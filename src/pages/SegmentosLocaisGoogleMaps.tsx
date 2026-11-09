import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Vi seu guia sobre os 6 Segmentos Locais no Google Maps e quero avaliar o potencial do meu setor na minha cidade.")}`;

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

const PILARES = [
  {
    id: "urgencia",
    numero: "01",
    tag: "Decisão Imediata",
    titulo: "Negócios de Alta Urgência & 24 Horas",
    segmentos: "Chaveiros, Encanadores, Desentupidoras, Oficinas Mecânicas, Reboques (Guinchos), Odontologia Emergencial e Veterinárias 24h.",
    comportamento: "O consumidor não pesquisa sites nem compara preços demoradamente. A pesquisa é por 'chaveiro perto de mim', 'desentupidora 24h' ou 'guincho aberto agora'. Ele liga ou chama no WhatsApp no primeiro resultado do Google Maps com nota alta e botão direto.",
    impactoGeo: "IAs e assistentes de voz recomendam quem tem 'aberto agora' verificado, tempo de resposta baixo e telefone limpo.",
    conversao: "Taxa de conversão de até 60% no primeiro contato. Supera anúncios patrocinados por transmitir proximidade real.",
    nichoLinks: [
      { nome: "Guinchos & Auto Socorro", slug: "guinchos" },
      { nome: "Oficinas Mecânicas", slug: "oficinas-mecanicas" },
      { nome: "Clínicas Veterinárias 24h", slug: "clinicas-veterinarias" },
      { nome: "Eletricistas Emergenciais", slug: "eletricistas" }
    ]
  },
  {
    id: "alimentacao",
    numero: "02",
    tag: "Visual & Prova Social",
    titulo: "Alimentação, Bares e Entretenimento",
    segmentos: "Restaurantes, Pizzarias, Hamburguerias, Bares, Cafeterias, Marmitarias e Docerias.",
    comportamento: "A decisão é 100% orientada a conveniência, fotos atraentes dos pratos e reputação de outros clientes. O usuário busca o perfil no Maps para ver cardápio, horários, ambiente, estacionamento e se aceita reservas ou delivery.",
    impactoGeo: "Google AI Overviews e Gemini extraem nomes exatos de pratos ('melhor parmegiana', 'pizza fermentação natural') diretamente das avaliações e fotos com legenda.",
    conversao: "Venda direta pelo WhatsApp e salão lotado sem pagar 27% de taxas abusivas para plataformas de delivery intermediárias.",
    nichoLinks: [
      { nome: "Restaurantes & Gastronomia", slug: "restaurantes" }
    ]
  },
  {
    id: "saude",
    numero: "03",
    tag: "Confiança & Alto Valor",
    titulo: "Saúde, Estética e Bem-Estar",
    segmentos: "Dentistas, Médicos, Clínicas de Estética, Psicólogos, Fisioterapeutas, Barbearias, Salões de Beleza e Pilates.",
    comportamento: "Nenhum cliente entrega sua saúde ou rosto para um desconhecido sem checar o Google. O paciente analisa o volume de notas 5 estrelas, fotos da clínica, certificações dos profissionais e comentários detalhados de tratamentos.",
    impactoGeo: "Modelos generativos usam compliance ético (CFM, CFO, OAB) e palavras-chave semânticas nas respostas do proprietário para recomendar a clínica como autoridade médica segura.",
    conversao: "Captação de pacientes particulares de alto ticket para procedimentos complexos (implantes, alinhadores, harmonização e consultas particulares).",
    nichoLinks: [
      { nome: "Dentistas & Clínicas", slug: "dentistas" },
      { nome: "Médicos & Consultórios", slug: "medicos" },
      { nome: "Clínicas de Estética", slug: "clinicas-de-estetica" },
      { nome: "Psicólogas", slug: "psicologas" },
      { nome: "Fisioterapeutas", slug: "fisioterapeutas" }
    ]
  },
  {
    id: "servicos",
    numero: "04",
    tag: "Área de Atendimento",
    titulo: "Prestadores de Serviços Locais & Domiciliares",
    segmentos: "Instalação de Ar-Condicionado, Dedetizadoras, Empresas de Limpeza, Pedreiros, Construtoras, Marceneiros e Vidraçarias.",
    comportamento: "Buscas fortemente geolocalizadas por bairro ('manutenção ar condicionado zona norte', 'pedreiro para reforma'). O Google privilegia o Pacote Local 3-Pack para empresas com Áreas de Cobertura (SAB) bem configuradas.",
    impactoGeo: "O Google cruza o endereço ou as zonas de atendimento registradas para gerar respostas para 'empresas que atendem no meu bairro'.",
    conversao: "Pedidos de orçamento formal com tíquete médio expressivo (empreitadas, contratos residenciais e prediais).",
    nichoLinks: [
      { nome: "Pedreiros & Reformas", slug: "pedreiros" },
      { nome: "Eletricistas", slug: "eletricistas" }
    ]
  },
  {
    id: "varejo",
    numero: "05",
    tag: "Onde Comprar Agora",
    titulo: "Varejo Físico de Nicho & Conveniência",
    segmentos: "Pet Shops, Casas Agropecuárias, Farmácias, Materiais de Construção, Autopeças e Floriculturas.",
    comportamento: "Captura a intenção 'onde comprar X perto de mim'. O cliente precisa do produto hoje e não quer esperar dias pelo frete da internet. A aba de produtos do Google Perfil mostra itens em estoque e atrai o cliente para o balcão físico.",
    impactoGeo: "Resumos de IA do Google (AI Overviews) respondem diretamente onde há peças automotivas, rações específicas ou materiais em estoque na cidade.",
    conversao: "Fluxo de caixa imediato na loja física e pedidos recorrentes via WhatsApp comercial.",
    nichoLinks: [
      { nome: "Pet Shops & Banho e Tosa", slug: "pet-shops" },
      { nome: "Lojas Agropecuárias", slug: "agropecuarias" }
    ]
  },
  {
    id: "b2b",
    numero: "06",
    tag: "Contratos de Alto Ticket",
    titulo: "Profissionais Liberais e Negócios B2B Locais",
    segmentos: "Advogados, Contadores, Arquitetos, Imobiliárias, Corretores de Seguros e Consultores.",
    comportamento: "Ciclo de vendas consultivo. A decisão exige validação de reputação e histórico comprovado. Avaliações com depoimentos aprofundados sobre causas resolvidas ou empresas assessoradas aceleram a assinatura de contratos mensais recorrentes.",
    impactoGeo: "As IAs mapeiam a proeminência do escritório por meio de menções em diretórios, consistência de dados externos (NAP) e autoridade de marca.",
    conversao: "Geração de leads corporativos de alto valor (honorários contratuais, BPO financeiro e projetos de arquitetura).",
    nichoLinks: [
      { nome: "Advogados & Bancas", slug: "advogados" },
      { nome: "Contadores & BPO", slug: "contadores" },
      { nome: "Arquitetos", slug: "arquitetos" }
    ]
  }
];

