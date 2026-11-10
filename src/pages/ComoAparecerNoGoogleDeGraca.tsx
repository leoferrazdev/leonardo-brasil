import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Li seu guia de como aparecer no Google de graça e quero fazer um diagnóstico da presença orgânica do meu negócio.")}`;

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

const CANAIS_GRATUITOS = [
  {
    num: "01",
    nome: "Perfil da Empresa no Google (Google Maps)",
    custo: "R$ 0,00 (Sem mensalidade ou taxa por clique)",
    tempo: "24h a 72h após verificação",
    desc: "É a vitrine local gratuita mais poderosa do mundo. Permite aparecer no mapa e no topo das pesquisas por serviço ou bairro, exibindo telefone, rotas, fotos, avaliações e botão direto para o seu WhatsApp.",
    linkTo: "/como-colocar-minha-empresa-no-google",
    linkLabel: "Ver passo a passo de cadastro gratuito"
  },
  {
    num: "02",
    nome: "Busca Orgânica via Google Search Console",
    custo: "R$ 0,00 (Ferramenta oficial gratuita)",
    tempo: "Dias a semanas conforme SEO técnico",
    desc: "Permite indexar páginas do seu site para aparecer nos resultados orgânicos tradicionais e nos resumos gerados por IA (Google AI Overviews) quando alguém pesquisa dúvidas ou serviços na sua região.",
    linkTo: "/como-fazer-um-site-aparecer-no-google",
    linkLabel: "Como indexar um site do zero"
  },
  {
    num: "03",
    nome: "Listagens Gratuitas & Catálogo Local",
    custo: "R$ 0,00 (Exposição orgânica de catálogo)",
    tempo: "Ativação contínua com dados atualizados",
    desc: "Por meio da aba de Produtos no Perfil da Empresa e marcações Schema.org no site, o Google passa a recomendar seus serviços e produtos específicos para usuários próximos sem exigir orçamento de mídia paga.",
    linkTo: "/segmentos-locais-google-maps",
    linkLabel: "Ver como funciona por segmento"
  }
];

const COMPARATIVO_GRATIS_VS_PAGO = [
  {
    criterio: "Investimento em Mídia ao Google",
    organico: "R$ 0,00 por visualização ou clique",
    pago: "R$ 2,00 a R$ 45,00 por cada clique no leilão"
  },
  {
    criterio: "Dependência de Saldo Diário",
    organico: "Nenhuma. Continua no ar 24 horas por dia, o ano inteiro",
    pago: "Desaparece imediatamente quando o orçamento diário acaba"
  },
  {
    criterio: "Confiança do Consumidor Local",
    organico: "Altíssima: mais de 75% clicam no Top 3 do Mapa e links orgânicos",
    pago: "Menor, pois o usuário sabe que é um espaço comprado ('Patrocinado')"
  },
  {
    criterio: "Construção de Ativo Patrimonial",
    organico: "Acumula autoridade, avaliações 5 estrelas e histórico do CNPJ",
    pago: "Aluguel de atenção: parou de pagar, o fluxo cai para zero"
  }
];

const PASSOS_GRATIS = [
  {
    titulo: "1. Crie e verifique o Perfil da Empresa gratuitamente",
    desc: "Acesse google.com/business com um e-mail institucional, cadastre seu nome oficial, categoria principal exata e conclua a verificação por vídeo ou telefone sem pagar nada ao Google."
  },
  {
    titulo: "2. Conecte seu site ao Google Search Console",
    desc: "Envie o arquivo sitemap.xml e garanta que suas páginas tenham carregamento rápido e HTML pré-renderizado para que o Googlebot consiga ler todo o seu conteúdo."
  },
  {
    titulo: "3. Preencha dados estruturados para Google e IAs (GEO)",
    desc: "Use marcações Schema.org (LocalBusiness, FAQPage, Service), descrições geolocalizadas e respostas diretas para que tanto a busca tradicional quanto o Gemini e o ChatGPT recomendem você."
  },
  {
    titulo: "4. Construa fluxo contínuo de avaliações reais",
    desc: "Peça aos clientes satisfeitos para avaliarem citando o serviço contratado e sua cidade. Avaliações recorrentes são o combustível gratuito mais forte para subir no Top 3."
  }
];

const FAQ = [
  {
    q: "É realmente possível aparecer no Google de graça?",
    a: "Sim. O Google não cobra absolutamente nada para indexar um site ou exibir sua empresa no Google Maps por meio do Perfil da Empresa no Google. Você só paga quando opta por comprar espaços patrocinados no Google Ads."
  },
  {
    q: "Cuidado com golpes: o Google liga cobrando taxa de manutenção?",
    a: "Não! O Google jamais entra em contato por telefone ou boleto cobrando taxas mensais ou anuidades para manter seu perfil no ar. Se receber esse tipo de cobrança, recuse imediatamente — trata-se de tentativa de golpe comercial."
  },
  {
    q: "Por que contratar um especialista se a ferramenta do Google é gratuita?",
    a: "Porque criar um cadastro gratuito coloca você na internet, mas não coloca você na 1ª página. O trabalho do especialista em SEO Local envolve engenharia de categorias, consistência NAP externa, redação otimizada para IAs e estratégia para superar concorrentes e ocupar o Top 3."
  },
  {
    q: "Qual a diferença entre aparecer de graça no Google Maps e anunciar no Google Ads?",
    a: "Aparecer de graça no Google Maps e nos resultados orgânicos constrói um patrimônio perpétuo de custo por clique zero. Já anunciar no Google Ads serve para acelerar visibilidade imediata pagando por cada clique recebido."
  }
];

