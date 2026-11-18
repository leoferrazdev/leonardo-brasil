import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";

interface DiagnosticItem {
  id: string;
  label: string;
  weight: number;
  explanation: string;
}

const DIAGNOSTIC_ITEMS: DiagnosticItem[] = [
  {
    id: "negativas",
    label: "Não reviso o relatório de Termos de Pesquisa e Palavras Negativas toda semana",
    weight: 22,
    explanation: "Sem negativação ativa, 20% a 40% da verba costuma ir para curiosos, vagas, cursos e pesquisas sem intenção de compra.",
  },
  {
    id: "geo",
    label: "A segmentação geográfica está no padrão 'Presença ou interesse' (em vez de apenas 'Presença')",
    weight: 18,
    explanation: "O padrão do Google exibe anúncios para pessoas fora da sua cidade que jamais vão contratar um prestador local.",
  },
  {
    id: "display",
    label: "Rede de Display ou Parceiros de Pesquisa estão ativados dentro da campanha de Pesquisa",
    weight: 15,
    explanation: "Misturar Pesquisa com Display drena cliques baratos de baixíssima intenção e distorce o algoritmo de lances.",
  },
  {
    id: "conversao",
    label: "Não existe rastreamento de conversão real no WhatsApp/ligações (só olho cliques e CTR)",
    weight: 20,
    explanation: "Sem tag de conversão real, o Google otimiza para trazer 'clicadores' e não compradores prontos para chamar no WhatsApp.",
  },
  {
    id: "maps",
    label: "Minha conta de Google Ads não está vinculada ao meu Google Meu Negócio otimizado",
    weight: 13,
    explanation: "Você perde a Extensão de Local, não aparece nos espaços patrocinados do Google Maps e perde credibilidade das estrelas.",
  },
  {
    id: "pagina",
    label: "Os anúncios enviam todo mundo para a página inicial genérica ou um site lento no celular",
    weight: 12,
    explanation: "Páginas lentas e genéricas derrubam o Índice de Qualidade (deixando o CPC mais caro) e fazem o visitante desistir antes do WhatsApp.",
  },
];

const PONTOS_AUDITORIA = [
  { n: "01", titulo: "Termos de Pesquisa Reais", desc: "Análise linha a linha do que as pessoas realmente digitaram antes de consumir seu dinheiro." },
  { n: "02", titulo: "Arquitetura de Campanhas & Correspondências", desc: "Verificação de correspondência ampla descontrolada e mistura de serviços de margens diferentes." },
  { n: "03", titulo: "Configuração de Localização e Horários", desc: "Checagem de raio geográfico, exclusão de regiões e horários em que sua equipe não atende." },
  { n: "04", titulo: "Índice de Qualidade e Copy dos Anúncios", desc: "Revisão de relevância de anúncios, extensões (sitelinks, chamada, local) e CTR real." },
  { n: "05", titulo: "Rastreamento GA4 e Conversões no WhatsApp", desc: "Validação das tags para garantir que o algoritmo aprenda com leads qualificados." },
  { n: "06", titulo: "Auditoria de Página de Destino + Google Maps", desc: "Diagnóstico conjunto da landing page e da sua ficha no Google Meu Negócio para elevar a conversão." },
];

const FAQ = [
  {
    q: "Preciso dar acesso total ou trocar minha agência atual para fazer a auditoria?",
    a: "Não. A auditoria técnica é feita inicialmente com acesso de leitura (ou compartilhamento de tela em reunião) para você ter um diagnóstico independente e baseado em dados reais da sua conta.",
  },
  {
    q: "Quanto dinheiro costuma ser desperdiçado em contas locais mal configuradas?",
    a: "Em negócios locais que nunca passaram por auditoria sênior, é comum encontrar entre 25% e 55% do orçamento mensal sendo gasto em termos irrelevantes, cliques de fora da cidade ou campanhas otimizadas sem meta de conversão.",
  },
  {
    q: "Depois da auditoria, posso escolher entre corrigir internamente ou contratar a gestão?",
    a: "Sim. Você recebe o plano de correção priorizado por impacto financeiro. Pode executar com sua equipe interna ou me contratar para reestruturar e assumir a gestão recorrente.",
  },
];

