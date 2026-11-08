import { useEffect } from "react";
import { useLocation, useNavigate } from "../lib/local-router";
import { createSiteTools, getBrowserContextHosts, registerSiteTools } from "../lib/webmcp";

export function WebMcpTools() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/crm" || pathname.startsWith("/crm/")) return;
    const [documentHost, navigatorHost] = getBrowserContextHosts();
    return registerSiteTools(documentHost, navigatorHost, createSiteTools(navigate));
  }, [navigate, pathname]);
  return null;
}
