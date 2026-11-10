import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Vi seu guia sobre como aparecer no Google Maps e quero colocar minha empresa no Top 3 da minha região.")}`;

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

const PILARES_MAPS = [
  {
    titulo: "1. Relevância Semântica",
    desc: "A precisão da conexão entre o que o usuário digita e os dados do seu perfil. Nome da empresa, categorias primárias e secundárias, catálogo de serviços e palavras-chave na descrição determinam se você entra na disputa."
  },
  {
    titulo: "2. Distância e Geolocalização",
    desc: "A proximidade física entre a localização do usuário (ou o local especificado na busca) e o seu endereço verificado ou sua Área de Atendimento cadastrada no Perfil da Empresa."
  },
  {
    titulo: "3. Proeminência e Reputação",
    desc: "A força da sua marca na web: quantidade de avaliações 5 estrelas recebidas recentemente, frequência de fotos dos clientes, citações em portais de notícias e menções em diretórios de autoridade."
  }
];

const ETAPAS_OTIMIZACAO = [
  {
    passo: "01",
    titulo: "Definição do Marcador Geográfico Exato",
    desc: "Ajuste milimétrico do pino no mapa para garantir que o GPS dos clientes trace a rota exata até a porta do seu estabelecimento."
  },
  {
    passo: "02",
    titulo: "Fotos Georreferenciadas de Fachada e Interior",
    desc: "Upload de fotos reais com metadados de localização, comprovando ao robô do Google que o negócio tem estrutura física legítima."
  },
  {
    passo: "03",
    titulo: "Horários Especiais e Status Sempre Aberto",
    desc: "Perfis com horários desatualizados ou marcados incorretamente como 'fechados' são ocultados imediatamente das buscas em tempo real."
  },
  {
    passo: "04",
    titulo: "Campanha Contínua de Avaliações com Palavras-chave",
    desc: "Incentivo a avaliações detalhadas onde os clientes mencionam o nome do serviço realizado, alimentando o motor semântico do Maps."
  }
];

const FAQ = [
  {
    q: "Como colocar minha empresa no Google Maps gratuitamente?",
    a: "Para colocar seu negócio no Google Maps sem pagar nada, acesse o Google Perfil de Empresa (business.google.com), faça login com sua conta Google, preencha o nome comercial, endereço ou área de atendimento e complete o processo de verificação por vídeo ou SMS."
  },
  {
    q: "Por que minha empresa sumiu do Google Maps?",
    a: "Geralmente isso ocorre por suspensão cadastral preventiva (quando o Google desconfia de edições bruscas de endereço ou categoria), perfil duplicado, falta de verificação recente ou rebaixamento algorítmico frente a concorrentes mais ativos."
  },
  {
    q: "Quem atende a domicílio pode aparecer no Google Maps?",
    a: "Sim. Você pode se cadastrar como 'Empresa com Área de Atendimento'. Seu endereço residencial fica protegido e oculto para o público, mas o seu perfil aparece no mapa para quem estiver dentro dos bairros e cidades que você atende."
  },
  {
    q: "Como subir para os 3 primeiros lugares no Google Maps?",
    a: "Para entrar no cobiçado Top 3 (Pacote Local), é necessário otimizar a categoria primária, manter consistência de dados externos (NAP), conseguir um fluxo constante de avaliações positivas com respostas ricas em palavras-chave e manter fotos atualizadas da empresa."
  }
];

