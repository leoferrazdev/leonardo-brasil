import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Vi seu guia de Primeiro Lugar no Google em 2027 e quero planejar o posicionamento da minha empresa para o próximo ano.")}`;

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

const PILARES_2027 = [
  {
    num: "01",
    titulo: "GEO (Generative Engine Optimization)",
    desc: "O algoritmo agora sintetiza respostas com IA (Google AI Overviews e Gemini). Estar em 1º lugar significa ser a entidade citada e recomendada pelas inteligências artificiais com dados ricos, consistentes e estruturados."
  },
  {
    num: "02",
    titulo: "Domínio Absoluto do Pacote Local 3-Pack",
    desc: "Em dispositivos móveis, os resultados orgânicos tradicionais foram empurrados para baixo. O verdadeiro 1º lugar é estar entre as 3 empresas em destaque no mapa, onde se concentram mais de 75% dos cliques de compra."
  },
  {
    num: "03",
    titulo: "Validação Semântica de Avaliações Reais (E-E-A-T)",
    desc: "O Google penaliza avaliações genéricas ou suspeitas. Em 2027, o fator decisivo é o fluxo contínuo de avaliações com fotos tiradas no local, menção explícita aos procedimentos e respostas profissionais do proprietário com palavras-chave."
  },
  {
    num: "04",
    titulo: "Blindagem Cadastral e Consistência NAP 360°",
    desc: "Discrepâncias de Nome, Endereço e Telefone (NAP) em diretórios, cartões CNPJ e redes sociais geram rebaixamento automático. Perfis blindados têm prioridade algorítmica inabalável."
  }
];

const COMPARATIVO_EVOLUCAO = [
  {
    criterio: "O que significa 'Primeiro Lugar'",
    passado: "Primeiro link azul de texto no topo da pesquisa tradicional",
    cenario2027: "Destaque no Top 3 do Google Maps + Citação direta nos resumos de IA (GEO)"
  },
  {
    criterio: "Critério de Relevância",
    passado: "Repetição exata de palavras-chave na página (Keyword Stuffing)",
    cenario2027: "Compreensão semântica da entidade, proximidade geográfica e contexto do usuário"
  },
  {
    criterio: "Papel das Avaliações",
    passado: "Apenas ter uma nota média alta (ex: 5.0) com poucos comentários",
    cenario2027: "Volume, frequência recente, fotos dos clientes e termos de serviço nos depoimentos"
  },
  {
    criterio: "Velocidade de Conversão",
    passado: "Usuário visitava o site institucional e preenchia formulário lento",
    cenario2027: "Clique instantâneo em 'Ligar' ou 'WhatsApp' com mensagem pré-configurada"
  }
];

const PASSOS_ESTRATEGICOS = [
  {
    passo: "1",
    titulo: "Auditoria Completa de Entidade e Blindagem",
    desc: "Verificação minuciosa de todas as diretrizes de conformidade do Google para eliminar inconsistências, evitar suspensões preventivas e proteger sua ficha contra edições de concorrentes."
  },
  {
    passo: "2",
    titulo: "Reengenharia de Categorias Primárias e Secundárias",
    desc: "Mapeamento das categorias exatas que ativam os leilões de busca de alto tíquete e intenção de compra imediata na sua região de atendimento."
  },
  {
    passo: "3",
    titulo: "Copywriting Geolocalizado para Motores de IA",
    desc: "Redação estratégica dos 750 caracteres da descrição oficial e catálogos com termos BLUF (Bottom Line Up Front) perfeitamente interpretáveis por robôs e IAs."
  },
  {
    passo: "4",
    titulo: "Protocolo Ativo de Avaliações 5 Estrelas",
    desc: "Implementação da rotina comercial para transformar cada cliente atendido em uma avaliação rica em palavras-chave que empurra seu perfil para o topo contínuo."
  }
];

const FAQ = [
  {
    q: "Por que se antecipar e otimizar para 2027 agora?",
    a: "O algoritmo do Google não posiciona uma empresa da noite para o dia. Construir relevância histórica, autoridade de marca, consistência de dados e um acervo sólido de avaliações leva semanas. Quem estrutura o perfil hoje entra em 2027 já consolidado no topo absoluto, enquanto os concorrentes ainda tentam entender as novas regras."
  },
  {
    q: "É possível garantir a 1ª posição absoluta no Google em 2027?",
    a: "Nenhum profissional ético promete primeiro lugar absoluto e fixo para todos os usuários, pois a busca moderna é personalizada e considera a distância física em tempo real de quem pesquisa. O que garantimos é a aplicação das técnicas mais avançadas do mundo em SEO Local para colocar sua empresa no bloco de elite (Top 3 do Google Maps e resumos de IA)."
  },
  {
    q: "Como as buscas por inteligência artificial (GEO) mudam o primeiro lugar?",
    a: "Em vez de apenas listar links, as IAs como o Google AI Overviews leem os dados do Perfil da Empresa, avaliações e páginas rápidas para recomendar uma resposta direta. Empresas com informações desatualizadas ou perfis abandonados são simplesmente ignoradas pelos assistentes de IA."
  },
  {
    q: "Qual a diferença entre pagar anúncios no topo e estar em primeiro no orgânico?",
    a: "Os anúncios pagos cobram valores caros por clique (chegando a R$ 20 a R$ 50 por clique em nichos concorridos) e somem no segundo em que o saldo zera. O primeiro lugar orgânico no Google Maps é um ativo patrimonial perpétuo que gera clientes todos os dias com custo por clique zero."
  },
  {
    q: "Como funciona a consultoria de posicionamento com o Leonardo Brasil?",
    a: "Eu analiso pessoalmente seu negócio, estudo os pontos cegos dos concorrentes da sua cidade e executo a reestruturação cirúrgica dos 6 Pilares de SEO Local no seu perfil, além de treinar seu time para converter o tráfego em vendas no WhatsApp."
  }
];

