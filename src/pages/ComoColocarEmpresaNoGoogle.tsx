import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Vi seu guia de como colocar minha empresa no Google e quero auditar o perfil da minha empresa.")}`;

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

const PASSOS = [
  {
    passo: "01",
    titulo: "Acesse a Ferramenta Oficial",
    desc: "Acesse google.com/business ou busque por 'Google Perfil de Empresa'. Utilize um e-mail Google (Gmail ou Google Workspace) institucional que você não vá perder o acesso."
  },
  {
    passo: "02",
    titulo: "Defina o Nome Oficial Exato (Sem Spam)",
    desc: "Insira exatamente o nome fantasia registrado da sua empresa. Evite adicionar palavras-chave extras como 'Clínica Silva - O Melhor Dentista', pois isso gera suspensão cadastral imediata."
  },
  {
    passo: "03",
    titulo: "Escolha a Categoria Primária Correta",
    desc: "A categoria principal é o fator número 1 de ranqueamento no algoritmo. Escolha o nicho que melhor representa seu serviço principal (ex: 'Clínica Médica', 'Escritório de Advocacia')."
  },
  {
    passo: "04",
    titulo: "Configure o Endereço ou Área de Atendimento",
    desc: "Se você recebe clientes fisicamente, insira o endereço completo. Se atende a domicílio ou online, selecione 'Empresa de Área de Atendimento' para ocultar a residência e atender com segurança."
  },
  {
    passo: "05",
    titulo: "Verificação da Empresa (Vídeo ou Telefone)",
    desc: "O Google solicitará a validação por gravação de vídeo contínuo da fachada, placa, maquinário ou SMS/ligação. Tenha comprovante de endereço e documentos do CNPJ em mãos."
  },
  {
    passo: "06",
    titulo: "Preenchimento do Catálogo & Conexão WhatsApp",
    desc: "Complete os 750 caracteres da descrição com SEO geolocalizado, adicione horários de funcionamento, produtos, serviços e o link direto para seu WhatsApp comercial."
  }
];

const ERROS_COMUNS = [
  {
    titulo: "Cadastrar e abandonar o perfil",
    explicacao: "Um perfil sem atualizações semanais, fotos novas e respostas a avaliações perde relevância e cai para a 4ª página em menos de 60 dias."
  },
  {
    titulo: "Inconsistência de dados (NAP)",
    explicacao: "Se o seu endereço ou telefone no Google estiver diferente do site, Facebook, Instagram ou Receita Federal, o Google diminui a nota de confiança da sua empresa."
  },
  {
    titulo: "Ignorar as avaliações dos clientes",
    explicacao: "Perfis com menos de 10 avaliações ou sem respostas personalizadas do proprietário convertem 70% menos cliques do que concorrentes bem avaliados."
  },
  {
    titulo: "Escolher a categoria errada",
    explicacao: "Errar a categoria primária impede que o algoritmo mostre o seu negócio para pesquisas de compra de alto valor na sua região."
  }
];

const FAQ = [
  {
    q: "É gratuito colocar minha empresa no Google?",
    a: "Sim, 100% gratuito. O Google não cobra nada para criar, verificar ou manter o Perfil da Empresa (antigo Google Meu Negócio). Cuidado com agências ou terceiros que ligam fingindo ser do Google cobrando taxas de anuidade."
  },
  {
    q: "Quanto tempo demora para a minha empresa aparecer no Google Maps?",
    a: "Após a verificação aprovada pelo Google, a empresa costuma ser indexada publicamente entre 24 e 72 horas. Porém, aparecer no topo da primeira página para buscas concorridas exige otimização técnica contínua."
  },
  {
    q: "Posso colocar minha empresa no Google sem ter um ponto comercial?",
    a: "Sim! Prestadores de serviço que atendem a domicílio, advogados e consultores podem configurar o perfil como 'Área de Atendimento'. Seu endereço residencial fica oculto e você seleciona os bairros e cidades onde atua."
  },
  {
    q: "Por que minha empresa não aparece mesmo depois de cadastrada?",
    a: "Geralmente ocorre por três motivos: verificação ainda pendente pelo Google, categoria principal inadequada ou falta de relevância e autoridade em relação aos concorrentes mais antigos e bem avaliados."
  },
  {
    q: "Qual a diferença entre cadastrar sozinho e contratar uma consultoria especializada?",
    a: "Cadastrar sozinho garante apenas que seu pino exista. A consultoria especializada aplica SEO Local avançado, consistência de dados externos, blindagem contra suspensões e estrutura o funil para transformar visualizações em mensagens no WhatsApp."
  }
];

