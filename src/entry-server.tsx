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
import ComoColocarEmpresaNoGoogle from "./pages/ComoColocarEmpresaNoGoogle";
import ComoFicarNaPrimeiraPaginaGoogle from "./pages/ComoFicarNaPrimeiraPaginaGoogle";
import ComoDivulgarEmpresaNoGoogle from "./pages/ComoDivulgarEmpresaNoGoogle";
import ComoAparecerNoGoogleMaps from "./pages/ComoAparecerNoGoogleMaps";
import ComoVenderMaisNoGoogle from "./pages/ComoVenderMaisNoGoogle";
import GoogleMeuNegocioLanding from "./pages/GoogleMeuNegocioLanding";
import GoogleMeuNegocioNicheHub from "./pages/GoogleMeuNegocioNicheHub";
import GoogleMeuNegocioLocalLanding from "./pages/GoogleMeuNegocioLocalLanding";
import RecuperarPerfilSuspenso from "./pages/RecuperarPerfilSuspenso";
import AuditoriaPerfilGoogle from "./pages/AuditoriaPerfilGoogle";
import GoogleMeuNegocioMedicosCfm from "./pages/GoogleMeuNegocioMedicosCfm";
import GoogleMeuNegocioAdvogadosOab from "./pages/GoogleMeuNegocioAdvogadosOab";
import GoogleMeuNegocioDentistasCfo from "./pages/GoogleMeuNegocioDentistasCfo";
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
          
          {/* Ferramenta Interativa & Hubs Regulatórios */}
          <Route path="/auditoria-perfil-google" element={<AuditoriaPerfilGoogle />} />
          <Route path="/google-meu-negocio/medicos-cfm" element={<GoogleMeuNegocioMedicosCfm />} />
          <Route path="/google-meu-negocio/advogados-oab" element={<GoogleMeuNegocioAdvogadosOab />} />
          <Route path="/google-meu-negocio/dentistas-cfo" element={<GoogleMeuNegocioDentistasCfo />} />

          {/* Vertical 1: Google Meu Negócio */}
          <Route path="/google-meu-negocio" element={<GoogleMeuNegocioLanding />} />
          <Route path="/google-meu-negocio/:nicho" element={<GoogleMeuNegocioNicheHub />} />
          <Route path="/google-meu-negocio/:nicho/:estado/:cidade" element={<GoogleMeuNegocioLocalLanding />} />

          {/* Vertical 2: Otimização Google Meu Negócio */}
          <Route path="/otimizacao-google-meu-negocio" element={<GoogleMeuNegocioLanding />} />
          <Route path="/otimizacao-google-meu-negocio/:nicho" element={<GoogleMeuNegocioNicheHub />} />
          <Route path="/otimizacao-google-meu-negocio/:nicho/:estado/:cidade" element={<GoogleMeuNegocioLocalLanding />} />

          {/* Vertical 3: Consultor Google Meu Negócio */}
          <Route path="/consultor-google-meu-negocio" element={<GoogleMeuNegocioLanding />} />
          <Route path="/consultor-google-meu-negocio/:nicho" element={<GoogleMeuNegocioNicheHub />} />
          <Route path="/consultor-google-meu-negocio/:nicho/:estado/:cidade" element={<GoogleMeuNegocioLocalLanding />} />

          {/* Vertical 4: Especialista Google Maps */}
          <Route path="/especialista-google-maps" element={<GoogleMeuNegocioLanding />} />
          <Route path="/especialista-google-maps/:nicho" element={<GoogleMeuNegocioNicheHub />} />
          <Route path="/especialista-google-maps/:nicho/:estado/:cidade" element={<GoogleMeuNegocioLocalLanding />} />

          {/* Guias Estratégicos de SEO Local e Aquisição */}
          <Route path="/como-colocar-minha-empresa-no-google" element={<ComoColocarEmpresaNoGoogle />} />
          <Route path="/como-ficar-na-primeira-pagina-do-google" element={<ComoFicarNaPrimeiraPaginaGoogle />} />
          <Route path="/como-divulgar-minha-empresa-no-google" element={<ComoDivulgarEmpresaNoGoogle />} />
          <Route path="/como-aparecer-no-google-maps" element={<ComoAparecerNoGoogleMaps />} />
          <Route path="/como-vender-mais-no-google" element={<ComoVenderMaisNoGoogle />} />

          <Route path="/recuperar-perfil-suspenso-google" element={<RecuperarPerfilSuspenso />} />
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
