import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Vi seu conteúdo de como ficar na primeira página do Google e quero analisar o posicionamento da minha empresa.")}`;

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

const FATORES_RANQUEAMENTO = [
  {
    num: "01",
    titulo: "Consistência NAP e Blindagem",
    desc: "O algoritmo cruza Nome, Endereço e Telefone (NAP) em dezenas de diretórios oficiais. Se houver divergências, o Google rebaixa o perfil por falta de confiabilidade."
  },
  {
    num: "02",
    titulo: "Arquitetura de Categorias Estratégicas",
    desc: "A categoria primária define para quais leilões e intenções você compete. Categorias secundárias bem mapeadas capturam termos com intenção de compra imediata."
  },
  {
    num: "03",
    titulo: "Motor de Avaliações 5 Estrelas & Respostas",
    desc: "Volume, velocidade e palavras-chave dentro dos comentários dos clientes e das respostas do proprietário são o sinal social mais pesado para o Top 3."
  },
  {
    num: "04",
    titulo: "Sinais de Engajamento Real dos Usuários",
    desc: "Cliques para rota, ligações iniciadas, tempo de permanência nas fotos e salvamento de favoritos no Google Maps indicam ao algoritmo que sua empresa é a melhor escolha."
  }
];

const COMPARATIVO_ADS_VS_ORGANICO = [
  {
    criterio: "Custo por Clique",
    ads: "R$ 3,00 a R$ 45,00 por clique (saiu do ar se o saldo zerar)",
    organico: "R$ 0,00 por clique (ativo perpétuo do seu CNPJ)"
  },
  {
    criterio: "Taxa de Confiança do Consumidor",
    ads: "20% a 30% dos usuários clicam em links patrocinados",
    organico: "70% a 80% preferem o bloco do mapa e resultados orgânicos"
  },
  {
    criterio: "Duração dos Resultados",
    ads: "Acaba no minuto em que você pausa os anúncios",
    organico: "Permanece posicionado gerando clientes continuamente"
  },
  {
    criterio: "Conversão Direta no WhatsApp",
    ads: "Depende de uma landing page rápida e sem atritos",
    organico: "O cliente clica direto em 'Ligar' ou 'WhatsApp' no mapa"
  }
];

const FAQ = [
  {
    q: "Alguém pode me dar 100% de garantia de 1º lugar no Google?",
    a: "Não. O próprio Google afirma categoricamente em suas diretrizes oficiais que ninguém pode garantir a primeira posição absoluta, pois o algoritmo considera a distância física do usuário e múltiplos fatores dinâmicos. Fuja de promessas mágicas: o que fazemos é aplicar o método técnico comprovado para posicionar sua empresa no bloco de elite (Top 3 do Google Maps)."
  },
  {
    q: "Quanto tempo demora para uma empresa chegar à primeira página?",
    a: "Negócios locais com perfis otimizados costumam notar escalada expressiva no ranqueamento entre 3 a 8 semanas após a aplicação das correções técnicas de relevância, categorias e consistência NAP."
  },
  {
    q: "Preciso ter um site para ficar na primeira página do Google?",
    a: "Para o Google Maps (bloco local), você não é obrigado a ter um site complexo, embora um site institucional rápido e bem estruturado aumente drasticamente a autoridade do seu perfil e ajude a capturar buscas adicionais na pesquisa tradicional."
  },
  {
    q: "O que é o Pacote Local 3-Pack do Google?",
    a: "É o bloco com mapa e 3 empresas em destaque que o Google exibe no topo absoluto da tela sempre que alguém busca por um serviço na cidade (ex: 'dentista perto de mim', 'advogado tributário em Porto Alegre'). O Top 3 concentra mais de 75% de todas as ações de compra."
  },
  {
    q: "Como o Leonardo Brasil ajuda minha empresa a subir para o topo?",
    a: "Eu analiso sua concorrência local raio a raio, identifico as brechas que eles deixaram abertas e aplico a otimização cirúrgica dos 6 Pilares de Presença Digital, além de blindar seu cadastro contra suspensões."
  }
];

