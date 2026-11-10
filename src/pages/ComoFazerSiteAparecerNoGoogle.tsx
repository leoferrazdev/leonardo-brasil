import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Meu site ainda não aparece no Google e quero ajuda técnica para indexar e estruturar meu SEO Local.")}`;

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

const CHECKLIST_INDEXACAO = [
  {
    passo: "01",
    titulo: "Verifique a propriedade no Google Search Console",
    desc: "Crie uma propriedade de Domínio via DNS TXT em search.google.com/search-console. É o canal oficial para avisar ao Google que seu site existe e acompanhar exatamente quais páginas foram rastreadas."
  },
  {
    passo: "02",
    titulo: "Gere e envie o arquivo sitemap.xml atualizado",
    desc: "Envie https://seudominio.com.br/sitemap.xml dentro do menu Sitemaps no Search Console. Esse mapa em XML entrega ao Googlebot a lista limpa de todas as páginas válidas que ele deve visitar."
  },
  {
    passo: "03",
    titulo: "Audite o robots.txt e remova tags 'noindex' acidentais",
    desc: "Muitos sites novos são publicados com a caixa 'Evitar que mecanismos de busca indexem este site' ligada ou com 'Disallow: /' no robots.txt. Confira o código-fonte antes de solicitar indexação."
  },
  {
    passo: "04",
    titulo: "Garanta HTML pré-renderizado ou SSR (Legível por Robôs)",
    desc: "Sites modernos em React/JavaScript puro podem entregar apenas uma div vazia antes da execução do script. Usar Pré-Renderização Estática ou SSR garante que Googlebot e IAs leiam texto, títulos e Schema.org instantaneamente."
  },
  {
    passo: "05",
    titulo: "Conecte o domínio ao Perfil da Empresa e solicite indexação",
    desc: "Insira o link do seu site no Perfil da Empresa no Google (Maps) e clique em 'Inspeção de URL > Solicitar indexação' no Search Console para acelerar a primeira leitura entre 24h e 72h."
  }
];

const MOTIVOS_NAO_APARECER = [
  {
    titulo: "Status 'Detectada, mas não indexada no momento'",
    explicacao: "O Google sabe que a URL existe pelo sitemap, mas ainda não priorizou rastreá-la por excesso de páginas fracas ou servidor lento."
  },
  {
    titulo: "Status 'Rastreada, mas não indexada no momento'",
    explicacao: "O robô entrou na página, mas julgou o conteúdo raso, duplicado ou sem utilidade suficiente frente a outros sites já indexados."
  },
  {
    titulo: "Bloqueio invisível por canonical errada ou HTTP/HTTPS",
    explicacao: "Redirecionamentos em cadeia ou tag canonical apontando para outro endereço fazem o Google descartar a versão correta do seu site."
  },
  {
    titulo: "Domínio novo sem nenhum link apontando para ele (Página Órfã)",
    explicacao: "Se nenhum perfil oficial (como o Google Perfil de Empresa ou redes sociais) aponta para o domínio, o Googlebot demora semanas para descobrir sua existência."
  }
];

const FAQ = [
  {
    q: "Como saber se meu site já está aparecendo no Google?",
    a: "Abra o Google e pesquise exatamente por site:seudominio.com.br (sem espaços após os dois pontos). Todas as páginas já indexadas serão listadas. Se não retornar nada, seu domínio ainda está fora do índice do Google."
  },
  {
    q: "Quanto tempo demora para um site novo aparecer no Google?",
    a: "Depois de enviar o sitemap.xml no Google Search Console e solicitar indexação da página inicial sem bloqueios técnicos, a indexação inicial costuma acontecer entre 24 e 72 horas. Aparecer bem posicionado nas buscas de clientes leva mais tempo com SEO."
  },
  {
    q: "Posso fazer um site aparecer no Google sem pagar nada?",
    a: "Sim. Tanto o Google Search Console quanto a indexação orgânica e o cadastro no Google Perfil de Empresa são 100% gratuitos. Você nunca precisa pagar taxa ao Google para indexar seu domínio."
  },
  {
    q: "Qual a diferença entre aparecer no Google e aparecer em primeiro lugar?",
    a: "Aparecer no Google (indexação) significa que sua página entrou no catálogo do buscador. Já aparecer em primeiro para o cliente pesquisar pelo seu serviço exige autoridade local, SEO técnico e Topic Clusters — explicados no nosso guia de ranqueamento em primeiro lugar."
  }
];

