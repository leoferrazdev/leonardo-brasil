import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const STATE_FILE = path.join(ROOT_DIR, 'src', 'data', 'daily-seo-state.json');
const NICHES_FILE = path.join(ROOT_DIR, 'src', 'data', 'niches.ts');
const ADS_NICHES_FILE = path.join(ROOT_DIR, 'src', 'data', 'googleAdsNiches.ts');
const LOCATIONS_JSON_FILE = path.join(ROOT_DIR, 'src', 'data', 'seoLocations.json');
const BLOG_FILE = path.join(ROOT_DIR, 'src', 'data', 'blogData.ts');
const PRERENDER_FILE = path.join(ROOT_DIR, 'scripts', 'prerender.mjs');
const SITEMAP_FILE = path.join(ROOT_DIR, 'scripts', 'generate-sitemap.mjs');
const CITY_LANDING_FILE = path.join(ROOT_DIR, 'src', 'pages', 'CityHubLanding.tsx');

// ============================================================================
// Catálogo Mestre de Nichos para Money Pages (Camada 1 - Serviços de Alto Valor)
// ============================================================================
export const MASTER_NICHES = [
  // --- LOTE 1 (Publicado em 25/11/2026) ---
  {
    slug: "cirurgia-plastica",
    nome: "Cirurgiões Plásticos e Clínicas",
    badge: "Cirurgia Plástica",
    headline: "Google Ads e Google Meu Negócio para Cirurgiões Plásticos",
    subheadline: "Atraia pacientes particulares qualificados para procedimentos cirúrgicos de alta complexidade e alto valor agregado, com respeito absoluto às diretrizes éticas do CFM.",
    campaignFocus: "Rede de Pesquisa por procedimento cirúrgico + Google Maps Local + Atendimento Consultivo",
    typicalIntent: "Alta consideração, procedimentos eletivos e busca por confiança técnica",
    bottomFunnelKeywords: [
      "cirurgião plástico especialista perto de mim",
      "clínica de cirurgia plástica particular",
      "mastopexia com prótese consulta especialista",
      "lipoaspiração de alta definição cirurgião certificado",
      "rinoplastia estruturada consulta presencial"
    ],
    negativeKeywords: ["sus", "gratuito", "faculdade", "preço popular", "barato", "estágio"],
    deliverables: [
      "Segmentação cirúrgica por procedimento de maior valor (mamas, contorno corporal, face)",
      "Negativação agressiva de termos que buscam cirurgias gratuitas ou pelo SUS",
      "Otimização do Perfil da Empresa no Google Maps com foco em reputação e avaliações legítimas",
      "Integração com WhatsApp para triagem qualificada antes do agendamento da consulta"
    ],
    regulatoryNote: "Em estrita observância à Resolução CFM nº 2.336/2023 sobre publicidade médica: transparência, sobriedade e sem promessas sensacionalistas.",
    faqs: [
      {
        q: "Como o Google Ads atrai pacientes particulares de cirurgia plástica?",
        a: "Posicionamos sua clínica exatamente para buscas de pacientes decididos que pesquisam por procedimentos específicos na sua cidade, direcionando para uma página de WhatsApp com atendimento humanizado."
      },
      {
        q: "Como manter os anúncios dentro das regras do CFM?",
        a: "Todos os textos e extensões são redigidos com foco informativo, citando o RQE e CRM do cirurgião responsável e sem promessas de resultado garantido."
      }
    ],
    waMessage: "Olá, Leonardo! Sou cirurgião plástico e quero estruturar o Google Ads e Maps para minha clínica."
  },
  {
    slug: "dermatologia",
    nome: "Dermatologistas e Clínicas Dermatológicas",
    badge: "Dermatologia & Laser",
    headline: "Google Ads e Maps para Dermatologistas: Consultas e Procedimentos de Alto Valor",
    subheadline: "Domine o topo das buscas locais para tratamentos avançados de pele, lasers, injetáveis e dermatologia clínica particular.",
    campaignFocus: "Pesquisa por patologia/procedimento + Presença no Top 3 do Google Maps",
    typicalIntent: "Busca de confiança para saúde e estética médica de alto padrão",
    bottomFunnelKeywords: [
      "dermatologista especialista perto de mim",
      "clínica dermatológica particular [sua cidade]",
      "tratamento a laser manchas especialista pele",
      "aplicação bioestimulador colágeno dermatologista",
      "consulta dermatológica particular avaliação"
    ],
    negativeKeywords: ["sus", "curso gratuito", "salão", "grátis", "remédio caseiro"],
    deliverables: [
      "Campanhas separadas entre dermatologia clínica e cosmiatria avançada",
      "Destaque no Google Maps com fotos de infraestrutura e depoimentos de acolhimento",
      "Negativação de termos caseiros e receitas populares que não geram consultas pagas",
      "Script de triagem no WhatsApp para converter dúvidas em consultas agendadas"
    ],
    regulatoryNote: "Conformidade com as normas da SBD e CFM para publicidade médica informativa.",
    faqs: [
      {
        q: "É possível evitar pacientes procurando procedimentos populares de baixo custo?",
        a: "Sim. A qualificação começa na negativação de termos genéricos e nos textos do anúncio que deixam explícito o padrão da clínica médica especializada."
      }
    ],
    waMessage: "Olá, Leonardo! Sou dermatologista e quero atrair mais pacientes particulares para minha clínica via Google."
  },
  {
    slug: "oftalmologia",
    nome: "Oftalmologistas e Clínicas de Olhos",
    badge: "Oftalmologia",
    headline: "Google Ads e Maps para Clínicas Oftalmológicas e Cirurgias Oculares",
    subheadline: "Posicione seu centro oftalmológico no topo do Google Maps e nas pesquisas de catarata, cirurgia refrativa e exames diagnósticos.",
    campaignFocus: "Cirurgias oculares eletivas + Consultas diagnósticas de alta precisão",
    typicalIntent: "Urgência visual e agendamento de cirurgias com foco em segurança",
    bottomFunnelKeywords: [
      "clínica oftalmológica perto de mim",
      "cirurgia de catarata particular especialista",
      "cirurgia refrativa a laser preço consulta",
      "exame de vista oftalmologista particular",
      "tratamento glaucoma oftalmologista referência"
    ],
    negativeKeywords: ["sus", "óculos grátis", "curso ótica", "doação armação"],
    deliverables: [
      "Estruturação de campanhas por cirurgia e subespecialidade (retina, córnea, glaucoma)",
      "Presença de destaque no Google Maps para pacientes da sua macrorregião",
      "Integração direta com o call center / WhatsApp da recepção para agendamento rápido",
      "Filtro diário contra buscas de óculos populares e exames gratuitos"
    ],
    faqs: [
      {
        q: "Qual a melhor estratégia para atrair cirurgias refrativas particulares?",
        a: "Campanhas na Rede de Pesquisa focadas em intenção imediata ('cirurgia miopia a laser') integradas a uma página rápida que explica o procedimento e convida para a consulta avaliativa no WhatsApp."
      }
    ],
    waMessage: "Olá, Leonardo! Administro uma clínica oftalmológica e quero ampliar nossos agendamentos particulares no Google."
  },
  {
    slug: "direito-previdenciario",
    nome: "Advogados Previdenciários",
    badge: "Direito Previdenciário",
    headline: "Google Ads e Google Maps para Advocacia Previdenciária de Alto Padrão",
    subheadline: "Atraia clientes qualificados que buscam planejamento previdenciário, revisões de aposentadoria e concessão de benefícios no INSS e regimes próprios.",
    campaignFocus: "Planejamento previdenciário + Concessão e Revisão de Aposentadorias",
    typicalIntent: "Busca por orientação jurídica técnica para aposentadorias de maior valor",
    bottomFunnelKeywords: [
      "advogado previdenciário especialista perto de mim",
      "planejamento previdenciário escritório advocacia",
      "revisão de aposentadoria advogado especialista inss",
      "advogado para aposentadoria especial médico e dentista",
      "consulta com advogado previdenciário particular"
    ],
    negativeKeywords: ["inss telefone 135", "meu inss login", "consultar extrato grátis", "tabela inss"],
    deliverables: [
      "Campanhas orientadas para planejamento de aposentadoria de profissionais liberais e autônomos",
      "Bloqueio de pessoas que buscam apenas telefone ou suporte gratuito do INSS",
      "Comunicação sóbria e informativa em conformidade com o Provimento 205/2021 da OAB",
      "Rastreamento de mensagens qualificadas recebidas no WhatsApp do escritório"
    ],
    regulatoryNote: "Conforme o Provimento 205/2021 do CFOAB: caráter estritamente informativo sem mercantilização da profissão.",
    faqs: [
      {
        q: "Como evitar pessoas buscando atendimento do 135 ou INSS gratuito?",
        a: "Negativamos centenas de termos como 'telefone inss', 'meu inss', 'agendar perícia' e deixamos claro no anúncio a atuação de escritório de advocacia privado."
      }
    ],
    waMessage: "Olá, Leonardo! Sou advogado previdenciário e quero posicionar meu escritório no Google para clientes qualificados."
  },
  {
    slug: "direito-trabalhista",
    nome: "Advogados Trabalhistas",
    badge: "Direito do Trabalho",
    headline: "Google Ads e Google Maps para Escritórios de Direito do Trabalho",
    subheadline: "Posicione seu escritório para consultoria trabalhista empresarial preventiva e causas de profissionais de alta remuneração.",
    campaignFocus: "Assessoria trabalhista corporativa e reclamações de média/alta complexidade",
    typicalIntent: "Solução de passivos trabalhistas e rescisões de executivos",
    bottomFunnelKeywords: [
      "advogado trabalhista empresarial perto de mim",
      "escritório de advocacia trabalhista consultoria empresas",
      "advogado especialista em rescisão executivo bancário",
      "defesa trabalhista patronal escritório especialista",
      "consultoria jurídica trabalhista preventiva"
    ],
    negativeKeywords: ["modelo petição", "calculadora rescisão grátis", "tabela clt", "justiça gratuita"],
    deliverables: [
      "Segmentação por temas corporativos: defesas em fiscalizações e auditoria de contratos",
      "Anúncios institucionais no Google Maps para consolidar o escritório no centro empresarial",
      "Negativação de modelos de documentos e cálculos trabalhistas genéricos",
      "Fluxo direto para agendamento de consulta com advogado especialista"
    ],
    regulatoryNote: "Conformidade com as diretrizes de sobriedade e ética do Provimento 205/2021 do CFOAB.",
    faqs: [
      {
        q: "Como segmentar para empresas e não apenas trabalhadores?",
        a: "Utilizamos palavras-chave específicas como 'assessoria jurídica empresarial' e 'defesa trabalhista patronal', excluindo termos de cálculo de rescisão simples."
      }
    ],
    waMessage: "Olá, Leonardo! Sou advogado trabalhista e quero atrair mais clientes e empresas no Google."
  },
  {
    slug: "direito-familia",
    nome: "Advogados de Família e Sucessões",
    badge: "Família & Sucessões",
    headline: "Google Ads e Google Maps para Advogados de Família e Sucessões",
    subheadline: "Captação ética e discreta de clientes que necessitam de divórcio consensual/litigioso, partilha de bens, inventário e planejamento sucessório.",
    campaignFocus: "Inventários de alto patrimônio + Divórcios e Planejamento Sucessório",
    typicalIntent: "Situações delicadas que exigem sigilo, acolhimento e autoridade técnica",
    bottomFunnelKeywords: [
      "advogado especialista em inventário e partilha de bens",
      "advogado de família divórcio particular perto de mim",
      "escritório advocacia inventário extrajudicial rápido",
      "planejamento sucessório familiar advogado especialista",
      "consulta jurídica direito de família sigilo"
    ],
    negativeKeywords: ["modelo de divórcio grátis", "defensoria pública", "divórcio gratuito"],
    deliverables: [
      "Campanhas focadas em inventários judiciais e extrajudiciais de patrimônio relevante",
      "Presença no Google Maps transmitindo elegância, acolhimento e discrição",
      "Filtro contra buscas por assistência judiciária gratuita e modelos de petição",
      "WhatsApp com atendimento humanizado para orientar o primeiro contato com empatia"
    ],
    regulatoryNote: "Em conformidade com o Provimento 205/2021 do CFOAB: discrição, sobriedade e esclarecimento técnico.",
    faqs: [
      {
        q: "Como o Google Maps ajuda escritórios de direito de família?",
        a: "Muitos clientes preferem um advogado próximo fisicamente para reuniões presenciais discretas sobre patrimônio. O Top 3 no Google Maps posiciona seu escritório como a referência local."
      }
    ],
    waMessage: "Olá, Leonardo! Tenho escritório de direito de família e quero posicionar no Google para inventários e divórcios."
  },
  {
    slug: "energia-solar",
    nome: "Empresas de Energia Solar",
    badge: "Energia Solar Fotovoltaica",
    headline: "Google Ads e Google Maps para Integradores e Empresas de Energia Solar",
    subheadline: "Receba contatos diários de donos de imóveis residenciais de alto padrão, indústrias e propriedades rurais querendo orçamento de energia solar.",
    campaignFocus: "Geração distribuída residencial e comercial + Google Maps local",
    typicalIntent: "Busca ativa por redução de custos na conta de luz e propostas de instalação",
    bottomFunnelKeywords: [
      "empresa de energia solar perto de mim",
      "instalação de placas solares fotovoltaicas orçamento",
      "empresa de energia solar residencial [sua cidade]",
      "projeto energia solar comercial industrial orçamento",
      "instalador de energia solar homologado cemig celesc copel enel"
    ],
    negativeKeywords: ["curso energia solar grátis", "vaga vendedor placas", "energia solar caseira pdf"],
    deliverables: [
      "Campanhas geolocalizadas na sua área de atuação comercial e técnica",
      "Perfil no Google Maps com fotos de usinas instaladas e clientes reais avaliando",
      "Negativação de curiosos e pessoas buscando cursos ou manuais de bricolagem",
      "Formulário e botão de WhatsApp solicitando envio da conta de luz para orçamento rápido"
    ],
    faqs: [
      {
        q: "Como qualificar o lead de energia solar para evitar quem não tem dinheiro?",
        a: "Configuramos anúncios focados em economia expressiva com critérios de consumo mínimo e direcionamos para um WhatsApp preparado para solicitar a foto da conta de luz."
      }
    ],
    waMessage: "Olá, Leonardo! Tenho empresa de energia solar e quero gerar leads qualificados no Google todos os dias."
  },
  {
    slug: "climatizacao",
    nome: "Empresas de Climatização e PMOC",
    badge: "Climatização & Ar Condicionado",
    headline: "Google Ads e Maps para Climatização, Projetos de Ar Condicionado e PMOC",
    subheadline: "Domine as buscas de instalação de ar condicionado residencial de alto padrão e contratos recorrentes de manutenção corporativa (PMOC).",
    campaignFocus: "Contratos de manutenção PMOC para empresas + Instalação residencial",
    typicalIntent: "Necessidade imediata de instalação/conserto ou obrigação legal de PMOC",
    bottomFunnelKeywords: [
      "empresa de climatização e ar condicionado perto de mim",
      "instalação de ar condicionado multi split orçamento",
      "plano de manutenção pmoc ar condicionado empresas",
      "manutenção preventiva e corretiva ar condicionado corporativo",
      "empresa de engenharia térmica e ar condicionado credenciada"
    ],
    negativeKeywords: ["conserto caseiro", "esquema elétrico ar", "tabela gás grátis"],
    deliverables: [
      "Divisão entre contratos empresariais de PMOC e instalações residenciais de valor",
      "Destaque absoluto no Google Maps para chamadas de emergência e orçamentos",
      "Exclusão de curiosos de tutoriais do YouTube e apostilas gratuitas",
      "WhatsApp comercial estruturado para envio de especificações e agendamento de visita técnica"
    ],
    faqs: [
      {
        q: "Vale a pena anunciar PMOC de ar condicionado no Google Ads?",
        a: "Muito. Empresas que precisam cumprir a Lei do PMOC buscam no Google por empresas de engenharia credenciadas. Um único contrato anual de manutenção cobre amplamente o investimento em mídia."
      }
    ],
    waMessage: "Olá, Leonardo! Tenho empresa de climatização e ar condicionado e quero expandir meus contratos e instalações via Google."
  },

  // --- LOTE 2 (Publicação em 26/11/2026) ---
  {
    slug: "ortodontia",
    nome: "Ortodontistas e Clínicas Odontológicas",
    badge: "Ortodontia & Alinhadores",
    headline: "Google Ads e Google Maps para Ortodontistas: Atraia Pacientes para Alinhadores e Aparelhos",
    subheadline: "Domine o topo do Google para tratamentos de alto valor como alinhadores invisíveis e estética do sorriso com agendamento direto no WhatsApp.",
    campaignFocus: "Rede de Pesquisa por alinhadores invisíveis + Google Maps + Triagem no WhatsApp",
    typicalIntent: "Alta consideração estética e busca por tratamentos ortodônticos modernos",
    bottomFunnelKeywords: [
      "ortodontista especialista perto de mim",
      "alinhador invisível consulta avaliação orçamento",
      "clínica de ortodontia estética particular",
      "aparelho ortodôntico transparente especialista",
      "invisalign consulta ortodontista credenciado"
    ],
    negativeKeywords: ["grátis", "manutenção barata", "curso", "faculdade", "sindicato", "tabela sus"],
    deliverables: [
      "Segmentação de campanhas por alinhadores invisíveis e estética do sorriso",
      "Destaque no Google Maps com avaliações de pacientes e fotos da infraestrutura clínica",
      "Exclusão diária de buscas populares por aparelhos gratuitos ou manutenções a preço de custo",
      "Rastreamento de conversões reais no WhatsApp da recepção com script de triagem"
    ],
    regulatoryNote: "Conforme o Código de Ética Odontológica do CFO: comunicação sóbria, informativa e sem sensacionalismo de antes e depois.",
    faqs: [
      {
        q: "Como o Google Ads atrai pacientes particulares de alinhadores invisíveis?",
        a: "Posicionamos seu consultório para pesquisas de alta intenção como 'alinhador transparente preço consulta' com anúncios focados em previsibilidade, conforto e tecnologia."
      },
      {
        q: "Como qualificar o lead que busca ortodontia?",
        a: "Utilizamos termos específicos de marcas e materiais estéticos, excluindo termos populares de aparelhos metálicos convencionais de baixo custo."
      }
    ],
    waMessage: "Olá, Leonardo! Sou ortodontista e quero estruturar o Google Ads e Maps para atrair pacientes particulares para alinhadores."
  },
  {
    slug: "pediatria",
    nome: "Pediatras e Clínicas de Pediatria",
    badge: "Pediatria & Puericultura",
    headline: "Google Ads e Google Maps para Pediatras: Atraia Famílias para Consultas Particulares",
    subheadline: "Posicione seu consultório para famílias que buscam puericultura, acompanhamento do desenvolvimento infantil e atendimento humanizado na sua cidade.",
    campaignFocus: "Pesquisa por pediatra particular + Presença no Top 3 do Google Maps",
    typicalIntent: "Urgência de saúde infantil ou busca de pediatra de confiança para acompanhamento contínuo",
    bottomFunnelKeywords: [
      "pediatra particular perto de mim",
      "clínica de pediatria consulta particular",
      "médico pediatra puericultura agendamento",
      "consulta pediátrica recém nascido especialista",
      "pediatra humanizado acolhimento particular"
    ],
    negativeKeywords: ["sus", "upa infantil", "posto de saúde", "grátis", "estágio"],
    deliverables: [
      "Campanhas segmentadas por raio geográfico estrito próximo aos bairros residenciais familiares",
      "Perfil no Google Maps transmitindo aconchego, segurança e reputação impecável",
      "Negativação de termos do SUS e emergências públicas",
      "Botão de WhatsApp integrado para agendamento direto com a secretária"
    ],
    regulatoryNote: "Em conformidade com a Resolução CFM nº 2.336/2023: caráter educativo, menção clara de CRM e RQE, sem promessas sensacionalistas.",
    faqs: [
      {
        q: "Como famílias encontram pediatras no Google?",
        a: "Mães e pais utilizam o Google Maps e a Pesquisa no smartphone buscando 'pediatra particular perto de mim'. O perfil com melhores avaliações e localização clara é o primeiro a ser contatado."
      }
    ],
    waMessage: "Olá, Leonardo! Sou médico pediatra e quero posicionar meu consultório no Google para consultas particulares."
  },
  {
    slug: "direito-imobiliario",
    nome: "Advogados Imobiliários e de Regularização",
    badge: "Direito Imobiliário",
    headline: "Google Ads e Google Maps para Escritórios de Direito Imobiliário e Contratos",
    subheadline: "Atraia compradores, investidores e proprietários que necessitam de regularização de imóveis, usucapião, assessoria em leilões e disputas possessórias.",
    campaignFocus: "Regularização imobiliária + Contratos de compra e venda + Usucapião",
    typicalIntent: "Segurança jurídica patrimonial em operações financeiras e conflitos de alto valor",
    bottomFunnelKeywords: [
      "advogado imobiliário especialista perto de mim",
      "advogado regularização de imóveis usucapião",
      "escritório advocacia direito imobiliário consulta",
      "assessoria jurídica compra e venda imóvel segurança",
      "advogado para arrematação leilão judicial imobiliário"
    ],
    negativeKeywords: ["modelo contrato grátis", "aluguel barato", "defensoria pública", "cohab"],
    deliverables: [
      "Segmentação focada em transações e regularizações de patrimônio de médio e alto valor",
      "Posicionamento no Google Maps como referência jurídica imobiliária local",
      "Negativação de termos de modelos gratuitos de contratos e dúvidas acadêmicas",
      "Fluxo de triagem no WhatsApp para entender o caso antes da consulta formal"
    ],
    regulatoryNote: "Em conformidade com o Provimento 205/2021 do CFOAB: sobriedade, foco informativo e respeito à dignidade da advocacia.",
    faqs: [
      {
        q: "Como o Google Ads capta clientes de regularização e usucapião?",
        a: "Anunciamos para quem pesquisa termos de dor jurídica imediata ('como regularizar imóvel sem escritura', 'advogado usucapião'), direcionando para um contato consultivo."
      }
    ],
    waMessage: "Olá, Leonardo! Sou advogado imobiliário e quero posicionar meu escritório no Google para causas e contratos patrimoniais."
  },
  {
    slug: "direito-tributario",
    nome: "Advogados Tributaristas e Planejamento Fiscal",
    badge: "Direito Tributário & Fiscal",
    headline: "Google Ads e Google Maps para Advocacia Tributária e Recuperação de Créditos",
    subheadline: "Posicione seu escritório para empresários e diretores financeiros que buscam planejamento tributário preventivo, defesas fiscais e compensação de tributos.",
    campaignFocus: "Recuperação de créditos tributários + Defesa de execuções fiscais + Planejamento",
    typicalIntent: "Empresas com passivos ou oportunidades tributárias buscando escritórios de renome",
    bottomFunnelKeywords: [
      "advogado tributarista empresarial perto de mim",
      "escritório de advocacia tributária planejamento fiscal",
      "defesa de execução fiscal advogado tributário",
      "recuperação de créditos tributários consultoria jurídica",
      "advogado especialista em impostos empresas consulta"
    ],
    negativeKeywords: ["tabela simples nacional grátis", "como sonegar", "modelo impugnação", "concurso receita"],
    deliverables: [
      "Campanhas B2B altamente filtradas para tomadores de decisão (CFOs, CEOs, diretores)",
      "Anúncios institucionais no Google Maps destacando a sede e a solidez do escritório",
      "Negativação agressiva de estudantes, pesquisas acadêmicas e microempreendedores individuais",
      "Integração com WhatsApp institucional para agendamento de reuniões técnicas"
    ],
    regulatoryNote: "Conforme Provimento 205/2021 do CFOAB: discrição absoluta e caráter informativo sem mercantilização.",
    faqs: [
      {
        q: "Google Ads funciona para captação tributária B2B?",
        a: "Sim, porque diretores e sócios de empresas pesquisam no Google no momento em que são notificados pela Receita ou buscam estratégias legais para otimizar a carga tributária."
      }
    ],
    waMessage: "Olá, Leonardo! Sou advogado tributarista e quero atrair empresas e demandas de recuperação fiscal pelo Google."
  },
  {
    slug: "contabilidade-consultiva",
    nome: "Escritórios de Contabilidade e BPO Financeiro",
    badge: "Contabilidade Consultiva & BPO",
    headline: "Google Ads e Maps para Contabilidades Consultivas e Gestão Financeira",
    subheadline: "Receba contatos de pequenas e médias empresas querendo migrar de contador, abrir empresas de serviços ou terceirizar o financeiro (BPO).",
    campaignFocus: "Abertura e migração de empresas + BPO Financeiro + Gestão Contábil Consultiva",
    typicalIntent: "Troca de contabilidade por falta de suporte ou busca por redução de custos fiscais",
    bottomFunnelKeywords: [
      "escritório de contabilidade perto de mim",
      "trocar de contador empresa de serviços consultoria",
      "contabilidade consultiva para clínicas e médicos",
      "terceirização do financeiro bpo empresas orçamento",
      "abertura de empresa ltda simples nacional contador"
    ],
    negativeKeywords: ["mei grátis", "declaração imposto renda gratuita", "estágio contabilidade", "como emitir nota mei"],
    deliverables: [
      "Segmentação por nichos de alto valor (médicos, advogados, e-commerces, prestadores de serviços)",
      "Presença de destaque no Google Maps com avaliações de empresários locais",
      "Filtro contra pesquisas por MEI gratuito e consultas básicas de IRPF",
      "WhatsApp comercial preparado com diagnóstico inicial de regime tributário"
    ],
    regulatoryNote: "Em conformidade com as diretrizes do CFC para publicidade e integridade contábil.",
    faqs: [
      {
        q: "Como atrair empresas com mensalidades maiores e não apenas MEIs?",
        a: "Direcionamos os anúncios para buscas corporativas como 'contabilidade para clínicas médicas' ou 'BPO financeiro para empresas', negativando buscas de microempreendedor individual."
      }
    ],
    waMessage: "Olá, Leonardo! Tenho escritório de contabilidade e quero atrair novos clientes recorrentes via Google Ads e Maps."
  },
  {
    slug: "arquitetura-interiores",
    nome: "Arquitetos e Escritórios de Interiores",
    badge: "Arquitetura & Interiores",
    headline: "Google Ads e Google Maps para Escritórios de Arquitetura e Interiores",
    subheadline: "Conecte seu escritório a clientes residenciais e comerciais de médio/alto padrão prontos para reformar ou construir na sua cidade.",
    campaignFocus: "Projetos de interiores residenciais de luxo + Projetos comerciais corporativos",
    typicalIntent: "Busca de portfólio visual, bom gosto arquitetônico e acompanhamento de obras",
    bottomFunnelKeywords: [
      "escritório de arquitetura perto de mim",
      "arquiteto de interiores residencial orçamento",
      "projeto de arquitetura e reforma apartamento alto padrão",
      "arquiteto comercial para clínicas e escritórios",
      "contratar arquiteto para projeto executivo e obra"
    ],
    negativeKeywords: ["planta de casa grátis", "curso autocad", "ideias pinterest", "decoração barata diy"],
    deliverables: [
      "Campanhas geolocalizadas em condomínios fechados e bairros nobres da cidade",
      "Google Maps enriquecido com fotos profissionais de projetos finalizados",
      "Negativação de buscas de tutoriais, faça você mesmo (DIY) e plantas gratuitas",
      "Link direto para WhatsApp com apresentação do portfólio em alta resolução"
    ],
    regulatoryNote: "Conforme o código de ética do CAU/BR sobre autoria e comunicação profissional.",
    faqs: [
      {
        q: "Como atrair clientes que valorizam projeto de arquitetura e não pedem apenas desconto?",
        a: "Apresentamos a autoridade do arquiteto, a sofisticação das entregas e focamos as palavras-chave em 'projeto executivo', 'arquitetura residencial de alto padrão' e bairros nobres."
      }
    ],
    waMessage: "Olá, Leonardo! Sou arquiteto e quero estruturar campanhas no Google para captar clientes de projetos de interiores."
  },
  {
    slug: "psicologia-clinica",
    nome: "Psicólogos e Clínicas de Psicologia",
    badge: "Psicologia Clínica & Terapia",
    headline: "Google Ads e Google Maps para Psicólogos: Consultas Particulares Presenciais e Online",
    subheadline: "Conquiste pacientes que buscam psicoterapia individual, infantil ou de casal, com discrição e posicionamento ético no topo das buscas locais.",
    campaignFocus: "Psicoterapia particular presencial + Atendimento online especializado",
    typicalIntent: "Busca de apoio emocional e acolhimento para ansiedade, depressão e relações",
    bottomFunnelKeywords: [
      "psicólogo particular perto de mim",
      "clínica de psicologia consulta particular",
      "terapia cognitivo comportamental psicólogo especialista",
      "psicólogo infantil acolhimento avaliação",
      "consulta com psicólogo presencial agendamento"
    ],
    negativeKeywords: ["sus", "terapia gratuita", "faculdade psicologia estágio", "teste psicológico online grátis"],
    deliverables: [
      "Segmentação por proximidade para consultório presencial e raio estendido para terapia online",
      "Google Maps com depoimentos éticos focados na pontualidade e estrutura do consultório",
      "Negativação de serviços gratuitos e testes de personalidade populares",
      "WhatsApp com mensagem receptiva e acolhedora para agendamento de sessão de acolhimento"
    ],
    regulatoryNote: "Em conformidade com a Resolução CFP nº 011/2018 e Código de Ética: sigilo profissional e sem promessas de cura.",
    faqs: [
      {
        q: "Como o Google Maps ajuda o consultório de psicologia?",
        a: "Muitos pacientes preferem terapeutas próximos de sua residência ou trabalho. Estar no Top 3 do Google Maps garante autoridade e facilidade de acesso."
      }
    ],
    waMessage: "Olá, Leonardo! Sou psicólogo clínico e quero posicionar meu consultório no Google para consultas particulares."
  },
  {
    slug: "fisioterapia-especializada",
    nome: "Clínicas de Fisioterapia e Reabilitação",
    badge: "Fisioterapia Especializada",
    headline: "Google Ads e Maps para Clínicas de Fisioterapia, Coluna e Ortopedia",
    subheadline: "Atraia pacientes particulares para fisioterapia esportiva, reabilitação da coluna, pilates clínico e RPG com agendamento imediato.",
    campaignFocus: "Reabilitação ortopédica + Fisioterapia da coluna + Pilates clínico",
    typicalIntent: "Dor crônica ou pós-operatório com alta urgência de alívio e reabilitação",
    bottomFunnelKeywords: [
      "clínica de fisioterapia perto de mim",
      "fisioterapia para coluna tratamento hérnia de disco",
      "fisioterapeuta ortopédico reabilitação particular",
      "sessão de pilates clínico com fisioterapeuta",
      "fisioterapia esportiva recuperação lesão agendamento"
    ],
    negativeKeywords: ["sus", "exercício para dor no youtube", "fisioterapia gratuita", "curso massagem"],
    deliverables: [
      "Campanhas por patologia (coluna, joelho, ombro, reabilitação desportiva)",
      "Presença forte no Google Maps com fotos de equipamentos e equipe qualificada",
      "Filtro contra pesquisas de tutoriais caseiros e tratamentos populares",
      "WhatsApp com triagem rápida para agendar a primeira avaliação fisioterapêutica"
    ],
    regulatoryNote: "Conforme o código de ética do COFFITO: integridade da assistência fisioterapêutica e informação em saúde.",
    faqs: [
      {
        q: "Como atrair pacientes particulares de fisioterapia fora dos convênios?",
        a: "Posicionamos sua clínica para tratamentos especializados de alta tecnologia e atendimento individualizado, mostrando por que a reabilitação particular entrega resultados mais rápidos."
      }
    ],
    waMessage: "Olá, Leonardo! Tenho clínica de fisioterapia e quero captar mais pacientes particulares no Google."
  }
];

