import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "./lib/local-router";
import { HelmetProvider } from "react-helmet-async";
import { initAnalytics } from "./lib/analytics";
import { RouteAnnouncementBar } from "./components/RouteAnnouncementBar";
import "./index.css";

// Inicia interceptador global de UTMs para o WhatsApp
initAnalytics();

// Agent Readiness: WebMCP Integration
if (typeof navigator !== "undefined" && (navigator as any).modelContext) {
  try {
    (navigator as any).modelContext.provideContext({
      tools: [
        {
          name: "calculate_sales_funnel",
          description: "Calculates the sales funnel bottleneck (leads, calls, sales).",
          inputSchema: {
            type: "object",
            properties: {
              leads: { type: "number" },
              calls: { type: "number" },
              sales: { type: "number" }
            },
            required: ["leads", "calls", "sales"]
          },
          execute: async (inputs: any) => {
            const { leads, calls, sales } = inputs;
            const conversionRate = (sales / leads) * 100;
            return {
              content: [{
                type: "text",
                text: `Com ${leads} leads e ${sales} vendas, a conversão é de ${conversionRate.toFixed(2)}%.`
              }]
            };
          }
        },
        {
          name: "request_diagnostic",
          description: "Generates the WhatsApp link to request a free sales funnel diagnostic.",
          inputSchema: {
            type: "object",
            properties: {}
          },
          execute: async () => {
            return {
              content: [{
                type: "text",
                text: "O diagnóstico pode ser solicitado via WhatsApp: https://wa.me/5551992568861?text=Olá,%20Leonardo!%20Quero%20um%20diagnóstico%20gratuito%20da%20estrutura%20de%20vendas%20do%20meu%20negócio."
              }]
            };
          }
        }
      ]
    });
  } catch (e) {
    console.error("Failed to provide WebMCP context:", e);
  }
}

const App = lazy(() => import("./App"));
const NicheLanding = lazy(() => import("./pages/NicheLanding"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Brandbook = lazy(() => import("./pages/Brandbook"));
const CitiesDirectory = lazy(() => import("./pages/CitiesDirectory"));
const CalculatorPage = lazy(() => import("./pages/CalculatorPage"));
const Consultoria = lazy(() => import("./pages/Consultoria"));
const PortoAlegreDigital = lazy(() => import("./pages/PortoAlegreDigital"));
const GoogleMeuNegocioLanding = lazy(() => import("./pages/GoogleMeuNegocioLanding"));
const GoogleMeuNegocioNicheHub = lazy(() => import("./pages/GoogleMeuNegocioNicheHub"));
const GoogleMeuNegocioLocalLanding = lazy(() => import("./pages/GoogleMeuNegocioLocalLanding"));
const TermsPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.PrivacyPage })));
const DataDeletionPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.DataDeletionPage })));

/**
 * Catch-all: as URLs de nicho (/estrutura-de-vendas-para-...) não são um
 * segmento dinâmico simples do React Router, então resolvemos pelo caminho.
 */
function RouteFallback() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/estrutura-de-vendas-para-")) {
    return <NicheLanding />;
  }
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <RouteAnnouncementBar />
        <Suspense fallback={<div className="min-h-screen bg-ink flex items-center justify-center text-accent">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/google-meu-negocio" element={<GoogleMeuNegocioLanding />} />
            <Route path="/google-meu-negocio/:nicho" element={<GoogleMeuNegocioNicheHub />} />
            <Route path="/google-meu-negocio/:nicho/:estado/:cidade" element={<GoogleMeuNegocioLocalLanding />} />
            <Route path="/consultoria" element={<Consultoria />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/brandbook" element={<Brandbook />} />
            <Route path="/cidades" element={<CitiesDirectory />} />
            <Route path="/calculadora" element={<CalculatorPage />} />
            <Route path="/porto-alegre-digital" element={<PortoAlegreDigital />} />
            <Route path="/termos" element={<TermsPage />} />
            <Route path="/privacidade" element={<PrivacyPage />} />
            <Route path="/exclusao-de-dados" element={<DataDeletionPage />} />
            <Route path="*" element={<RouteFallback />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
