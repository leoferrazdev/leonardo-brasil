import { useState } from "react";
import { Link } from "./lib/local-router";
import { SeoHead } from "./components/SeoHead";
import { Footer } from "./components/Footer";
import locationsData from "./data/seoLocations.json";
import { LOCATIONS } from "./data/locations";

// WhatsApp pessoal do Leonardo Brasil (só dígitos, DDI 55).
const WHATSAPP_NUMBER = "5551992568861";

const waLink = (msg: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const WA_DIAG = waLink("Olá, Leonardo! Quero uma avaliação gratuita do perfil da minha empresa no Google Meu Negócio.");
const WA_INFO = waLink("Olá, Leonardo! Gostaria de mais informações sobre a consultoria de Google Meu Negócio.");

// --- Ícones inline ---
const WhatsApp = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.04-.95.23-3.2-.67-2.7-1.07-4.42-3.83-4.55-4.01-.13-.18-1.1-1.46-1.1-2.78 0-1.32.69-1.97.94-2.24.24-.27.53-.33.7-.33.18 0 .35 0 .5.01.16.01.38-.06.6.46.24.55.8 1.9.87 2.04.07.13.12.29.02.47-.09.18-.14.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.16.27.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.42.11.58-.07.16-.18.67-.78.85-1.05.18-.27.35-.22.6-.13.24.09 1.55.73 1.82.86.27.13.44.2.5.31.07.11.07.63-.17 1.32Z" />
  </svg>
);
const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const Check = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);
const Chevron = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

const PILARES = [
  { n: "01", nome: "Auditoria & Consistência NAP", desc: "Alinhamento exato de Nome, Endereço e Telefone em todas as fontes da web para gerar máxima relevância perante o algoritmo do Google." },
  { n: "02", nome: "Categorias Estratégicas", desc: "Configuração precisa da categoria primária e secundárias que concentram o maior volume de buscas de clientes prontos para comprar." },
  { n: "03", nome: "SEO Local na Descrição", desc: "Texto persuasivo de 750 caracteres estruturado com palavras-chave geográficas para responder às pesquisas e resumos de IA (Google AI Overviews)." },
  { n: "04", nome: "Catálogo de Serviços & Preços", desc: "Apresentação clara de tudo o que você oferece, com fotos, diferenciais e links diretos para agendamento ou orçamento no WhatsApp." },
  { n: "05", nome: "Fotos & Vídeos Georreferenciados", desc: "Direcionamento e organização de imagens do ambiente, equipe e serviços que aumentam cliques e engajamento visual no Google Maps." },
  { n: "06", nome: "Kit de Avaliações 5 Estrelas", desc: "Estratégia e links curtos para transformar clientes atendidos em dezenas de avaliações positivas, blindando a reputação contra concorrentes." },
];

const PASSOS = [
  { t: "1. Diagnóstico Gratuito", d: "Você me chama no WhatsApp e eu avalio seu perfil no Google Maps, apontando exatamente o que está afastando clientes." },
  { t: "2. Otimização Cirúrgica", d: "Executamos a revisão completa: categorias, catálogo, textos, fotos, horários e conexão direta com seu WhatsApp." },
  { t: "3. Tração & Autoridade", d: "Seu perfil sobe posições no Maps, atrai ligações e você recebe o kit prático para continuar conquistando avaliações 5 estrelas." },
];

const FAQ = [
  { q: "Vocês garantem a 1ª posição no Google?", a: "Nenhum profissional sério pode garantir primeira posição absoluta, pois o Google considera proximidade física e histórico. O que fazemos é aplicar todas as técnicas oficiais de SEO Local para colocar seu negócio entre os primeiros destacados no Google Maps (Top 3)." },
  { q: "Serve para quem não tem loja física ou consultório?", a: "Sim. Se você presta serviços na cidade ou atende em domicílio/online, configuramos como 'Área de Atendimento', permitindo aparecer no Google Maps sem expor seu endereço residencial." },
  { q: "Existe mensalidade?", a: "Não. A otimização e reestruturação do Google Meu Negócio é realizada como investimento único. Você paga uma vez para blindar e organizar o seu perfil." },
  { q: "Quanto tempo leva para surtir efeito?", a: "Muitos negócios começam a notar aumento significativo nas ligações, rotas e mensagens no WhatsApp já nas primeiras duas a três semanas após as correções no perfil." },
  { q: "Por que contratar um especialista em vez de fazer sozinho?", a: "Porque detalhes técnicos como categoria primária, consistência de dados externos e resposta com palavras-chave fazem a diferença entre ficar na página 3 ou dominar o Top 3 da sua rua e bairro." },
];

