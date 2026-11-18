import { useEffect, useState } from "react";
import { Link, useLocation } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import locationsData from "../data/seoLocations.json";

const WHATSAPP_NUMBER = "5551996737359";

interface GoogleAdsVariantConfig {
  canonicalPath: string;
  title: string;
  description: string;
  keywords: string;
  badge: string;
  h1: string;
  h1Highlight: string;
  subheadline: string;
  ctaLabel: string;
  waMessage: string;
  serviceName: string;
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillars: { num: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const VARIANTS: Record<string, GoogleAdsVariantConfig> = {
  "/google-ads": {
    canonicalPath: "/google-ads",
    title: "Gestão de Google Ads para Negócios Locais e WhatsApp | Leonardo Brasil",
    description:
      "Serviço especializado de gestão de Google Ads para clínicas, escritórios e prestadores de serviços locais. Campanhas na Rede de Pesquisa e Google Maps focadas em leads reais no WhatsApp.",
    keywords:
      "gestão de google ads, gestão de tráfego google ads, google ads para negócios locais, anúncios no google ads, contratar gestão google ads",
    badge: "Google Ads · Aquisição Previsível no WhatsApp",
    h1: "Gestão de Google Ads focada em ",
    h1Highlight: "clientes prontos para fechar no WhatsApp",
    subheadline:
      "Estruturo e gerencio suas campanhas na Rede de Pesquisa e no Google Maps com foco obsessivo em intenção de compra, palavras-chave negativas e rastreamento real de conversões — para cada real investido voltar em faturamento.",
    ctaLabel: "Solicitar Diagnóstico de Google Ads no WhatsApp",
    waMessage:
      "Olá, Leonardo! Quero contratar a gestão profissional de Google Ads para atrair mais clientes qualificados no WhatsApp.",
    serviceName: "Gestão de Google Ads para Negócios Locais",
    pillarsTitle: "Como funciona a Gestão de Google Ads na prática",
    pillarsSubtitle:
      "Sem métricas de vaidade. O foco é controlar o Custo por Lead (CPL), eliminar cliques de curiosos e encher seu comercial de demandas reais.",
    pillars: [
      {
        num: "01",
        title: "Pesquisa de Palavras-Chave Fundo de Funil",
        desc: "Mapeamento dos termos exatos que seu cliente digita quando já decidiu contratar (serviço + bairro/cidade + urgência), separando campanhas por margem de lucro.",
      },
      {
        num: "02",
        title: "Blindagem com Palavras-Chave Negativas",
        desc: "Lista inicial robusta e auditoria semanal de termos de pesquisa para impedir que sua verba seja drenada por curiosos, vagas de emprego, cursos ou serviços gratuitos.",
      },
      {
        num: "03",
        title: "Integração Google Ads + Google Meu Negócio",
        desc: "Vinculação oficial da conta ao Perfil da Empresa para ativar Extensão de Local e exibir sua empresa também nos espaços patrocinados dentro do Google Maps.",
      },
      {
        num: "04",
        title: "Segmentação Geográfica Cirúrgica",
        desc: "Configuração restrita a 'Presença' no raio exato onde sua empresa realmente atende, bloqueando cliques desperdiçados de outras cidades e estados.",
      },
      {
        num: "05",
        title: "Rastreamento Real de Conversões (GA4 + WhatsApp)",
        desc: "Implementação de eventos de conversão de cliques no WhatsApp, ligações e formulários para o algoritmo aprender a trazer quem realmente compra.",
      },
      {
        num: "06",
        title: "Otimização Semanal e Relatório Executivo",
        desc: "Ajuste contínuo de lances, anúncios, horários de pico e relatório transparente de investimento, cliques qualificados e custo por contato.",
      },
    ],
    faqs: [
      {
        q: "Quanto preciso investir em verba de mídia no Google Ads para começar?",
        a: "O orçamento de mídia (pago direto ao Google) depende do custo por clique do seu segmento e cidade. Para negócios locais, normalmente recomendamos começar entre R$ 600 e R$ 2.500/mês em mídia para gerar volume estatístico e contatos diários consistentes.",
      },
      {
        q: "A conta do Google Ads fica no meu nome e CNPJ?",
        a: "Sim, 100%. Você tem propriedade integral da conta, do histórico de dados e faz o pagamento da mídia diretamente ao Google (boleto, Pix ou cartão), sem nenhum ágio oculto.",
      },
      {
        q: "Quanto tempo leva para o Google Ads começar a gerar contatos no WhatsApp?",
        a: "Diferente do SEO orgânico, o Google Ads começa a exibir seus anúncios e gerar cliques/contatos nos primeiros dias após a publicação. As primeiras 4 semanas servem para refinar termos de pesquisa e derrubar o custo por lead.",
      },
      {
        q: "Preciso ter um site antes de contratar a gestão de Google Ads?",
        a: "Ter uma landing page rápida e focada em conversão multiplica drasticamente o resultado. Se você ainda não tem ou se seu site atual é lento, avaliamos no diagnóstico a melhor estrutura de destino (landing page dedicada + Perfil do Google Maps).",
      },
    ],
  },
  "/gestor-google-ads": {
    canonicalPath: "/gestor-google-ads",
    title: "Gestor de Tráfego Google Ads Especialista Sênior | Leonardo Brasil",
    description:
      "Contrate um gestor de Google Ads sênior especializado em negócios locais, clínicas, escritórios e prestadores de serviços. Atendimento direto, sem intermediários e foco em ROI.",
    keywords:
      "gestor de google ads, gestor de tráfego google ads, contratar gestor google ads, freelancer google ads sênior, especialista tráfego pago google",
    badge: "Gestor de Google Ads · Atendimento Sênior Direto",
    h1: "Contrate um Gestor de Google Ads ",
    h1Highlight: "que olha sua conta toda semana — e não só no dia do boleto",
    subheadline:
      "Chega de contratar agência grande onde um vendedor fecha o contrato e um estagiário esquece sua campanha no piloto automático. Como gestor de tráfego focado em Google Ads e SEO Local, cuido pessoalmente da sua verba.",
    ctaLabel: "Falar Direto com o Gestor de Google Ads",
    waMessage:
      "Olá, Leonardo! Estou procurando um gestor de Google Ads dedicado para assumir ou iniciar as campanhas da minha empresa.",
    serviceName: "Gestor de Tráfego Google Ads Sênior",
    pillarsTitle: "O que você ganha contratando um Gestor Sênior de Google Ads",
    pillarsSubtitle:
      "Operação enxuta, comunicação direta pelo WhatsApp e engenharia de campanha desenhada para lucratividade local.",
    pillars: [
      {
        num: "01",
        title: "Atendimento Direto com Quem Executa",
        desc: "Você fala diretamente com o especialista responsável pelas decisões técnicas, sem telefone sem fio ou gerentes de conta que não entendem sua campanha.",
      },
      {
        num: "02",
        title: "Rotina Real de Negativação e Limpeza de Leilão",
        desc: "Análise recorrente do relatório de termos de pesquisa para cortar desperdícios centavo por centavo antes que drenem seu orçamento mensal.",
      },
      {
        num: "03",
        title: "Anúncios Escritos por Copywriter de Conversão",
        desc: "Títulos, descrições, sitelinks e frases de destaque construídos para atrair clientes qualificados e filtrar curiosos já antes do clique.",
      },
      {
        num: "04",
        title: "Visão Integrada de Funil (Anúncio → Página → WhatsApp)",
        desc: "Não basta gerar cliques: avaliamos sua landing page, sua nota no Google Maps e a velocidade de resposta do seu atendimento no WhatsApp.",
      },
      {
        num: "05",
        title: "Respeito às Normas de Saúde e Direito (CFM / OAB / CFO)",
        desc: "Experiência prática com contas de médicos, dentistas, psicólogos e advogados para anunciar com alta performance e zero risco ético.",
      },
      {
        num: "06",
        title: "Transparência Total de Investimento e Retorno",
        desc: "Você acompanha exatamente quanto pagou ao Google, quantas conversões foram geradas e quais campanhas estão trazendo os melhores clientes.",
      },
    ],
    faqs: [
      {
        q: "Qual a diferença entre contratar um Gestor de Google Ads independente e uma agência tradicional?",
        a: "Na agência tradicional, um único analista júnior costuma cuidar de 40 a 80 contas ao mesmo tempo. Com um gestor sênior dedicado, sua conta recebe atenção cirúrgica, comunicação direta e decisões rápidas alinhadas ao seu caixa.",
      },
      {
        q: "Você assume contas de Google Ads que já estão rodando com outra pessoa?",
        a: "Sim. Faço primeiro uma auditoria completa da conta existente para preservar o histórico de conversões úteis, cortar os ralos de verba e reestruturar as campanhas sem precisar jogar fora o aprendizado positivo.",
      },
      {
        q: "Você também faz gestão de Meta Ads ou o foco é Google?",
        a: "Meu foco principal é o ecossistema Google (Google Ads + Google Meu Negócio + SEO Local + Landing Pages de Conversão), pois é onde o consumidor já está com intenção ativa de comprar ou contratar hoje.",
      },
    ],
  },
  "/consultor-google-ads": {
    canonicalPath: "/consultor-google-ads",
    title: "Consultor de Google Ads: Auditoria, Reestruturação e Acompanhamento | Leonardo Brasil",
    description:
      "Consultoria especializada em Google Ads para destravar campanhas que não dão retorno, reduzir CPC, estruturar rastreamento de conversões e escalar leads no WhatsApp.",
    keywords:
      "consultor google ads, consultoria google ads, consultoria de tráfego pago google, especialista consultoria google ads, destravar conta google ads",
    badge: "Consultoria Técnica de Google Ads · Diagnóstico & Plano de Ação",
    h1: "Consultor de Google Ads para ",
    h1Highlight: "parar de queimar verba e destravar seu ROI",
    subheadline:
      "Já investe no Google Ads mas sente que os cliques estão caros e os leads chegam desqualificados? Na consultoria técnica, abrimos sua conta juntos, identificamos os ralos de orçamento e reestruturamos sua operação.",
    ctaLabel: "Agendar Consultoria de Google Ads",
    waMessage:
      "Olá, Leonardo! Já anuncio (ou vou anunciar) no Google Ads e quero contratar sua consultoria técnica para melhorar meus resultados.",
    serviceName: "Consultoria Especializada em Google Ads",
    pillarsTitle: "Formatos da Consultoria de Google Ads",
    pillarsSubtitle:
      "Ideal tanto para empresários que gerenciam a própria conta quanto para equipes internas que precisam de direção sênior.",
    pillars: [
      {
        num: "01",
        title: "Raio-X de Desperdício na Conta Atual",
        desc: "Auditoria de termos de pesquisa, correspondências abertas, redes de parceiros/display ocultas e erros de segmentação geográfica.",
      },
      {
        num: "02",
        title: "Reestruturação Completa de Campanhas",
        desc: "Separação limpa por intenção comercial e serviço, com novas listas de negativas, extensões e anúncios de alta relevância.",
      },
      {
        num: "03",
        title: "Correção de Rastreamento (Tag / GA4 / Conversões)",
        desc: "Garantia de que o Google Ads esteja medindo conversões reais (contatos e agendamentos) em vez de otimizar para cliques vazios.",
      },
      {
        num: "04",
        title: "Revisão da Página de Destino & Perfil no Maps",
        desc: "Ajustes de copy, velocidade mobile e prova social no Google Meu Negócio que elevam o Índice de Qualidade e reduzem o CPC.",
      },
      {
        num: "05",
        title: "Plano de Escala de 90 Dias",
        desc: "Roteiro claro de quando aumentar verba, quando mudar estratégia de lances e quais novas palavras-chave atacar com segurança.",
      },
      {
        num: "06",
        title: "Sessões de Revisão com Sua Equipe",
        desc: "Opção de reuniões quinzenais ou mensais para validar métricas junto ao seu marketing interno ou gestor atual.",
      },
    ],
    faqs: [
      {
        q: "Posso contratar apenas a consultoria pontual sem fechar gestão mensal?",
        a: "Sim! A consultoria técnica pode ser contratada de forma pontual (auditoria + plano de ação + reestruturação) ou em formato de acompanhamento estratégico para sua equipe interna.",
      },
      {
        q: "A consultoria resolve problemas de leads curiosos perguntando só preço?",
        a: "Na maioria dos casos, leads desqualificados vêm de palavras-chave amplas demais, falta de negativas e anúncios que não filtram o perfil do cliente ideal. Corrigimos exatamente esses três pontos na consultoria.",
      },
      {
        q: "Como funciona a primeira conversa antes de contratar?",
        a: "Você me chama no WhatsApp, conta rapidamente seu segmento, cidade e cenário atual. Eu avalio se faz sentido avançarmos com auditoria pontual, consultoria ou gestão recorrente.",
      },
    ],
  },
  "/agencia-google-ads-negocios-locais": {
    canonicalPath: "/agencia-google-ads-negocios-locais",
    title: "Agência ou Especialista em Google Ads para Negócios Locais? | Leonardo Brasil",
    description:
      "Procurando agência de Google Ads para negócios locais? Conheça o modelo de consultoria boutique com atenção sênior, integração Google Maps e foco em leads reais no WhatsApp.",
    keywords:
      "agência google ads, agência de google ads para negócios locais, empresa de gestão google ads, agência tráfego pago google maps, melhor agência google ads local",
    badge: "Boutique Especializada · Google Ads + SEO Local",
    h1: "Procurando uma Agência de Google Ads para ",
    h1Highlight: "Negócios Locais que entregue clientes de verdade?",
    subheadline:
      "Antes de assinar contrato anual com uma agência generalista que mistura sua conta com dezenas de e-commerces, conheça uma operação 100% especializada em negócios locais, profissionais liberais e funis de WhatsApp.",
    ctaLabel: "Conversar Sobre Meu Projeto Local",
    waMessage:
      "Olá, Leonardo! Estava pesquisando uma agência de Google Ads para meu negócio local e quero conhecer como funciona sua gestão especializada.",
    serviceName: "Gestão Boutique de Google Ads para Negócios Locais",
    pillarsTitle: "Por que negócios locais trocam agências genéricas pela nossa estrutura",
    pillarsSubtitle:
      "Vender para clientes na sua cidade tem regras totalmente diferentes de vender infoproduto ou loja virtual nacional.",
    pillars: [
      {
        num: "01",
        title: "Especialização 100% em Negócios Locais",
        desc: "Dominamos a dinâmica de raio geográfico, horários comerciais, ligações, rotas no GPS e fechamento via WhatsApp em 27+ segmentos locais.",
      },
      {
        num: "02",
        title: "Integração Nativa com Google Meu Negócio",
        desc: "A maioria das agências ignora o Google Maps. Nós otimizamos sua ficha orgânica e a conectamos ao Google Ads para dobrar sua presença na 1ª tela.",
      },
      {
        num: "03",
        title: "Sem Multas Abusivas ou Conta Refém",
        desc: "A conta de anúncios, o pixel, o GA4 e todos os dados permanecem 100% no seu nome desde o primeiro dia.",
      },
      {
        num: "04",
        title: "Execução Sênior (Sem Terceirização Oculta)",
        desc: "Estratégia, copy dos anúncios, negativação e otimização feitas com critério de diretor de performance e SEO.",
      },
      {
        num: "05",
        title: "Foco em Custo por Agendamento / Orçamento",
        desc: "Relatórios sem jargão confuso: você vê claramente investimento, leads gerados no WhatsApp e evolução do custo por oportunidade.",
      },
      {
        num: "06",
        title: "Velocidade de Ajuste no Dia a Dia",
        desc: "Precisa pausar um serviço, promover outro ou ajustar horários de atendimento? A comunicação direta permite ajustes rápidos.",
      },
    ],
    faqs: [
      {
        q: "Vocês atendem empresas de qualquer cidade do Brasil?",
        a: "Sim. Atendemos clínicas, escritórios, prestadores de serviços e empresas locais em todas as capitais e cidades do interior do Brasil.",
      },
      {
        q: "Por que integrar Google Ads com Google Meu Negócio supera contratar uma agência só de tráfego?",
        a: "Porque o consumidor local quase sempre checa sua nota e avaliações no Google Maps antes de chamar no WhatsApp. Integrar os dois canais eleva a taxa de conversão dos anúncios e constrói um canal orgânico gratuito em paralelo.",
      },
    ],
  },
};

export default function GoogleAdsLanding() {
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const cleanPath = location.pathname.replace(/\/+$/, "") || "/google-ads";
  const config = VARIANTS[cleanPath] || VARIANTS["/google-ads"];

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpenFaq(0);
  }, [cleanPath]);