export default function ComoColocarEmpresaNoGoogle() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/como-colocar-minha-empresa-no-google#article",
        headline: "Como Colocar Minha Empresa no Google: Passo a Passo Definitivo e Gratuito",
        description: "Aprenda como cadastrar sua empresa no Google e Google Maps gratuitamente em 2026. Guia prático com requisitos, verificação e dicas para atrair clientes locais.",
        author: {
          "@type": "Person",
          name: "Leonardo Brasil",
          jobTitle: "Especialista em Google Meu Negócio e SEO Local",
          url: "https://leonardobrasil.com.br"
        },
        publisher: {
          "@type": "Organization",
          name: "Leonardo Brasil",
          url: "https://leonardobrasil.com.br"
        },
        mainEntityOfPage: "https://leonardobrasil.com.br/como-colocar-minha-empresa-no-google",
        datePublished: "2026-01-15T08:00:00-03:00",
        dateModified: "2026-11-09T09:00:00-03:00"
      },
      {
        "@type": "HowTo",
        name: "Como cadastrar e colocar sua empresa no Google Meu Negócio",
        description: "Passo a passo oficial e seguro para cadastrar sua empresa no Perfil da Empresa no Google e aparecer no Google Maps.",
        step: PASSOS.map((p, idx) => ({
          "@type": "HowToStep",
          position: idx + 1,
          name: p.titulo,
          text: p.desc
        }))
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-ink text-text selection:bg-accent selection:text-white">
      <SeoHead
        title="Como Colocar Minha Empresa no Google: Passo a Passo Gratuito | Leonardo Brasil"
        description="Descubra como colocar sua empresa no Google e no Google Maps gratuitamente. Passo a passo oficial, verificação sem erros e otimização para atrair clientes."
        canonicalUrl="https://leonardobrasil.com.br/como-colocar-minha-empresa-no-google"
        schema={schema}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-semibold text-lg text-white group-hover:text-accent transition-colors">
              Leonardo Brasil
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium">
              Guia Prático
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Auditoria Gratuita no WhatsApp
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
            <span>Google Meu Negócio • Perfil da Empresa</span>
            <span className="text-white/40">•</span>
            <span>Atualizado 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Como Colocar Minha Empresa no Google <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              e Atrair Clientes de Graça
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Aprenda o passo a passo oficial para cadastrar seu negócio no Google e no Google Maps. 
            Sem custos, sem taxas abusivas e com a estrutura certa para o seu telefone tocar todos os dias.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-lg shadow-accent/25"
            >
              <WhatsApp className="w-4 h-4" />
              Solicitar Auditoria do Meu Perfil
            </a>
            <a
              href="#passo-a-passo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Ver Passo a Passo
              <Arrow className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-accent font-bold text-lg mb-0.5">100% Grátis</div>
              <div className="text-xs text-text-muted">Ferramenta nativa oficial do Google</div>
            </div>
            <div className="p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-accent font-bold text-lg mb-0.5">Maps & Pesquisa</div>
              <div className="text-xs text-text-muted">Apareça para quem busca perto de você</div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-emerald-400 font-bold text-lg mb-0.5">Leads Diretos</div>
              <div className="text-xs text-text-muted">Ligações e rotas direto no WhatsApp</div>
            </div>
          </div>
        </div>
      </section>

      {/* PASSO A PASSO OFICIAL */}
      <section id="passo-a-passo" className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Passo a Passo: Como Cadastrar Sua Empresa no Google
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Siga cada uma dessas etapas com atenção para evitar bloqueios ou reprovação na verificação por vídeo.
            </p>
          </div>

          <div className="space-y-4">
            {PASSOS.map((p) => (
              <div
                key={p.passo}
                className="p-6 rounded-2xl bg-ink-card border border-line hover:border-accent/30 transition-all flex flex-col sm:flex-row items-start gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-lg">
                  {p.passo}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.titulo}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-accent/15 via-ink-card to-accent/10 border border-accent/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Travou na verificação ou quer fazer tudo certo?</h3>
              <p className="text-sm text-text-muted">
                Eu avalio o cadastro do seu negócio e mostro exatamente o que precisa ser ajustado.
              </p>
            </div>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-accent hover:bg-accent-light transition-all flex-shrink-0 shadow-md"
            >
              <WhatsApp className="w-4 h-4" />
              Falar com o Leonardo no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ERROS QUE FAZEM PERDER CLIENTES */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Por que 83% dos negócios cadastrados continuam invisíveis?
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Colocar o pino no Google é apenas a primeira etapa. Estes são os erros clássicos que impedem uma empresa de receber ligações:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ERROS_COMUNS.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-ink-card border border-line">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">
                    ✕
                  </span>
                  <h3 className="text-base font-bold text-white">{item.titulo}</h3>
                </div>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {item.explicacao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-b border-line">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Perguntas Frequentes
            </h2>
            <p className="text-sm text-text-muted">
              Dúvidas comuns sobre como cadastrar e manter sua empresa no Google.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-line bg-ink-card overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 text-white font-semibold text-sm sm:text-base hover:text-accent transition-colors"
                >
                  <span>{f.q}</span>
                  <Chevron
                    className={`w-5 h-5 text-accent transition-transform duration-200 flex-shrink-0 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-text-muted border-t border-line/60 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-t from-accent/15 via-ink to-ink text-center">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Quer colocar sua empresa no Google do jeito certo?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            Não perca tempo com tentativas e erros que podem suspender seu perfil. Fale diretamente comigo e receba uma análise personalizada da sua empresa.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-xl shadow-accent/30"
          >
            <WhatsApp className="w-5 h-5" />
            Falar com Leonardo Brasil no WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