const NAV = [
  { id: "pilares", label: "O que fazemos" },
  { id: "comparativo", label: "Comparativo" },
  { id: "especialidades", label: "Especialidades" },
  { id: "faq", label: "FAQ" },
];

export default function App() {
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const niches = locationsData.NICHES;
  const topCities = LOCATIONS.filter(l => 
    ["sao-paulo", "rio-de-janeiro", "belo-horizonte", "curitiba", "porto-alegre", "balneario-camboriu", "florianopolis", "campinas"].includes(l.slug)
  );

  return (
    <div className="min-h-screen bg-ink text-text overflow-x-hidden selection:bg-accent selection:text-white">
      <SeoHead
        title="Leonardo Brasil — Especialista em Google Meu Negócio e SEO Local"
        description="Coloque seu negócio no Top 3 do Google Maps. Otimização e gestão de Perfil da Empresa no Google para atrair clientes locais sem pagar por anúncios diários."
        canonicalUrl="https://leonardobrasil.com.br"
        schema={faqSchema}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight hover:text-accent transition-colors">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent/15 border border-accent/30">
              <svg viewBox="0 0 48 48" className="w-[18px] h-[18px]" fill="none"><rect x="6" y="9" width="36" height="9" rx="4" fill="#3b82f6" opacity="0.4" /><rect x="13" y="21" width="22" height="9" rx="4" fill="#3b82f6" opacity="0.7" /><rect x="20" y="33" width="8" height="9" rx="4" fill="#60a5fa" /></svg>
            </span>
            Leonardo Brasil
          </Link>

          <nav className="hidden md:flex gap-7 items-center">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={(e) => scrollTo(e, n.id)} className="text-sm font-medium text-muted hover:text-text transition-colors">{n.label}</a>
            ))}
            <Link to="/cidades" className="text-sm font-medium text-muted hover:text-text transition-colors">Cidades</Link>
            <Link to="/blog" className="text-sm font-medium text-muted hover:text-text transition-colors">Blog</Link>
          </nav>

          <div className="hidden md:block">
            <a href={WA_DIAG} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 transition-all active:scale-95 shadow-[0_0_24px_rgba(59,130,246,0.35)]">
              Avaliar meu Perfil <Arrow className="w-4 h-4" />
            </a>
          </div>

          <button className="md:hidden p-2 -mr-2 text-muted" onClick={() => setMenu(!menu)} aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">{menu ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}</svg>
          </button>
        </div>

        {menu && (
          <div className="md:hidden border-t border-line bg-ink px-5 py-6 flex flex-col gap-5">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={(e) => scrollTo(e, n.id)} className="text-lg font-medium">{n.label}</a>
            ))}
            <Link to="/cidades" onClick={() => setMenu(false)} className="text-lg font-medium">Cidades Atendidas</Link>
            <Link to="/blog" onClick={() => setMenu(false)} className="text-lg font-medium">Blog</Link>
            <a href={WA_DIAG} target="_blank" rel="noreferrer" className="mt-2 inline-flex justify-center items-center gap-2 rounded-full bg-accent px-5 py-3.5 font-bold text-white">Avaliar meu Perfil <Arrow className="w-5 h-5" /></a>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(60% 50% at 70% 0%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(50% 40% at 10% 20%, rgba(37,99,235,0.12), transparent 60%)" }} />
          <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent-300">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Especialista em Google Meu Negócio & SEO Local
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl font-black leading-[1.08] tracking-tight text-balance">
                Seu concorrente no Google Maps não é melhor.<br />Ele só está <span className="text-accent-400">mais visível</span>.
              </h1>
              <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">
                Sou <strong className="text-text">Leonardo Brasil</strong>. Otimizo seu Perfil da Empresa no Google para transformar buscas locais em <strong className="text-text">ligações</strong>, <strong className="text-text">pedidos de rota</strong> e <strong className="text-text">mensagens no WhatsApp</strong>, sem você precisar torrar dinheiro com anúncios pagos todos os dias.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href={WA_DIAG} target="_blank" rel="noreferrer" className="inline-flex justify-center items-center gap-2 rounded-full bg-accent px-7 py-4 text-base font-bold text-white hover:bg-accent-600 transition-all active:scale-95 shadow-[0_0_40px_rgba(59,130,246,0.35)]">
                  <WhatsApp className="w-5 h-5" /> Diagnóstico gratuito no WhatsApp
                </a>
                <a href="#pilares" onClick={(e) => scrollTo(e, "pilares")} className="inline-flex justify-center items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-base font-semibold text-text hover:bg-panel transition-colors">
                  Ver o que está incluso
                </a>
              </div>
              <p className="mt-6 text-xs text-muted">Consultoria técnica individualizada · Atendimento direto comigo.</p>
            </div>

            {/* Foto e Card de Autoridade */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-4 rounded-[2rem] bg-accent/20 blur-3xl" />
              <div className="relative rounded-[1.75rem] overflow-hidden border border-line-strong bg-panel aspect-[4/5] shadow-2xl">
                <img
                  src="/leonardo.jpg"
                  alt="Leonardo Brasil — Especialista em Google Meu Negócio"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget.style.display = "none"); }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-ink via-ink/80 to-transparent">
                  <p className="font-bold text-lg text-text">Leonardo Brasil</p>
                  <p className="text-xs text-accent-300 font-semibold">Consultor em Google Meu Negócio & Presença Local</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MÉTRICAS DE IMPACTO */}
        <section className="border-y border-line bg-panel/40">
          <div className="mx-auto max-w-6xl px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-black text-accent">+70%</p>
              <p className="text-xs text-muted mt-1">Dos cliques locais vão para o Top 3 do Maps</p>
            </div>
            <div>
              <p className="text-3xl font-black text-gold">Orgânico</p>
              <p className="text-xs text-muted mt-1">Sem pagar anúncios por cada clique</p>
            </div>
            <div>
              <p className="text-3xl font-black text-text">WhatsApp</p>
              <p className="text-xs text-muted mt-1">Leads prontos para agendar</p>
            </div>
            <div>
              <p className="text-3xl font-black text-accent-300">5 Estrelas</p>
              <p className="text-xs text-muted mt-1">Método ativo de coleta de avaliações</p>
            </div>
          </div>
        </section>

        {/* OS 6 PILARES DA OTIMIZAÇÃO */}
        <section id="pilares" className="mx-auto max-w-6xl px-5 py-20 scroll-mt-16">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Metodologia Especializada</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">O que fazemos no seu Perfil</h2>
            <p className="mt-4 text-muted text-base sm:text-lg">
              Um processo técnico e prático para transformar um perfil esquecido em uma máquina de novos clientes locais.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILARES.map((p) => (
              <div key={p.n} className="rounded-2xl border border-line bg-panel p-7 hover:border-accent/40 transition-colors">
                <span className="text-xs font-black text-accent">{p.n}</span>
                <h3 className="text-lg font-bold text-text mt-3 mb-2">{p.nome}</h3>
                <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARATIVO: PERFIL COMUM VS PERFIL BLINDADO */}
        <section id="comparativo" className="border-y border-line bg-panel/30 py-20 scroll-mt-16">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text">
                O que separa o perfil comum do perfil dominante
              </h2>
              <p className="mt-4 text-muted text-base">
                A maioria das empresas locais perde clientes todos os dias simplesmente porque seu perfil parece abandonado.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* PERFIL COMUM */}
              <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-7">
                <span className="inline-block text-xs font-black uppercase text-red-400 bg-red-500/10 px-3 py-1 rounded-full mb-4">
                  Perfil Comum / Abandonado
                </span>
                <h3 className="text-xl font-bold text-text mb-4">Perdendo Vendas Todos os Dias</h3>
                <ul className="space-y-3 text-sm text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Categoria errada ou incompleta, sumindo nas pesquisas mais procuradas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Poucas fotos, desatualizadas ou de baixa qualidade enviadas por clientes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Avaliações negativas sem resposta ou meses sem novas avaliações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Cliente clica e não tem WhatsApp direto para iniciar atendimento</span>
                  </li>
                </ul>
              </div>

              {/* PERFIL BLINDADO */}
              <div className="rounded-2xl border border-accent/40 bg-accent/5 p-7 shadow-xl shadow-accent/5">
                <span className="inline-block text-xs font-black uppercase text-accent-300 bg-accent/20 px-3 py-1 rounded-full mb-4">
                  Otimizado por Leonardo Brasil
                </span>
                <h3 className="text-xl font-bold text-text mb-4">Top 3 e Máxima Conversão</h3>
                <ul className="space-y-3 text-sm text-text">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold shrink-0">✓</span>
                    <span>Categoria primária e secundárias exatas para atrair o maior volume de busca</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold shrink-0">✓</span>
                    <span>Fotos profissionais georreferenciadas que transmitem credibilidade instantânea</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold shrink-0">✓</span>
                    <span>Estratégia ativa para captar avaliações 5 estrelas e respostas com SEO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold shrink-0">✓</span>
                    <span>Botão de WhatsApp com mensagem personalizada para atendimento imediato</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-20 border-b border-line">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center">Como funciona o processo</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {PASSOS.map((p, i) => (
                <div key={p.t} className="rounded-2xl border border-line bg-panel p-7">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 text-accent-400 font-black">{i + 1}</span>
                  <h3 className="mt-5 text-lg font-bold">{p.t}</h3>
                  <p className="mt-2 text-muted leading-relaxed text-sm">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ESPECIALIDADES / NICHOS */}
        <section id="especialidades" className="py-20 bg-panel scroll-mt-16 border-b border-line">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Segmentos Especializados</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
                Otimização de Google Meu Negócio por Especialidade
              </h2>
              <p className="mt-3 text-muted text-sm sm:text-base">
                Selecione o seu segmento para acessar o hub nacional com todas as cidades atendidas.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {niches.map((n) => (
                <Link
                  key={n.slug}
                  to={`/google-meu-negocio/${n.slug}`}
                  className="p-5 rounded-2xl border border-line bg-ink/70 hover:border-accent hover:bg-ink transition-all flex items-center justify-between group"
                >
                  <span className="font-bold text-sm text-text group-hover:text-accent transition-colors">
                    {n.nome}
                  </span>
                  <Arrow className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* COBERTURA REGIONAL */}
        <section className="py-20 border-b border-line bg-ink">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent">Abrangência Nacional</span>
                <h2 className="text-3xl font-black tracking-tight mt-1">Principais Cidades Atendidas</h2>
              </div>
              <Link to="/cidades" className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
                Ver todas as 5.570 cidades do Brasil →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topCities.map((city) => (
                <Link
                  key={city.slug}
                  to={`/google-meu-negocio/dentistas/${city.state.toLowerCase()}/${city.slug}`}
                  className="p-3.5 rounded-xl border border-line bg-panel/60 hover:border-accent/40 text-sm font-medium text-muted hover:text-text transition-all"
                >
                  {city.name} - {city.state}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-5 py-20 scroll-mt-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center">Perguntas Frequentes</h2>
          <div className="mt-10 flex flex-col gap-3">
            {FAQ.map((f, i) => (
              <div key={i} className="rounded-2xl border border-line bg-panel overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold">
                  {f.q}
                  <Chevron className={`w-5 h-5 text-accent-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && <p className="px-5 pb-5 -mt-1 text-muted leading-relaxed text-sm">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-panel p-10 sm:p-14 text-center">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(59,130,246,0.18), transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Vamos colocar seu negócio no Top 3 do Google Maps?</h2>
              <p className="mt-4 text-muted text-base sm:text-lg max-w-xl mx-auto">
                Envie uma mensagem e receba uma análise preliminar gratuita do seu perfil. Descubra onde estão as brechas que você pode consertar hoje.
              </p>
              <a href={WA_DIAG} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-full sm:w-auto justify-center items-center gap-2.5 rounded-full bg-accent px-8 py-4 text-base sm:text-lg font-bold text-white hover:bg-accent-600 transition-all active:scale-95 shadow-[0_0_50px_rgba(59,130,246,0.4)]">
                <WhatsApp className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" /> Diagnóstico gratuito no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* FAB WhatsApp */}
      <a href={WA_INFO} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] pl-3 pr-3 sm:pr-5 py-3 text-white font-semibold shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] hover:bg-[#1ebe5b] transition-all active:scale-95">
        <span className="relative grid place-items-center h-7 w-7 rounded-full lb-ping">
          <WhatsApp className="h-7 w-7" />
        </span>
        <span className="hidden sm:inline text-sm">Falar no WhatsApp</span>
      </a>
    </div>
  );
}
