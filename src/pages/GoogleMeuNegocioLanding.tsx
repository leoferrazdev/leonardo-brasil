import { useEffect, useState } from "react";
import { Link, useLocation } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import locationsData from "../data/seoLocations.json";

const WHATSAPP_NUMBER = "5551996737359";

interface VerticalLandingConfig {
  canonicalPath: string;
  baseNichePath: string;
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
  deliverablesTitle: string;
  deliverablesSubtitle: string;
  deliverables: { num: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const VERTICAL_CONFIGS: Record<string, VerticalLandingConfig> = {
  "/google-meu-negocio": {
    canonicalPath: "/google-meu-negocio",
    baseNichePath: "/google-meu-negocio",
    title: "Google Meu Negócio: Serviço Completo de Otimização e Gestão | Leonardo Brasil",
    description:
      "Contrate serviço especializado de Google Meu Negócio (Perfil da Empresa no Google). Posicionamento no Top 3 do Google Maps, mais ligações, rotas e contatos qualificados no WhatsApp.",
    keywords:
      "serviço google meu negócio, contratar google meu negócio, perfil da empresa no google, seo local google maps, leonardo brasil google meu negócio",
    badge: "Serviço Especializado · Perfil da Empresa no Google",
    h1: "Transforme seu Google Meu Negócio no ",
    h1Highlight: "canal mais previsível de clientes locais",
    subheadline:
      "Quando um cliente na sua cidade pesquisa pelo que você vende, o Google Maps é a primeira vitrine que aparece. Estruturo, otimizo e blindo seu Perfil da Empresa no Google para gerar ligações, rotas e mensagens diárias no WhatsApp.",
    ctaLabel: "Solicitar Diagnóstico Gratuito do Meu Perfil",
    waMessage:
      "Olá, Leonardo! Quero contratar o serviço de Google Meu Negócio para colocar minha empresa no Top 3 do Google Maps.",
    serviceName: "Serviço Completo de Google Meu Negócio e SEO Local",
    deliverablesTitle: "O que entra na estruturação do seu Google Meu Negócio",
    deliverablesSubtitle:
      "Atuação técnica de ponta a ponta sobre os fatores oficiais de ranqueamento do Google: Relevância, Distância e Proeminência.",
    deliverables: [
      {
        num: "01",
        title: "Auditoria Técnica & Consistência NAP",
        desc: "Diagnóstico completo do perfil atual, correção de conflitos cadastrais e padronização de Nome, Endereço e Telefone em diretórios e citações locais.",
      },
      {
        num: "02",
        title: "Arquitetura de Categorias Primária e Secundárias",
        desc: "Mapeamento dos concorrentes líderes da sua cidade e seleção cirúrgica das categorias oficiais que liberam as buscas mais lucrativas.",
      },
      {
        num: "03",
        title: "Catálogo de Serviços, Produtos e SEO na Descrição",
        desc: "Escrita comercial com palavras-chave locais na descrição (750 caracteres), ficha de serviços detalhada e respostas estruturadas para Google e AI Overviews.",
      },
      {
        num: "04",
        title: "Acervo Visual e Fotos Georreferenciadas",
        desc: "Curadoria de capa, logotipo, fachada, equipe e portfólio visual pensados para aumentar a taxa de clique e a confiança imediata no celular.",
      },
      {
        num: "05",
        title: "Sistema de Avaliações 5 Estrelas",
        desc: "Link curto oficial, roteiro de solicitação pós-atendimento e modelo de respostas com palavras-chave locais para acelerar sua reputação.",
      },
      {
        num: "06",
        title: "Conversão Direta para WhatsApp e Site",
        desc: "Configuração de botões de ação, links rastreados com UTM e alinhamento do perfil para receber também tráfego de anúncios no Google Ads.",
      },
    ],
    faqs: [
      {
        q: "Qual a diferença entre otimização pontual e gestão mensal de Google Meu Negócio?",
        a: "A otimização pontual é um projeto único de reestruturação completa do perfil (ideal para organizar, corrigir e subir posições sem mensalidade). Já a gestão mensal inclui postagens semanais, monitoramento contra edições de concorrentes, respostas estratégicas de avaliações e relatórios contínuos.",
      },
      {
        q: "Quanto custa o serviço de Google Meu Negócio?",
        a: "O valor varia conforme o estágio atual do perfil (criação do zero, recuperação de suspensão, otimização única ou gestão recorrente) e o número de unidades. Envie o link da sua ficha no WhatsApp para receber um diagnóstico gratuito e proposta transparente.",
      },
      {
        q: "Vocês atendem apenas Porto Alegre ou todo o Brasil?",
        a: "Todo o Brasil. Todo o trabalho técnico de auditoria, otimização, SEO local e acompanhamento é executado remotamente com acesso de administrador autorizado diretamente na sua conta Google.",
      },
    ],
  },
  "/otimizacao-google-meu-negocio": {
    canonicalPath: "/otimizacao-google-meu-negocio",
    baseNichePath: "/otimizacao-google-meu-negocio",
    title: "Otimização de Google Meu Negócio (Setup Único) | Leonardo Brasil",
    description:
      "Serviço técnico de otimização de Google Meu Negócio sem mensalidade obrigatória. Corrija categorias, descrição SEO, catálogo, fotos e avaliações para subir ao Top 3 do Maps.",
    keywords:
      "otimização google meu negócio, otimizar perfil empresa google, melhorar posição google maps, seo perfil google meu negócio, serviço otimização gmn",
    badge: "Otimização Cirúrgica · Investimento Único",
    h1: "Otimização de Google Meu Negócio para ",
    h1Highlight: "sair do esquecimento e subir ao Top 3",
    subheadline:
      "Seu perfil já existe no Google Maps, mas quase não gera ligações nem mensagens? Executo uma reestruturação técnica completa — em projeto único, sem mensalidade obrigatória — para transformar sua ficha em um ativo comercial.",
    ctaLabel: "Avaliar o Que Falta Otimizar no Meu Perfil",
    waMessage:
      "Olá, Leonardo! Já tenho perfil no Google e quero contratar a otimização completa do meu Google Meu Negócio.",
    serviceName: "Otimização Pontual de Perfil no Google Meu Negócio",
    deliverablesTitle: "Checklist da Otimização Técnica (Projeto Único)",
    deliverablesSubtitle:
      "Cada campo invisível ou mal preenchido custa posições no Google Maps. Entregamos o perfil 100% ajustado em poucos dias.",
    deliverables: [
      {
        num: "01",
        title: "Engenharia Reversa do Top 3 da Sua Cidade",
        desc: "Analiso exatamente quais categorias, serviços e sinais de autoridade os 3 primeiros concorrentes da sua região estão usando.",
      },
      {
        num: "02",
        title: "Correção de Categorias e Atributos Ocultos",
        desc: "Ajuste fino de categoria primária, secundárias, atributos de acessibilidade, pagamento e área de atendimento sem risco de suspensão.",
      },
      {
        num: "03",
        title: "Reescrita SEO de Descrição e Serviços",
        desc: "Cadastro individual dos serviços mais rentáveis com descrições orientadas à intenção real de busca local e ao vocabulário do cliente.",
      },
      {
        num: "04",
        title: "Reorganização Fotográfica e Capa de Alta Conversão",
        desc: "Padronização de dimensões, nomenclatura e seleção das imagens que realmente aumentam cliques no perfil e pedidos de rota.",
      },
      {
        num: "05",
        title: "Links Rastreáveis com UTM + WhatsApp",
        desc: "Ativação do WhatsApp oficial na ficha e links de site com parâmetros UTM para você comprovar no Google Analytics quantos clientes vêm do Maps.",
      },
      {
        num: "06",
        title: "Playbook de Avaliações 5 Estrelas",
        desc: "Entrega do link direto de avaliação, QR Code pronto e scripts de pedido e resposta para sua equipe manter o perfil em crescimento constante.",
      },
    ],
    faqs: [
      {
        q: "A otimização de Google Meu Negócio exige pagar mensalidade?",
        a: "Não. A otimização completa é contratada como projeto único. Após a entrega, você fica com 100% de propriedade da conta e só contrata gestão mensal se desejar delegar a manutenção contínua.",
      },
      {
        q: "Em quanto tempo o perfil otimizado começa a gerar mais contatos?",
        a: "Após a indexação das correções de categorias, serviços e sinais de engajamento, a maioria dos negócios locais percebe crescimento em visualizações, rotas e cliques no WhatsApp entre 15 e 45 dias.",
      },
      {
        q: "A otimização pode causar suspensão do meu perfil?",
        a: "Não quando feita com critério técnico. Seguimos rigorosamente as diretrizes oficiais do Google, sem keyword stuffing no nome da empresa nem alterações bruscas simultâneas que disparam travas automáticas.",
      },
    ],
  },
  "/consultor-google-meu-negocio": {
    canonicalPath: "/consultor-google-meu-negocio",
    baseNichePath: "/consultor-google-meu-negocio",
    title: "Consultor Google Meu Negócio Especialista Sênior | Leonardo Brasil",
    description:
      "Contrate um consultor especialista em Google Meu Negócio com atendimento direto 1-para-1. Diagnóstico técnico, blindagem contra suspensão, SEO local e funil para WhatsApp.",
    keywords:
      "consultor google meu negócio, consultoria google meu negócio, contratar especialista google meu negócio, consultor seo local, consultoria perfil empresa google",
    badge: "Consultoria Individual 1-para-1 · Atendimento Direto",
    h1: "Consultor Google Meu Negócio com ",
    h1Highlight: "atendimento sênior direto comigo",
    subheadline:
      "Nada de agência genérica terceirizando sua conta para estagiário. Como consultor especialista em SEO Local e Google Meu Negócio, audito seu mercado, executo as melhorias técnicas e desenho seu plano de crescimento no Google.",
    ctaLabel: "Falar Direto com o Consultor no WhatsApp",
    waMessage:
      "Olá, Leonardo! Estou procurando um consultor especialista em Google Meu Negócio e quero conversar sobre o meu negócio.",
    serviceName: "Consultoria Individual de Google Meu Negócio",
    deliverablesTitle: "Por que contratar um consultor dedicado em vez de uma agência genérica",
    deliverablesSubtitle:
      "Decisões baseadas em dados de busca local, regras regulatórias (CFM, OAB, CFO) e foco absoluto em leads reais no WhatsApp.",
    deliverables: [
      {
        num: "01",
        title: "Diagnóstico Profundo em Vídeo ou Reunião",
        desc: "Mapeamento transparente de cada gargalo técnico que hoje impede sua empresa de aparecer na frente dos concorrentes no mapa.",
      },
      {
        num: "02",
        title: "Execução Técnica ou Acompanhamento da Equipe",
        desc: "Você escolhe: eu executo todas as correções diretamente no perfil ou oriento sua equipe interna com checklist e revisão sênior.",
      },
      {
        num: "03",
        title: "Estratégia para Múltiplas Unidades e Franquias",
        desc: "Padronização de nomenclatura, páginas locais no site e arquitetura de perfis sem risco de duplicidade ou canibalização entre filiais.",
      },
      {
        num: "04",
        title: "Conformidade Ética para Médicos, Advogados e Dentistas",
        desc: "Consultoria especializada nas normas do CFM 2.336, Provimento 205 da OAB e CFO para captar clientes particulares sem riscos.",
      },
      {
        num: "05",
        title: "Integração com Site e Google Ads Local",
        desc: "Alinhamento entre ficha do Google Maps, páginas locais do seu site e campanhas de Google Ads para multiplicar o retorno de cada real investido.",
      },
      {
        num: "06",
        title: "Acompanhamento de Métricas de Conversão",
        desc: "Foco em indicadores que colocam dinheiro no caixa: ligações, solicitações de rota, cliques no site e mensagens reais no WhatsApp.",
      },
    ],
    faqs: [
      {
        q: "Como funciona a contratação da consultoria de Google Meu Negócio?",
        a: "Começamos por uma avaliação preliminar gratuita pelo WhatsApp. Se houver potencial real de ganho na sua cidade, apresento o escopo fechado (otimização única, consultoria de acompanhamento ou gestão completa) sem letras miúdas.",
      },
      {
        q: "A consultoria serve para quem tem mais de uma unidade ou rede de lojas?",
        a: "Sim. Estruturo operações tanto para profissionais liberais e negócios de unidade única quanto para clínicas, redes e empresas com várias filiais que precisam padronizar reputação e SEO local.",
      },
      {
        q: "Eu continuo sendo o proprietário principal da ficha no Google?",
        a: "Sempre. Você nunca perde o controle da sua conta. Trabalhamos via convite oficial de administrador no Perfil da Empresa no Google, garantindo 100% de propriedade e transparência.",
      },
    ],
  },
  "/especialista-google-maps": {
    canonicalPath: "/especialista-google-maps",
    baseNichePath: "/especialista-google-maps",
    title: "Especialista em Google Maps e Local Pack (Top 3) | Leonardo Brasil",
    description:
      "Contrate um especialista em Google Maps e SEO Local para posicionar sua empresa entre os 3 primeiros resultados do mapa (Local Pack) e atrair ligações e rotas todos os dias.",
    keywords:
      "especialista google maps, especialista em google maps, aparecer no top 3 google maps, ranquear no google maps, posicionamento google maps",
    badge: "Especialista em Google Maps · Local Pack Top 3",
    h1: "Especialista em Google Maps para colocar sua empresa ",
    h1Highlight: "no Top 3 do mapa da sua cidade",
    subheadline:
      "Mais de 70% dos cliques em buscas locais vão para os 3 primeiros resultados do Google Maps (Local Pack). Aplico engenharia de SEO Local para aumentar sua visibilidade geográfica, ligações e pedidos de rota.",
    ctaLabel: "Analisar Minha Posição Atual no Google Maps",
    waMessage:
      "Olá, Leonardo! Procuro um especialista em Google Maps para subir minha empresa para o Top 3 da minha cidade.",
    serviceName: "Especialista em Posicionamento no Google Maps (Local Pack)",
    deliverablesTitle: "Os pilares que colocam uma empresa no Top 3 do Google Maps",
    deliverablesSubtitle:
      "O mapa não funciona por sorte. Ele responde a sinais determinísticos de relevância semântica, autoridade externa e comportamento do usuário.",
    deliverables: [
      {
        num: "01",
        title: "Mapeamento de Visibilidade por Bairro e Raio",
        desc: "Identificação de onde sua empresa aparece bem e em quais bairros estratégicos seus concorrentes estão roubando suas buscas.",
      },
      {
        num: "02",
        title: "Sinais de Relevância On-Profile",
        desc: "Alinhamento perfeito entre categoria principal, categorias secundárias, lista de serviços, perguntas frequentes e atualizações no mapa.",
      },
      {
        num: "03",
        title: "Sinais de Autoridade Local no Site (On-Page)",
        desc: "Conexão semântica entre a ficha do Google Maps, Schema LocalBusiness e páginas de serviço do seu site para reforçar sua autoridade geográfica.",
      },
      {
        num: "04",
        title: "Velocidade e Qualidade de Avaliações",
        desc: "Estratégia contínua de coleta de reviews com texto natural, fotos de clientes e respostas otimizadas para os termos que o consumidor pesquisa.",
      },
      {
        num: "05",
        title: "Combate a Spam e Perfis Irregulares no Mapa",
        desc: "Monitoramento técnico do ecossistema local para proteger seu posicionamento contra práticas abusivas no Google Maps.",
      },
      {
        num: "06",
        title: "Aceleração Híbrida com Anúncios no Google Maps",
        desc: "Quando faz sentido acelerar o caixa, conectamos o perfil ao Google Ads com Extensão de Local para exibir também o pino patrocinado no topo.",
      },
    ],
    faqs: [
      {
        q: "Por que estar no Top 3 do Google Maps é tão decisivo?",
        a: "No celular, o bloco do Google Maps (Local Pack) ocupa praticamente toda a primeira tela acima dos sites orgânicos tradicionais. Quem está no Top 3 com nota alta recebe ligações, pedidos de rota e cliques no WhatsApp sem precisar pagar por cada clique.",
      },
      {
        q: "Quem atende em domicílio sem ponto comercial aberto pode aparecer no Google Maps?",
        a: "Sim. Configuramos corretamente o perfil como Empresa de Área de Atendimento (SAB), definindo cidades e bairros atendidos sem expor seu endereço residencial e cumprindo 100% das diretrizes do Google.",
      },
      {
        q: "O trabalho no Google Maps funciona junto com Google Ads?",
        a: "Perfeitamente. Um perfil forte no Google Maps aumenta a taxa de conversão dos seus anúncios pagos e reduz seu custo por lead ao longo dos meses, pois parte crescente dos contatos passa a vir de graça pelo orgânico.",
      },
    ],
  },
};

export default function GoogleMeuNegocioLanding() {
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const cleanPath = location.pathname.replace(/\/+$/, "") || "/google-meu-negocio";
  const config = VERTICAL_CONFIGS[cleanPath] || VERTICAL_CONFIGS["/google-meu-negocio"];

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpenFaq(0);
  }, [cleanPath]);

