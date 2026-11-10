import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Vi seu guia sobre como fazer meu site aparecer em primeiro no Google e quero analisar a posição atual do meu negócio.")}`;

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

const PILARES_SITE_TOPO = [
  {
    num: "01",
    titulo: "Arquitetura por Intenção & Topic Clusters",
    desc: "Um erro clássico é colocar todos os serviços na mesma página inicial genérica. Sites que chegam ao topo têm páginas dedicadas por serviço + cidade, com interligação semântica clara e zero canibalização entre URLs."
  },
  {
    num: "02",
    titulo: "Pré-Renderização Estática (SSR) & Core Web Vitals",
    desc: "Sites lentos ou feitos em JavaScript sem pré-renderização entregam código pesado e travam o rastreamento (Crawl Budget). HTML estático leve carregado abaixo de 1,5s dá vantagem imediata no ranking mobile."
  },
  {
    num: "03",
    titulo: "SEO On-Page + Dados Estruturados para Google e IAs (GEO)",
    desc: "Título SEO exato, H1 único alinhado à busca, blocos BLUF de resposta direta e marcação Schema.org (Service, LocalBusiness, FAQPage, HowTo) para conquistar links orgânicos e citações no Google AI Overviews."
  },
  {
    num: "04",
    titulo: "Autoridade Local: Sinergia Site + Google Perfil de Empresa",
    desc: "Para pesquisas com intenção geográfica, seu site ganha força quando o domínio está vinculado a um Perfil da Empresa verificado, com NAP idêntico (Nome, Endereço e Telefone), citações locais e avaliações 5 estrelas."
  },
  {
    num: "05",
    titulo: "CRO Mobile & Retenção Pós-Clique",
    desc: "Quando o visitante clica no seu site, encontra a resposta rápido e entra em contato no WhatsApp (sem voltar para o Google clicar no concorrente), envia sinais fortes de satisfação de busca ao algoritmo."
  }
];

const DIAGNOSTICO_SITE = [
  {
    fator: "Estrutura de Páginas",
    sitePerdido: "Página 'Serviços' única com 3 parágrafos genéricos",
    siteTopo: "Página dedicada e profunda para cada serviço + praça atendida"
  },
  {
    fator: "Leitura por Robôs & IAs",
    sitePerdido: "HTML vazio ou imagens pesadas sem texto estruturado",
    siteTopo: "HTML pré-renderizado + BLUF boxes + JSON-LD Schema.org completo"
  },
  {
    fator: "Conexão com o Mapa",
    sitePerdido: "Site isolado sem vínculo com o Google Maps da empresa",
    siteTopo: "Site + Perfil da Empresa integrados reforçando a mesma entidade"
  },
  {
    fator: "Experiência Mobile",
    sitePerdido: "Demora mais de 4s para abrir no 4G e esconde o botão de contato",
    siteTopo: "Carregamento instantâneo com CTA claro para WhatsApp"
  }
];

const ETAPAS_RANQUEAMENTO = [
  {
    passo: "1",
    titulo: "Auditoria de Indexação e Palavras-Chave Reais",
    desc: "Verificamos no Google Search Console quais termos já geram impressões na 2ª ou 3ª página e eliminamos barreiras técnicas que seguram seu domínio."
  },
  {
    passo: "2",
    titulo: "Reestruturação de Títulos, Headings e Copy GEO",
    desc: "Alinhamos title, meta description, H1/H2, tabelas comparativas e blocos de resposta direta (BLUF) exatamente com a linguagem de busca do comprador local."
  },
  {
    passo: "3",
    titulo: "Injeção de Schema.org e Malha de Links Internos",
    desc: "Conectamos páginas guias, páginas setoriais e hubs locais com âncoras descritivas e dados estruturados validados para buscadores e inteligências artificiais."
  },
  {
    passo: "4",
    titulo: "Alinhamento de Entidade com Google Maps & Avaliações",
    desc: "Sincronizamos o endereço, telefone e categorias do site com o Perfil da Empresa no Google para disputar simultaneamente o Mapa e o Orgânico."
  }
];