export default function PrimeiroLugarNoGoogle2027() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/primeiro-lugar-no-google-2027#article",
        headline: "Como Ficar em Primeiro Lugar no Google em 2027: O Guia Definitivo de SEO Local",
        description: "Aprenda as técnicas avançadas de SEO Local e GEO para colocar sua empresa em primeiro lugar no Google e dominar o Top 3 do Google Maps em 2027.",
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
        mainEntityOfPage: "https://leonardobrasil.com.br/primeiro-lugar-no-google-2027",
        datePublished: "2026-11-09T20:00:00-03:00",
        dateModified: "2026-11-09T20:30:00-03:00"
      },
      {
        "@type": "HowTo",
        name: "Como conquistar o primeiro lugar no Google em 2027",
        description: "Passo a passo estratégico de otimização para liderar as buscas locais do Google e recomendações de IA.",
        step: PASSOS_ESTRATEGICOS.map((p, idx) => ({
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
        title="Primeiro Lugar no Google 2027: Como Liderar o Top 3 do Maps | Leonardo Brasil"
        description="Descubra como colocar sua empresa em primeiro lugar no Google em 2027. Técnicas avançadas de SEO Local, algoritmos de IA (GEO) e conversão no WhatsApp."
        canonicalUrl="https://leonardobrasil.com.br/primeiro-lugar-no-google-2027"
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
              Estratégia 2027
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Planejar Posicionamento 2027
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
            <span>Algoritmo 2027 • SEO Local & GEO</span>
            <span className="text-white/40">•</span>
            <span>Antecipação Estratégica</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Primeiro Lugar no Google em 2027: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              Como Dominar as Buscas da Sua Cidade
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            As regras de ranqueamento mudaram radicalmente. Entenda o que é necessário para colocar sua empresa no topo do Google Maps e nas recomendações de inteligência artificial em 2027.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-lg shadow-accent/25"
            >
              <WhatsApp className="w-4 h-4" />
              Auditoria de Posicionamento para 2027
            </a>
            <a
              href="#pilares"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Conhecer as Novas Regras
              <Arrow className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-accent font-bold text-lg mb-0.5">Top 3 do Maps</div>
              <div className="text-xs text-text-muted">Mais de 75% dos cliques de compra</div>
            </div>
            <div className="p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-accent font-bold text-lg mb-0.5">Relevância em IA</div>
              <div className="text-xs text-text-muted">Citado por Gemini, SearchGPT e Perplexity</div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-emerald-400 font-bold text-lg mb-0.5">Custo Zero/Clique</div>
              <div className="text-xs text-text-muted">Ativo perpétuo para o seu negócio</div>
            </div>
          </div>
        </div>
      </section>

      {/* OS 4 PILARES DE 2027 */}
      <section id="pilares" className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              O Que Define o 1º Lugar no Google em 2027?
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Não se trata mais de encher o site de palavras-chave repetidas. Os 4 pilares modernos de autoridade:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PILARES_2027.map((item) => (
              <div
                key={item.num}
                className="p-6 rounded-2xl bg-ink-card border border-line hover:border-accent/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm mb-4">
                  {item.num}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.titulo}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVO EVOLUÇÃO */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              SEO Tradicional vs. Primeiro Lugar em 2027
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Veja a evolução entre o que funcionava no passado e o que é obrigatório para liderar o mercado nos próximos anos:
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-ink-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-line bg-ink/60 text-white font-semibold">
                    <th className="p-4">Dimensão</th>
                    <th className="p-4 text-text-muted">SEO do Passado</th>
                    <th className="p-4 text-accent">Novo Primeiro Lugar (2027)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {COMPARATIVO_EVOLUCAO.map((row, idx) => (
                    <tr key={idx} className="hover:bg-ink-card/40 transition-colors">
                      <td className="p-4 font-semibold text-white whitespace-nowrap">{row.criterio}</td>
                      <td className="p-4 text-text-muted">{row.passado}</td>
                      <td className="p-4 text-emerald-400 font-medium">{row.cenario2027}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* O PASSO A PASSO PARA O TOPO */}
      <section className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Como Chegar ao Topo em 4 Etapas Estruturadas
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              O método de engenharia de busca aplicado nos clientes de Leonardo Brasil:
            </p>
          </div>

          <div className="space-y-4">
            {PASSOS_ESTRATEGICOS.map((item) => (
              <div
                key={item.passo}
                className="p-6 rounded-2xl bg-ink-card border border-line flex flex-col sm:flex-row items-start gap-5 hover:border-accent/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-lg flex-shrink-0">
                  0{item.passo}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.titulo}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Perguntas Frequentes
            </h2>
            <p className="text-sm text-text-muted">
              Dúvidas essenciais sobre primeiro lugar no Google e antecipação para 2027.
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
            Pronto para colocar sua empresa em 1º lugar em 2027?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            Não espere a concorrência se movimentar primeiro. Faça uma auditoria completa de presença digital e garanta sua liderança no Google.
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
