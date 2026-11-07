import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

type LocationState = {
  pathname: string;
  search: string;
  hash: string;
};

type RouterContextValue = {
  location: LocationState;
  params: Record<string, string>;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  isStatic: boolean;
};

type RouteProps = {
  path: string;
  element: ReactNode;
};

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  replace?: boolean;
};

type NavigateProps = {
  to: string;
  replace?: boolean;
};

const RouterContext = createContext<RouterContextValue | null>(null);

function normalizePath(pathname: string) {
  const cleanPath = pathname.split("?")[0]?.split("#")[0] || "/";
  if (cleanPath === "/") return "/";
  return cleanPath.replace(/\/+$/, "");
}

function getBrowserLocation(): LocationState {
  return {
    pathname: normalizePath(window.location.pathname),
    search: window.location.search,
    hash: window.location.hash,
  };
}

function parseLocation(location: string): LocationState {
  const url = new URL(location, "https://leonardobrasil.com.br");
  return {
    pathname: normalizePath(url.pathname),
    search: url.search,
    hash: url.hash,
  };
}

function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  if (pattern === "*") return {};

  const routeParts = normalizePath(pattern).split("/").filter(Boolean);
  const pathParts = normalizePath(pathname).split("/").filter(Boolean);

  if (routeParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

  for (let index = 0; index < routeParts.length; index += 1) {
    const routePart = routeParts[index];
    const pathPart = pathParts[index];

    if (routePart.startsWith(":")) {
      params[routePart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (routePart !== pathPart) return null;
  }

  return params;
}

function createNavigator(setLocation: (location: LocationState) => void) {
  return (to: string, options?: { replace?: boolean }) => {
    const url = new URL(to, window.location.origin);
    const nextLocation = parseLocation(`${url.pathname}${url.search}${url.hash}`);

    if (options?.replace) {
      window.history.replaceState(null, "", to);
    } else {
      window.history.pushState(null, "", to);
    }

    setLocation(nextLocation);
  };
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationState>(() => getBrowserLocation());

  useEffect(() => {
    const onPopState = () => setLocation(getBrowserLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = useMemo<RouterContextValue>(
    () => ({
      location,
      params: {},
      navigate: createNavigator(setLocation),
      isStatic: false,
    }),
    [location],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function StaticRouter({ location, children }: { location: string; children: ReactNode }) {
  const value = useMemo<RouterContextValue>(
    () => ({
      location: parseLocation(location),
      params: {},
      navigate: () => undefined,
      isStatic: true,
    }),
    [location],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Routes({ children }: { children: ReactNode }) {
  const router = useRequiredRouter();
  const routeElements = React.Children.toArray(children).filter(React.isValidElement) as ReactElement<RouteProps>[];

  for (const routeElement of routeElements) {
    const params = matchPath(routeElement.props.path, router.location.pathname);

    if (params) {
      return (
        <RouterContext.Provider value={{ ...router, params }}>
          {routeElement.props.element}
        </RouterContext.Provider>
      );
    }
  }

  return null;
}

export function Route(_props: RouteProps) {
  return null;
}

export function Link({ to, replace, onClick, target, children, ...props }: LinkProps) {
  const router = useRequiredRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      target ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      to.startsWith("http") ||
      to.startsWith("mailto:") ||
      to.startsWith("tel:")
    ) {
      return;
    }

    event.preventDefault();
    router.navigate(to, { replace });
  };

  return (
    <a href={to} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function Navigate({ to, replace }: NavigateProps) {
  const router = useRequiredRouter();

  useEffect(() => {
    if (!router.isStatic) {
      router.navigate(to, { replace });
    }
  }, [replace, router, to]);

  return null;
}

export function useNavigate() {
  return useRequiredRouter().navigate;
}

export function useLocation() {
  return useRequiredRouter().location;
}

export function useParams<TParams extends Record<string, string | undefined> = Record<string, string>>() {
  return useRequiredRouter().params as TParams;
}

function useRequiredRouter() {
  const router = useContext(RouterContext);
  if (!router) {
    throw new Error("Router components must be rendered inside BrowserRouter or StaticRouter.");
  }
  return router;
}