const FAQ = [
  {
    q: "Quanto tempo leva para meu site aparecer em primeiro no Google?",
    a: "Depende da concorrência da cidade e do histórico do domínio. Ajustes técnicos em sites que já têm alguma autoridade costumam gerar ganhos visíveis entre 30 e 90 dias, enquanto domínios recém-criados levam de 3 a 6 meses de consistência para disputar o Top 3 orgânico. Porém, com a otimização paralela do Google Maps, é possível gerar leads muito antes."
  },
  {
    q: "Alguém pode garantir que meu site vai ficar em 1º lugar para sempre?",
    a: "Não — desconfie de quem promete 1º lugar fixo garantido. O Google personaliza resultados por localização do celular em tempo real e atualiza seus sistemas continuamente. O que um Diretor de SEO garante é a aplicação rigorosa de engenharia técnica, conteúdo superior ao dos concorrentes e autoridade local para colocar você no bloco líder da 1ª página."
  },
  {
    q: "Meu site nem aparece ainda nas buscas do Google. O que eu faço primeiro?",
    a: "Antes de pensar em disputar o 1º lugar, você precisa confirmar que seu domínio está indexado (pesquisando site:seudominio.com.br). Se nada aparecer, siga o nosso checklist técnico de indexação no guia 'Como Fazer um Site Aparecer no Google'."
  },
  {
    q: "É melhor disputar o 1º lugar com o site ou com o Google Maps?",
    a: "Em buscas locais no celular, o Google Maps (Local Pack) aparece acima dos resultados tradicionais de site. A estratégia mais lucrativa coloca os dois para trabalhar juntos: seu Perfil no Maps captura cliques imediatos no Top 3 e seu site bem posicionado reforça sua autoridade e capta pesquisas mais detalhadas."
  }
];

