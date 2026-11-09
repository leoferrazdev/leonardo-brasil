import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Quero entender a melhor estratégia para divulgar minha empresa no Google e atrair mais clientes na minha cidade.")}`;

const WhatsApp = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.04-.95.23-3.2-.67-2.7-1.07-4.42-3.83-4.55-4.01-.13-.18-1.1-1.46-1.1-2.78 0-1.32.69-1.97.94-2.24.24-.27.53-.33.7-.33.18 0 .35 0 .5.01.16.01.38-.06.6.46.24.55.8 1.9.87 2.04.07.13.12.29.02.47-.09.18-.14.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.16.27.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.42.11.58-.07.16-.18.67-.78.85-1.05.18-.27.35-.22.6-.13.24.09 1.55.73 1.82.86.27.13.44.2.5.31.07.11.07.63-.17 1.32Z" />
  </svg>
);

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const Chevron = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

const PILARES_DIVULGACAO = [
  {
    sigla: "P",
    nome: "Presença",
    titulo: "Perfil da Empresa Otimizado & Verificado",
    desc: "A base de tudo. Sem um perfil impecável, validado pelo Google e livre de pendências, qualquer tentativa de divulgação vira desperdício de tempo e dinheiro."
  },
  {
    sigla: "A",
    nome: "Aquisição",
    titulo: "SEO Local Orgânico & Google Maps",
    desc: "Posicionamento para os termos que seus clientes de fato digitam quando precisam do seu serviço agora (ex: 'onde encontrar', 'perto de mim', 'especialista em')."
  },
  {
    sigla: "C",
    nome: "Conversão",
    titulo: "Estrutura Direta para WhatsApp",
    desc: "Transformar visualizações em conversas reais. Catálogo visual de serviços, fotos reais do local e botão de contato com mensagem parametrizada."
  },
  {
    sigla: "E",
    nome: "Escala",
    titulo: "Reputação Contínua & Blindagem",
    desc: "Rotina automatizada de coleta de avaliações 5 estrelas e proteção do cadastro contra atualizações concorrentes ou bloqueios do Google."
  }
];

const CANAIS_GOOGLE = [
  {
    canal: "Google Perfil de Empresa (Google Maps)",
    custo: "Gratuito (Custo R$ 0 por clique)",
    quandoUsar: "Essencial para qualquer negócio físico ou prestador de serviços local. É onde os clientes mais confiam.",
    destaque: true
  },
  {
    canal: "Google Ads (Pesquisa Patrocinada)",
    custo: "Pago por clique (R$ 2 a R$ 35/clique)",
    quandoUsar: "Excelente para validações rápidas ou nichos hipercompetitivos com orçamento agressivo.",
    destaque: false
  },
  {
    canal: "Site Otimizado / SEO Orgânico",
    custo: "Investimento único de construção",
    quandoUsar: "Complementa o mapa com artigos explicativos, páginas por bairro e autoridade de domínio.",
    destaque: false
  }
];

const FAQ = [
  {
    q: "Qual a melhor forma de divulgar minha empresa no Google sem gastar em anúncios?",
    a: "A melhor e mais lucrativa forma é a otimização completa do Perfil da Empresa no Google (antigo Google Meu Negócio). Ele permite que sua empresa apareça no Google Maps e na busca local no momento exato em que pessoas da sua região buscam pelo seu serviço, sem cobrar nenhum valor por clique."
  },
  {
    q: "Vale a pena pagar anúncios no Google Ads para negócios locais?",
    a: "O Google Ads é uma excelente ferramenta aceleradora, mas se o seu Perfil da Empresa no Maps estiver desatualizado ou com poucas avaliações, você jogará dinheiro fora. O cliente quase sempre confere a nota da sua empresa no Maps antes de ligar."
  },
  {
    q: "O que preciso ter para começar a divulgar no Google?",
    a: "Basta ter um negócio ativo (com ou sem ponto físico comercial), um número de telefone com WhatsApp para atendimento e fotos reais do seu serviço, equipe ou ambiente de atendimento."
  },
  {
    q: "Como o método do Leonardo Brasil difere de uma agência tradicional?",
    a: "Agências costumam cobrar mensalidades caras apenas para rodar anúncios que acabam quando você para de pagar. O meu trabalho foca em construir um ativo orgânico permanente: otimizar seu Google Maps e estruturar seu funil de WhatsApp para você ser dono do seu próprio tráfego."
  }
];