export default function AuditoriaGoogleAds() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedItems = DIAGNOSTIC_ITEMS.filter((item) => checked[item.id]);
  const riskScore = selectedItems.reduce((sum, item) => sum + item.weight, 0);

  const riskLabel =
    riskScore === 0
      ? "Marque os pontos acima para estimar o risco de desperdício"
      : riskScore <= 25
      ? "Risco Moderado — Há brechas de eficiência para ajustar"
      : riskScore <= 55
      ? "Risco Alto — Sua conta provavelmente está desperdiçando boa parte da verba"
      : "Risco Crítico — Sangramento severo de orçamento no Google Ads";

  const waMessage =
    selectedItems.length > 0
      ? `Olá, Leonardo! Fiz o diagnóstico na página de Auditoria de Google Ads (risco estimado: ${riskScore}/100, ${selectedItems.length} alertas marcados) e quero agendar uma auditoria técnica da minha conta.`
      : "Olá, Leonardo! Quero solicitar uma auditoria técnica da minha conta de Google Ads para parar de desperdiçar verba e aumentar meus leads no WhatsApp.";

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
  const canonicalUrl = "https://leonardobrasil.com.br/auditoria-google-ads";

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Auditoria Técnica de Conta Google Ads para Negócios Locais",
      description:
        "Auditoria completa de Google Ads para identificar desperdício de verba, corrigir palavras-chave negativas, segmentação geográfica, rastreamento de WhatsApp e reduzir o Custo por Lead.",
      url: canonicalUrl,
      provider: {
        "@type": "Organization",
        "@id": "https://leonardobrasil.com.br/#organization",
        name: "Leonardo Brasil",
      },
      areaServed: { "@type": "Country", name: "Brasil" },
      serviceType: "Auditoria e Otimização de Google Ads",
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
        { "@type": "ListItem", position: 1, name: "Início", item: "https://leonardobrasil.com.br" },
        { "@type": "ListItem", position: 2, name: "Google Ads", item: "https://leonardobrasil.com.br/google-ads" },
        { "@type": "ListItem", position: 3, name: "Auditoria de Google Ads", item: canonicalUrl },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ink text-text font-sans selection:bg-accent selection:text-white">
      <SeoHead
        title="Auditoria de Google Ads: Pare de Queimar Verba e Reduza seu CPL | Leonardo Brasil"
        description="Auditoria técnica de conta Google Ads para negócios locais. Identifique ralos de orçamento, corrija palavras negativas, segmentação geográfica e rastreamento no WhatsApp."
        keywords="auditoria google ads, auditoria de conta google ads, por que meu google ads não vende, otimização de campanhas google ads, reduzir cpc google ads"
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
            <Link to="/google-ads" className="hover:text-text transition-colors">Gestão Google Ads</Link>
            <Link to="/consultor-google-ads" className="hover:text-text transition-colors">Consultor Ads</Link>
            <Link to="/google-ads-e-google-meu-negocio" className="hover:text-text transition-colors">Ads + Maps</Link>
            <Link to="/auditoria-perfil-google" className="hover:text-text transition-colors">Raio-X Maps</Link>
          </nav>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-600 transition-all shadow-lg shadow-accent/20"
          >
            Auditar Minha Conta
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-line py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/15 via-ink to-ink -z-10" />
          <div className="mx-auto max-w-4xl px-5 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/30 mb-6">
              Auditoria Técnica Independente · Google Ads
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-balance">
              Sua conta de Google Ads gera cliques, mas <span className="text-gold">poucos clientes fechando no WhatsApp?</span>
            </h1>
            <p className="mt-6 text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Antes de aumentar seu orçamento de mídia, descubra exatamente onde o dinheiro está escapando. Na Auditoria de Google Ads, identifico cada ralo de verba e entrego o plano cirúrgico para derrubar seu Custo por Lead.
            </p>
          </div>
        </section>

        {/* CHECKLIST INTERATIVO DE RISCO DE DESPERDÍCIO */}
        <section className="py-16 border-b border-line bg-panel/40">
          <div className="mx-auto max-w-4xl px-5">
            <div className="rounded-3xl border border-line bg-panel p-6 sm:p-10">
              <span className="text-xs font-bold uppercase tracking-widest text-gold">Autoavaliação Rápida (30 segundos)</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                Marque os sinais que acontecem na sua conta hoje:
              </h2>
              <p className="mt-2 text-sm text-muted">
                Clique nos cenários abaixo para calcular o índice estimado de vazamento de verba.
              </p>

              <div className="mt-6 space-y-3">
                {DIAGNOSTIC_ITEMS.map((item) => {
                  const isSelected = Boolean(checked[item.id]);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? "border-gold/60 bg-gold/10"
                          : "border-line bg-ink/60 hover:border-accent/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 grid place-items-center w-5 h-5 rounded border text-xs font-black shrink-0 ${
                            isSelected ? "bg-gold border-gold text-ink" : "border-line-strong text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <div>
                          <p className="font-bold text-sm sm:text-base text-text">{item.label}</p>
                          <p className="mt-1 text-xs text-muted leading-relaxed">{item.explanation}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* RESULTADO */}
              <div className="mt-8 rounded-2xl border border-accent/30 bg-ink p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-muted">Índice de Vazamento de Verba</p>
                  <p className="text-3xl font-black text-gold mt-1">{riskScore} / 100</p>
                  <p className="text-sm font-semibold text-text mt-1">{riskLabel}</p>
                </div>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-black text-white hover:bg-accent-600 transition-all shadow-lg shadow-accent/25"
                >
                  Solicitar Auditoria no WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* OS 6 PILARES DA AUDITORIA */}
        <section className="py-20 border-b border-line bg-ink">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Profundidade Técnica</span>
              <h2 className="text-2xl sm:text-4xl font-black mt-2">O que inspeciono na sua conta Google Ads</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PONTOS_AUDITORIA.map((p) => (
                <div key={p.n} className="rounded-2xl border border-line bg-panel p-6">
                  <span className="text-xs font-black text-gold">{p.n}</span>
                  <h3 className="text-lg font-bold text-text mt-2 mb-2">{p.titulo}</h3>
                  <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
                </div>
              ))}
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
