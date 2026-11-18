import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_GESTAO = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá, Leonardo! Quero informações sobre a Gestão Mensal de Google Meu Negócio para manter meu perfil ativo e no topo do Google Maps."
)}`;

const ROTINA_MENSAL = [
  {
    freq: "Semanal",
    titulo: "Publicações & Atualizações Estratégicas",
    desc: "Criação de postagens no Perfil da Empresa com ofertas, diferenciais, serviços carro-chefe e palavras-chave geográficas que sinalizam atividade constante ao algoritmo.",
  },
  {
    freq: "Contínuo",
    titulo: "Gestão e Resposta de Avaliações com SEO",
    desc: "Monitoramento das avaliações recebidas e respostas estratégicas em até 24–48h usando termos naturais dos seus serviços e cidade — reforçando confiança e relevância.",
  },
  {
    freq: "Quinzenal",
    titulo: "Atualização de Fotos, Serviços e Catálogo",
    desc: "Subida de novas fotografias reais do negócio, equipe e entregas, além de atualização de horários especiais, feriados e novos serviços no catálogo.",
  },
  {
    freq: "Blindagem",
    titulo: "Defesa contra Edições de Concorrentes e Spam",
    desc: "O Google permite que terceiros sugiram edições no seu perfil (como mudar seu telefone ou marcar como fechado). Monitoramos e rejeitamos alterações maliciosas.",
  },
  {
    freq: "Mensal",
    titulo: "Relatório Executivo de Ligações, Rotas e Cliques",
    desc: "Relatório objetivo comparando mês a mês quantas pessoas ligaram, pediram rota no GPS, clicaram no site e iniciaram conversa no WhatsApp pelo Google Maps.",
  },
  {
    freq: "Estratégico",
    titulo: "Acompanhamento de Concorrentes & Perguntas (Q&A)",
    desc: "Monitoramento dos movimentos dos líderes da sua cidade e manutenção da seção de Perguntas e Respostas antecipando objeções comerciais dos clientes.",
  },
];

const COMPARATIVO = [
  {
    item: "Reestruturação inicial (categorias, descrição, NAP, catálogo)",
    otimizacao: "Incluso (Setup Único)",
    gestao: "Incluso no 1º mês",
  },
  {
    item: "Postagens semanais com foco em SEO Local",
    otimizacao: "Por conta da equipe",
    gestao: "Executado toda semana",
  },
  {
    item: "Resposta técnica às novas avaliações de clientes",
    otimizacao: "Playbook entregue",
    gestao: "Gerenciado continuamente",
  },
  {
    item: "Monitoramento contra edições indevidas e risco de suspensão",
    otimizacao: "Apenas no setup",
    gestao: "Monitoramento ativo",
  },
  {
    item: "Relatório mensal de ligações, rotas e cliques no WhatsApp",
    otimizacao: "Baseline inicial",
    gestao: "Relatório mensal completo",
  },
  {
    item: "Ideal para",
    otimizacao: "Negócios com baixa concorrência ou equipe interna ativa",
    gestao: "Mercados disputados, clínicas, escritórios e redes multiunidade",
  },
];

const FAQ = [
  {
    q: "Qual a diferença entre otimização pontual e gestão mensal de Google Meu Negócio?",
    a: "A otimização pontual corrige toda a base técnica do perfil em um único projeto. A gestão mensal mantém o perfil vivo, atualizado toda semana, protegido contra edições maliciosas e com crescimento contínuo de avaliações e métricas — essencial em cidades e nichos competitivos.",
  },
  {
    q: "Quanto custa a gestão mensal de Google Meu Negócio?",
    a: "O investimento mensal depende do nível de competitividade da cidade, do número de unidades/perfis e se a gestão será combinada com Google Ads. Envie seu perfil no WhatsApp para receber o diagnóstico gratuito e a proposta exata para o seu cenário.",
  },
  {
    q: "Existe contrato de fidelidade longa?",
    a: "Trabalhamos com total transparência e foco em resultados mensuráveis (ligações, rotas e mensagens). Explico claramente o prazo mínimo recomendado para maturação de SEO Local (geralmente 90 dias) sem multas abusivas.",
  },
  {
    q: "Posso combinar a Gestão de Google Meu Negócio com Gestão de Google Ads?",
    a: "Sim — inclusive esse é o formato que gera o menor Custo por Lead (CPL) para clínicas, escritórios e prestadores de serviços. Você aparece nos anúncios pagos e no Top 3 orgânico do Maps ao mesmo tempo.",
  },
];

export default function GestaoGoogleMeuNegocio() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canonicalUrl = "https://leonardobrasil.com.br/gestao-google-meu-negocio";

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Gestão Mensal de Google Meu Negócio (Perfil da Empresa no Google)",
      description:
        "Serviço de gerenciamento mensal completo do Google Meu Negócio: postagens semanais, gestão de avaliações com SEO local, blindagem contra concorrentes e relatórios mensais.",
      url: canonicalUrl,
      provider: {
        "@type": "Organization",
        "@id": "https://leonardobrasil.com.br/#organization",
        name: "Leonardo Brasil",
      },
      areaServed: { "@type": "Country", name: "Brasil" },
      serviceType: "Gestão de Google Meu Negócio e SEO Local",
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
        { "@type": "ListItem", position: 2, name: "Google Meu Negócio", item: "https://leonardobrasil.com.br/google-meu-negocio" },
        { "@type": "ListItem", position: 3, name: "Gestão Mensal de Google Meu Negócio", item: canonicalUrl },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ink text-text font-sans selection:bg-accent selection:text-white">
      <SeoHead
        title="Gestão de Google Meu Negócio Mensal: Manutenção e Top 3 no Maps | Leonardo Brasil"
        description="Contrate a gestão mensal do seu Google Meu Negócio (Perfil da Empresa no Google). Postagens semanais, respostas de avaliações com SEO local, blindagem e relatórios reais."
        keywords="gestão de google meu negócio, gerenciamento google meu negócio, empresa que gerencia google meu negócio, quanto custa gestão google meu negócio, manutenção perfil empresa google"
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
            <Link to="/otimizacao-google-meu-negocio" className="hover:text-text transition-colors">Otimização Pontual</Link>
            <Link to="/google-ads" className="text-accent hover:text-accent-300 transition-colors">Google Ads</Link>
            <Link to="/auditoria-perfil-google" className="hover:text-text transition-colors">Raio-X Grátis</Link>
          </nav>
          <a
            href={WA_GESTAO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-600 transition-all shadow-lg shadow-accent/20"
          >
            Solicitar Proposta
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-line py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-ink to-ink -z-10" />
          <div className="mx-auto max-w-4xl px-5 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-300 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/30 mb-6">
              Gerenciamento Profissional · Recorrente
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-balance">
              Gestão Mensal de Google Meu Negócio para <span className="text-accent-400">manter sua empresa no Top 3</span>
            </h1>
            <p className="mt-6 text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Em mercados competitivos, otimizar o perfil uma vez e abandonar por meses faz seus concorrentes tomarem o topo. Com a gestão mensal, seu Perfil da Empresa recebe manutenção semanal, blindagem e evolução contínua de ligações e contatos no WhatsApp.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WA_GESTAO}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white font-black text-base px-8 py-4 rounded-full hover:bg-accent-600 transition-all shadow-xl shadow-accent/25"
              >
                Quero Proposta de Gestão Mensal →
              </a>
              <Link
                to="/otimizacao-google-meu-negocio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-panel px-7 py-4 text-sm font-bold text-text hover:border-accent transition-colors"
              >
                Prefere Otimização Pontual (Sem Mensalidade)?
              </Link>
            </div>
          </div>
        </section>

        {/* ROTINA DE GESTÃO */}
        <section className="py-20 border-b border-line bg-ink">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">O que fazemos todo mês</span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">
                Rotina técnica para gerar consistência no Google Maps
              </h2>
              <p className="mt-3 text-muted text-sm sm:text-base">
                O algoritmo local premia perfis vivos, confiáveis e constantemente atualizados. Veja cada entrega incluída na gestão.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROTINA_MENSAL.map((item) => (
                <div key={item.titulo} className="rounded-2xl border border-line bg-panel p-6 hover:border-accent/40 transition-colors">
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-accent-300 bg-accent/10 px-2.5 py-1 rounded-md">
                    {item.freq}
                  </span>
                  <h3 className="text-lg font-bold text-text mt-3 mb-2">{item.titulo}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARATIVO: OTIMIZAÇÃO PONTUAL VS GESTÃO MENSAL */}
        <section className="py-20 border-b border-line bg-panel/40">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Otimização Pontual vs. Gestão Mensal: qual escolher?
              </h2>
              <p className="mt-3 text-muted text-sm sm:text-base">
                Transparência total para você contratar exatamente o que o seu momento exige — sem empurrar mensalidade desnecessária.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-ink/60">
                    <th className="p-4 font-bold text-text">Critério / Entrega</th>
                    <th className="p-4 font-bold text-muted">Otimização Pontual</th>
                    <th className="p-4 font-bold text-accent-300">Gestão Mensal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {COMPARATIVO.map((row) => (
                    <tr key={row.item} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-medium text-text">{row.item}</td>
                      <td className="p-4 text-muted">{row.otimizacao}</td>
                      <td className="p-4 font-semibold text-accent-300">{row.gestao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CROSS-LINK PARA GOOGLE ADS + GMN */}
        <section className="py-16 border-b border-line bg-ink">
          <div className="mx-auto max-w-5xl px-5">
            <div className="rounded-3xl border border-gold/30 bg-panel p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold">Plano Acelerado</span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2">
                  Quer unir Gestão de Google Meu Negócio + Google Ads?
                </h2>
                <p className="mt-2 text-sm text-muted max-w-xl leading-relaxed">
                  Vincule seu perfil otimizado a campanhas locais no Google Ads para aparecer nos resultados patrocinados e no Top 3 orgânico do mapa ao mesmo tempo.
                </p>
              </div>
              <Link
                to="/google-ads-e-google-meu-negocio"
                className="shrink-0 rounded-full bg-gold text-ink font-black text-sm px-6 py-3.5 hover:bg-gold-400 transition-colors"
              >
                Conhecer Estratégia Híbrida →
              </Link>
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