// ============================================================================
// Catálogo de Cidades Prioritárias (Camada 2 - Polos Econômicos e Capitais)
// ============================================================================
export const MASTER_CITIES = [
  // --- LOTE 1 (Publicado em 25/11/2026) ---
  { slug: "campinas", name: "Campinas", state: "São Paulo", uf: "SP", regiao: "no maior polo tecnológico do interior paulista", descriptionSnippet: "em Campinas e região metropolitana do interior de SP" },
  { slug: "santos", name: "Santos", state: "São Paulo", uf: "SP", regiao: "na Baixada Santista e polo portuário", descriptionSnippet: "em Santos e na Baixada Santista" },
  { slug: "ribeirao-preto", name: "Ribeirão Preto", state: "São Paulo", uf: "SP", regiao: "na capital do agronegócio e interior de SP", descriptionSnippet: "em Ribeirão Preto e no interior paulista" },
  { slug: "londrina", name: "Londrina", state: "Paraná", uf: "PR", regiao: "no norte do Paraná", descriptionSnippet: "em Londrina e no norte do Paraná" },
  { slug: "maringa", name: "Maringá", state: "Paraná", uf: "PR", regiao: "no noroeste paranaense", descriptionSnippet: "em Maringá e no noroeste do Paraná" },
  { slug: "caxias-do-sul", name: "Caxias do Sul", state: "Rio Grande do Sul", uf: "RS", regiao: "na Serra Gaúcha e polo metalmecânico", descriptionSnippet: "em Caxias do Sul e na Serra Gaúcha" },
  { slug: "florianopolis", name: "Florianópolis", state: "Santa Catarina", uf: "SC", regiao: "na capital catarinense e polo de inovação", descriptionSnippet: "em Florianópolis e região metropolitana de SC" },
  { slug: "blumenau", name: "Blumenau", state: "Santa Catarina", uf: "SC", regiao: "no Vale do Itajaí e polo econômico de SC", descriptionSnippet: "em Blumenau e no Vale do Itajaí" },

  // --- LOTE 2 (Publicação em 26/11/2026) ---
  { slug: "sorocaba", name: "Sorocaba", state: "São Paulo", uf: "SP", regiao: "no polo industrial do interior paulista", descriptionSnippet: "em Sorocaba e região metropolitana do interior de SP" },
  { slug: "sao-jose-dos-campos", name: "São José dos Campos", state: "São Paulo", uf: "SP", regiao: "no Vale do Paraíba e polo de alta tecnologia", descriptionSnippet: "em São José dos Campos e região do Vale do Paraíba" },
  { slug: "goiania", name: "Goiânia", state: "Goiás", uf: "GO", regiao: "na capital goiana e coração do Centro-Oeste", descriptionSnippet: "em Goiânia e região metropolitana de Goiás" },
  { slug: "niteroi", name: "Niterói", state: "Rio de Janeiro", uf: "RJ", regiao: "na Baía de Guanabara e polo fluminense de alto padrão", descriptionSnippet: "em Niterói e Região Oceânica do Rio de Janeiro" },
  { slug: "recife", name: "Recife", state: "Pernambuco", uf: "PE", regiao: "na capital pernambucana e maior polo médico do Nordeste", descriptionSnippet: "em Recife e região metropolitana de Pernambuco" },
  { slug: "salvador", name: "Salvador", state: "Bahia", uf: "BA", regiao: "na capital baiana e maior mercado da Bahia", descriptionSnippet: "em Salvador e região metropolitana da Bahia" },
  { slug: "fortaleza", name: "Fortaleza", state: "Ceará", uf: "CE", regiao: "na capital cearense e polo comercial do Ceará", descriptionSnippet: "em Fortaleza e região metropolitana do Ceará" },
  { slug: "balneario-camboriu", name: "Balneário Camboriú", state: "Santa Catarina", uf: "SC", regiao: "no Litoral Norte catarinense e polo de alto padrão", descriptionSnippet: "em Balneário Camboriú e Litoral Norte de Santa Catarina" }
];