  const niches = locationsData.NICHES;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(config.waMessage)}`;
  const canonicalUrl = `https://leobrasil.com.br${config.canonicalPath}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: config.serviceName,
      description: config.description,
      url: canonicalUrl,
      provider: {
        "@type": "Organization",
        "@id": "https://leobrasil.com.br/#organization",
        name: "Leonardo Brasil",
      },
      areaServed: { "@type": "Country", name: "Brasil" },
      serviceType: "Gestão e Consultoria de Google Ads",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://leobrasil.com.br" },
        { "@type": "ListItem", position: 2, name: config.serviceName, item: canonicalUrl },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ink text-text font-sans selection:bg-accent selection:text-white">
      <SeoHead
        title={config.title}
        description={config.description}
        keywords={config.keywords}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-text hover:text-accent transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
            Leonardo Brasil
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-muted">
            <Link to="/google-ads" className="hover:text-text transition-colors">Gestão Ads</Link>
            <Link to="/auditoria-google-ads" className="text-gold hover:text-gold-300 transition-colors">Auditoria Ads</Link>
            <Link to="/google-ads-e-google-meu-negocio" className="hover:text-text transition-colors">Ads + Maps</Link>
            <Link to="/google-meu-negocio" className="hover:text-text transition-colors">Google Meu Negócio</Link>
            <Link to="/auditoria-perfil-google" className="hover:text-text transition-colors">Raio-X Maps</Link>
          </nav>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-600 transition-all shadow-lg shadow-accent/20"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-line py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-ink to-ink -z-10" />
          <div className="mx-auto max-w-4xl px-5 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-300 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/30 mb-6">
              {config.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-balance">
              {config.h1}
              <span className="text-accent-400">{config.h1Highlight}</span>
            </h1>
            <p className="mt-6 text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              {config.subheadline}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white font-black text-base px-8 py-4 rounded-full hover:bg-accent-600 transition-all shadow-xl shadow-accent/25 hover:scale-[1.02]"
              >
                {config.ctaLabel} →
              </a>
              <Link
                to="/auditoria-google-ads"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-7 py-4 text-sm sm:text-base font-bold text-gold hover:bg-gold/20 transition-colors"
              >
                Fazer Auditoria da Minha Conta Ads
              </Link>
            </div>
          </div>
        </section>

        {/* PILARES */}
        <section className="py-20 border-b border-line bg-ink">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Método de Performance Local</span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">{config.pillarsTitle}</h2>
              <p className="mt-3 text-muted text-sm sm:text-base">{config.pillarsSubtitle}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.pillars.map((item) => (
                <div key={item.num} className="rounded-2xl border border-line bg-panel p-6 hover:border-accent/40 transition-colors">
                  <span className="text-xs font-black text-accent">{item.num}</span>
                  <h3 className="text-lg font-bold text-text mt-2 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUB-SERVIÇOS DO SILO GOOGLE ADS */}
        <section className="py-16 border-b border-line bg-panel/40">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Soluções de Google Ads</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                Como posso atuar na sua aquisição paga hoje
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/gestor-google-ads" className="rounded-2xl border border-line bg-panel p-5 hover:border-accent transition-all group">
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent-300">Execução Recorrente</span>
                <h3 className="font-bold text-base text-text mt-1 group-hover:text-accent">Gestor de Google Ads</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Acompanhamento semanal completo das campanhas direto comigo, sem intermediários.
                </p>
              </Link>

              <Link to="/consultor-google-ads" className="rounded-2xl border border-line bg-panel p-5 hover:border-accent transition-all group">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Direção Sênior</span>
                <h3 className="font-bold text-base text-text mt-1 group-hover:text-emerald-300">Consultor Google Ads</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Reestruturação de conta, plano de escala e mentorias técnicas para sua equipe interna.
                </p>
              </Link>

              <Link to="/auditoria-google-ads" className="rounded-2xl border border-gold/30 bg-gold/5 p-5 hover:border-gold transition-all group">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold">Diagnóstico</span>
                <h3 className="font-bold text-base text-text mt-1 group-hover:text-gold">Auditoria de Conta Ads</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Descubra onde sua verba está vazando e corte cliques inúteis que encarecem seus leads.
                </p>
              </Link>

              <Link to="/google-ads-e-google-meu-negocio" className="rounded-2xl border border-accent/30 bg-accent/10 p-5 hover:border-accent transition-all group">
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent-300">Dominação Dupla</span>
                <h3 className="font-bold text-base text-text mt-1 group-hover:text-accent-300">Google Ads + Maps</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Combine anúncios no topo com o Top 3 orgânico do Google Meu Negócio para máximo ROI.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* GOOGLE ADS POR SEGMENTO (27 NICHOS) */}
        <section className="py-20 border-b border-line bg-panel">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Estratégia por Segmento</span>
              <h2 className="text-2xl sm:text-4xl font-black mt-2">
                Google Ads Sob Medida para o Seu Mercado
              </h2>
              <p className="mt-3 text-muted text-sm sm:text-base">
                Cada profissão tem palavras-chave de compra, negativas críticas e regras próprias (CFM, OAB, CFO). Selecione seu nicho:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {niches.map((niche) => (
                <Link
                  key={niche.slug}
                  to={`/google-ads/${niche.slug}`}
                  className="p-5 rounded-2xl border border-line bg-ink/60 hover:border-accent hover:bg-panel-2 transition-all flex items-center justify-between group"
                >
                  <span className="font-bold text-sm text-text group-hover:text-accent transition-colors">
                    Google Ads para {niche.nome}
                  </span>
                  <span className="text-xs text-muted group-hover:text-accent transition-colors shrink-0">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-ink">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">Perguntas Frequentes</h2>
            <div className="space-y-3">
              {config.faqs.map((item, idx) => (
                <div key={item.q} className="rounded-2xl border border-line bg-panel overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-sm sm:text-base text-text"
                  >
                    <span>{item.q}</span>
                    <span className="text-accent text-lg shrink-0">{openFaq === idx ? "−" : "+"}</span>
                  </button>
                  {openFaq === idx && (
                    <p className="px-5 pb-5 -mt-1 text-sm text-muted leading-relaxed">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
