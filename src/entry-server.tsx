import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route, useLocation } from "./lib/local-router";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { RouteAnnouncementBar } from "./components/RouteAnnouncementBar";
import App from "./App";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import Brandbook from "./pages/Brandbook";
import CitiesDirectory from "./pages/CitiesDirectory";
import PortoAlegreDigital from "./pages/PortoAlegreDigital";
import GoogleMeuNegocioLanding from "./pages/GoogleMeuNegocioLanding";
import GoogleMeuNegocioNicheHub from "./pages/GoogleMeuNegocioNicheHub";
import GoogleMeuNegocioLocalLanding from "./pages/GoogleMeuNegocioLocalLanding";
import { TermsPage, PrivacyPage, DataDeletionPage } from "./pages/LegalPages";

/**
 * Fallback: direciona qualquer rota legada para o fluxo principal de Google Meu Negócio
 */
function RouteFallback() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/estrutura-de-vendas-para-")) {
    return <GoogleMeuNegocioLanding />;
  }
  return <App />;
}

/**
 * Renderiza uma rota em HTML no servidor (build), para pré-renderização estática.
 * As mesmas rotas do cliente (src/main.tsx) existem aqui.
 */
export function render(url: string): { appHtml: string; head: string } {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <RouteAnnouncementBar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/google-meu-negocio" element={<GoogleMeuNegocioLanding />} />
          <Route path="/google-meu-negocio/:nicho" element={<GoogleMeuNegocioNicheHub />} />
          <Route path="/google-meu-negocio/:nicho/:estado/:cidade" element={<GoogleMeuNegocioLocalLanding />} />
          <Route path="/consultoria" element={<GoogleMeuNegocioLanding />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/brandbook" element={<Brandbook />} />
          <Route path="/cidades" element={<CitiesDirectory />} />
          <Route path="/porto-alegre-digital" element={<PortoAlegreDigital />} />
          <Route path="/termos" element={<TermsPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/exclusao-de-dados" element={<DataDeletionPage />} />
          <Route path="*" element={<RouteFallback />} />
        </Routes>
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;
  const head = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ]
        .filter(Boolean)
        .join("\n    ")
    : "";

  return { appHtml, head };
}