  const niches = locationsData.NICHES;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(config.waMessage)}`;
  const canonicalUrl = `https://leonardobrasil.com.br${config.canonicalPath}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: config.serviceName,
      description: config.description,
      url: canonicalUrl,
      provider: {
        "@type": "Organization",
        "@id": "https://leonardobrasil.com.br/#organization",
        name: "Leonardo Brasil",
      },
      areaServed: {
        "@type": "Country",
        name: "Brasil",
      },
      serviceType: "SEO Local e Google Meu Negócio",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Início",
          item: "https://leonardobrasil.com.br",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: config.serviceName,
          item: canonicalUrl,
        },
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
            <Link to="/gestao-google-meu-negocio" className="hover:text-text transition-colors">Gestão Mensal</Link>
            <Link to="/criar-e-verificar-google-meu-negocio" className="hover:text-text transition-colors">Criar &amp; Verificar</Link>
            <Link to="/google-ads" className="text-accent hover:text-accent-300 transition-colors">Google Ads</Link>
            <Link to="/auditoria-perfil-google" className="hover:text-text transition-colors">Raio-X Grátis</Link>
            <Link to="/cidades" className="hover:text-text transition-colors">Cidades</Link>
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/30 mb-6">
              {config.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-text text-balance">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent text-white font-black text-base px-8 py-4 rounded-full hover:bg-accent-600 transition-all shadow-xl shadow-accent/25 hover:scale-[1.02]"
              >
                {config.ctaLabel}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <Link
                to="/auditoria-perfil-google"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-7 py-4 text-sm sm:text-base font-bold text-accent-300 hover:bg-accent/20 transition-colors"
              >
                Fazer Raio-X Online (Grátis) →
              </Link>
            </div>
          </div>
        </section>

        {/* ENTREGÁVEIS ESPECÍFICOS DA ROTA */}
        <section className="py-20 border-b border-line bg-ink">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Escopo Técnico</span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">{config.deliverablesTitle}</h2>
              <p className="mt-3 text-muted text-sm sm:text-base">{config.deliverablesSubtitle}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.deliverables.map((item) => (
                <div key={item.num} className="rounded-2xl border border-line bg-panel p-6 hover:border-accent/40 transition-colors">
                  <span className="text-xs font-black text-accent">{item.num}</span>
                  <h3 className="text-lg font-bold text-text mt-2 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUTROS SERVIÇOS COMPLEMENTARES DO ECOSSISTEMA GOOGLE */}
        <section className="py-16 border-b border-line bg-panel/40">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Soluções Complementares</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">Escolha o formato exato para o momento do seu negócio</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/gestao-google-meu-negocio"
                className="rounded-2xl border border-line bg-panel p-5 hover:border-accent transition-all group"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent-300">Recorrente</span>
                <h3 className="font-bold text-base text-text mt-1 group-hover:text-accent">Gestão Mensal de GMN</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Postagens semanais, gestão de avaliações, defesa contra concorrentes e relatórios mensais.
                </p>
              </Link>

              <Link
                to="/criar-e-verificar-google-meu-negocio"
                className="rounded-2xl border border-line bg-panel p-5 hover:border-accent transition-all group"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Do Zero</span>
                <h3 className="font-bold text-base text-text mt-1 group-hover:text-emerald-300">Criar e Verificar Perfil</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Cadastro blindado e aprovação na verificação por vídeo do Google sem cair em suspensão.
                </p>
              </Link>

              <Link
                to="/recuperar-perfil-suspenso-google"
                className="rounded-2xl border border-red-500/20 bg-red-950/10 p-5 hover:border-red-400 transition-all group"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">Emergência</span>
                <h3 className="font-bold text-base text-text mt-1 group-hover:text-red-300">Recuperar Perfil Suspenso</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Auditoria de conformidade, montagem de dossiê documental e apelação técnica ao suporte.
                </p>
              </Link>

              <Link
                to="/google-ads-e-google-meu-negocio"
                className="rounded-2xl border border-gold/30 bg-gold/5 p-5 hover:border-gold transition-all group"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold">Aceleração</span>
                <h3 className="font-bold text-base text-text mt-1 group-hover:text-gold">Google Ads + Google Maps</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Domine os anúncios pagos e o Top 3 orgânico simultaneamente para multiplicar leads no WhatsApp.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* NICHOS EM DESTAQUE */}
        <section className="py-20 border-b border-line bg-panel">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-4xl font-black text-text">Especialidades Atendidas no Brasil Inteiro</h2>
              <p className="mt-3 text-muted text-sm sm:text-base">
                Selecione seu segmento abaixo para conferir o plano específico de posicionamento local na sua cidade.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {niches.map((niche) => (
                <Link
                  key={niche.slug}
                  to={`${config.baseNichePath}/${niche.slug}`}
                  className="p-5 rounded-2xl border border-line bg-ink/60 hover:border-accent hover:bg-panel-2 transition-all flex items-center justify-between group"
                >
                  <span className="font-bold text-sm text-text group-hover:text-accent transition-colors">
                    {niche.nome}
                  </span>
                  <span className="text-xs text-muted group-hover:text-accent transition-colors shrink-0">Ver →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ EXCLUSIVO DA VERTICAL */}
        <section className="py-20 border-b border-line bg-ink">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center mb-10">
              Perguntas Frequentes sobre o Serviço
            </h2>
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