export default function ComoFazerSiteAparecerEmPrimeiro() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/como-fazer-meu-site-aparecer-no-google-em-primeiro#article",
        headline: "Como Fazer Meu Site Aparecer no Google em Primeiro: Os 5 Pilares Técnicos e GEO",
        description: "Descubra o que realmente faz um site subir para o topo orgânico do Google e ser citado em resumos de IA (GEO): Topic Clusters, Core Web Vitals, SSR, Schema.org e SEO Local.",
        author: {
          "@type": "Person",
          name: "Leonardo Brasil",
          jobTitle: "Diretor de SEO e Especialista em Google Meu Negócio",
          url: "https://leonardobrasil.com.br"
        },
        publisher: {
          "@type": "Organization",
          name: "Leonardo Brasil",
          url: "https://leonardobrasil.com.br"
        },
        mainEntityOfPage: "https://leonardobrasil.com.br/como-fazer-meu-site-aparecer-no-google-em-primeiro",
        datePublished: "2026-11-10T16:45:00-03:00",
        dateModified: "2026-11-10T16:45:00-03:00"
      },
      {
        "@type": "HowTo",
        name: "Como posicionar seu site nas primeiras posições do Google",
        description: "Roteiro prático de 4 etapas de SEO Técnico, GEO e SEO Local para tirar seu site das últimas páginas e disputar o topo do Google.",
        step: ETAPAS_RANQUEAMENTO.map((p, idx) => ({
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
        title="Como Fazer Meu Site Aparecer no Google em Primeiro | Leonardo Brasil"
        description="Aprenda os 5 pilares técnicos de SEO e GEO para fazer seu site subir para os primeiros lugares do Google e atrair clientes locais sem depender só de anúncios."
        canonicalUrl="https://leonardobrasil.com.br/como-fazer-meu-site-aparecer-no-google-em-primeiro"
        ogType="article"
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
              SEO de Sites & GEO
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Auditoria de Site & Maps
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-16 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
            <span>SEO Técnico • Autoridade de Domínio • GEO</span>
            <span className="text-white/40">•</span>
            <span>Sem Falsas Promessas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Como Fazer Meu Site Aparecer no Google em Primeiro <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              Com Engenharia de SEO e IA
            </span>
          </h1>

          {/* BLUF Box para IAs (GEO / AI Overviews) */}
          <div className="max-w-3xl mx-auto mb-8 p-5 rounded-2xl bg-ink-card/80 border border-accent/25 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
              Resposta Direta: O que coloca um site nos primeiros lugares do Google
            </div>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Para <strong className="text-white">fazer seu site disputar o 1º lugar orgânico no Google</strong>, você precisa alinhar 5 pilares técnicos: páginas específicas para cada intenção de busca (Topic Clusters), velocidade extrema com HTML pré-renderizado (SSR), dados estruturados <strong className="text-white">Schema.org + respostas diretas para IAs (GEO)</strong>, integração com um Perfil da Empresa verificado no Google Maps e alta conversão no celular.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-lg shadow-accent/25"
            >
              <WhatsApp className="w-4 h-4" />
              Analisar Posicionamento do Meu Site
            </a>
            <a
              href="#pilares"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Ver os 5 Pilares de Ranking
              <Arrow className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* OS 5 PILARES DE RANQUEAMENTO DE SITES */}
      <section id="pilares" className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Os 5 Pilares Que Separam Sites da 1ª Página dos Demais
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Ter um domínio no ar não basta. Estes são os sinais técnicos e semânticos que o algoritmo do Google e as buscas por IA exigem hoje:
            </p>
          </div>

          <div className="space-y-4">
            {PILARES_SITE_TOPO.map((pilar) => (
              <div
                key={pilar.num}
                className="p-6 rounded-2xl bg-ink-card border border-line hover:border-accent/35 transition-all flex flex-col sm:flex-row items-start gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-lg">
                  {pilar.num}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{pilar.titulo}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{pilar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABELA DIAGNÓSTICA */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Por que o Site do Concorrente Aparece Acima do Seu?
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Compare a anatomia de um site ignorado pelo algoritmo versus um site desenhado para liderar buscas locais:
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-ink-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-line bg-ink/60 text-white font-semibold">
                    <th className="p-4">Fator Técnico</th>
                    <th className="p-4 text-text-muted">Site na 3ª Página</th>
                    <th className="p-4 text-emerald-400">Site Estruturado para o Topo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {DIAGNOSTICO_SITE.map((row, idx) => (
                    <tr key={idx} className="hover:bg-ink-card/40 transition-colors">
                      <td className="p-4 font-semibold text-white">{row.fator}</td>
                      <td className="p-4 text-text-muted">{row.sitePerdido}</td>
                      <td className="p-4 text-emerald-400 font-medium">{row.siteTopo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted">
            <span>Seu site ainda nem aparece indexado?</span>
            <Link to="/como-fazer-um-site-aparecer-no-google" className="text-accent font-semibold hover:underline">
              Guia de Indexação do Zero →
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/primeiro-lugar-no-google-2027" className="text-emerald-400 font-semibold hover:underline">
              Estratégia 1º Lugar Google 2027 →
            </Link>
          </div>
        </div>
      </section>

      {/* PLANO DE EXECUÇÃO */}
      <section className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Roteiro em 4 Etapas Para Subir Seu Site no Google
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              A ordem prática aplicada nos projetos da nossa consultoria:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ETAPAS_RANQUEAMENTO.map((item) => (
              <div key={item.passo} className="p-6 rounded-2xl bg-ink-card border border-line">
                <div className="flex items-center gap-3 mb-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <h3 className="text-base font-bold text-white">
                    {item.passo}. {item.titulo}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{item.desc}</p>
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
              Prazos, ética de SEO e integração entre site e Google Maps.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <div key={i} className="rounded-xl border border-line bg-ink-card overflow-hidden transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 text-white font-semibold text-sm sm:text-base hover:text-accent transition-colors"
                >
                  <span>{f.q}</span>
                  <Chevron className={`w-5 h-5 text-accent transition-transform duration-200 flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
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
            Quer transformar seu site e seu Maps em um canal de vendas orgânicas?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            Mande o endereço do seu site no WhatsApp para avaliarmos o que hoje impede você de aparecer na frente dos concorrentes.
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