export default function ComoAparecerNoGoogleMaps() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/como-aparecer-no-google-maps#article",
        headline: "Como Aparecer no Google Maps: Guia Completo de SEO Local e GEO para Estar no Top 3",
        description: "Aprenda como colocar sua empresa no Google Maps gratuitamente, otimizar sinais de entidade para IAs (GEO) e ranquear no Top 3 para gerar ligações e WhatsApp.",
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
        mainEntityOfPage: "https://leonardobrasil.com.br/como-aparecer-no-google-maps",
        datePublished: "2026-02-01T08:00:00-03:00",
        dateModified: "2026-11-10T16:45:00-03:00"
      },
      {
        "@type": "HowTo",
        name: "Como colocar sua empresa no topo do Google Maps",
        description: "Etapas essenciais de otimização para colocar sua empresa no Google Maps e conquistar o Top 3 da sua região.",
        step: ETAPAS_OTIMIZACAO.map((e, idx) => ({
          "@type": "HowToStep",
          position: idx + 1,
          name: e.titulo,
          text: e.desc
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
        title="Como Aparecer no Google Maps: Guia Top 3, SEO Local e IA | Leonardo Brasil"
        description="Descubra como colocar sua empresa no Google Maps gratuitamente, otimizar sinais de entidade para Google AI Overviews (GEO) e ranquear no Top 3 da sua região."
        canonicalUrl="https://leonardobrasil.com.br/como-aparecer-no-google-maps"
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
              Google Maps SEO & GEO
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Quero Minha Empresa no Top 3
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
            <span>Geolocalização & Tráfego Local</span>
            <span className="text-white/40">•</span>
            <span>Google Maps & IA (GEO)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Como Aparecer no Google Maps <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              e Conquistar o Top 3 da Sua Região
            </span>
          </h1>

          {/* BLUF Box para IAs (GEO / AI Overviews) */}
          <div className="max-w-3xl mx-auto mb-8 p-5 rounded-2xl bg-ink-card/80 border border-accent/25 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
              Resposta Direta: Como aparecer e subir no Google Maps
            </div>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Para <strong className="text-white">aparecer no Google Maps</strong>, cadastre e verifique gratuitamente sua empresa no <strong className="text-white">Google Perfil de Empresa</strong>. Para subir ao <strong className="text-white">Top 3 (Local Pack)</strong> e ser recomendado nos resumos de IA do Google, otimize os 3 pilares do algoritmo: categoria primária exata (Relevância), raio geográfico real (Distância) e avaliações frequentes + consistência cadastral NAP (Proeminência).
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
              Auditar Meu Posicionamento no Maps
            </a>
            <a
              href="#algoritmo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Como o Maps Decide o Top 3
              <Arrow className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* OS 3 PILARES DO MAPS */}
      <section id="algoritmo" className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Os 3 Critérios Oficiais de Ranqueamento no Maps
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Documentados pelo próprio Google: são estes 3 fatores que decidem quais perfis aparecem na tela do usuário.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PILARES_MAPS.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-ink-card border border-line hover:border-accent/30 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-xs mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.titulo}</h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ETAPAS PRÁTICAS */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              O Que Faz Sua Empresa Subir no Google Maps?
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Técnicas reais de otimização aplicadas em perfis de alta performance:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ETAPAS_OTIMIZACAO.map((item) => (
              <div
                key={item.passo}
                className="p-6 rounded-2xl bg-ink-card border border-line flex items-start gap-4"
              >
                <span className="w-9 h-9 rounded-xl bg-accent/10 text-accent font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {item.passo}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{item.titulo}</h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-ink-card border border-accent/25">
            <div className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
              Entity Anchoring & Sinais de IA (GEO no Google Maps)
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
              Nos novos resultados com Inteligência Artificial (Google AI Overviews e Gemini), o buscador cruza os dados do seu pino no Maps com o conteúdo do seu site oficial e menções externas. Empresas com horários sempre corretos, respostas em Perguntas e Respostas, aba de serviços preenchida e site bem estruturado são recomendadas diretamente aos usuários da sua cidade.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold">
              <Link to="/segmentos-locais-google-maps" className="text-accent hover:underline">
                Ver os 6 segmentos que mais faturam no Maps →
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/como-colocar-minha-empresa-no-google" className="text-accent hover:underline">
                Cadastrar empresa gratuitamente →
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/como-fazer-meu-site-aparecer-no-google-em-primeiro" className="text-accent hover:underline">
                Alinhar site no 1º lugar orgânico →
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
              Respostas diretas sobre visibilidade e ranqueamento no mapa.
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
            Quer ver sua empresa no Top 3 do Google Maps?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            Eu analiso sua região, identifico os pontos fracos dos seus concorrentes e aplico a otimização completa no seu perfil.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-xl shadow-accent/30"
          >
            <WhatsApp className="w-5 h-5" />
            Solicitar Análise de Google Maps no WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