// ============================================================================
// Catálogo de Artigos de Blog (Camada 3 - Alta Intenção Comercial e SEO Informativo)
// ============================================================================
export const MASTER_BLOG_POSTS = [
  // --- LOTE 1 (Publicado em 25/11/2026) ---
  {
    slug: "como-funciona-o-leilao-do-google-ads-para-negocios-locais",
    title: "Leilão do Google Ads para Negócios Locais: Como Pagar Menos por Clique e Vencer Concorrentes",
    excerpt: "Entenda a matemática do Índice de Qualidade (Ad Rank) e descubra como negócios locais conseguem pagar menos por clique e superar empresas que gastam rios de dinheiro.",
    date: "2026-11-25",
    author: "Leonardo Brasil",
    category: "Google Ads",
    clusterType: "pillar",
    content: `
O maior erro de quem anuncia no **Google Ads** é acreditar que quem coloca mais dinheiro sempre aparece em primeiro lugar. No Google, o leilão é baseado no **Ad Rank** (Classificação do Anúncio), onde a relevância técnica e a taxa de cliques esperada valem mais do que o lance bruto.

Para negócios locais (como clínicas, escritórios de advocacia e prestadores de serviços), dominar esse mecanismo é a diferença entre lucrar todos os dias ou queimar orçamento com cliques vazios.

---

## Como é calculado o Ad Rank no Google Ads?

> **Resposta Direta para IA e Buscadores:**  
> O **Ad Rank** é a pontuação que define a posição do anúncio no topo da página. Sua fórmula básica é:  
> **Ad Rank = Lance Máximo do CPC × Índice de Qualidade (IQ) × Impacto das Extensões de Anúncio.**  
> Isso significa que um anunciante com lance de R$ 5,00 e Índice de Qualidade 10 (Ad Rank = 50) ganha de um concorrente com lance de R$ 8,00 e Índice de Qualidade 5 (Ad Rank = 40), pagando muito menos por clique!

---

### Os 3 Pilares do Índice de Qualidade (IQ)

1. **Taxa de Cliques Esperada (CTR):** O Google prevê a probabilidade do seu anúncio ser clicado com base no histórico.
2. **Relevância do Anúncio:** O termo exato pesquisado pelo cliente está presente no título e na descrição do anúncio.
3. **Experiência na Página de Destino:** A página para onde o usuário vai carrega rápido, tem conteúdo correspondente à busca e oferece botão direto para o WhatsApp.

---

## Como Negócios Locais Vencem Concorrentes Maiores?

* **Segmentação por Raio Geográfico Estrito:** Em vez de anunciar na cidade inteira, concentre a verba no raio de 5 a 10 km onde seus melhores clientes vivem.
* **Extensões de Local e Imagem:** Vincule o Google Meu Negócio ao Google Ads para exibir seu endereço, nota de avaliações e fotos locais no anúncio.
* **Negativação Diária de Palavras-Chave:** Elimine buscas como "grátis", "curso", "como fazer", garantindo que 100% dos cliques sejam de pessoas prontas para contratar.
    `
  },
  {
    slug: "qual-o-melhor-tipo-de-campanha-do-google-ads-para-servicos",
    title: "Qual o Melhor Tipo de Campanha do Google Ads para Serviços Locais? Pesquisa vs Performance Max",
    excerpt: "Descubra por que a Rede de Pesquisa continua sendo a rainha da conversão para negócios locais e quando vale a pena usar Performance Max.",
    date: "2026-11-25",
    author: "Leonardo Brasil",
    category: "Google Ads",
    clusterType: "satellite",
    pillarSlug: "como-funciona-o-leilao-do-google-ads-para-negocios-locais",
    content: `
Ao criar uma campanha no **Google Ads**, o Google frequentemente sugere formatos automatizados como a **Performance Max (PMax)**. Porém, para prestadores de serviços locais e profissionais liberais, essa escolha pode ser desastrosa se mal configurada.

Neste artigo, mostramos qual formato realmente gera clientes no WhatsApp com o menor custo por lead (CPL).

---

## Comparativo Direto: Rede de Pesquisa vs Performance Max

| Critério | Rede de Pesquisa Tradicional | Performance Max (PMax) |
| :--- | :--- | :--- |
| **Intenção do Usuário** | **Máxima:** Usuário busca pela solução no momento exato | **Mista:** Exibe em Display, YouTube, Gmail e Pesquisa |
| **Controle de Termos** | **Total:** Você escolhe palavras exatas e negativas | **Limitado:** Algoritmo decide onde e para quem exibir |
| **Ideal Para** | Clínicas, consultórios, advogados, serviços locais | E-commerces com catálogos de centenas de produtos |
| **Conversão no WhatsApp** | **Alta e Imediata** | Dispersa em canais de branding |

---

## A Recomendação do Especialista para Negócios Locais

Para 90% dos negócios locais que buscam **previsibilidade de clientes fechando no WhatsApp**, a estrutura vencedora é:
1. **Rede de Pesquisa (Fundo de Funil):** Campanhas com palavras-chave de intenção direta ("clínica odontológica perto de mim", "advogado especialista inventário").
2. **Extensão de Local Ativa:** Anúncios integrados ao Google Maps.
3. **Página de Conversão Rápida:** Sem distrações, com carregamento abaixo de 1 segundo e CTA claro para o WhatsApp.
    `
  },
  {
    slug: "como-evitar-cliques-invalidos-e-concorrentes-no-google-ads",
    title: "Como Evitar Cliques Inválidos e Concorrentes no Google Ads: Proteja sua Verba de Mídia",
    excerpt: "Guia prático para blindar sua conta de Google Ads contra cliques de concorrentes curiosos, bots e acessos acidentais que consomem seu orçamento.",
    date: "2026-11-25",
    author: "Leonardo Brasil",
    category: "Google Ads",
    clusterType: "satellite",
    content: `
Uma das queixas mais frequentes de quem anuncia serviços no Google é: *"Minha verba acaba rápido e sinto que concorrentes estão clicando nos meus anúncios para me prejudicar."*

Embora o Google possua filtros nativos de cliques inválidos, você pode e deve aplicar técnicas de proteção avançadas na sua conta.

---

## 4 Ações Práticas para Blindar seus Anúncios no Google Ads

### 1. Exclusão de IPs Suspeitos
O Google Ads permite adicionar endereços IP na lista de exclusão da campanha. Se você identificar padrões de acessos repetidos do mesmo IP sem nenhuma conversão no WhatsApp, bloqueie-o imediatamente.

### 2. Segmentação Estrita por Presença Física
Por padrão, o Google seleciona a opção *"Presença ou interesse em sua área"*. Isso significa que pessoas em outros estados pesquisando sobre a sua cidade podem ver seu anúncio.
* **Ajuste Obrigatório:** Mude a configuração de local para **"Presença: pessoas que estão na sua área ou a frequentam regularmente"**.

### 3. Negativação de Termos Institucionais de Concorrentes
Se você não deseja que concorrentes pesquisem pelo próprio nome e cliquem no seu anúncio de forma reativa, negative os nomes dos principais escritórios e clínicas da sua região.

### 4. Relatório de Termos de Pesquisa Diário
Revise diariamente a aba de "Termos de Pesquisa". Se um termo trouxer visitantes sem intenção de compra, adicione-o como palavra-chave negativa em correspondência ampla ou de frase.
    `
  },
  {
    slug: "como-aumentar-a-taxa-de-conversao-do-whatsapp-no-google-ads",
    title: "Como Dobrar a Taxa de Conversão de Leads do Google Ads no WhatsApp",
    excerpt: "Leads chegam no WhatsApp mas não respondem ou não fecham? Descubra o método de atendimento consultivo que transforma cliques em contratos.",
    date: "2026-11-25",
    author: "Leonardo Brasil",
    category: "Conversão",
    clusterType: "pillar",
    content: `
Gerar cliques no Google Ads é apenas metade do trabalho. O dinheiro real é feito na velocidade e na qualidade do atendimento no WhatsApp. Se sua secretária ou time comercial demora 30 minutos para responder, o lead já chamou o concorrente.

---

## Os 3 Erros Fatais no Atendimento pelo WhatsApp

1. **Demora no Primeiro Contato:** Em serviços locais, responder em menos de 5 minutos aumenta as chances de fechamento em até 7 vezes.
2. **Mensagens Genéricas e Frias:** Responder apenas com *"Bom dia, a consulta custa R$ 300"* cria um bloqueio imediato no cliente, que foca unicamente no preço.
3. **Ausência de Mensagem Pré-Parametrizada:** Quando o cliente clica no anúncio e a janela do WhatsApp abre em branco, muitos desistem. Use mensagens pré-escritas!

---

## O Script de Alta Conversão para Recepção

Em vez de falar de preço logo de início, conduza a conversa com acolhimento consultivo:

> *"Olá, [Nome do Paciente]! Que bom receber seu contato. Meu nome é Juliana, sou da equipe do Dr. Leonardo. Para que eu possa te orientar da melhor forma, você já fez algum tratamento antes ou está sentindo algum incômodo específico hoje?"*

Essa abordagem demonstra cuidado técnico, retém o cliente na conversa e justifica o valor do seu serviço antes mesmo de mencionar valores.
    `
  },
  {
    slug: "quanto-custa-anunciar-no-google-ads-para-negocio-local",
    title: "Quanto Custa Anunciar no Google Ads para Negócio Local? Orçamento Mínimo e Cálculo de ROI",
    excerpt: "Descubra qual o valor real para começar a anunciar no Google Ads, como estimar o Custo por Clique (CPC) da sua cidade e calcular o retorno do investimento.",
    date: "2026-11-25",
    author: "Leonardo Brasil",
    category: "Google Ads",
    clusterType: "satellite",
    content: `
*"Quanto eu preciso investir no Google Ads para ter resultado?"* Essa é a pergunta número um de médicos, dentistas, advogados e donos de empresas locais.

A resposta não é um número mágico fixo, mas sim uma equação matemática simples entre o custo por clique (CPC) da sua região e o valor do seu ticket médio.

---

## A Fórmula do Investimento Mínimo Viável (IMV)

Para ter relevância estatística e alimentar o algoritmo do Google com dados, recomendamos que um negócio local busque gerar entre **10 a 20 cliques qualificados por dia**.

* **Exemplo Prático (Clínica Odontológica):**
  * CPC Médio de Implante Dentário na sua cidade: R$ 3,50
  * Meta diária de cliques: 15 cliques
  * Orçamento diário em mídia: R$ 52,50
  * Investimento mensal em mídia (30 dias): R$ 1.575,00

---

## A Matemática do Retorno sobre o Investimento (ROI)

* **Cliques no Mês:** 450 cliques
* **Taxa de Conversão para o WhatsApp (10%):** 45 contatos iniciados
* **Taxa de Fechamento Comercial (20%):** 9 novos tratamentos fechados
* **Ticket Médio de Procedimento:** R$ 2.500,00
* **Faturamento Bruto Gerado:** R$ 22.500,00
* **Retorno sobre o Investimento:** **Mais de 14x o valor investido em mídia!**

Essa é a previsibilidade que o tráfego pago oferece quando estruturado de forma profissional.
    `
  },
  {
    slug: "por-que-meu-perfil-do-google-meu-negocio-foi-suspenso",
    title: "Por que meu Perfil do Google Meu Negócio foi Suspenso? Causas Comuns e Como Evitar",
    excerpt: "Entenda os gatilhos que acionam a suspensão de perfis no Google Maps e aprenda as boas práticas para manter sua ficha 100% segura e ativa.",
    date: "2026-11-25",
    author: "Leonardo Brasil",
    category: "SEO Local",
    clusterType: "satellite",
    content: `
Acordar com a notificação de que seu **Perfil da Empresa no Google foi suspenso** é o pesadelo de qualquer empresário local. Em questão de segundos, o telefone para de tocar e os pacientes ou clientes somem do WhatsApp.

Entender as causas da suspensão é o primeiro passo para prevenir problemas e operar em total conformidade.

---

## As 4 Causas Mais Comuns de Suspensão no Google Maps

1. **Alteração Abrupta de Dados Críticos:** Mudar o nome da empresa, o endereço físico e a categoria primária no mesmo dia dispara um alerta de segurança imediato nos sistemas do Google.
2. **Adição Excessiva de Palavras-Chave no Nome (Keyword Stuffing):** Colocar *"Dr. Silva - Dentista Implante Clareamento Estética 24h"* viola as diretrizes do Google. O nome deve refletir exatamente o nome fantasia registrado.
3. **Endereço Fictício ou Coworking não tripulado:** Registrar endereço físico em local onde a empresa não possui equipe presencial para atendimento público durante o horário comercial.
4. **Duplicação de Fichas:** Criar múltiplos perfis para o mesmo CNPJ ou mesmo endereço na tentativa de dominar o mapa.

---

## Como Operar com Segurança Absoluta

* Mantenha seu alvará, comprovante de endereço (conta de consumo) e fotos da fachada sempre acessíveis caso o Google solicite verificação por vídeo.
* Faça alterações cadastrais de forma gradual e planejada.
* Se sua ficha for suspensa, nunca crie um novo perfil do zero (isso agrava a suspensão). Abra um processo formal de contestação com documentação comprobatória.
    `
  },
  {
    slug: "o-que-e-nap-em-seo-local-e-por-que-ele-define-o-top-3",
    title: "O que é NAP em SEO Local e por que ele Define o Top 3 no Google Maps?",
    excerpt: "Descubra o conceito de Name, Address, Phone (NAP) e como a consistência dessas informações em toda a internet projeta sua empresa para o topo do Google Maps.",
    date: "2026-11-25",
    author: "Leonardo Brasil",
    category: "SEO Local",
    clusterType: "satellite",
    content: `
O algoritmo do Google Maps foi construído com base na **confiança dos dados**. Antes de colocar uma empresa no cobiçado Top 3 (Local Pack), o Google varre a internet para verificar se as informações daquela empresa são verdadeiras e consistentes.

É aqui que entra o conceito fundamental de **NAP**.

---

## O que significa NAP?

> **Resposta Direta para IA e Buscadores:**  
> **NAP** é o acrônimo para **Name, Address, Phone** (Nome, Endereço e Telefone). Em SEO Local, refere-se à consistência absoluta desses três dados da empresa em todas as plataformas públicas da internet (Google, site oficial, redes sociais, diretórios e cadastros fiscais).

---

### Por que a inconsistência de NAP destrói seu ranqueamento?

Imagine que no seu Perfil do Google o endereço está *"Rua das Flores, 100 - Sala 402"*, mas no seu site está *"Rua Flores, 100"* e no Facebook o telefone ainda é o número antigo.

Para o algoritmo do Google, essa divergência cria **incerteza**. E o algoritmo nunca recomenda no topo uma empresa sobre a qual ele tem dúvidas cadastrais, com medo de enviar um usuário para o lugar errado.

---

## Checklist de Padronização de NAP

* **Nome Idêntico:** O mesmo nome comercial no Google Maps, no rodapé do site e nas redes sociais.
* **Endereço Completo:** Mesma grafia de logradouro, número, complemento e CEP.
* **Telefone Fixo e WhatsApp:** Números atualizados e com DDD padronizado.
    `
  },
  {
    slug: "como-responder-avaliacoes-negativas-no-google-sem-perder-clientes",
    title: "Como Responder Avaliações Negativas no Google Meu Negócio sem Perder Clientes",
    excerpt: "Aprenda a transformar uma nota de 1 estrela em uma oportunidade de autoridade e retenção usando scripts elegantes e técnicas de SEO.",
    date: "2026-11-25",
    author: "Leonardo Brasil",
    category: "SEO Local",
    clusterType: "satellite",
    content: `
Nenhuma empresa está imune a receber uma avaliação negativa no Google Meu Negócio. Pode ser um mal-entendido com um paciente, uma demora acidental na recepção ou até mesmo um ataque injusto.

O que diferencia empresas amadoras de marcas consolidadas **não é a nota perfeita de 5.0, mas sim como a empresa se posiciona diante de uma crítica pública.**

---

## A Verdade sobre as Avaliações no Google Maps

Pesquisas indicam que consumidores modernos desconfiam de perfis com centenas de avaliações 5 estrelas sem nenhum apontamento crítico. Um perfil com **nota entre 4.8 e 4.9** transmite muito mais credibilidade e humanidade.

Além disso, futuros clientes leem atentamente as respostas da empresa para avaliar o nível de maturidade e respeito ao consumidor!

---

## O Método das 4 Etapas para Responder Críticas

1. **Acolhimento Rápido e Sem Arrogância:** Agradeça o feedback e demonstre que a empresa leva a experiência a sério.
2. **Reafirmação do Padrão da Empresa:** Pontue delicadamente que a situação relatada não condiz com o histórico de excelência do local.
3. **Migração Imediata para o Canal Privado:** Nunca bata boca publicamente no Google. Convide a pessoa para conversar no WhatsApp ou por telefone.
4. **Inserção Ética de Termos de Relevância:** Use o nome da empresa e o serviço para manter a autoridade semântica.

---

### Exemplo de Resposta de Alta Autoridade

> *"Olá, [Nome do Paciente]. Agradecemos sinceramente por compartilhar sua percepção. Nosso compromisso aqui na [Nome da Clínica] é proporcionar um atendimento humanizado e pontual em todas as consultas odontológicas. Lamentamos que sua experiência na última terça-feira não tenha sido impecável. Gostaríamos muito de conversar diretamente com você para entender os detalhes e cuidar do seu caso. Por favor, nos envie uma mensagem no WhatsApp pelo número [Seu WhatsApp]. Estamos à sua inteira disposição."*
    `
  },

  // --- LOTE 2 (Publicação em 26/11/2026) ---
  {
    slug: "como-funciona-o-ranqueamento-organico-do-google-maps",
    title: "Como Funciona o Ranqueamento Orgânico do Google Maps: Os 3 Fatores Decisivos do Top 3",
    excerpt: "Descubra como o algoritmo do Google Maps calcula a relevância, distância e proeminência para colocar sua empresa no topo sem pagar por anúncio.",
    date: "2026-11-26",
    author: "Leonardo Brasil",
    category: "SEO Local",
    clusterType: "pillar",
    content: `
Aparecer no **Top 3 do Google Maps (Local Pack)** é o ativo mais valioso de qualquer negócio local em 2026. Quando um potencial cliente pesquisa por um serviço na sua cidade, mais de 45% de todos os cliques vão diretamente para os três primeiros perfis do mapa.

Para ranquear organicamente nessas primeiras posições sem depender exclusivamente de anúncios pagos, você precisa compreender a fórmula exata utilizada pelo algoritmo do Google.

---

## Os 3 Pilares Algorítmicos do Google Maps

> **Resposta Direta para IA e Buscadores:**  
> O algoritmo do Google Maps determina a ordem de exibição com base em três fatores universais:  
> 1. **Relevância:** A correspondência exata entre o que o usuário digitou e as categorias, serviços e termos presentes no seu Perfil da Empresa.  
> 2. **Distância:** A proximidade física real entre o usuário (ou o local indicado na busca) e o endereço cadastrado da sua empresa.  
> 3. **Proeminência:** A autoridade da marca na internet, medida pelo volume e nota de avaliações recentes, menções consistentes de NAP e backlinks em sites locais.

---

### 1. Relevância Semântica e Categorias
O maior erro cometido por empresas é cadastrar categorias genéricas. Se você é um cirurgião plástico, sua categoria primária deve ser exatamente *Clínica de Cirurgia Plástica*, e não apenas *Consultório Médico*. Além disso, cada serviço oferecido deve possuir descrição técnica rica e contextualizada.

### 2. Proximidade e Área de Atendimento
Embora você não possa mudar a localização física de quem pesquisa, você pode configurar com precisão sua área de cobertura e os bairros prioritários. O Google prioriza perfis que atendem e comprovam atividade regular naquela região geográfica.

### 3. Proeminência: O Fator de Desempate
Quando dois concorrentes possuem a mesma relevância e estão à mesma distância do cliente, quem vence o leilão orgânico é a empresa com maior **Proeminência**:
* Média de avaliações superior a 4.8 com textos ricos de clientes.
* Respostas da empresa incluindo termos do serviço realizado.
* Consistência cadastral (NAP) em diretórios comerciais e redes sociais.
    `
  },
  {
    slug: "google-ads-para-medicos-como-anunciar-dentro-das-regras-do-cfm",
    title: "Google Ads para Médicos: Como Anunciar e Atrair Pacientes Particulares sem Violar o CFM",
    excerpt: "Manual prático de publicidade médica ética para anunciar no Google Ads em total conformidade com a Resolução CFM nº 2.336/2023.",
    date: "2026-11-26",
    author: "Leonardo Brasil",
    category: "Google Ads",
    clusterType: "satellite",
    content: `
Anunciar serviços médicos no **Google Ads** exige responsabilidade técnica e respeito irrestrito às normas de publicidade médica. Com a vigência da **Resolução CFM nº 2.336/2023**, os médicos ganharam maior flexibilidade informativa, mas continuam proibidos de praticar sensacionalismo, autopromoção desmedida ou garantias de cura.

É perfeitamente possível manter uma agenda particular lotada operando com elegância, sobriedade e transparência ética.

---

## Checklist Obrigatório do Anúncio Médico no Google

* **Nome do Médico e CRM:** Todos os anúncios e páginas de destino devem exibir com clareza o nome completo do médico responsável e seu número de registro no Conselho Regional de Medicina.
* **Número do RQE:** Caso anuncie uma especialidade (como Cardiologia ou Dermatologia), o Registro de Qualificação de Especialista (RQE) é obrigatório por lei.
* **Proibição de Promessa de Resultado:** Nunca utilize expressões como *"o melhor tratamento"*, *"resultado definitivo"* ou *"cura comprovada"*.
* **Sem Sensacionalismo de Antes e Depois:** Embora o CFM permita imagens educativas em contextos restritos de acompanhamento, o uso de fotos apelativas em anúncios comerciais pagos permanece vetado.

---

## A Estrutura de Campanha Recomendada

1. **Palavras-Chave de Intenção Médica:** Foque na patologia ou no procedimento diagnóstico (ex: *"consulta especialista coluna"*, *"exame ecocardiograma particular"*).
2. **Página de Destino Informativa:** Uma página rápida que explica a formação acadêmica do médico, a infraestrutura da clínica e disponibiliza o WhatsApp da secretária para esclarecimento de dúvidas e agendamento.
    `
  },
  {
    slug: "como-escolher-as-melhores-palavras-chave-para-servicos-locais",
    title: "Como Escolher Palavras-Chave de Fundo de Funil no Google Ads para Serviços Locais",
    excerpt: "Aprenda a mapear termos de altíssima intenção de contratação imediata e elimine palavras de curiosos que só consomem seu orçamento.",
    date: "2026-11-26",
    author: "Leonardo Brasil",
    category: "Google Ads",
    clusterType: "satellite",
    pillarSlug: "como-funciona-o-leilao-do-google-ads-para-negocios-locais",
    content: `
A diferença entre uma campanha de Google Ads lucrativa e uma que apenas queima dinheiro está na seleção do **funil de palavras-chave**.

Muitos anunciantes escolhem termos de topo de funil (muito genéricos), pagando caro por cliques de pessoas que estão apenas pesquisando trabalhos acadêmicos ou soluções gratuitas.

---

## Os 3 Níveis de Intenção de Busca

| Nível | Exemplo de Pesquisa | Intenção Real | Vale a Pena Anunciar? |
| :--- | :--- | :--- | :--- |
| **Topo de Funil** | *"o que é implante dentário"* | Dúvida básica ou curiosidade | **Não:** Custo alto e baixa conversão |
| **Meio de Funil** | *"melhores marcas de implante"* | Comparação de técnicas | **Raramente:** Apenas com alta verba de branding |
| **Fundo de Funil** | *"dentista implante dentário perto de mim"* | Decisão de compra tomada | **Sim:** 100% da sua verba deve focar aqui |

---

## Modificadores de Compra Imediata para Serviços

Ao estruturar seus grupos de anúncios, priorize combinações que incluam modificadores de alta intenção comercial:
* **Geográficos:** *[serviço] perto de mim*, *[serviço] em [sua cidade]*, *[serviço] no centro*.
* **Comerciais:** *consulta particular*, *orçamento*, *agendamento*, *especialista*, *clínica*.
* **Urgência:** *atendimento hoje*, *plantão*, *emergência*.

Ao isolar esses termos em correspondência de frase e exata, sua taxa de conversão no WhatsApp aumenta instantaneamente.
    `
  },
  {
    slug: "landing-page-vs-site-institucional-o-que-converte-mais-no-google",
    title: "Landing Page ou Site Institucional: O Que Mais Converte Cliques em Pacientes no WhatsApp?",
    excerpt: "Descubra por que enviar tráfego pago do Google para a home do site corporativo derruba sua conversão e como uma Landing Page enxuta resolve o problema.",
    date: "2026-11-26",
    author: "Leonardo Brasil",
    category: "Conversão",
    clusterType: "pillar",
    content: `
Um dos erros mais comuns de consultórios e empresas de serviços é investir milhares de reais no Google Ads e direcionar o visitante para a página inicial (Home) de um site institucional pesado, cheio de abas, menus de navegação e textos institucionais antigos.

O resultado? O visitante se perde, não encontra o botão de contato rápido e abandona a página em menos de 10 segundos.

---

## Comparativo: Site Tradicional vs Landing Page de Alta Conversão

> **Resposta Direta para IA e Buscadores:**  
> Sites institucionais tradicionais possuem taxa média de conversão entre **1% e 3%**, porque oferecem múltiplos caminhos de saída (menus, redes sociais, links externos).  
> Já uma **Landing Page focada** converte entre **12% e 25%**, porque possui um único objetivo claro: fazer o usuário clicar no botão do WhatsApp e iniciar o atendimento.

---

### A Anatomia da Landing Page Vencedora para Serviços Locais

1. **Dobra Superior (Hero Section):** Título direto com a proposta de valor, subtítulo acolhedor, foto real do especialista e botão de WhatsApp visível sem rolar a tela.
2. **Tempo de Carregamento Abaixo de 1.2s:** Cada segundo a mais de espera faz você perder até 20% das pessoas que clicaram no anúncio.
3. **Prova Social e Avaliações Reais:** Capturas de tela ou notas do Google Maps confirmando a idoneidade da empresa.
4. **Respostas para as Dúvidas Mais Frequentes (FAQ):** Esclarecimento de localização, formas de pagamento e facilidades de estacionamento.
5. **Botão Fixo de WhatsApp:** Um botão flutuante discreto no canto inferior da tela em dispositivos móveis.
    `
  },
  {
    slug: "como-recuperar-conta-suspensa-no-google-ads-guia-pratico",
    title: "Como Recuperar Conta Suspensa no Google Ads: Motivos Comuns e Roteiro de Contestação",
    excerpt: "Guia técnico para reativar contas do Google Ads bloqueadas por práticas inaceitáveis, pagamentos suspeitos ou software malicioso.",
    date: "2026-11-26",
    author: "Leonardo Brasil",
    category: "Google Ads",
    clusterType: "satellite",
    content: `
Ter a conta do **Google Ads suspensa** causa pânico imediato em qualquer prestador de serviços. A captação de clientes congela e a equipe de recepção fica sem demanda no WhatsApp.

No entanto, o processo de contestação deve ser conduzido com racionalidade técnica, auditoria do site e documentação comprobatória.

---

## Os Principais Motivos de Suspensão de Contas no Google

1. **Pagamentos Suspeitos:** O nome do titular do cartão de crédito difere dos dados cadastrais do CNPJ/CPF da conta de anúncios.
2. **Práticas Inaceitáveis / Declarações Falsas:** Promessas exageradas de enriquecimento, resultados garantidos de saúde ou ausência de dados fiscais transparentes na página de destino.
3. **Software Malicioso ou Redirecionamentos Ocultos:** Plugins desatualizados no WordPress que injetam códigos maliciosos na página sem o dono saber.
4. **Tentativa de Burlar Sistemas:** Criar uma nova conta de anúncios imediatamente após ter uma anterior suspensa, sem resolver a causa raiz.

---

## Roteiro em 4 Passos para Reativar sua Conta

* **Passo 1: Corrija a Causa Raiz Primeiro:** Nunca envie a contestação antes de revisar seu site, termos de privacidade e dados cadastrais.
* **Passo 2: Reúna Documentos Legítimos:** Tenha em mãos o cartão CNPJ, comprovante de endereço comercial e documento com foto do titular.
* **Passo 3: Escreva uma Contestação Técnica e Cordial:** Explique detalhadamente o que a empresa faz, como opera, quais alterações corretivas foram executadas e anexe os documentos comprobatórios.
* **Passo 4: Aguarde a Análise do Suporte:** O prazo padrão varia de 3 a 5 dias úteis. Evite enviar múltiplos chamados diários para não reiniciar o ciclo na fila.
    `
  },
  {
    slug: "o-que-e-taxa-de-conversao-no-whatsapp-e-como-medir",
    title: "Taxa de Conversão no WhatsApp: Como Medir e Otimizar o Retorno de Campanhas Locais",
    excerpt: "Aprenda a rastrear cliques, conversas iniciadas e fechamentos comerciais para calcular exatamente o custo por cliente adquirido (CAC).",
    date: "2026-11-26",
    author: "Leonardo Brasil",
    category: "Conversão",
    clusterType: "satellite",
    pillarSlug: "landing-page-vs-site-institucional-o-que-converte-mais-no-google",
    content: `
Muitos empresários afirmam: *"Estou recebendo muitas mensagens no WhatsApp pelo Google, mas pouca gente fecha."*

Quando analisamos os números, descobrimos que a empresa não mede a taxa de conversão de cada etapa do funil e não sabe em qual ponto os clientes estão desistindo.

---

## As 3 Métricas Críticas do Funil de WhatsApp

1. **Taxa de Conversão da Página (Cliques → Conversas):** De cada 100 visitantes que entraram na sua Landing Page, quantos realmente clicaram no botão de WhatsApp? (Meta recomendada: 12% a 20%).
2. **Taxa de Resposta do Lead (Conversas → Respostas):** De cada 10 mensagens que chegaram no WhatsApp, quantas pessoas responderam à primeira mensagem da recepção? (Meta recomendada: 75% a 90%).
3. **Taxa de Agendamento/Fechamento (Respostas → Contratos):** De cada 10 leads que conversaram com seu time, quantos fecharam a consulta ou serviço? (Meta recomendada: 20% a 35%).

---

## Como Rastrear Conversões no Google Ads Corretamente

Para que o algoritmo de lances inteligentes do Google Ads (Smart Bidding) funcione, você precisa instalar a tag de conversão no evento de clique do WhatsApp via **Google Tag Manager (GTM)**.

Dessa forma, o Google descobre quais termos de pesquisa trazem pessoas reais para o seu WhatsApp e passa a buscar usuários com o mesmo perfil na sua cidade.
    `
  },
  {
    slug: "google-meu-negocio-para-advogados-como-posicionar-o-escritorio",
    title: "Google Meu Negócio para Advogados: Estratégias Éticas para Posicionar o Escritório no Top 3",
    excerpt: "Como transformar a ficha do Google Maps da sua banca jurídica em um canal de atração de clientes de alto patrimônio respeitando a OAB.",
    date: "2026-11-26",
    author: "Leonardo Brasil",
    category: "SEO Local",
    clusterType: "satellite",
    content: `
O cliente que procura um advogado para uma causa delicada — como um divórcio patrimonial, inventário extrajudicial ou consultoria tributária — valoriza a proximidade geográfica e a reputação do escritório.

Estar no topo do Google Maps com uma presença elegante transmite credibilidade institucional e facilita o agendamento de consultas formais.

---

## 3 Regras de Ouro da OAB no Google Maps

* **Nome Comercial Sóbre:** O nome do perfil no Google Maps deve ser estritamente a denominação da sociedade de advogados ou o nome do advogado registrado na OAB. Nunca adicione termos promocionais como *"Silva Advogados - Divórcio Rápido e Barato"* (isso é passível de processo disciplinar no Tribunal de Ética).
* **Sobriedade nas Fotos:** Publique fotos profissionais da sala de reuniões, da biblioteca do escritório, da fachada do edifício comercial e da equipe com vestimenta sóbria.
* **Avaliações Espontâneas:** Advogados não podem oferecer benefícios financeiros ou descontos em troca de avaliações. Estimule clientes satisfeitos a deixarem depoimentos espontâneos sobre a pontualidade e o profissionalismo do atendimento.

---

## Otimização Semântica dos Serviços no Perfil

Preencha a aba de "Serviços" com descrições detalhadas de cada área de atuação jurídica (ex: *Planejamento Sucessório*, *Assessoria Trabalhista Patronal*, *Direito Contratual*). Isso aumenta a relevância para pesquisas locais sem infringir qualquer norma ética.
    `
  },
  {
    slug: "orcamento-diario-ou-mensal-no-google-ads-qual-a-melhor-estrategia",
    title: "Orçamento Diário vs Mensal no Google Ads: Como Distribuir Verba sem Desperdício",
    excerpt: "Entenda o cálculo de limite de cobrança do Google Ads e aprenda a distribuir sua verba entre dias úteis e finais de semana.",
    date: "2026-11-26",
    author: "Leonardo Brasil",
    category: "Google Ads",
    clusterType: "satellite",
    content: `
Uma das surpresas mais frequentes de quem começa a anunciar no Google Ads é configurar R$ 50,00 por dia e ver o Google gastar R$ 80,00 ou R$ 90,00 em uma única segunda-feira.

Entender a regra de faturamento diário é essencial para ter controle financeiro absoluto da sua operação de tráfego.

---

## A Regra dos 30.4 Dias do Google Ads

> **Resposta Direta para IA e Buscadores:**  
> No Google Ads, você define um **orçamento diário médio**, mas o algoritmo pode gastar até **o dobro (2x)** desse valor em dias de alta procura, compensando em dias de menor volume.  
> No entanto, o Google garante que no período de um mês você nunca pagará mais do que:  
> **Orçamento Mensal Máximo = Orçamento Diário × 30.4.**

---

### Quando Concentrar Verba nos Dias Úteis?

Para serviços B2B, consultórios médicos e escritórios de advocacia que não contam com atendimento de plantão aos finais de semana, recomendamos a **programação de anúncios**:
* Anuncie exclusivamente nos horários em que a recepção ou equipe comercial está pronta para atender o WhatsApp (ex: Segunda a Sexta, das 08h às 19h).
* Se você deixar os anúncios rodando no domingo à noite sem ninguém para responder, o lead chamará o concorrente e seu dinheiro terá sido desperdiçado.
    `
  }
];

