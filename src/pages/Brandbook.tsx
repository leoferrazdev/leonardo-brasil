import { useState, useEffect } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";

// Ícones minimalistas nativos SVG
const Check = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5" /></svg>
);
const Copy = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const ChevronRight = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);
const Menu = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const X = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const Target = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const MapPin = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const Briefcase = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

// Logo Nativo do Header
const LogoIcon = ({ size = 32, className = "" }) => (
  <span className={`grid place-items-center rounded-lg border border-accent/30 shrink-0 ${className}`} style={{ width: size, height: size, backgroundColor: "rgba(59,130,246,0.15)" }}>
    <svg viewBox="0 0 48 48" className="w-[56%] h-[56%]" fill="none">
      <rect x="6" y="9" width="36" height="9" rx="4" fill="#3b82f6" opacity="0.4" />
      <rect x="13" y="21" width="22" height="9" rx="4" fill="#3b82f6" opacity="0.7" />
      <rect x="20" y="33" width="8" height="9" rx="4" fill="#60a5fa" />
    </svg>
  </span>
);

function ColorSwatch({ colorClass, name, hex, description }: { colorClass: string, name: string, hex: string, description: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="group cursor-pointer rounded-2xl border border-line bg-ink p-4 transition-all hover:border-accent/40"
      onClick={handleCopy}
    >
      <div 
        className={`mb-4 h-32 w-full rounded-xl shadow-inner transition-transform group-hover:scale-[0.98] ${colorClass}`} 
      />
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-text">{name}</h4>
          <p className="text-xs text-muted mt-0.5">{description}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-panel text-muted transition-colors group-hover:bg-accent group-hover:text-white">
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 font-mono text-xs text-muted">
        <span>HEX</span>
        <span className="text-text">{hex}</span>
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "visao-geral", label: "Visão Geral" },
  { id: "sobre-negocio", label: "Sobre o Negócio" },
  { id: "logo", label: "Sistema de Logo" },
  { id: "cores", label: "Paleta de Cores" },
  { id: "tipografia", label: "Tipografia" },
  { id: "tom-de-voz", label: "Tom de Voz" },
  { id: "icp-regioes", label: "ICP & Regiões" },
];

const businessResources = [
  {
    title: "Presença digital",
    description: "Criação de site profissional e otimização do Google Meu Negócio para que o negócio apareça quando os clientes procuram.",
  },
  {
    title: "Aquisição de clientes",
    description: "Gestão de anúncios e tráfego pago direcionado ao público certo, com orçamento eficiente e sem desperdício.",
  },
  {
    title: "Conversão no WhatsApp",
    description: "Organização do atendimento via WhatsApp com CRM próprio para acompanhar cada lead desde o primeiro contato até o fechamento.",
  },
  {
    title: "Escala com IA e processos",
    description: "Implementação de automações, rotinas e inteligência artificial para o funil de vendas funcionar de forma consistente e autônoma.",
  },
  {
    title: "Diagnóstico gratuito",
    description: "Análise personalizada via WhatsApp para identificar onde o negócio está perdendo vendas e quanto faturamento está sendo desperdiçado.",
  },
];

const targetClients = [
  "Donos de negócios locais que têm qualidade no serviço, mas não conseguem atrair clientes de forma consistente por falta de presença digital.",
  "Empreendedores que dependem exclusivamente de indicações e não aparecem nos resultados do Google quando potenciais clientes procuram seus serviços.",
  "Profissionais que investem em anúncios, mas não veem retorno porque não têm uma estrutura de conversão organizada após o clique.",
  "Negócios locais com o WhatsApp cheio de orçamentos sem resposta e leads perdidos por falta de follow-up sistemático.",
  "Pequenos empresários que querem escalar as vendas sem depender de memória ou esforço manual diário para gerenciar o processo comercial.",
];