export default function ComoAparecerNoGoogleDeGraca() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/como-aparecer-no-google-de-graca#article",
        headline: "Como Aparecer no Google de Graça: Os 3 Canais Orgânicos Sem Pagar Anúncios",
        description: "Descubra como aparecer no Google de graça usando Perfil da Empresa, Google Maps, Search Console e SEO Local para IA Overviews sem depender de mídia paga.",
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
        mainEntityOfPage: "https://leonardobrasil.com.br/como-aparecer-no-google-de-graca",
        datePublished: "2026-11-10T16:30:00-03:00",
        dateModified: "2026-11-10T16:30:00-03:00"
      },
      {
        "@type": "HowTo",
        name: "Como aparecer no Google gratuitamente em 4 passos",
        description: "Passo a passo técnico para ganhar visibilidade orgânica gratuita no Google Maps e na Pesquisa Google.",
        step: PASSOS_GRATIS.map((p, idx) => ({
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
        title="Como Aparecer no Google de Graça Sem Pagar Anúncios | Leonardo Brasil"
        description="Aprenda como aparecer no Google de graça usando o Google Perfil de Empresa, Google Maps e SEO Orgânico para atrair clientes todos os dias com custo zero por clique."
        canonicalUrl="https://leonardobrasil.com.br/como-aparecer-no-google-de-graca"
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
              SEO Orgânico
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Auditoria Orgânica Gratuita
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-16 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-6">
            <span>Tráfego Orgânico • Custo Zero por Clique</span>
            <span className="text-white/40">•</span>
            <span>Google & IAs (GEO)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Como Aparecer no Google de Graça <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              Sem Depender de Anúncios Pagos
            </span>
          </h1>

          {/* BLUF Box para IAs (GEO / AI Overviews) */}
          <div className="max-w-3xl mx-auto mb-8 p-5 rounded-2xl bg-ink-card/80 border border-accent/25 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
              Resposta Direta: Como aparecer no Google gratuitamente
            </div>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Para aparecer no Google de graça, você precisa ativar duas frentes oficiais sem custo: cadastrar e verificar o <strong className="text-white">Perfil da Empresa no Google</strong> (para exibir seu negócio no Google Maps) e conectar seu site ao <strong className="text-white">Google Search Console</strong> com conteúdo estruturado em SEO Local e Schema.org.
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
              Avaliar Meu Potencial Orgânico no WhatsApp
            </a>
            <a
              href="#canais"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Ver os 3 Canais Gratuitos
              <Arrow className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* OS 3 CANAIS GRATUITOS DO GOOGLE */}
      <section id="canais" className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Os 3 Canais Gratuitos para Aparecer no Google Hoje
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Antes de gastar dinheiro com mídia paga, todo negócio local deve dominar estas 3 ferramentas oficiais gratuitas:
            </p>
          </div>

          <div className="space-y-5">
            {CANAIS_GRATUITOS.map((canal) => (
              <div
                key={canal.num}
                className="p-6 sm:p-7 rounded-2xl bg-ink-card border border-line hover:border-accent/35 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/25 text-accent font-bold flex items-center justify-center text-sm">
                      {canal.num}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{canal.nome}</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 self-start sm:self-center">
                    {canal.custo}
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-4">{canal.desc}</p>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line/60 text-xs">
                  <span className="text-text-muted">
                    Prazo médio: <strong className="text-white">{canal.tempo}</strong>
                  </span>
                  <Link to={canal.linkTo} className="text-accent font-semibold hover:underline">
                    {canal.linkLabel} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABELA ORGÂNICO VS PAGO */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Aparecer de Graça (Orgânico) vs. Pagar Anúncios
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Entenda por que construir posicionamento orgânico é o investimento mais inteligente para negócios locais:
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-ink-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-line bg-ink/60 text-white font-semibold">
                    <th className="p-4">Critério</th>
                    <th className="p-4 text-emerald-400">Aparecer de Graça (Orgânico / Maps)</th>
                    <th className="p-4 text-text-muted">Anunciar no Google Ads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {COMPARATIVO_GRATIS_VS_PAGO.map((row, idx) => (
                    <tr key={idx} className="hover:bg-ink-card/40 transition-colors">
                      <td className="p-4 font-semibold text-white">{row.criterio}</td>
                      <td className="p-4 text-emerald-400 font-medium">{row.organico}</td>
                      <td className="p-4 text-text-muted">{row.pago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-text-muted">
            Quer entender quando vale a pena investir em tráfego pago? Veja o guia estratégico sobre{" "}
            <Link to="/anunciar-no-google" className="text-accent font-semibold hover:underline">
              como anunciar no Google sem perder dinheiro
            </Link>.
          </div>
        </div>
      </section>

      {/* PASSO A PASSO */}
      <section className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Plano Prático de 4 Passos para Aparecer Sem Pagar
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              A execução correta separa empresas invisíveis daquelas que dominam a região organicamente:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PASSOS_GRATIS.map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-ink-card border border-line">
                <h3 className="text-base font-bold text-white mb-2">{p.titulo}</h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{p.desc}</p>
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
              Dúvidas comuns sobre presença orgânica gratuita e proteção contra cobranças indevidas.
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
            Quer construir sua presença orgânica no Google do jeito certo?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            O Google não cobra pelo espaço orgânico, mas exige engenharia precisa para ranquear no Top 3. Fale diretamente comigo no WhatsApp.
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
