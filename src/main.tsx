import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "./lib/local-router";
import { HelmetProvider } from "react-helmet-async";
import { initAnalytics } from "./lib/analytics";
import { RouteAnnouncementBar } from "./components/RouteAnnouncementBar";
import { Toaster } from "react-hot-toast";
import { WebMcpTools } from "./components/WebMcpTools";
import "./index.css";

// Inicia interceptador global de UTMs para o WhatsApp
initAnalytics();

const App = lazy(() => import("./App"));
const GoogleMeuNegocioLanding = lazy(() => import("./pages/GoogleMeuNegocioLanding"));
const GoogleMeuNegocioNicheHub = lazy(() => import("./pages/GoogleMeuNegocioNicheHub"));
const GoogleMeuNegocioLocalLanding = lazy(() => import("./pages/GoogleMeuNegocioLocalLanding"));
const RecuperarPerfilSuspenso = lazy(() => import("./pages/RecuperarPerfilSuspenso"));
const AuditoriaPerfilGoogle = lazy(() => import("./pages/AuditoriaPerfilGoogle"));
const GoogleMeuNegocioMedicosCfm = lazy(() => import("./pages/GoogleMeuNegocioMedicosCfm"));
const GoogleMeuNegocioAdvogadosOab = lazy(() => import("./pages/GoogleMeuNegocioAdvogadosOab"));
const GoogleMeuNegocioDentistasCfo = lazy(() => import("./pages/GoogleMeuNegocioDentistasCfo"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Brandbook = lazy(() => import("./pages/Brandbook"));
const CitiesDirectory = lazy(() => import("./pages/CitiesDirectory"));
const PortoAlegreDigital = lazy(() => import("./pages/PortoAlegreDigital"));
const ComoColocarEmpresaNoGoogle = lazy(() => import("./pages/ComoColocarEmpresaNoGoogle"));
const ComoFicarNaPrimeiraPaginaGoogle = lazy(() => import("./pages/ComoFicarNaPrimeiraPaginaGoogle"));
const ComoDivulgarEmpresaNoGoogle = lazy(() => import("./pages/ComoDivulgarEmpresaNoGoogle"));
const ComoAparecerNoGoogleMaps = lazy(() => import("./pages/ComoAparecerNoGoogleMaps"));
const ComoVenderMaisNoGoogle = lazy(() => import("./pages/ComoVenderMaisNoGoogle"));
const SegmentosLocaisGoogleMaps = lazy(() => import("./pages/SegmentosLocaisGoogleMaps"));
const PrimeiroLugarNoGoogle2027 = lazy(() => import("./pages/PrimeiroLugarNoGoogle2027"));
const ComoAparecerNoGoogleDeGraca = lazy(() => import("./pages/ComoAparecerNoGoogleDeGraca"));
const AnunciarNoGoogle = lazy(() => import("./pages/AnunciarNoGoogle"));
const ComoFazerSiteAparecerEmPrimeiro = lazy(() => import("./pages/ComoFazerSiteAparecerEmPrimeiro"));
const ComoFazerSiteAparecerNoGoogle = lazy(() => import("./pages/ComoFazerSiteAparecerNoGoogle"));
const TermsPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.PrivacyPage })));
const DataDeletionPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.DataDeletionPage })));

// Módulo CRM de Prospecção Local
const CrmLogin = lazy(() => import("./pages/crm/Login"));
const CrmDashboard = lazy(() => import("./pages/crm/Dashboard"));
const CrmKeywordPlanner = lazy(() => import("./pages/crm/KeywordPlanner"));
const CrmProtectedRoute = lazy(() =>
  import("./pages/crm/components/CrmProtectedRoute").then((m) => ({
    default: m.CrmProtectedRoute,
  }))
);

/**
 * Redirecionamento de rotas legadas para a nova máquina de Google Meu Negócio
 */
function RouteFallback() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/estrutura-de-vendas-para-")) {
    const clean = pathname.replace("/estrutura-de-vendas-para-", "");
    const parts = clean.split("-em-");
    if (parts.length === 2) {
      return <Navigate to={`/google-meu-negocio/${parts[0]}`} replace />;
    }
    return <Navigate to={`/google-meu-negocio/${clean}`} replace />;
  }
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <WebMcpTools />
        <RouteAnnouncementBar />
        <Toaster position="top-right" toastOptions={{ className: "text-xs font-semibold" }} />
        <Suspense fallback={<div className="min-h-screen bg-ink flex items-center justify-center text-accent">Carregando...</div>}>
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
            <Route path="/primeiro-lugar-no-google-2027" element={<PrimeiroLugarNoGoogle2027 />} />
            <Route path="/segmentos-locais-google-maps" element={<SegmentosLocaisGoogleMaps />} />
            <Route path="/como-colocar-minha-empresa-no-google" element={<ComoColocarEmpresaNoGoogle />} />
            <Route path="/como-ficar-na-primeira-pagina-do-google" element={<ComoFicarNaPrimeiraPaginaGoogle />} />
            <Route path="/como-divulgar-minha-empresa-no-google" element={<ComoDivulgarEmpresaNoGoogle />} />
            <Route path="/como-aparecer-no-google-maps" element={<ComoAparecerNoGoogleMaps />} />
            <Route path="/como-vender-mais-no-google" element={<ComoVenderMaisNoGoogle />} />
            <Route path="/como-aparecer-no-google-de-graca" element={<ComoAparecerNoGoogleDeGraca />} />
            <Route path="/anunciar-no-google" element={<AnunciarNoGoogle />} />
            <Route path="/como-fazer-meu-site-aparecer-no-google-em-primeiro" element={<ComoFazerSiteAparecerEmPrimeiro />} />
            <Route path="/como-fazer-um-site-aparecer-no-google" element={<ComoFazerSiteAparecerNoGoogle />} />

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

            {/* Rotas do CRM de Prospecção Local */}
            <Route path="/crm" element={<Navigate to="/crm/dashboard" replace />} />
            <Route path="/crm/login" element={<CrmLogin />} />
            <Route
              path="/crm/dashboard"
              element={
                <CrmProtectedRoute>
                  <CrmDashboard />
                </CrmProtectedRoute>
              }
            />
            <Route
              path="/crm/planejador"
              element={
                <CrmProtectedRoute>
                  <CrmKeywordPlanner />
                </CrmProtectedRoute>
              }
            />
            <Route path="/crm/keywords" element={<Navigate to="/crm/planejador" replace />} />

            <Route path="*" element={<RouteFallback />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