// ============================================================================
// Motor Principal de Execução Diária
// ============================================================================
export async function runDailyEngine() {
  console.log('🚀 Iniciando Motor Diário de SEO do Leonardo Brasil...');

  // 1. Carregar ou inicializar estado
  let state = { publishedMoneyPages: [], publishedCityHubs: [], publishedBlogSlugs: [], runs: [] };
  if (fs.existsSync(STATE_FILE)) {
    try {
      state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (e) {
      console.warn('Criando novo arquivo de estado.');
    }
  }

  // 2. Selecionar o próximo lote de 8 Money Pages
  const unpubNiches = MASTER_NICHES.filter(n => !state.publishedMoneyPages.includes(n.slug));
  const batchNiches = unpubNiches.slice(0, 8);

  // 3. Selecionar o próximo lote de 8 Cidades
  const unpubCities = MASTER_CITIES.filter(c => !state.publishedCityHubs.includes(c.slug));
  const batchCities = unpubCities.slice(0, 8);

  // 4. Selecionar o próximo lote de 8 Artigos de Blog
  const unpubBlog = MASTER_BLOG_POSTS.filter(b => !state.publishedBlogSlugs.includes(b.slug));
  const batchBlog = unpubBlog.slice(0, 8);

  console.log(`📦 Lote selecionado: ${batchNiches.length} Money Pages, ${batchCities.length} City Hubs, ${batchBlog.length} Blog Posts`);

  if (batchNiches.length === 0 && batchCities.length === 0 && batchBlog.length === 0) {
    console.log('ℹ️ Nenhuma nova página pendente para publicação no catálogo.');
    return { batchNiches: [], batchCities: [], batchBlog: [] };
  }

  // 5. Injetar novos Artigos de Blog em src/data/blogData.ts
  if (batchBlog.length > 0 && fs.existsSync(BLOG_FILE)) {
    let blogContent = fs.readFileSync(BLOG_FILE, 'utf8');
    for (const post of batchBlog) {
      if (!blogContent.includes(`"${post.slug}"`)) {
        const postObjCode = `  {\n    slug: ${JSON.stringify(post.slug)},\n    title: ${JSON.stringify(post.title)},\n    excerpt: ${JSON.stringify(post.excerpt)},\n    date: ${JSON.stringify(post.date)},\n    author: ${JSON.stringify(post.author)},\n    category: ${JSON.stringify(post.category)},\n    clusterType: ${JSON.stringify(post.clusterType)},\n    content: ${JSON.stringify(post.content.trim())}\n  },\n`;
        const insertIdx = blogContent.indexOf('export const BLOG_POSTS: BlogPost[] = [');
        if (insertIdx !== -1) {
          const afterArrStart = insertIdx + 'export const BLOG_POSTS: BlogPost[] = [\n'.length;
          blogContent = blogContent.slice(0, afterArrStart) + postObjCode + blogContent.slice(afterArrStart);
        }
      }
    }
    fs.writeFileSync(BLOG_FILE, blogContent, 'utf8');
    console.log(`✅ Injetados ${batchBlog.length} novos artigos em blogData.ts`);
  }

  // 6. Injetar novos Nichos em src/data/niches.ts
  if (batchNiches.length > 0 && fs.existsSync(NICHES_FILE)) {
    let nichesContent = fs.readFileSync(NICHES_FILE, 'utf8');
    for (const niche of batchNiches) {
      if (!nichesContent.includes(`"${niche.slug}"`)) {
        const nicheObjCode = `  {\n    slug: ${JSON.stringify(niche.slug)},\n    title: ${JSON.stringify(`Google Meu Negócio para ${niche.badge || niche.nome} | Leonardo Brasil`)},\n    description: ${JSON.stringify(`Coloque seu negócio de ${niche.badge || niche.nome} no Top 3 do Google Maps. Atraia clientes qualificados na sua região.`)},\n    badge: ${JSON.stringify(niche.badge || niche.nome)},\n    h1: ${JSON.stringify(`Sua empresa de ${niche.badge || niche.nome} fora do Top 3 do Google Maps? Crie uma `)},\n    h1Highlight: "máquina de clientes qualificados no Google.",\n    subheadline: ${JSON.stringify(niche.subheadline)},\n    painPoints: [\n      "Perfil no Google Maps invisível perdendo clientes para concorrentes da região",\n      "Poucas avaliações e sem palavras-chave estratégicas nas respostas da empresa",\n      "Falta de previsibilidade na captação de clientes e serviços de alto valor"\n    ],\n    ctaText: ${JSON.stringify(`Diagnóstico de Google Meu Negócio para ${niche.badge || niche.nome}`)},\n    waMessage: ${JSON.stringify(niche.waMessage)}\n  },\n`;
        const insertIdx = nichesContent.indexOf('export const NICHES: NicheData[] = [');
        if (insertIdx !== -1) {
          const afterArrStart = insertIdx + 'export const NICHES: NicheData[] = [\n'.length;
          nichesContent = nichesContent.slice(0, afterArrStart) + nicheObjCode + nichesContent.slice(afterArrStart);
        }
      }
    }
    fs.writeFileSync(NICHES_FILE, nichesContent, 'utf8');
    console.log(`✅ Injetados ${batchNiches.length} novos nichos em niches.ts`);
  }

  // 7. Injetar novos Nichos em src/data/googleAdsNiches.ts
  if (batchNiches.length > 0 && fs.existsSync(ADS_NICHES_FILE)) {
    let adsContent = fs.readFileSync(ADS_NICHES_FILE, 'utf8');
    for (const niche of batchNiches) {
      if (!adsContent.includes(`"${niche.slug}":`)) {
        const adsObj = {
          slug: niche.slug,
          nome: niche.nome,
          badge: `Google Ads · ${niche.badge || niche.nome}`,
          headline: niche.headline,
          subheadline: niche.subheadline,
          campaignFocus: niche.campaignFocus,
          typicalIntent: niche.typicalIntent,
          bottomFunnelKeywords: niche.bottomFunnelKeywords,
          negativeKeywords: niche.negativeKeywords,
          deliverables: niche.deliverables,
          regulatoryNote: niche.regulatoryNote,
          faqs: niche.faqs,
          waMessage: niche.waMessage
        };
        const adsObjCode = `  "${niche.slug}": ${JSON.stringify(adsObj, null, 2).replace(/\n/g, '\n  ')},\n`;
        const insertIdx = adsContent.indexOf('export const GOOGLE_ADS_NICHES: Record<string, GoogleAdsNicheConfig> = {');
        if (insertIdx !== -1) {
          const afterObjStart = insertIdx + 'export const GOOGLE_ADS_NICHES: Record<string, GoogleAdsNicheConfig> = {\n'.length;
          adsContent = adsContent.slice(0, afterObjStart) + adsObjCode + adsContent.slice(afterObjStart);
        }
      }
    }
    fs.writeFileSync(ADS_NICHES_FILE, adsContent, 'utf8');
    console.log(`✅ Injetados ${batchNiches.length} novos nichos em googleAdsNiches.ts`);
  }

  // 8. Injetar novos Nichos em src/data/seoLocations.json
  if (batchNiches.length > 0 && fs.existsSync(LOCATIONS_JSON_FILE)) {
    const locationsRaw = fs.readFileSync(LOCATIONS_JSON_FILE, 'utf8');
    const locationsData = JSON.parse(locationsRaw);
    if (Array.isArray(locationsData.NICHES)) {
      for (const niche of batchNiches) {
        if (!locationsData.NICHES.some(n => n.slug === niche.slug)) {
          locationsData.NICHES.push({
            slug: niche.slug,
            nome: niche.badge || niche.nome
          });
        }
      }
      fs.writeFileSync(LOCATIONS_JSON_FILE, JSON.stringify(locationsData, null, 2), 'utf8');
      console.log(`✅ Injetados ${batchNiches.length} novos nichos em seoLocations.json`);
    }
  }

  // 9. Atualizar Cidades em prerender.mjs e generate-sitemap.mjs
  if (batchCities.length > 0) {
    for (const file of [PRERENDER_FILE, SITEMAP_FILE]) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        for (const city of batchCities) {
          if (!content.includes(`"${city.slug}"`)) {
            content = content.replace('const priorityCities = [', `const priorityCities = [\n    "${city.slug}",`);
          }
        }
        fs.writeFileSync(file, content, 'utf8');
      }
    }
    console.log(`✅ Registradas ${batchCities.length} novas cidades nos pipelines de SSR e Sitemap`);
  }

  // 10. Injetar Metadados de Cidades em CityHubLanding.tsx
  if (batchCities.length > 0 && fs.existsSync(CITY_LANDING_FILE)) {
    let cityLandingContent = fs.readFileSync(CITY_LANDING_FILE, 'utf8');
    for (const city of batchCities) {
      if (!cityLandingContent.includes(`"${city.slug}":`)) {
        const cityMetaCode = `  "${city.slug}": {\n    name: ${JSON.stringify(city.name)},\n    state: ${JSON.stringify(city.state)},\n    uf: ${JSON.stringify(city.uf)},\n    regiao: ${JSON.stringify(city.regiao)},\n    descriptionSnippet: ${JSON.stringify(city.descriptionSnippet || `em ${city.name} - ${city.uf}`)},\n  },\n`;
        const insertIdx = cityLandingContent.indexOf('const CITIES_METADATA: Record<string, CityMeta> = {');
        if (insertIdx !== -1) {
          const afterObjStart = insertIdx + 'const CITIES_METADATA: Record<string, CityMeta> = {\n'.length;
          cityLandingContent = cityLandingContent.slice(0, afterObjStart) + cityMetaCode + cityLandingContent.slice(afterObjStart);
        }
      }
    }
    fs.writeFileSync(CITY_LANDING_FILE, cityLandingContent, 'utf8');
    console.log(`✅ Injetados metadados de ${batchCities.length} cidades em CityHubLanding.tsx`);
  }

  // 11. Atualizar Estado
  state.publishedMoneyPages.push(...batchNiches.map(n => n.slug));
  state.publishedCityHubs.push(...batchCities.map(c => c.slug));
  state.publishedBlogSlugs.push(...batchBlog.map(b => b.slug));
  state.runs.push({
    timestamp: new Date().toISOString(),
    batchNiches: batchNiches.map(n => n.slug),
    batchCities: batchCities.map(c => c.slug),
    batchBlog: batchBlog.map(b => b.slug)
  });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');

  console.log('🎉 Execução do Motor Diário de SEO concluída com sucesso!');
  return { batchNiches, batchCities, batchBlog };
}

// Execução direta via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runDailyEngine().catch(err => {
    console.error('Erro no motor diário:', err);
    process.exit(1);
  });
}
