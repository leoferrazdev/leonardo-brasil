import { useState } from "react";
import { Link } from "./lib/local-router";
import { SeoHead } from "./components/SeoHead";
import { Footer } from "./components/Footer";
import { SalesBottleneckCalculator } from "./components/SalesBottleneckCalculator";

// WhatsApp pessoal do Leonardo Brasil (só dígitos, DDI 55).
const WHATSAPP_NUMBER = "5551992568861";

const waLink = (msg: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const WA_DIAG = waLink("Olá, Leonardo! Quero um diagnóstico gratuito da estrutura de vendas do meu negócio.");
const WA_INFO = waLink("Olá, Leonardo! Quero mais informações sobre estrutura de vendas.");

// --- Ícones inline (sem dependências) ---
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

const CAMADAS = [
  { n: "01", nome: "Presença", frase: "Ser encontrado", desc: "Site profissional e Google Meu Negócio, quando procuram, é você que aparece, não o concorrente." },
  { n: "02", nome: "Aquisição", frase: "Atrair clientes", desc: "Anúncios e tráfego que trazem gente certa, com verba que trabalha, não botão impulsionado no escuro." },
  { n: "03", nome: "Conversão", frase: "Vender mais", desc: "WhatsApp organizado e CRM, cada lead acompanhado do primeiro 'oi' ao fechamento, sem venda perdida na gaveta." },
  { n: "04", nome: "Escala", frase: "Crescer sem caos", desc: "IA, rotina e processo para o funil rodar todo dia, sem depender de você lembrar de tudo." },
];

const PASSOS = [
  { t: "Diagnóstico gratuito", d: "Você me chama no WhatsApp e eu identifico exatamente onde o seu negócio está perdendo venda hoje." },
  { t: "Montagem da estrutura", d: "Montamos camada por camada, começando pelo que mais trava, presença, aquisição, conversão ou escala." },
  { t: "Acompanhamento", d: "Ajusto até o funil rodar de verdade, cliente te encontra, chama no WhatsApp e fecha com consistência." },
];

const SEGMENTOS = [
  "Nutricionistas",
  "Psicólogas",
  "Dentistas",
  "Fisioterapeutas",
  "Terapeutas",
  "Massoterapeutas",
  "Profissionais Liberais",
  "Prestadores de Serviço",
  "Autônomos",
  "Comércio Local"
];

const FAQ = [
  { q: "Isso é uma agência de marketing?", a: "Não. Agência entrega postagem. Eu monto estrutura de vendas: o caminho inteiro entre o cliente te encontrar, chamar no WhatsApp e comprar de você. Presença, aquisição, conversão e escala funcionando juntas." },
  { q: "Preciso contratar tudo de uma vez?", a: "Não. Começamos pela camada que mais trava o seu negócio hoje. Você entra pelo que precisa agora e evolui no seu ritmo." },
  { q: "Quanto custa?", a: "O valor é fechado no diagnóstico, conforme o que o seu negócio precisa. Nada de pacote genérico, primeiro entendo o gargalo, depois proponho." },
  { q: "Funciona pro meu segmento?", a: "Se você é um negócio local ou profissional liberal que recebe cliente pelo WhatsApp, depende de indicação ou precisa aparecer melhor no Google, funciona." },
];

const NAV = [
  { id: "metodo", label: "O Método" },
  { id: "para-quem", label: "Para quem" },
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

  return (
    <div className="min-h-screen bg-ink text-text overflow-x-hidden">
      <SeoHead schema={faqSchema} />
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <a href="#top" onClick={(e) => scrollTo(e, "top")} className="flex items-center gap-2.5 font-extrabold tracking-tight">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent/15 border border-accent/30">
              <svg viewBox="0 0 48 48" className="w-[18px] h-[18px]" fill="none"><rect x="6" y="9" width="36" height="9" rx="4" fill="#3b82f6" opacity="0.4" /><rect x="13" y="21" width="22" height="9" rx="4" fill="#3b82f6" opacity="0.7" /><rect x="20" y="33" width="8" height="9" rx="4" fill="#60a5fa" /></svg>
            </span>
            Leonardo Brasil
          </a>
          <nav className="hidden md:flex gap-8">
            <Link to="/google-meu-negocio" className="text-sm font-bold text-accent hover:text-accent-300 transition-colors">Google Meu Negócio</Link>
            <Link to="/consultoria" className="text-sm font-bold text-gold-400 hover:text-gold-300 transition-colors">Consultoria</Link>
            <Link to="/calculadora" className="text-sm font-bold text-accent-400 hover:text-accent-300 transition-colors">Calculadora</Link>
            <Link to="/blog" className="text-sm font-bold text-accent-400 hover:text-accent-300 transition-colors">Blog</Link>
            <Link to="/cidades" className="text-sm font-bold text-muted hover:text-text transition-colors">Cidades</Link>
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={(e) => scrollTo(e, n.id)} className="text-sm font-medium text-muted hover:text-text transition-colors">{n.label}</a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a href={WA_DIAG} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 transition-all active:scale-95 shadow-[0_0_24px_rgba(59,130,246,0.35)]">
              Diagnóstico gratuito <Arrow className="w-4 h-4" />
            </a>
          </div>
          <button className="md:hidden p-2 -mr-2 text-muted" onClick={() => setMenu(!menu)} aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">{menu ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}</svg>
          </button>
        </div>
        {menu && (
          <div className="md:hidden border-t border-line bg-ink px-5 py-6 flex flex-col gap-5">
            <Link to="/google-meu-negocio" onClick={() => setMenu(false)} className="text-lg font-bold text-accent">Google Meu Negócio</Link>
            <Link to="/consultoria" onClick={() => setMenu(false)} className="text-lg font-bold text-gold-400">Consultoria</Link>
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={(e) => scrollTo(e, n.id)} className="text-lg font-medium">{n.label}</a>
            ))}
            <a href={WA_DIAG} target="_blank" rel="noreferrer" className="mt-2 inline-flex justify-center items-center gap-2 rounded-full bg-accent px-5 py-3.5 font-bold text-white">Diagnóstico gratuito <Arrow className="w-5 h-5" /></a>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(60% 50% at 70% 0%, rgba(59,130,246,0.16), transparent 60%), radial-gradient(50% 40% at 10% 20%, rgba(37,99,235,0.10), transparent 60%)" }} />
          <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className="lb-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-accent-300">
                Estrutura de Vendas · Negócio Local
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight text-balance">
                Seu concorrente não é melhor.<br />Ele só tem <span className="text-accent-400">estrutura</span>.
              </h1>
              <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">
                Sou <strong className="text-text">Leonardo Brasil</strong>. Monto o caminho inteiro entre o cliente te <strong className="text-text">encontrar</strong>, chamar no seu <strong className="text-text">WhatsApp</strong> e <strong className="text-text">comprar de você</strong>, do Google ao atendimento organizado. O problema quase nunca é qualidade: é falta de estrutura de vendas.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href={WA_DIAG} target="_blank" rel="noreferrer" className="inline-flex justify-center items-center gap-2 rounded-full bg-accent px-7 py-4 text-base font-bold text-white hover:bg-accent-600 transition-all active:scale-95 shadow-[0_0_40px_rgba(59,130,246,0.35)]">
                  <WhatsApp className="w-5 h-5" /> Diagnóstico gratuito no WhatsApp
                </a>
                <a href="#metodo" onClick={(e) => scrollTo(e, "metodo")} className="inline-flex justify-center items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-base font-semibold text-text hover:bg-panel transition-colors">
                  Ver o método
                </a>
              </div>
              <p className="mt-6 text-sm text-muted">Fundador do <a href="https://funilcomercial.com" target="_blank" rel="noreferrer" className="text-accent-300 hover:underline">Funil Comercial</a> · Atendimento direto comigo.</p>
            </div>

            {/* Foto */}
            <div className="lb-rise relative mx-auto w-full max-w-sm" style={{ animationDelay: "0.1s" }}>
              <div className="absolute -inset-4 rounded-[2rem] bg-accent/20 blur-3xl" />
              <div className="relative rounded-[1.75rem] overflow-hidden border border-line-strong bg-panel aspect-[4/5] shadow-2xl">
                <img
                  src="/leonardo.jpg"
                  alt="Leonardo Brasil"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget.style.display = "none"); }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-ink via-ink/70 to-transparent">
                  <p className="font-bold text-lg">Leonardo Brasil</p>
                  <p className="text-sm text-muted">Estrutura de vendas para negócio local</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAIXA 4 CAMADAS (resumo) */}
        <section className="border-y border-line bg-panel/40">
          <div className="mx-auto max-w-6xl px-5 py-5 grid grid-cols-2 place-items-center gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-6 sm:gap-y-2 text-sm font-semibold tracking-wide">
            {CAMADAS.map((c, i) => (
              <span key={c.nome} className="flex items-center gap-6 text-muted">
                <span><span className="text-accent-400">{c.nome}</span></span>
                {i < CAMADAS.length - 1 && <span className="hidden sm:inline text-line-strong">·</span>}
              </span>
            ))}
          </div>
        </section>

        {/* O MÉTODO — 4 camadas detalhadas */}
        <section id="metodo" className="mx-auto max-w-6xl px-5 py-20 scroll-mt-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">O método: 4 camadas que vendem juntas</h2>
            <p className="mt-4 text-muted text-lg">Não é dica solta. É a engrenagem completa da sua estrutura de vendas, você entra pela camada que trava hoje.</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 gap-5">
            {CAMADAS.map((c) => (
              <div key={c.n} className="rounded-2xl border border-line bg-panel p-7 hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-black text-accent-400 tabular-nums">{c.n}</span>
                  <div>
                    <h3 className="text-xl font-bold leading-none">{c.nome}</h3>
                    <span className="text-xs font-semibold uppercase tracking-widest text-accent-300">{c.frase}</span>
                  </div>
                </div>
                <p className="text-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA — 3 passos */}
        <section className="border-y border-line bg-panel/30">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Como funciona</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {PASSOS.map((p, i) => (
                <div key={p.t} className="relative rounded-2xl border border-line bg-ink p-7">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 text-accent-400 font-black">{i + 1}</span>
                  <h3 className="mt-5 text-lg font-bold">{p.t}</h3>
                  <p className="mt-2 text-muted leading-relaxed text-sm">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PARA QUEM */}
        <section id="para-quem" className="mx-auto max-w-6xl px-5 py-20 scroll-mt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Você é bom no que faz.<br />Falta estrutura para vender.</h2>
              <p className="mt-5 text-muted text-lg leading-relaxed">
                Se o seu WhatsApp virou uma gaveta de orçamentos esquecidos, se você depende de indicação e some do Google, ou se anuncia e não vê retorno, o gargalo não é talento. É estrutura. É isso que eu monto.
              </p>
              <a href={WA_INFO} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-white hover:bg-accent-600 transition-all active:scale-95">
                <WhatsApp className="w-5 h-5" /> Falar comigo
              </a>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {SEGMENTOS.map((s) => (
                <span key={s} className="rounded-lg border border-line bg-panel px-3.5 py-2 text-sm font-medium text-text/90 flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-400" /> {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* PROVA / AUTORIDADE */}
        <section className="border-y border-line bg-panel/30">
          <div className="mx-auto max-w-4xl px-5 py-20 text-center">
            <p className="text-2xl sm:text-3xl font-bold leading-snug text-balance">
              “Quem monta a estrutura, usa a própria estrutura. Não revendo ferramenta dos outros, <span className="text-accent-400">construí o meu próprio CRM</span> e entrego o mesmo método que uso todos os dias.”
            </p>
            <p className="mt-6 text-muted font-semibold">Leonardo Brasil · Fundador do Funil Comercial</p>
          </div>
        </section>

        {/* CALCULADORA DE GARGALO COMERCIAL */}
        <section id="calculadora" className="mx-auto max-w-6xl px-5 py-20 scroll-mt-16">
          <SalesBottleneckCalculator initialTicket={400} initialLeads={50} initialConversion={15} />
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-5 py-20 scroll-mt-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center">Perguntas frequentes</h2>
          <div className="mt-10 flex flex-col gap-3">
            {FAQ.map((f, i) => (
              <div key={i} className="rounded-2xl border border-line bg-panel overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold">
                  {f.q}
                  <Chevron className={`w-5 h-5 text-accent-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && <p className="px-5 pb-5 -mt-1 text-muted leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-panel p-10 sm:p-14 text-center">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(59,130,246,0.18), transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Vamos montar a sua estrutura?</h2>
              <p className="mt-4 text-muted text-lg max-w-xl mx-auto">Comece pelo diagnóstico gratuito. Em poucos minutos no WhatsApp eu te mostro onde está a venda que você perde hoje.</p>
              <a href={WA_DIAG} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-full sm:w-auto justify-center items-center gap-2 sm:gap-2.5 rounded-full bg-accent px-6 py-3.5 text-sm sm:px-9 sm:py-4 sm:text-lg font-bold text-white hover:bg-accent-600 transition-all active:scale-95 shadow-[0_0_50px_rgba(59,130,246,0.4)]">
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
        <span className="hidden sm:inline text-sm">Mais informações</span>
      </a>
    </div>
  );
}