const METRICAS_COMPARATIVAS = [
  {
    pilar: "1. Alta Urgência",
    tempoDecisao: "Menos de 10 minutos",
    intencaoBusca: "Transacional Imediata ('perto de mim / aberto agora')",
    taxaConversao: "45% a 65%",
    canalPrincipal: "Ligação direta / WhatsApp de plantão"
  },
  {
    pilar: "2. Gastronomia",
    tempoDecisao: "15 a 45 minutos",
    intencaoBusca: "Navegacional & Visual ('melhor pizza / cardápio')",
    taxaConversao: "35% a 50%",
    canalPrincipal: "Traçar rota no Maps / Cardápio WhatsApp"
  },
  {
    pilar: "3. Saúde & Estética",
    tempoDecisao: "1 a 7 dias",
    intencaoBusca: "Comercial de Confiança ('especialista / notas 5 estrelas')",
    taxaConversao: "25% a 40%",
    canalPrincipal: "Agendamento online / WhatsApp da recepção"
  },
  {
    pilar: "4. Serviços Domiciliares",
    tempoDecisao: "2 a 24 horas",
    intencaoBusca: "Geográfica Exata ('orçamento em [bairro]')",
    taxaConversao: "30% a 45%",
    canalPrincipal: "Visita técnica / WhatsApp comercial"
  },
  {
    pilar: "5. Varejo de Nicho",
    tempoDecisao: "Imediato a 4 horas",
    intencaoBusca: "Disponibilidade de Estoque ('onde comprar perto de mim')",
    taxaConversao: "40% a 55%",
    canalPrincipal: "Visita ao balcão / Entrega rápida"
  },
  {
    pilar: "6. B2B & Liberais",
    tempoDecisao: "3 a 30 dias",
    intencaoBusca: "Autoridade Consultiva ('escritório renomado / causas')",
    taxaConversao: "15% a 30% (Alto Ticket)",
    canalPrincipal: "Reunião de diagnóstico / Proposta formal"
  }
];

