import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Vi seu conteúdo sobre como vender mais no Google e quero estruturar o funil de vendas para o WhatsApp da minha empresa.")}`;

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

const Check = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

const GARGALOS_VENDAS = [
  {
    titulo: "Visualização sem Ação Imediata",
    desc: "O cliente acha seu perfil no Google, mas não encontra um botão claro ou link direto de WhatsApp para tirar dúvidas. Ele fecha e clica no próximo concorrente."
  },
  {
    titulo: "Falta de Catálogo e Diferenciais",
    desc: "Se o seu perfil não lista com clareza quais procedimentos ou serviços você presta, o consumidor assume que você não atende àquela demanda específica."
  },
  {
    titulo: "Atendimento Comercial Lento",
    desc: "Demorar mais de 10 minutos para responder a uma mensagem que veio do Google reduz a taxa de fechamento em até 80%. O cliente quer agendar agora."
  },
  {
    titulo: "Ausência de Avaliações Recentes",
    desc: "Ter 5 estrelas em avaliações de 2 anos atrás não gera segurança. O consumidor atual busca depoimentos postados nos últimos 30 a 60 dias."
  }
];

const ETAPAS_FUNIL = [
  {
    fase: "Topo de Funil",
    nome: "Descoberta Ativa",
    acao: "O cliente pesquisa uma dor ou necessidade no Google (ex: 'onde fazer implante dentário', 'advogado trabalhista urgente')."
  },
  {
    fase: "Meio de Funil",
    nome: "Decisão & Prova Social",
    acao: "Ele vê sua nota 4.9+, fotos do ambiente e depoimentos reais. A barreira da desconfiança é quebrada em segundos."
  },
  {
    fase: "Fundo de Funil",
    nome: "Conversão Direta",
    acao: "Ele clica no botão de WhatsApp do seu perfil com mensagem automática pré-preenchida, caindo na sua recepção pronto para fechar."
  }
];

const FAQ = [
  {
    q: "O que é mais importante: muitas visualizações ou alta conversão?",
    a: "Alta conversão. Ter 10.000 visualizações e 2 ligações é prejuízo de tempo. Ter 500 visualizações com 40 chamados no WhatsApp transforma o faturamento de qualquer negócio local. O segredo é ter um perfil desenhado para converter."
  },
  {
    q: "Como configurar o botão de WhatsApp no Google Meu Negócio?",
    a: "O Google permite adicionar links de agendamento e chat. O ideal é usar um link parametrizado com mensagem personalizada, permitindo à sua recepção saber exatamente qual serviço o cliente tem interesse logo na primeira mensagem."
  },
  {
    q: "Quanto uma empresa pode aumentar suas vendas com o Google otimizado?",
    a: "Empresas com perfis reestruturados e que seguem um protocolo ágil de atendimento no WhatsApp costumam dobrar ou triplicar o volume de orçamentos e agendamentos nas primeiras 4 a 6 semanas."
  },
  {
    q: "Como o Leonardo Brasil ajuda a estruturar esse funil de vendas?",
    a: "Eu não apenas coloco sua empresa no mapa: eu reescrevo a copy do seu perfil, organizo seu catálogo visual, treino sua equipe de recepção com scripts de WhatsApp de alta conversão e garanto que nenhuma oportunidade seja perdida."
  }
];

export default function ComoVenderMaisNoGoogle() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/como-vender-mais-no-google#article",
        headline: "Como Vender Mais no Google: O Funil Local de Alta Conversão no WhatsApp",
        description: "Aprenda como transformar pesquisas do Google em vendas e agendamentos reais no seu WhatsApp. Elimine gargalos e aumente seu faturamento.",
        author: {
          "@type": "Person",
          name: "Leonardo Brasil",
          jobTitle: "Especialista em Google Meu Negócio e Estrutura de Vendas",
          url: "https://leonardobrasil.com.br"
        },
        publisher: {
          "@type": "Organization",
          name: "Leonardo Brasil",
          url: "https://leonardobrasil.com.br"
        },
        mainEntityOfPage: "https://leonardobrasil.com.br/como-vender-mais-no-google",
        datePublished: "2026-02-05T08:00:00-03:00",
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
        title="Como Vender Mais no Google: Funil Local para WhatsApp | Leonardo Brasil"
        description="Descubra como transformar pesquisas do Google em clientes pagantes no seu WhatsApp. Estratégia de funil de vendas para profissionais e empresas locais."
        canonicalUrl="https://leonardobrasil.com.br/como-vender-mais-no-google"
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
              Estrutura de Vendas
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Auditoria de Conversão no WhatsApp
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
            <span>Conversão Direta • Do Google para o Caixa</span>
            <span className="text-white/40">•</span>
            <span>Funil de WhatsApp</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Como Vender Mais no Google <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              Transformando Cliques em Contratos
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Visualizações não pagam contas. Entenda como construir um funil de vendas sem atritos que conecta quem pesquisa no Google diretamente à sua equipe comercial no WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-lg shadow-accent/25"
            >
              <WhatsApp className="w-4 h-4" />
              Estruturar Meu Funil de WhatsApp
            </a>
            <a
              href="#funil"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Ver as Etapas do Funil
              <Arrow className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* O FUNIL DE VENDAS LOCAL */}
      <section id="funil" className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              A Jornada do Cliente: Do Google ao Fechamento
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Veja como acontece a transição perfeita de um usuário frio para um cliente pagante:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {ETAPAS_FUNIL.map((e, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-ink-card border border-line hover:border-accent/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                    {e.fase}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{e.nome}</h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{e.acao}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-xs text-text-muted">
                  <span>Passo {idx + 1} de 3</span>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARGALOS QUE FAZEM PERDER VENDAS */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Os 4 Gargalos que Fazem Sua Empresa Perder Vendas
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Se você tem impressões mas o telefone não toca, o problema quase sempre está em um destes pontos:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {GARGALOS_VENDAS.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-ink-card border border-line">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                    !
                  </span>
                  <h3 className="text-base font-bold text-white">{item.titulo}</h3>
                </div>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{item.desc}</p>
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
              Como destravar os resultados financeiros do seu negócio.
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
            Vamos transformar o Google na sua maior máquina de vendas?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            Pare de depender da sorte ou de indicações esporádicas. Construa um funil comercial profissional e previsível.
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
