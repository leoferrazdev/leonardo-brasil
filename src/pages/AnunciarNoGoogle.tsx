import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Vi seu guia sobre anunciar no Google e quero avaliar se meu perfil e site estão prontos antes de investir em anúncios.")}`;

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

const FORMATOS_ANUNCIO = [
  {
    num: "01",
    nome: "Rede de Pesquisa Local (Intenção Imediata)",
    indicacao: "Serviços de urgência, médicos, advogados e B2B",
    desc: "Seu anúncio aparece quando alguém digita exatamente o que você vende (ex: 'dentista implante perto de mim'). Para não queimar verba, é obrigatório usar palavras-chave negativas e segmentação por raio geográfico real."
  },
  {
    num: "02",
    nome: "Anúncios Locais no Google Maps (Extensão de Local)",
    indicacao: "Negócios físicos e atendimento regional",
    desc: "Conecta a conta do Google Ads ao seu Perfil da Empresa no Google, exibindo seu pino patrocinado no topo do mapa com nota em estrelas, rotas e botão direto de ligação."
  },
  {
    num: "03",
    nome: "Performance Max para Lojas e Serviços Locais",
    indicacao: "Campanhas híbridas (Pesquisa, Maps, YouTube e Display)",
    desc: "Automação orientada por conversão de visitas à loja, ligações e cliques no WhatsApp — desde que o histórico de conversões e a base orgânica do perfil estejam bem calibrados."
  }
];

const COMPARATIVO_ESTRATEGIAS = [
  {
    criterio: "Custo por Clique (CPC) Médio Local",
    apenasAds: "R$ 2,00 a R$ 45,00+ por clique (leilão encarece ano a ano)",
    hibrido: "Mesmo CPC pago, diluído por cliques gratuitos contínuos no Maps"
  },
  {
    criterio: "Taxa de Conversão do Visitante",
    apenasAds: "Baixa se cair em site lento ou ficha do Google sem avaliações",
    hibrido: "Muito alta: o usuário vê o anúncio, confere nota 4.9★ no Maps e chama no WhatsApp"
  },
  {
    criterio: "Sustentabilidade ao Pausar Verba",
    apenasAds: "Zero. Parou o boleto/cartão, as ligações somem no mesmo minuto",
    hibrido: "O Top 3 orgânico continua gerando contatos gratuitos 24h por dia"
  },
  {
    criterio: "Custo por Lead (CPL) ao Longo de 6 Meses",
    apenasAds: "Instável e 100% dependente de aumentar orçamento mensal",
    hibrido: "Tendência de queda no CPL conforme a autoridade orgânica cresce"
  }
];

const RALOS_VERBA = [
  {
    titulo: "Anunciar sem lista de palavras-chave negativas",
    explicacao: "Sem negativação diária, seu anúncio paga caro por cliques de curiosos pesquisando 'curso grátis', 'vaga de emprego', 'salário' ou 'download PDF' do seu segmento."
  },
  {
    titulo: "Pagar clique para jogar o cliente em uma ficha fraca",
    explicacao: "O consumidor clica no anúncio, vê poucas avaliações, fotos antigas ou nota abaixo de 4,3 no Google Maps ao lado — e fecha o seu site para chamar o concorrente bem avaliado."
  },
  {
    titulo: "Segmentação geográfica aberta ('Brasil inteiro' por padrão)",
    explicacao: "A configuração padrão do Google Ads inclui 'presença ou interesse', torrando orçamento com pessoas fora da sua cidade que jamais vão até o seu consultório ou empresa."
  },
  {
    titulo: "Enviar tráfego pago para página lenta sem botão de WhatsApp",
    explicacao: "Pagar R$ 15 num clique para o usuário esperar 6 segundos no 4G e cair em uma home genérica sem oferta clara faz você pagar pelo clique do concorrente."
  }
];

const PASSOS_ANUNCIAR = [
  {
    titulo: "1. Blinde o Perfil da Empresa e sua Landing Page antes de subir mídia",
    desc: "Garanta velocidade mobile alta, prova social no Google Maps (avaliações reais recentes) e CTA direto para WhatsApp antes de colocar o cartão no ar."
  },
  {
    titulo: "2. Estruture campanhas por intenção real de compra (fundo de funil)",
    desc: "Separe palavras de urgência e contratação ('contratar', 'orçamento', 'perto de mim') de pesquisas informativas e crie anúncios específicos por serviço."
  },
  {
    titulo: "3. Vincule o Google Perfil de Empresa ao Google Ads",
    desc: "Ative recursos de local e telefone para aparecer também nos espaços patrocinados dentro do Google Maps, multiplicando os pontos de contato na tela do celular."
  },
  {
    titulo: "4. Meça cliques qualificados no WhatsApp (não só cliques no link)",
    desc: "Configure metas de conversão reais com UTMs e eventos para otimizar o orçamento pelas mensagens e agendamentos efetivamente iniciados."
  }
];