export default function ComoDivulgarEmpresaNoGoogle() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/como-divulgar-minha-empresa-no-google#article",
        headline: "Como Divulgar Minha Empresa no Google e Atrair Clientes Locais",
        description: "Descubra como divulgar sua empresa no Google de forma orgânica e profissional. O método dos 4 Pilares para transformar buscas locais em vendas no WhatsApp.",
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
        mainEntityOfPage: "https://leonardobrasil.com.br/como-divulgar-minha-empresa-no-google",
        datePublished: "2026-01-25T08:00:00-03:00",
        dateModified: "2026-11-09T09:00:00-03:00"
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
        title="Como Divulgar Minha Empresa no Google: Guia Completo | Leonardo Brasil"
        description="Aprenda como divulgar sua empresa no Google e atrair clientes locais todos os dias. Estratégias gratuitas e profissionais para negócios locais e autônomos."
        canonicalUrl="https://leonardobrasil.com.br/como-divulgar-minha-empresa-no-google"
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
              Estratégia de Aquisição
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Sessão Estratégica no WhatsApp
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
            <span>Aquisição de Clientes Locais</span>
            <span className="text-white/40">•</span>
            <span>Do Google para o WhatsApp</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Como Divulgar Minha Empresa no Google <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              e Lotar a Minha Agenda
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Descubra como colocar sua empresa na frente de clientes que estão procurando seus serviços exatamente agora na sua cidade, sem depender de anúncios caros ou posts diários no Instagram.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-lg shadow-accent/25"
            >
              <WhatsApp className="w-4 h-4" />
              Quero Atrair Mais Clientes no Google
            </a>
            <a
              href="#pilares"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Conhecer o Método 4 Pilares
              <Arrow className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* OS 4 PILARES */}
      <section id="pilares" className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              O Método dos 4 Pilares de Divulgação Local
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Uma estratégia sólida de captação que constrói um fluxo contínuo e previsível de clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILARES_DIVULGACAO.map((pilar) => (
              <div
                key={pilar.sigla}
                className="p-6 rounded-2xl bg-ink-card border border-line hover:border-accent/30 transition-all relative overflow-hidden"
              >
                <div className="text-5xl font-black text-accent/10 absolute top-4 right-4 select-none">
                  {pilar.sigla}
                </div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-bold mb-3">
                  Pilar {pilar.nome}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{pilar.titulo}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{pilar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONDE DIVULGAR NO GOOGLE */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Onde Divulgar Sua Empresa Dentro do Google?
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Nem todo canal do Google é igual. Veja a comparação prática de retorno sobre o investimento:
            </p>
          </div>

          <div className="space-y-4">
            {CANAIS_GOOGLE.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all ${
                  item.destaque
                    ? "bg-gradient-to-r from-accent/15 via-ink-card to-ink-card border-accent/40 shadow-lg shadow-accent/10"
                    : "bg-ink-card border-line"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{item.canal}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    item.destaque ? "bg-emerald-500/20 text-emerald-400" : "bg-ink border border-line text-text-muted"
                  }`}>
                    {item.custo}
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{item.quandoUsar}</p>
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
              Tudo o que você precisa saber para começar a divulgar com segurança.
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
            Pronto para transformar o Google na sua maior fonte de clientes?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            Pare de postar sem rumo e comece a ser encontrado por quem já tem a intenção de contratar você hoje.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-xl shadow-accent/30"
          >
            <WhatsApp className="w-5 h-5" />
            Falar Diretamente com Leonardo Brasil
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