export default function ComoFicarNaPrimeiraPaginaGoogle() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/como-ficar-na-primeira-pagina-do-google#article",
        headline: "Como Ficar na Primeira Página do Google: O Guia Real para Negócios Locais",
        description: "Descubra como colocar sua empresa na primeira página do Google e dominar o Top 3 do Google Maps sem depender de promessas falsas de agências.",
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
        mainEntityOfPage: "https://leonardobrasil.com.br/como-ficar-na-primeira-pagina-do-google",
        datePublished: "2026-01-20T08:00:00-03:00",
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
        title="Como Ficar na Primeira Página do Google: Guia Real | Leonardo Brasil"
        description="Aprenda como colocar sua empresa na primeira página do Google e no Top 3 do Google Maps. Fatores reais de ranqueamento e estratégias para atrair clientes locais."
        canonicalUrl="https://leonardobrasil.com.br/como-ficar-na-primeira-pagina-do-google"
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
              Estratégia de SEO Local
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Analisar Meu Posicionamento
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
            <span>Ranqueamento Orgânico • Top 3 Google Maps</span>
            <span className="text-white/40">•</span>
            <span>Sem Fórmulas Mágicas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Como Ficar na Primeira Página do Google <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              e Dominar a Sua Região
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Estar na primeira página não é sorte: é engenharia de dados. Entenda como o algoritmo do Google decide quem fica no Top 3 do Google Maps e como posicionar seu negócio na frente dos concorrentes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-lg shadow-accent/25"
            >
              <WhatsApp className="w-4 h-4" />
              Diagnóstico de Posicionamento Local
            </a>
            <a
              href="#fatores"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Ver os 4 Fatores de Ranqueamento
              <Arrow className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-accent font-bold text-lg mb-0.5">Top 3 do Maps</div>
              <div className="text-xs text-text-muted">Mais de 75% dos cliques de compra</div>
            </div>
            <div className="p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-accent font-bold text-lg mb-0.5">Tráfego Perpétuo</div>
              <div className="text-xs text-text-muted">Clientes sem depender só de anúncios</div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-emerald-400 font-bold text-lg mb-0.5">Alta Intenção</div>
              <div className="text-xs text-text-muted">Pessoas prontas para contratar hoje</div>
            </div>
          </div>
        </div>
      </section>

      {/* FATORES DE RANQUEAMENTO */}
      <section id="fatores" className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Os 4 Pilares Reais para Chegar à Primeira Página
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              O Google usa centenas de sinais matemáticos. Estes são os 4 blocos de maior peso para negócios físicos e prestadores de serviço locais:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FATORES_RANQUEAMENTO.map((fator) => (
              <div
                key={fator.num}
                className="p-6 rounded-2xl bg-ink-card border border-line hover:border-accent/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm mb-4">
                  {fator.num}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{fator.titulo}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{fator.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVO ADS VS ORGÂNICO */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Google Ads vs. Primeira Página Orgânica
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Investir em anúncios pagos ou construir autoridade orgânica no Google Maps? Veja a comparação transparente:
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-ink-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-ink/50 text-white">
                    <th className="p-4 font-semibold">Critério</th>
                    <th className="p-4 font-semibold text-text-muted">Google Ads (Patrocinado)</th>
                    <th className="p-4 font-semibold text-accent">Google Maps (Orgânico)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {COMPARATIVO_ADS_VS_ORGANICO.map((row, idx) => (
                    <tr key={idx} className="hover:bg-ink-card/40 transition-colors">
                      <td className="p-4 font-medium text-white">{row.criterio}</td>
                      <td className="p-4 text-text-muted text-xs sm:text-sm">{row.ads}</td>
                      <td className="p-4 text-emerald-400 font-medium text-xs sm:text-sm">{row.organico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              Dúvidas essenciais sobre posicionamento e primeira página do Google.
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
            Descubra o que falta para sua empresa estar no topo
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            Faça um diagnóstico completo do seu posicionamento local com quem entende os algoritmos de busca e conversão.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-xl shadow-accent/30"
          >
            <WhatsApp className="w-5 h-5" />
            Analisar Meu Posicionamento no WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