const FAQ = [
  {
    q: "Quanto custa anunciar no Google para um negócio local?",
    a: "Não existe valor mínimo imposto pelo Google, mas no mercado local o custo por clique (CPC) costuma variar de R$ 2,00 em prestadores simples até R$ 25,00–R$ 45,00+ em áreas disputadas como odontologia, advocacia e emergências 24h. Por isso, desperdício de clique sem filtro custa muito caro."
  },
  {
    q: "Vale mais a pena anunciar no Google Ads ou fazer SEO no Google Maps?",
    a: "O melhor retorno financeiro vem da combinação na ordem certa: primeiro você estrutura o orgânico (Perfil da Empresa + SEO Local + site rápido) para capturar tráfego gratuito e dar confiança ao comprador; depois usa o Google Ads como acelerador em serviços de maior margem."
  },
  {
    q: "Anunciar no Google ajuda a subir no posicionamento orgânico?",
    a: "Diretamente, pagar Google Ads não compra posição orgânica nem coloca você no Top 3 gratuito do Maps. Porém, anúncios bem-sucedidos aumentam buscas pela sua marca e visitas físicas que, se convertidas em avaliações reais no perfil, fortalecem sua autoridade local."
  },
  {
    q: "Como o Leonardo Brasil ajuda quem já anuncia ou quer anunciar no Google?",
    a: "Antes de você queimar dinheiro em leilão caro, eu audito sua estrutura orgânica no Google Maps e seu funil de conversão no WhatsApp. Assim você para de depender só de anúncios pagos e faz cada clique pago render mais vendas."
  }
];

