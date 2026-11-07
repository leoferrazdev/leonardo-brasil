import React, { useEffect } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import locationsData from "../data/seoLocations.json";

const WHATSAPP_NUMBER = "5551992568861";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Tenho interesse na consultoria de otimização do Google Meu Negócio. Pode avaliar meu perfil?")}`;

export default function GoogleMeuNegocioLanding() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const niches = locationsData.NICHES;

  return (
    <div className="min-h-screen bg-ink text-text font-sans">
      <SeoHead
        title="Otimização e Gestão de Google Meu Negócio | Leonardo Brasil"
        description="Consultoria e otimização de Perfil da Empresa no Google (Google Meu Negócio). Coloque sua empresa no Top 3 do Google Maps e transforme buscas em novos clientes."
        canonicalUrl="https://leonardobrasil.com.br/google-meu-negocio"
      />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-text hover:text-accent transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
            Leonardo Brasil
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/cidades" className="text-xs font-semibold text-muted hover:text-text transition-colors">
              Cidades Atendidas
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-600 transition-all shadow-lg shadow-accent/20"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-line py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-ink to-ink -z-10" />
          <div className="mx-auto max-w-4xl px-5 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/30 mb-6">
              Consultoria & Gestão Especializada
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-text">
              Transforme seu Perfil no Google na Vitrine Mais Valiosa da sua Região
            </h1>
            <p className="mt-6 text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Quando alguém na sua cidade pesquisa pelo serviço que você oferece, o Google Maps é a primeira tela que aparece. Faço a otimização completa do seu Perfil da Empresa para você atrair clientes qualificados sem pagar por anúncios diários.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent text-white font-black text-base px-8 py-4 rounded-full hover:bg-accent-600 transition-all shadow-xl shadow-accent/25 hover:scale-105"
              >
                Quero Avaliar Meu Google Gratuitamente
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* NICHOS EM DESTAQUE */}
        <section className="py-20 border-b border-line bg-panel">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-black text-text">Especialidades Atendidas no Brasil Inteiro</h2>
              <p className="mt-3 text-muted text-sm sm:text-base">
                Selecione seu segmento abaixo para conferir o plano específico de posicionamento local na sua cidade.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {niches.map((niche) => (
                <Link
                  key={niche.slug}
                  to={`/google-meu-negocio/${niche.slug}`}
                  className="p-5 rounded-2xl border border-line bg-ink/60 hover:border-accent hover:bg-panel-2 transition-all flex items-center justify-between group"
                >
                  <span className="font-bold text-sm text-text group-hover:text-accent transition-colors">
                    {niche.nome}
                  </span>
                  <span className="text-xs text-muted group-hover:text-accent transition-colors">Ver cidades →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