const FAQ = [
  {
    q: "Por que o Google Maps converte mais do que anúncios tradicionais nesses setores?",
    a: "Porque no Google Maps o usuário está no ZMOT (Zero Moment of Truth - Momento Zero da Verdade). Ele não está navegando passivamente como em redes sociais; ele já tem uma necessidade ativa, quer resolver hoje e procura quem está geograficamente próximo e tem as melhores avaliações."
  },
  {
    q: "Como os resumos de IA do Google (Google AI Overviews) afetam meu negócio local?",
    a: "As IAs utilizam as informações do Google Meu Negócio (horários, respostas com palavras-chave, categorias e dados estruturados Schema.org) para responder diretamente à dúvida do usuário e indicar os 3 negócios com maior relevância e nota média da região."
  },
  {
    q: "O que é o Pacote Local 3-Pack e qual a sua importância?",
    a: "O 3-Pack é o bloco em destaque com o mapa e as 3 melhores empresas que o Google exibe no topo absoluto da página de busca antes de qualquer resultado de site comum. Mais de 75% dos cliques de compra concentram-se exclusivamente dentro desses 3 primeiros perfis."
  },
  {
    q: "Serve tanto para quem tem loja com fachada quanto para quem atende em domicílio?",
    a: "Sim. O Google permite cadastros físicos (com endereço e fachada aberta ao público) e cadastros de 'Área de Atendimento' (SAB), onde o endereço do prestador fica protegido e ele define os bairros ou cidades onde executa os serviços."
  },
  {
    q: "Como o método do Leonardo Brasil posiciona minha empresa na frente dos concorrentes?",
    a: "Eu aplico os 6 Pilares de SEO Local Avançado: consistência de dados externos (NAP), definição cirúrgica de categorias primárias e secundárias, copywriting geolocalizado de 750 caracteres, estruturação de catálogo, fotos com geolocalização e automação de avaliações 5 estrelas com palavras-chave estratégicas."
  }
];