export default function Brandbook() {
  const [activeSection, setActiveSection] = useState("visao-geral");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-ink text-text font-sans selection:bg-accent/30 flex overflow-x-hidden transform">
      <SeoHead 
        title="Brandbook & Guia de Estilo | Leonardo Brasil" 
        description="Manual oficial de identidade visual, diretrizes de marca e tom de voz da marca Leonardo Brasil."
        canonicalUrl="https://leobrasil.com.br/brandbook"
      />

      {/* MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-line bg-ink/95 px-5 backdrop-blur-md lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <LogoIcon size={28} />
          <span className="font-extrabold tracking-tight">Brandbook</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-md p-2 text-muted hover:bg-panel hover:text-text"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-line bg-ink/90 backdrop-blur-xl transition-transform lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="hidden h-24 items-center gap-3 px-8 lg:flex">
            <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-lg">
              <LogoIcon size={32} />
              Leonardo Brasil
            </Link>
          </div>
          
          <div className="mt-20 flex-1 px-5 lg:mt-0 lg:px-6">
            <p className="mb-4 px-2 text-xs font-bold uppercase tracking-wider text-muted">Índice</p>
            <nav className="flex flex-col gap-1.5">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${activeSection === section.id ? "bg-accent/15 text-accent-400" : "text-muted hover:bg-panel hover:text-text"}`}
                >
                  {section.label}
                  {activeSection === section.id && <ChevronRight size={16} />}
                </button>
              ))}
            </nav>
          </div>

           <div className="border-t border-line p-5 lg:p-6 space-y-2">
             <Link to="/calculadora" className="flex items-center justify-center gap-2 w-full rounded-md bg-panel px-4 py-2.5 text-sm font-bold text-accent-400 hover:bg-line transition-colors">
                Calculadora Comercial
             </Link>
             <Link to="/cidades" className="flex items-center justify-center gap-2 w-full rounded-md bg-panel px-4 py-2.5 text-sm font-bold text-muted hover:text-text hover:bg-line transition-colors">
                Regiões Atendidas
             </Link>
             <Link to="/" className="flex items-center justify-center gap-2 w-full rounded-md bg-panel px-4 py-2.5 text-sm font-bold hover:bg-line transition-colors">
                Voltar ao site
             </Link>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 px-5 pb-24 pt-24 lg:pl-72 lg:pr-12 lg:pt-20">
        <div className="mx-auto max-w-4xl space-y-32">
          
          {/* HERO */}
          <header>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent-400 mb-6 tracking-wide uppercase">
              Brandbook Oficial
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-balance mb-6">
              Identidade Visual<br/>& Tom de Voz
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-2xl">
              Este manual documenta as diretrizes da marca Leonardo Brasil. Utilize estas referências para garantir consistência visual e verbal em todos os pontos de contato: site, anúncios, blog e redes sociais.
            </p>
          </header>

          {/* VISÃO GERAL */}
          <section id="visao-geral" className="scroll-mt-24 space-y-8">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">Visão Geral</h2>
              <p className="text-muted">Nosso posicionamento e a promessa principal.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-panel p-8">
                <h3 className="text-lg font-bold text-accent-400 mb-3">Nosso Propósito</h3>
                <p className="text-sm leading-relaxed text-muted">
                  Estruturar o processo comercial de <strong className="text-text">profissionais liberais e clínicos</strong> para gerar previsibilidade em vendas. Não vendemos "gestão de redes sociais"; vendemos infraestrutura e funis que transformam curiosos em clientes pagantes.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-panel p-8">
                <h3 className="text-lg font-bold text-accent-400 mb-3">Estética Premium</h3>
                <p className="text-sm leading-relaxed text-muted">
                  O visual reflete sofisticação técnica: fundos escuros (Dark Mode nativo), uso inteligente de espaços negativos, contrastes em azul elétrico e tipografia grotesca sem serifa (Sans) que passa a percepção de um parceiro tecnológico e estruturado.
                </p>
              </div>
            </div>
          </section>

          {/* SOBRE O NEGÓCIO */}
          <section id="sobre-negocio" className="scroll-mt-24 space-y-8">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">Sobre o Negócio</h2>
              <p className="text-muted">A estrutura comercial que sustenta a marca Leonardo Brasil.</p>
            </div>

            <div className="rounded-3xl border border-line bg-panel p-8 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5">
                  <h3 className="text-2xl font-black tracking-tight text-text">Funil Comercial como método proprietário</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Leonardo Brasil é um consultor especializado em montar estruturas de vendas completas para negócios locais, cobrindo desde a presença no Google até o fechamento de vendas pelo WhatsApp.
                  </p>
                  <p className="text-sm leading-relaxed text-muted">
                    O método, chamado <strong className="text-text">Funil Comercial</strong>, liga todas as camadas do processo comercial: presença, aquisição, conversão e escala, numa engrenagem integrada e funcional.
                  </p>
                  <p className="text-sm leading-relaxed text-muted">
                    Ao contrário de agências tradicionais, Leonardo constrói e usa a própria estrutura que entrega, incluindo um <strong className="text-text">CRM desenvolvido por ele mesmo</strong>.
                  </p>
                </div>

                <div className="rounded-2xl border border-accent/20 bg-accent/10 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-400">Vantagem Competitiva</span>
                  <p className="mt-4 text-sm leading-relaxed text-text">
                    Leonardo Brasil não entrega dicas isoladas nem publicações nas redes sociais: monta a engrenagem comercial completa do negócio, usando o mesmo método e CRM que ele próprio utiliza, com acompanhamento direto e personalizado até o funil funcionar de verdade.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-text">Principais Recursos</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {businessResources.map((resource) => (
                  <div key={resource.title} className="rounded-2xl border border-line bg-ink p-6">
                    <h4 className="mb-2 text-sm font-bold text-accent-400">{resource.title}</h4>
                    <p className="text-sm leading-relaxed text-muted">{resource.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-text">Clientes-Alvo</h3>
              <div className="grid gap-3">
                {targetClients.map((client) => (
                  <div key={client} className="flex items-start gap-3 rounded-2xl border border-line bg-panel p-5">
                    <Check size={18} className="mt-0.5 shrink-0 text-accent-400" />
                    <p className="text-sm leading-relaxed text-muted">{client}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SISTEMA DE LOGO */}
          <section id="logo" className="scroll-mt-24 space-y-8">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">Sistema de Logo</h2>
              <p className="text-muted">O ícone oficial da plataforma.</p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-line bg-panel p-12 flex flex-col items-center justify-center relative">
                <div className="flex items-center gap-3">
                  <LogoIcon size={48} />
                  <span className="text-3xl font-extrabold tracking-tight">Leonardo Brasil</span>
                </div>
                <div className="absolute bottom-4 left-6 text-xs text-muted font-bold tracking-wider uppercase">Variação Completa</div>
              </div>
              <div className="rounded-3xl border border-line bg-ink p-12 flex flex-col items-center justify-center relative">
                <LogoIcon size={80} />
                <div className="absolute bottom-4 left-6 text-xs text-muted font-bold tracking-wider uppercase">Símbolo Isolado</div>
              </div>
            </div>
          </section>

          {/* PALETA DE CORES */}
          <section id="cores" className="scroll-mt-24 space-y-8">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">Paleta de Cores</h2>
              <p className="text-muted">As variáveis tailwind oficiais que ditam o contraste do projeto.</p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <ColorSwatch 
                name="Accent Blue"
                description="O botão CTA, links e destaques (accent-500)."
                hex="#3b82f6"
                colorClass="bg-blue-500"
              />
              <ColorSwatch 
                name="Deep Ink"
                description="O fundo escuro principal de todo o site (ink)."
                hex="#0a0a0a"
                colorClass="bg-[#0a0a0a]"
              />
              <ColorSwatch 
                name="Surface Panel"
                description="Elevado, cards e modais (panel)."
                hex="#171717"
                colorClass="bg-[#171717]"
              />
              <ColorSwatch 
                name="Line Border"
                description="Divisões e contornos sutis (line)."
                hex="#262626"
                colorClass="bg-[#262626]"
              />
              <ColorSwatch 
                name="Text Primary"
                description="Tipografia de leitura clara (text)."
                hex="#fafafa"
                colorClass="bg-[#fafafa]"
              />
              <ColorSwatch 
                name="Muted Gray"
                description="Apoios, parágrafos secundários (muted)."
                hex="#a1a1aa"
                colorClass="bg-[#a1a1aa]"
              />
            </div>
          </section>

          {/* TIPOGRAFIA */}
          <section id="tipografia" className="scroll-mt-24 space-y-8">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">Tipografia</h2>
              <p className="text-muted">A família San-Serif para comunicação digital.</p>
            </div>
            
            <div className="space-y-12 rounded-3xl border border-line bg-panel p-8 sm:p-12">
              <div>
                <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
                  <span className="text-sm font-bold uppercase tracking-widest text-accent-400">Headlines (System Sans / Inter)</span>
                  <span className="text-xs text-muted">Pesos: Bold (700), Black (900)</span>
                </div>
                <div className="space-y-5">
                  <div className="text-5xl font-black tracking-tight">O fim do boca-a-boca.</div>
                  <div className="text-3xl font-bold tracking-tight">Venda previsível todo mês.</div>
                </div>
              </div>
              
              <div>
                <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
                  <span className="text-sm font-bold uppercase tracking-widest text-accent-400">Corpo de Texto</span>
                  <span className="text-xs text-muted">Pesos: Regular (400), Medium (500)</span>
                </div>
                <div className="space-y-4 max-w-2xl">
                  <p className="text-base leading-relaxed text-text">
                    Esta é a estrutura oficial para leitura de textos longos, artigos de blog e copys de persuasão. O espaçamento deve ser amplo para garantir o conforto ocular no fundo escuro.
                  </p>
                  <p className="text-sm leading-relaxed text-muted">
                    Textos de apoio (Small), metadados de blog ou hints de formulários devem usar a cor Muted com tamanho de fonte reduzido, mantendo a hierarquia visual.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TOM DE VOZ */}
          <section id="tom-de-voz" className="scroll-mt-24 space-y-8">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">Tom de Voz</h2>
              <p className="text-muted">Como a marca Leonardo Brasil escreve e se comunica.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-panel p-8">
                <h3 className="text-lg font-bold text-text mb-4">✅ O que nós somos</h3>
                <ul className="space-y-3 text-sm text-muted">
                  <li className="flex items-start gap-3"><Check size={18} className="text-accent-400 shrink-0" /><strong>Consultivos:</strong> Explicamos o "porquê" antes do "como".</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-accent-400 shrink-0" /><strong>Pragmáticos:</strong> Focamos em processos, não em motivação barata.</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-accent-400 shrink-0" /><strong>Especialistas:</strong> Otimizamos resultados; não ficamos no achismo.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-panel p-8">
                <h3 className="text-lg font-bold text-text mb-4">❌ O que NÃO somos</h3>
                <ul className="space-y-3 text-sm text-muted">
                  <li className="flex items-start gap-3"><X size={18} className="text-red-400 shrink-0" /><strong>Gurus de Marketing:</strong> Sem promessas falsas de ficar rico rápido.</li>
                  <li className="flex items-start gap-3"><X size={18} className="text-red-400 shrink-0" /><strong>Agência de Likes:</strong> Não vendemos vaidade, vendemos estrutura de conversão.</li>
                  <li className="flex items-start gap-3"><X size={18} className="text-red-400 shrink-0" /><strong>Informais demais:</strong> Somos polidos, evitamos gírias de internet e excesso de emojis.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ICP & REGIÕES */}
          <section id="icp-regioes" className="scroll-mt-24 space-y-8">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">ICP & Estratégia de Regiões</h2>
              <p className="text-muted">O Perfil de Cliente Ideal.</p>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-panel p-8">
                  <div className="mb-4 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent-400">
                    <Target size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">O Cliente Ideal</h3>
                  <p className="text-sm leading-relaxed text-muted mb-4">
                    Negócios que atendem e recebem leads pelo WhatsApp, mas que sofrem com a dependência de indicações e desorganização no follow-up comercial.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {['Nutricionistas', 'Psicólogas', 'Dentistas', 'Fisioterapeutas', 'Terapeutas', 'Massoterapeutas', 'Profissionais Liberais', 'Prestadores de Serviço', 'Autônomos', 'Comércio Local'].map((badge) => (
                      <span key={badge} className="px-3 py-1.5 rounded-lg border border-line bg-ink text-xs font-semibold text-text">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-2xl border border-line bg-panel p-8">
                  <div className="mb-4 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent-400">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">Alvos Geográficos</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Para o tráfego orgânico programático (Multi-City SEO), o sistema prioriza o **Eixo Sul-Sudeste**, alvejando as 25 cidades chave onde o ticket médio das consultas particulares é mais alto e as operações são mais maduras.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-ink p-8">
                <div className="mb-4 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent-400">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-bold text-text mb-4">A grande Dor do nosso ICP</h3>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-bold text-text text-sm">Leads vazando</h4>
                    <p className="text-xs text-muted leading-relaxed">Pessoas curiosas que não são convertidas em pacientes pagantes por falta de scripts no WhatsApp.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-text text-sm">Preço vs Valor</h4>
                    <p className="text-xs text-muted leading-relaxed">O cliente briga por preço porque o site do profissional não transmite autoridade para uma consulta High-Ticket.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-text text-sm">Prisão da Agenda</h4>
                    <p className="text-xs text-muted leading-relaxed">Falta de previsibilidade do faturamento; o cliente não sabe quantos pacientes fecharão no mês seguinte.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
