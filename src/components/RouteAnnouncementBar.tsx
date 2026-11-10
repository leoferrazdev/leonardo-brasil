import { useLocation } from "../lib/local-router";
import { AnnouncementBar } from "./AnnouncementBar";

const ROUTES_WITHOUT_ANNOUNCEMENT = new Set([
  "/porto-alegre-digital",
]);

export function shouldHideAnnouncement(pathname: string): boolean {
  return ROUTES_WITHOUT_ANNOUNCEMENT.has(pathname) || pathname === "/crm" || pathname.startsWith("/crm/");
}

export function RouteAnnouncementBar() {
  const { pathname } = useLocation();

  if (shouldHideAnnouncement(pathname)) {
    return null;
  }

  return <AnnouncementBar />;
}
