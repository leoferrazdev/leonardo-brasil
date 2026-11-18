import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_HIBRIDO = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá, Leonardo! Quero conhecer a estratégia combinada de Google Ads + Google Meu Negócio para dominar os resultados pagos e orgânicos na minha cidade."
)}`;

const CAMADAS_TELA = [
  {
    camada: "Camada 1 · Topo Patrocinado (Google Ads Pesquisa)",
    titulo: "Captura Imediata de Quem Tem Urgência",
    desc: "Seu anúncio aparece no topo absoluto para palavras-chave de maior margem (ex: 'implante dentário', 'advogado trabalhista', 'desentupidora 24h'), trazendo contatos no WhatsApp desde a primeira semana.",
  },
  {
    camada: "Camada 2 · Pino Patrocinado no Maps (Extensão de Local)",
    titulo: "Destaque Visual com Estrelas Dentro do Google Maps",
    desc: "Vinculamos sua conta do Google Ads ao seu Perfil da Empresa no Google. Assim seu anúncio ganha endereço, distância, telefone, rota e nota em estrelas — dobrando a taxa de clique no celular.",
  },
  {
    camada: "Camada 3 · Top 3 Orgânico (Google Meu Negócio)",
    titulo: "Fluxo Gratuito e Perpétuo Que Derruba Seu CPL",
    desc: "Enquanto o Google Ads acelera o caixa, a otimização de SEO Local coloca sua ficha no Top 3 orgânico do mapa, gerando ligações e mensagens sem pagar por cada clique.",
  },
];

const VANTAGENS = [
  {
    criterio: "Velocidade de Retorno",
    soGmn: "Médio prazo (2 a 8 semanas)",
    soAds: "Imediato (1ª semana)",
    combinado: "Imediato no Ads + composto no Maps",
  },
  {
    criterio: "Taxa de Conversão no Celular",
    soGmn: "Alta para buscas próximas",
    soAds: "Cai se o perfil no Maps tiver poucas avaliações",
    combinado: "Máxima: o cliente vê o anúncio e confirma 4.9★ no Maps",
  },
  {
    criterio: "Custo por Lead (CPL) em 6 Meses",
    soGmn: "Baixíssimo (tráfego orgânico)",
    soAds: "Estável ou crescente com o leilão",
    combinado: "CPL médio cai mês a mês com a soma dos leads orgânicos",
  },
  {
    criterio: "Presença na 1ª Tela do Google",
    soGmn: "1 espaço (bloco do mapa)",
    soAds: "1 espaço (anúncio)",
    combinado: "2 espaços simultâneos (Anúncio + Top 3 do Mapa)",
  },
];

const FAQ = [
  {
    q: "Como funciona vincular o Google Meu Negócio ao Google Ads?",
    a: "Conectamos oficialmente seu Perfil da Empresa no Google à sua conta de Google Ads através dos Recursos de Local (antiga Extensão de Local). Isso libera anúncios locais dentro do Google Maps e exibe endereço, horário e rota junto aos anúncios da Rede de Pesquisa.",
  },
  {
    q: "Anunciar no Google Ads faz meu Google Meu Negócio subir no orgânico?",
    a: "Indiretamente, sim. Embora pagar Google Ads não compre posição orgânica direta, os anúncios geram mais visitas, ligações e clientes reais — que, ao avaliarem sua empresa no Maps, alimentam os sinais de proeminência que fazem o perfil subir organicamente.",
  },
  {
    q: "Para qual tipo de empresa essa estratégia combinada mais funciona?",
    a: "Clínicas médicas e odontológicas, escritórios de advocacia, clínicas de estética, oficinas mecânicas, clínicas veterinárias, empresas de energia solar e prestadores de serviços de urgência que precisam de caixa imediato e crescimento sustentável.",
  },
];

export default function GoogleAdsEGmn() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canonicalUrl = "https://leobrasil.com.br/google-ads-e-google-meu-negocio";

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Estratégia Combinada: Google Ads + Google Meu Negócio (Anúncios no Google Maps)",
      description:
        "Serviço integrado de Gestão de Google Ads com Extensão de Local e Otimização de Google Meu Negócio para dominar os espaços pagos e orgânicos na primeira tela do Google.",
      url: canonicalUrl,
      provider: {
        "@type": "Organization",
        "@id": "https://leobrasil.com.br/#organization",
        name: "Leonardo Brasil",
      },
      areaServed: { "@type": "Country", name: "Brasil" },
      serviceType: "Google Ads e Google Meu Negócio Integrados",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://leobrasil.com.br" },
        { "@type": "ListItem", position: 2, name: "Google Ads", item: "https://leobrasil.com.br/google-ads" },
        { "@type": "ListItem", position: 3, name: "Google Ads + Google Meu Negócio", item: canonicalUrl },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ink text-text font-sans selection:bg-accent selection:text-white">
      <SeoHead
        title="Google Ads + Google Meu Negócio: Domine o Topo Pago e o Google Maps | Leonardo Brasil"
        description="Unifique Google Ads (Rede de Pesquisa e Anúncios no Google Maps) com SEO no Google Meu Negócio. Apareça 2 vezes na primeira tela e reduza seu custo por lead no WhatsApp."
        keywords="google ads e google meu negócio, anunciar no google maps, extensão de local google ads, anúncios locais google maps, combinar google ads com seo local"
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
            <Link to="/google-meu-negocio" className="hover:text-text transition-colors">Google Meu Negócio</Link>
            <Link to="/google-ads" className="hover:text-text transition-colors">Google Ads</Link>
            <Link to="/auditoria-google-ads" className="hover:text-text transition-colors">Auditoria Ads</Link>
            <Link to="/auditoria-perfil-google" className="hover:text-text transition-colors">Raio-X Maps</Link>
          </nav>
          <a
            href={WA_HIBRIDO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-600 transition-all shadow-lg shadow-accent/20"
          >
            Quero o Plano Integrado
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-line py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/15 via-ink to-ink -z-10" />
          <div className="mx-auto max-w-4xl px-5 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/30 mb-6">
              Arquitetura de Dominação Dupla · Pago + Orgânico
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-balance">
              Google Ads + Google Meu Negócio: <span className="text-gold">ocupe 2 espaços na 1ª tela do Google</span>
            </h1>
            <p className="mt-6 text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Não escolha entre resultado imediato e crescimento orgânico. Integrando campanhas de Google Ads com Extensão de Local ao seu Perfil da Empresa otimizado, você captura leads hoje enquanto derruba seu Custo por Lead mês após mês.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WA_HIBRIDO}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white font-black text-base px-8 py-4 rounded-full hover:bg-accent-600 transition-all shadow-xl shadow-accent/25"
              >
                Montar Minha Estratégia Híbrida →
              </a>
              <Link
                to="/anunciar-no-google"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-panel px-7 py-4 text-sm font-bold text-text hover:border-accent transition-colors"
              >
                Ler Guia Técnico de Custos
              </Link>
            </div>
          </div>
        </section>

        {/* AS 3 CAMADAS */}
        <section className="py-20 border-b border-line bg-ink">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Engenharia de SERP Local</span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">
                Como as 3 camadas trabalham juntas pelo seu WhatsApp
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {CAMADAS_TELA.map((c) => (
                <div key={c.camada} className="rounded-2xl border border-line bg-panel p-7">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-gold">{c.camada}</span>
                  <h3 className="text-lg font-bold text-text mt-3 mb-2">{c.titulo}</h3>
                  <p className="text-sm text-muted leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARATIVO */}
        <section className="py-20 border-b border-line bg-panel/40">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="text-2xl sm:text-4xl font-black text-center mb-12">
              Só Maps vs. Só Ads vs. Ecossistema Integrado
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-ink/60">
                    <th className="p-4 font-bold text-text">Critério</th>
                    <th className="p-4 font-bold text-muted">Só Google Meu Negócio</th>
                    <th className="p-4 font-bold text-muted">Só Google Ads</th>
                    <th className="p-4 font-bold text-gold">Ads + Google Maps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {VANTAGENS.map((row) => (
                    <tr key={row.criterio}>
                      <td className="p-4 font-semibold text-text">{row.criterio}</td>
                      <td className="p-4 text-muted">{row.soGmn}</td>
                      <td className="p-4 text-muted">{row.soAds}</td>
                      <td className="p-4 font-semibold text-gold">{row.combinado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-ink">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">Perguntas Frequentes</h2>
            <div className="space-y-3">
              {FAQ.map((item, idx) => (
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
      </main>

      <Footer />
    </div>
  );
}