export default function SegmentosLocaisGoogleMaps() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://leonardobrasil.com.br/segmentos-locais-google-maps#article",
        headline: "Os 6 Pilares de Negócios Locais Mais Lucrativos no Google Maps e SEO Local",
        description: "Guia estratégico para posicionar negócios de alta urgência, gastronomia, saúde, serviços, varejo e B2B no topo do Google Maps e nas respostas de IA (GEO).",
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
        mainEntityOfPage: "https://leonardobrasil.com.br/segmentos-locais-google-maps",
        datePublished: "2026-02-09T08:00:00-03:00",
        dateModified: "2026-11-09T18:00:00-03:00"
      },
      {
        "@type": "ItemList",
        name: "Os 6 Grandes Segmentos de Negócios Locais no Google Maps",
        itemListElement: PILARES.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: p.titulo,
          description: p.comportamento
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
        title="Os 6 Segmentos de Negócios Mais Lucrativos no Google Maps | Leonardo Brasil"
        description="Descubra por que negócios de urgência, gastronomia, saúde, serviços e B2B dominam o tráfego do Google Maps. Análise de SEO Local, GEO e conversão no WhatsApp."
        canonicalUrl="https://leonardobrasil.com.br/segmentos-locais-google-maps"
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
              Diretoria de SEO & GEO
            </span>
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            Auditar Meu Segmento no Maps
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-line bg-gradient-to-b from-ink via-ink-card/30 to-ink">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
            <span>Inteligência de Mercado Local</span>
            <span className="text-white/40">•</span>
            <span>Google Maps + GEO (IA Search)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Os 6 Segmentos que Mais Lucram <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
              no Top 3 do Google Maps
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Entenda como a psicologia de busca do consumidor, o Momento Zero da Verdade (ZMOT) e as novas IAs de busca transformaram o Perfil da Empresa no maior motor de faturamento para negócios locais.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-light transition-all shadow-lg shadow-accent/25"
            >
              <WhatsApp className="w-4 h-4" />
              Auditoria de Concorrência do Meu Setor
            </a>
            <a
              href="#pilares"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-text-muted hover:text-white bg-ink-card border border-line hover:border-accent/40 transition-all"
            >
              Explorar os 6 Segmentos
              <Arrow className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-accent font-bold text-lg mb-0.5">75%+ dos Cliques</div>
              <div className="text-xs text-text-muted">Concentrados no Local 3-Pack do Mapa</div>
            </div>
            <div className="p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-accent font-bold text-lg mb-0.5">ZMOT Ativo</div>
              <div className="text-xs text-text-muted">Cliente decide no instante da pesquisa</div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-ink-card/60 border border-line">
              <div className="text-emerald-400 font-bold text-lg mb-0.5">Alimentação de IAs</div>
              <div className="text-xs text-text-muted">Resumos e recomendações via GEO</div>
            </div>
          </div>
        </div>
      </section>

      {/* OS 6 PILARES EM DETALHES */}
      <section id="pilares" className="py-20 border-b border-line">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              A Taxonomia dos 6 Segmentos no Google Maps
            </h2>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Cada setor opera com um gatilho de compra diferente. Veja a mecânica de SEO Local, a influência dos motores de inteligência artificial (GEO) e a taxa de conversão esperada:
            </p>
          </div>

          <div className="space-y-8">
            {PILARES.map((p) => (
              <div
                key={p.id}
                className="p-6 sm:p-8 rounded-3xl bg-ink-card border border-line hover:border-accent/40 transition-all relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 text-accent font-bold flex items-center justify-center text-sm">
                      {p.numero}
                    </span>
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent">
                        {p.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">{p.titulo}</h3>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-ink/60 border border-line/80 mb-5 text-xs sm:text-sm text-text-muted">
                  <strong className="text-white">Segmentos Abrangidos:</strong> {p.segmentos}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-ink/40 border border-line">
                    <div className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent"></span>
                      Psicologia de Busca
                    </div>
                    <p className="text-text-muted leading-relaxed">{p.comportamento}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-ink/40 border border-line">
                    <div className="font-semibold text-accent mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent-light"></span>
                      Impacto em IA (GEO)
                    </div>
                    <p className="text-text-muted leading-relaxed">{p.impactoGeo}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-ink/40 border border-line">
                    <div className="font-semibold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Mecânica de Conversão
                    </div>
                    <p className="text-text-muted leading-relaxed">{p.conversao}</p>
                  </div>
                </div>

                {p.nichoLinks.length > 0 && (
                  <div className="pt-4 border-t border-line/60 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-text-muted mr-1">Páginas dedicadas no site:</span>
                    {p.nichoLinks.map((nl) => (
                      <Link
                        key={nl.slug}
                        to={`/google-meu-negocio/${nl.slug}`}
                        className="text-xs px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all font-medium"
                      >
                        {nl.nome} →
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABELA COMPARATIVA DE MÉTRICAS */}
      <section className="py-20 border-b border-line bg-ink-card/20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Comparativo de Desempenho por Segmento
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Veja as diferenças de ciclo de decisão, intenção de busca e canal de fechamento direto:
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-ink-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-line bg-ink/60 text-white font-semibold">
                    <th className="p-4">Segmento</th>
                    <th className="p-4">Tempo de Decisão</th>
                    <th className="p-4">Intenção de Busca</th>
                    <th className="p-4 text-emerald-400">Conversão Média</th>
                    <th className="p-4">Canal Primário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {METRICAS_COMPARATIVAS.map((m, idx) => (
                    <tr key={idx} className="hover:bg-ink-card/40 transition-colors">
                      <td className="p-4 font-semibold text-white whitespace-nowrap">{m.pilar}</td>
                      <td className="p-4 text-text-muted">{m.tempoDecisao}</td>
                      <td className="p-4 text-text-muted">{m.intencaoBusca}</td>
                      <td className="p-4 font-bold text-emerald-400">{m.taxaConversao}</td>
                      <td className="p-4 text-text-muted">{m.canalPrincipal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE VALE O INVESTIMENTO */}
      <section className="py-20 border-b border-line">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Por que a Otimização Justifica Todo o Esforço?
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Três verdades inegáveis que tornam o Google Maps o canal de maior retorno para empresas locais:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-ink-card border border-line">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">O 3-Pack Leva Tudo</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Mais de 75% dos cliques de quem pesquisa no celular vão direto para as 3 primeiras empresas exibidas no mapa. Quem está na 4ª posição já fica invisível.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ink-card border border-line">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Momento Zero (ZMOT)</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                O cliente que busca no Google Maps já tem a dor e o dinheiro na mão. Ele não precisa ser convencido a comprar: ele só está escolhendo a melhor opção.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ink-card border border-line">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Citação em IAs (GEO)</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Google AI Overviews e ChatGPT Search não inventam empresas do nada: eles recomendam os perfis com dados mais ricos, consistentes e bem avaliados da região.
              </p>
            </div>
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
              Dúvidas técnicas e comerciais sobre SEO Local e GEO por segmento.
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
            Quer colocar o seu negócio no Top 3 do seu segmento?
          </h2>
          <p className="text-sm sm:text-base text-text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            Seja um serviço de emergência 24h, uma clínica ou um escritório de alto ticket: o seu concorrente já está disputando essa posição. Descubra como dominar o mapa da sua cidade.
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
