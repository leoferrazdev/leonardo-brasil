import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "./lib/local-router";
import { HelmetProvider } from "react-helmet-async";
import { initAnalytics } from "./lib/analytics";
import { RouteAnnouncementBar } from "./components/RouteAnnouncementBar";
import { Toaster } from "react-hot-toast";
import "./index.css";

// Inicia interceptador global de UTMs para o WhatsApp
initAnalytics();

const App = lazy(() => import("./App"));
const GoogleMeuNegocioLanding = lazy(() => import("./pages/GoogleMeuNegocioLanding"));
const GoogleMeuNegocioNicheHub = lazy(() => import("./pages/GoogleMeuNegocioNicheHub"));
const GoogleMeuNegocioLocalLanding = lazy(() => import("./pages/GoogleMeuNegocioLocalLanding"));
const RecuperarPerfilSuspenso = lazy(() => import("./pages/RecuperarPerfilSuspenso"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Brandbook = lazy(() => import("./pages/Brandbook"));
const CitiesDirectory = lazy(() => import("./pages/CitiesDirectory"));
const PortoAlegreDigital = lazy(() => import("./pages/PortoAlegreDigital"));
const TermsPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.PrivacyPage })));
const DataDeletionPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.DataDeletionPage })));

// Módulo CRM de Prospecção Local
const CrmLogin = lazy(() => import("./pages/crm/Login"));
const CrmDashboard = lazy(() => import("./pages/crm/Dashboard"));
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
        <RouteAnnouncementBar />
        <Toaster position="top-right" toastOptions={{ className: "text-xs font-semibold" }} />
        <Suspense fallback={<div className="min-h-screen bg-ink flex items-center justify-center text-accent">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/google-meu-negocio" element={<GoogleMeuNegocioLanding />} />
            <Route path="/google-meu-negocio/:nicho" element={<GoogleMeuNegocioNicheHub />} />
            <Route path="/google-meu-negocio/:nicho/:estado/:cidade" element={<GoogleMeuNegocioLocalLanding />} />
            <Route path="/otimizacao-google-meu-negocio" element={<GoogleMeuNegocioLanding />} />
            <Route path="/otimizacao-google-meu-negocio/:nicho" element={<GoogleMeuNegocioNicheHub />} />
            <Route path="/otimizacao-google-meu-negocio/:nicho/:estado/:cidade" element={<GoogleMeuNegocioLocalLanding />} />
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

            <Route path="*" element={<RouteFallback />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