export default function ComoFazerSiteAparecerNoGoogle() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/como-fazer-um-site-aparecer-no-google#article",
        headline: "Como Fazer um Site Aparecer no Google do Zero: Checklist Técnico de Indexação",
        description: "Aprenda como fazer um site novo aparecer no Google em 24h a 72h usando Google Search Console, sitemap.xml, verificação de robots.txt/noindex e vínculo com Google Maps.",
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
        mainEntityOfPage: "https://leonardobrasil.com.br/como-fazer-um-site-aparecer-no-google",
        datePublished: "2026-11-10T16:45:00-03:00",
        dateModified: "2026-11-10T16:45:00-03:00"
      },
      {
        "@type": "HowTo",
        name: "Como indexar um site no Google em 5 passos",
        description: "Checklist técnico oficial para fazer o Google encontrar, rastrear e indexar seu site corretamente.",
        step: CHECKLIST_INDEXACAO.map((p, idx) => ({
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
        title="Como Fazer um Site Aparecer no Google: Guia de Indexação | Leonardo Brasil"
        description="Site novo não aparece nas pesquisas? Veja o checklist técnico de 5 passos com Search Console, sitemap.xml e correção de bloqueios para indexar seu site no Google."
        canonicalUrl="https://leonardobrasil.com.br/como-fazer-um-site-aparecer-no-google"
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
              Indexação & SEO Técnico
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Diagnosticar Indexação no WhatsApp
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-16 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-6">
            <span>Google Search Console • Sitemap • SSR</span>
            <span className="text-white/40">•</span>
            <span>Do Zero à Indexação</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Como Fazer um Site Aparecer no Google <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              Em 24h a 72h Com Segurança
            </span>
          </h1>

          {/* BLUF Box para IAs (GEO / AI Overviews) */}
          <div className="max-w-3xl mx-auto mb-8 p-5 rounded-2xl bg-ink-card/80 border border-accent/25 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
              Resposta Direta: Como indexar um site no Google hoje
            </div>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Para <strong className="text-white">fazer um site aparecer no Google</strong>, você deve verificar a propriedade do domínio no <strong className="text-white">Google Search Console</strong>, enviar o arquivo <code className="text-white">sitemap.xml</code>, confirmar que <code className="text-white">robots.txt</code> e meta tags não estão bloqueando robôs (<code className="text-white">noindex</code>), garantir HTML pré-renderizado e conectar o domínio ao seu Perfil da Empresa no Google.
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
              Pedir Diagnóstico do Meu Domínio
            </a>
            <a
              href="#checklist"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Ver Checklist de 5 Passos
              <Arrow className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CHECKLIST DE 5 PASSOS */}
      <section id="checklist" className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Checklist Técnico de 5 Passos Para Indexar Seu Site
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Execute nesta ordem exata para sair da invisibilidade técnica e entrar no índice oficial do Google:
            </p>
          </div>

          <div className="space-y-4">
            {CHECKLIST_INDEXACAO.map((item) => (
              <div
                key={item.passo}
                className="p-6 rounded-2xl bg-ink-card border border-line hover:border-accent/30 transition-all flex flex-col sm:flex-row items-start gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-lg">
                  {item.passo}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.titulo}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOTIVOS PELOS QUAIS UM SITE NÃO APARECE */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Por que o Site Continua Invisível Mesmo Depois de Publicado?
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Estes são os 4 diagnósticos mais frequentes quando abrimos o Google Search Console de clientes locais:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {MOTIVOS_NAO_APARECER.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-ink-card border border-line">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    ✕
                  </span>
                  <h3 className="text-base font-bold text-white">{item.titulo}</h3>
                </div>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{item.explicacao}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-accent/15 via-ink-card to-accent/10 border border-accent/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Check className="w-4 h-4" />
                Próximo passo após indexar
              </div>
              <p className="text-sm text-text-muted">
                Seu site já aparece quando você busca o nome exato, mas não para clientes novos? Veja como levá-lo ao topo orgânico.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                to="/como-fazer-meu-site-aparecer-no-google-em-primeiro"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-accent hover:bg-accent-light transition-all"
              >
                Subir para o 1º Lugar →
              </Link>
              <Link
                to="/como-colocar-minha-empresa-no-google"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-text-muted hover:text-white bg-ink border border-line hover:border-accent/40 transition-all"
              >
                Cadastrar Empresa no Mapa →
              </Link>
            </div>
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
              Respostas objetivas sobre verificação de domínio, prazos de indexação e custos.
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
            Site novo no ar e sem nenhuma visita do Google?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            Envie o link do seu site no WhatsApp. Eu verifico se há bloqueios técnicos de indexação e mostro como alinhar seu site com o Google Maps da sua empresa.
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
