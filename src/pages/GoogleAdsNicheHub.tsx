import { useEffect, useState } from "react";
import { Link, useParams } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import locationsData from "../data/seoLocations.json";
import { getGoogleAdsNiche } from "../data/googleAdsNiches";

const WHATSAPP_NUMBER = "5551996737359";

export default function GoogleAdsNicheHub() {
  const { nicho } = useParams();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpenFaq(0);
  }, [nicho]);

  const locationNiche = locationsData.NICHES.find((item) => item.slug === nicho);
  const config = getGoogleAdsNiche(nicho, locationNiche?.nome);
  const canonicalUrl = `https://leonardobrasil.com.br/google-ads/${config.slug}`;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(config.waMessage)}`;

  const relatedNiches = locationsData.NICHES.filter((item) => item.slug !== config.slug).slice(0, 8);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Gestão de Google Ads para ${config.nome}`,
      description: config.subheadline,
      url: canonicalUrl,
      provider: {
        "@type": "Organization",
        "@id": "https://leonardobrasil.com.br/#organization",
        name: "Leonardo Brasil",
      },
      areaServed: { "@type": "Country", name: "Brasil" },
      serviceType: `Google Ads para ${config.nome}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://leonardobrasil.com.br" },
        { "@type": "ListItem", position: 2, name: "Google Ads", item: "https://leonardobrasil.com.br/google-ads" },
        { "@type": "ListItem", position: 3, name: `Google Ads para ${config.nome}`, item: canonicalUrl },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ink text-text font-sans selection:bg-accent selection:text-white">
      <SeoHead
        title={`Google Ads para ${config.nome}: Gestão Especializada | Leonardo Brasil`}
        description={`Gestão de Google Ads para ${config.nome}: campanhas fundo de funil, palavras negativas, anúncios no Google Maps e leads qualificados direto no WhatsApp.`}
        keywords={`google ads para ${config.nome.toLowerCase()}, gestor google ads ${config.nome.toLowerCase()}, anunciar no google ${config.nome.toLowerCase()}, tráfego pago ${config.nome.toLowerCase()}`}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-text hover:text-accent transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
            Leonardo Brasil
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-muted">
            <Link to="/google-ads" className="hover:text-text transition-colors">Google Ads</Link>
            <Link to="/auditoria-google-ads" className="text-gold hover:text-gold-300 transition-colors">Auditoria Ads</Link>
            <Link to={`/google-meu-negocio/${config.slug}`} className="text-accent hover:text-accent-300 transition-colors">
              Google Maps ({locationNiche?.nome || config.nome})
            </Link>
          </nav>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-600 transition-all shadow-lg shadow-accent/20"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-line py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-ink to-ink -z-10" />
          <div className="mx-auto max-w-4xl px-5 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted mb-5">
              <Link to="/" className="hover:text-text">Início</Link>
              <span>/</span>
              <Link to="/google-ads" className="hover:text-text">Google Ads</Link>
              <span>/</span>
              <span className="text-accent-300 font-semibold">{config.nome}</span>
            </div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-300 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/30 mb-6">
              {config.badge}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1] text-balance">
              {config.headline}
            </h1>
            <p className="mt-6 text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              {config.subheadline}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white font-black text-base px-8 py-4 rounded-full hover:bg-accent-600 transition-all shadow-xl shadow-accent/25"
              >
                Solicitar Plano de Google Ads no WhatsApp →
              </a>
              <Link
                to={`/google-meu-negocio/${config.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-panel px-7 py-4 text-sm font-bold text-text hover:border-accent transition-colors"
              >
                Ver Google Meu Negócio para este Nicho
              </Link>
            </div>
          </div>
        </section>

        {/* ARQUITETURA DA CAMPANHA PARA O NICHO */}
        <section className="py-20 border-b border-line bg-ink">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* PALAVRAS-CHAVE DE COMPRA */}
              <div className="rounded-3xl border border-accent/30 bg-panel p-7">
                <span className="text-xs font-bold uppercase tracking-widest text-accent-300">Onde está o dinheiro</span>
                <h2 className="text-2xl font-black mt-2">Exemplos de buscas fundo de funil</h2>
                <p className="mt-2 text-sm text-muted">
                  Foco: <strong className="text-text">{config.campaignFocus}</strong>
                </p>
                <ul className="mt-5 space-y-2.5">
                  {config.bottomFunnelKeywords.map((kw) => (
                    <li key={kw} className="flex items-center gap-2.5 rounded-xl border border-line bg-ink/70 px-4 py-2.5 text-sm font-medium text-text">
                      <span className="text-accent font-bold">✓</span>
                      <span>"{kw}"</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PALAVRAS NEGATIVAS & BLINDAGEM */}
              <div className="rounded-3xl border border-red-500/20 bg-panel p-7">
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Blindagem de Verba</span>
                <h2 className="text-2xl font-black mt-2">Cliques que bloqueamos desde o Dia 1</h2>
                <p className="mt-2 text-sm text-muted">
                  Perfil de intenção: <strong className="text-text">{config.typicalIntent}</strong>
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {config.negativeKeywords.map((neg) => (
                    <span
                      key={neg}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-950/20 px-3.5 py-1.5 text-xs font-bold text-red-300"
                    >
                      <span>✕</span>
                      <span>-{neg}</span>
                    </span>
                  ))}
                </div>

                {config.regulatoryNote && (
                  <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Conformidade Ética</p>
                    <p className="mt-1 text-xs text-muted leading-relaxed">{config.regulatoryNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ENTREGÁVEIS DO NICHO */}
            <div className="mt-10 rounded-3xl border border-line bg-panel p-7 sm:p-9">
              <h2 className="text-2xl font-black mb-6">
                O que entregamos na Gestão de Google Ads para {config.nome}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {config.deliverables.map((del) => (
                  <div key={del} className="flex items-start gap-3 rounded-2xl border border-line bg-ink/60 p-4">
                    <span className="text-accent font-black shrink-0">✓</span>
                    <p className="text-sm text-muted leading-relaxed">{del}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CROSS-LINK PARA GOOGLE MEU NEGÓCIO DO MESMO NICHO */}
        <section className="py-16 border-b border-line bg-panel/40">
          <div className="mx-auto max-w-5xl px-5">
            <div className="rounded-3xl border border-gold/30 bg-panel p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold">Sinergia Máxima</span>
                <h2 className="text-2xl font-black mt-2">
                  Combine Google Ads + Google Meu Negócio para {config.nome}
                </h2>
                <p className="mt-2 text-sm text-muted max-w-xl leading-relaxed">
                  Quando o cliente pesquisa na sua cidade, ele compara o seu anúncio com a sua nota e avaliações no Google Maps. Estruture os dois canais juntos para maximizar sua conversão no WhatsApp.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  to={`/google-meu-negocio/${config.slug}`}
                  className="rounded-full bg-accent px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-accent-600 transition-colors text-center"
                >
                  Google Meu Negócio ({locationNiche?.nome || config.nome})
                </Link>
                <Link
                  to="/google-ads-e-google-meu-negocio"
                  className="rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-xs sm:text-sm font-bold text-gold hover:bg-gold/20 transition-colors text-center"
                >
                  Ver Estratégia Híbrida
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 border-b border-line bg-ink">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">
              Dúvidas Frequentes sobre Google Ads para {config.nome}
            </h2>
            <div className="space-y-3">
              {config.faqs.map((item, idx) => (
                <div key={item.q} className="rounded-2xl border border-line bg-panel overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-sm sm:text-base text-text"
                  >
                    <span>{item.q}</span>
                    <span className="text-accent text-lg shrink-0">{openFaq === idx ? "−" : "+"}</span>
                  </button>
                  {openFaq === idx && (
                    <p className="px-5 pb-5 -mt-1 text-sm text-muted leading-relaxed">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUTROS SEGMENTOS */}
        <section className="py-16 bg-panel/30">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-lg font-bold text-text mb-6">Google Ads para outros segmentos locais:</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedNiches.map((item) => (
                <Link
                  key={item.slug}
                  to={`/google-ads/${item.slug}`}
                  className="p-3.5 rounded-xl border border-line bg-ink/70 hover:border-accent text-xs font-semibold text-muted hover:text-text transition-colors"
                >
                  Google Ads para {item.nome} →
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