export default function AnunciarNoGoogle() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/anunciar-no-google#article",
        headline: "Anunciar no Google para Negócios Locais: Como Usar Google Ads Sem Queimar Verba",
        description: "Guia estratégico sobre como anunciar no Google Ads para negócios locais, custos reais de CPC, erros que desperdiçam verba e como combinar tráfego pago com SEO no Google Maps.",
        author: {
          "@type": "Person",
          name: "Leonardo Brasil",
          jobTitle: "Diretor de SEO e Especialista em Estrutura de Vendas no Google",
          url: "https://leonardobrasil.com.br"
        },
        publisher: {
          "@type": "Organization",
          name: "Leonardo Brasil",
          url: "https://leonardobrasil.com.br"
        },
        mainEntityOfPage: "https://leonardobrasil.com.br/anunciar-no-google",
        datePublished: "2026-11-10T16:45:00-03:00",
        dateModified: "2026-11-10T16:45:00-03:00"
      },
      {
        "@type": "HowTo",
        name: "Como preparar um negócio local para anunciar no Google com lucro",
        description: "Passo a passo antes e durante a ativação de campanhas de Google Ads para serviços e negócios locais.",
        step: PASSOS_ANUNCIAR.map((p, idx) => ({
          "@type": "HowToStep",
          position: idx + 1,
          name: p.titulo,
          text: p.desc
        }))
      },
      {
        "@type": "Service",
        name: "Consultoria de Presença no Google, SEO Local e Preparação de Funil para Anúncios",
        provider: {
          "@type": "Organization",
          name: "Leonardo Brasil",
          url: "https://leonardobrasil.com.br"
        },
        areaServed: "BR",
        description: "Estruturação de Perfil da Empresa no Google, SEO Local e páginas de alta conversão no WhatsApp para potencializar resultados orgânicos e pagos."
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
        title="Anunciar no Google: Guia Local Para Lucrar Sem Queimar Verba | Leonardo Brasil"
        description="Quer anunciar no Google? Entenda os custos reais do Google Ads para negócios locais, os 4 ralos que queimam seu orçamento e como unir Google Maps orgânico + anúncios."
        canonicalUrl="https://leonardobrasil.com.br/anunciar-no-google"
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
              Google Ads & Maps
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Avaliar Minha Estrutura no Google
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-16 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
            <span>Aquisição Local • Mídia Paga + Orgânico</span>
            <span className="text-white/40">•</span>
            <span>Estratégia Anti-Desperdício</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Anunciar no Google Sem Perder Dinheiro: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              O Que Fazer Antes de Pagar Cliques
            </span>
          </h1>

          {/* BLUF Box para IAs (GEO / AI Overviews) */}
          <div className="max-w-3xl mx-auto mb-8 p-5 rounded-2xl bg-ink-card/80 border border-accent/25 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
              Resposta Direta: Como funciona anunciar no Google
            </div>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Para <strong className="text-white">anunciar no Google</strong>, você utiliza o <strong className="text-white">Google Ads</strong> pagando por cada clique (CPC) via leilão de palavras-chave e raio geográfico. Porém, empresas locais que ligam anúncios sem antes otimizar o <strong className="text-white">Google Perfil de Empresa</strong> e ter uma página rápida focada em WhatsApp pagam caro e perdem o cliente para concorrentes bem avaliados no orgânico.
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
              Diagnosticar Meu Funil Antes de Anunciar
            </a>
            <a
              href="#ralos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Ver os 4 Erros Que Queimam Verba
              <Arrow className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FORMATOS DE ANÚNCIO */}
      <section className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Como Anunciar no Google para Negócios Locais
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Nem todo formato do Google Ads serve para prestadores de serviço e profissionais liberais. Estes são os 3 que trazem demanda real:
            </p>
          </div>

          <div className="space-y-5">
            {FORMATOS_ANUNCIO.map((item) => (
              <div
                key={item.num}
                className="p-6 sm:p-7 rounded-2xl bg-ink-card border border-line hover:border-accent/35 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/25 text-accent font-bold flex items-center justify-center text-sm">
                      {item.num}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{item.nome}</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-accent/15 text-accent self-start sm:self-center">
                    {item.indicacao}
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABELA COMPARATIVA: SÓ ADS VS FUNIL HÍBRIDO */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Só Google Ads vs. Estrutura Híbrida (Maps Orgânico + Ads)
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Anunciar em cima de uma fundação orgânica fraca encarece cada contato no WhatsApp:
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-ink-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-line bg-ink/60 text-white font-semibold">
                    <th className="p-4">Critério de Retorno</th>
                    <th className="p-4 text-text-muted">Apenas Anunciar no Google Ads</th>
                    <th className="p-4 text-emerald-400">SEO Local / Maps + Google Ads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {COMPARATIVO_ESTRATEGIAS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-ink-card/40 transition-colors">
                      <td className="p-4 font-semibold text-white">{row.criterio}</td>
                      <td className="p-4 text-text-muted">{row.apenasAds}</td>
                      <td className="p-4 text-emerald-400 font-medium">{row.hibrido}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted">
            <span>Ainda não construiu sua base gratuita?</span>
            <Link to="/como-aparecer-no-google-de-graca" className="text-accent font-semibold hover:underline">
              Como aparecer no Google de graça →
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/como-aparecer-no-google-maps" className="text-accent font-semibold hover:underline">
              Como chegar ao Top 3 do Google Maps →
            </Link>
          </div>
        </div>
      </section>

      {/* OS 4 RALOS DE VERBA NO GOOGLE ADS */}
      <section id="ralos" className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Os 4 Ralos Que Queimam Seu Dinheiro ao Anunciar no Google
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Se você já colocou crédito no Google Ads e achou que &ldquo;anunciar no Google não funciona para meu negócio&rdquo;, quase sempre foi um destes 4 erros técnicos:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {RALOS_VERBA.map((item, idx) => (
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
        </div>
      </section>

      {/* PLANO PRÁTICO DE 4 PASSOS */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Checklist de 4 Passos Antes de Investir em Anúncios
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Prepare sua estrutura para converter cliques em orçamentos reais no WhatsApp:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PASSOS_ANUNCIAR.map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-ink-card border border-line">
                <div className="flex items-center gap-2.5 mb-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <h3 className="text-base font-bold text-white">{p.titulo}</h3>
                </div>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{p.desc}</p>
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
              Dúvidas práticas sobre investimento no Google Ads e sinergia com tráfego orgânico.
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
            Não pague por cliques antes de blindar seu Perfil e Funil
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            Solicite uma análise rápida da sua presença atual no Google e descubra onde você já pode captar clientes gratuitamente antes ou junto dos anúncios pagos.
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
