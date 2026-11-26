export interface GoogleAdsNicheFAQ {
  q: string;
  a: string;
}

export interface GoogleAdsNicheConfig {
  slug: string;
  nome: string;
  badge: string;
  headline: string;
  subheadline: string;
  campaignFocus: string;
  typicalIntent: string;
  bottomFunnelKeywords: string[];
  negativeKeywords: string[];
  deliverables: string[];
  regulatoryNote?: string;
  faqs: GoogleAdsNicheFAQ[];
  waMessage: string;
}

export const GOOGLE_ADS_NICHES: Record<string, GoogleAdsNicheConfig> = {
  "fisioterapia-especializada": {
    "slug": "fisioterapia-especializada",
    "nome": "Clínicas de Fisioterapia e Reabilitação",
    "badge": "Google Ads · Fisioterapia Especializada",
    "headline": "Google Ads e Maps para Clínicas de Fisioterapia, Coluna e Ortopedia",
    "subheadline": "Atraia pacientes particulares para fisioterapia esportiva, reabilitação da coluna, pilates clínico e RPG com agendamento imediato.",
    "campaignFocus": "Reabilitação ortopédica + Fisioterapia da coluna + Pilates clínico",
    "typicalIntent": "Dor crônica ou pós-operatório com alta urgência de alívio e reabilitação",
    "bottomFunnelKeywords": [
      "clínica de fisioterapia perto de mim",
      "fisioterapia para coluna tratamento hérnia de disco",
      "fisioterapeuta ortopédico reabilitação particular",
      "sessão de pilates clínico com fisioterapeuta",
      "fisioterapia esportiva recuperação lesão agendamento"
    ],
    "negativeKeywords": [
      "sus",
      "exercício para dor no youtube",
      "fisioterapia gratuita",
      "curso massagem"
    ],
    "deliverables": [
      "Campanhas por patologia (coluna, joelho, ombro, reabilitação desportiva)",
      "Presença forte no Google Maps com fotos de equipamentos e equipe qualificada",
      "Filtro contra pesquisas de tutoriais caseiros e tratamentos populares",
      "WhatsApp com triagem rápida para agendar a primeira avaliação fisioterapêutica"
    ],
    "regulatoryNote": "Conforme o código de ética do COFFITO: integridade da assistência fisioterapêutica e informação em saúde.",
    "faqs": [
      {
        "q": "Como atrair pacientes particulares de fisioterapia fora dos convênios?",
        "a": "Posicionamos sua clínica para tratamentos especializados de alta tecnologia e atendimento individualizado, mostrando por que a reabilitação particular entrega resultados mais rápidos."
      }
    ],
    "waMessage": "Olá, Leonardo! Tenho clínica de fisioterapia e quero captar mais pacientes particulares no Google."
  },
  "psicologia-clinica": {
    "slug": "psicologia-clinica",
    "nome": "Psicólogos e Clínicas de Psicologia",
    "badge": "Google Ads · Psicologia Clínica & Terapia",
    "headline": "Google Ads e Google Maps para Psicólogos: Consultas Particulares Presenciais e Online",
    "subheadline": "Conquiste pacientes que buscam psicoterapia individual, infantil ou de casal, com discrição e posicionamento ético no topo das buscas locais.",
    "campaignFocus": "Psicoterapia particular presencial + Atendimento online especializado",
    "typicalIntent": "Busca de apoio emocional e acolhimento para ansiedade, depressão e relações",
    "bottomFunnelKeywords": [
      "psicólogo particular perto de mim",
      "clínica de psicologia consulta particular",
      "terapia cognitivo comportamental psicólogo especialista",
      "psicólogo infantil acolhimento avaliação",
      "consulta com psicólogo presencial agendamento"
    ],
    "negativeKeywords": [
      "sus",
      "terapia gratuita",
      "faculdade psicologia estágio",
      "teste psicológico online grátis"
    ],
    "deliverables": [
      "Segmentação por proximidade para consultório presencial e raio estendido para terapia online",
      "Google Maps com depoimentos éticos focados na pontualidade e estrutura do consultório",
      "Negativação de serviços gratuitos e testes de personalidade populares",
      "WhatsApp com mensagem receptiva e acolhedora para agendamento de sessão de acolhimento"
    ],
    "regulatoryNote": "Em conformidade com a Resolução CFP nº 011/2018 e Código de Ética: sigilo profissional e sem promessas de cura.",
    "faqs": [
      {
        "q": "Como o Google Maps ajuda o consultório de psicologia?",
        "a": "Muitos pacientes preferem terapeutas próximos de sua residência ou trabalho. Estar no Top 3 do Google Maps garante autoridade e facilidade de acesso."
      }
    ],
    "waMessage": "Olá, Leonardo! Sou psicólogo clínico e quero posicionar meu consultório no Google para consultas particulares."
  },
  "arquitetura-interiores": {
    "slug": "arquitetura-interiores",
    "nome": "Arquitetos e Escritórios de Interiores",
    "badge": "Google Ads · Arquitetura & Interiores",
    "headline": "Google Ads e Google Maps para Escritórios de Arquitetura e Interiores",
    "subheadline": "Conecte seu escritório a clientes residenciais e comerciais de médio/alto padrão prontos para reformar ou construir na sua cidade.",
    "campaignFocus": "Projetos de interiores residenciais de luxo + Projetos comerciais corporativos",
    "typicalIntent": "Busca de portfólio visual, bom gosto arquitetônico e acompanhamento de obras",
    "bottomFunnelKeywords": [
      "escritório de arquitetura perto de mim",
      "arquiteto de interiores residencial orçamento",
      "projeto de arquitetura e reforma apartamento alto padrão",
      "arquiteto comercial para clínicas e escritórios",
      "contratar arquiteto para projeto executivo e obra"
    ],
    "negativeKeywords": [
      "planta de casa grátis",
      "curso autocad",
      "ideias pinterest",
      "decoração barata diy"
    ],
    "deliverables": [
      "Campanhas geolocalizadas em condomínios fechados e bairros nobres da cidade",
      "Google Maps enriquecido com fotos profissionais de projetos finalizados",
      "Negativação de buscas de tutoriais, faça você mesmo (DIY) e plantas gratuitas",
      "Link direto para WhatsApp com apresentação do portfólio em alta resolução"
    ],
    "regulatoryNote": "Conforme o código de ética do CAU/BR sobre autoria e comunicação profissional.",
    "faqs": [
      {
        "q": "Como atrair clientes que valorizam projeto de arquitetura e não pedem apenas desconto?",
        "a": "Apresentamos a autoridade do arquiteto, a sofisticação das entregas e focamos as palavras-chave em 'projeto executivo', 'arquitetura residencial de alto padrão' e bairros nobres."
      }
    ],
    "waMessage": "Olá, Leonardo! Sou arquiteto e quero estruturar campanhas no Google para captar clientes de projetos de interiores."
  },
  "contabilidade-consultiva": {
    "slug": "contabilidade-consultiva",
    "nome": "Escritórios de Contabilidade e BPO Financeiro",
    "badge": "Google Ads · Contabilidade Consultiva & BPO",
    "headline": "Google Ads e Maps para Contabilidades Consultivas e Gestão Financeira",
    "subheadline": "Receba contatos de pequenas e médias empresas querendo migrar de contador, abrir empresas de serviços ou terceirizar o financeiro (BPO).",
    "campaignFocus": "Abertura e migração de empresas + BPO Financeiro + Gestão Contábil Consultiva",
    "typicalIntent": "Troca de contabilidade por falta de suporte ou busca por redução de custos fiscais",
    "bottomFunnelKeywords": [
      "escritório de contabilidade perto de mim",
      "trocar de contador empresa de serviços consultoria",
      "contabilidade consultiva para clínicas e médicos",
      "terceirização do financeiro bpo empresas orçamento",
      "abertura de empresa ltda simples nacional contador"
    ],
    "negativeKeywords": [
      "mei grátis",
      "declaração imposto renda gratuita",
      "estágio contabilidade",
      "como emitir nota mei"
    ],
    "deliverables": [
      "Segmentação por nichos de alto valor (médicos, advogados, e-commerces, prestadores de serviços)",
      "Presença de destaque no Google Maps com avaliações de empresários locais",
      "Filtro contra pesquisas por MEI gratuito e consultas básicas de IRPF",
      "WhatsApp comercial preparado com diagnóstico inicial de regime tributário"
    ],
    "regulatoryNote": "Em conformidade com as diretrizes do CFC para publicidade e integridade contábil.",
    "faqs": [
      {
        "q": "Como atrair empresas com mensalidades maiores e não apenas MEIs?",
        "a": "Direcionamos os anúncios para buscas corporativas como 'contabilidade para clínicas médicas' ou 'BPO financeiro para empresas', negativando buscas de microempreendedor individual."
      }
    ],
    "waMessage": "Olá, Leonardo! Tenho escritório de contabilidade e quero atrair novos clientes recorrentes via Google Ads e Maps."
  },
  "direito-tributario": {
    "slug": "direito-tributario",
    "nome": "Advogados Tributaristas e Planejamento Fiscal",
    "badge": "Google Ads · Direito Tributário & Fiscal",
    "headline": "Google Ads e Google Maps para Advocacia Tributária e Recuperação de Créditos",
    "subheadline": "Posicione seu escritório para empresários e diretores financeiros que buscam planejamento tributário preventivo, defesas fiscais e compensação de tributos.",
    "campaignFocus": "Recuperação de créditos tributários + Defesa de execuções fiscais + Planejamento",
    "typicalIntent": "Empresas com passivos ou oportunidades tributárias buscando escritórios de renome",
    "bottomFunnelKeywords": [
      "advogado tributarista empresarial perto de mim",
      "escritório de advocacia tributária planejamento fiscal",
      "defesa de execução fiscal advogado tributário",
      "recuperação de créditos tributários consultoria jurídica",
      "advogado especialista em impostos empresas consulta"
    ],
    "negativeKeywords": [
      "tabela simples nacional grátis",
      "como sonegar",
      "modelo impugnação",
      "concurso receita"
    ],
    "deliverables": [
      "Campanhas B2B altamente filtradas para tomadores de decisão (CFOs, CEOs, diretores)",
      "Anúncios institucionais no Google Maps destacando a sede e a solidez do escritório",
      "Negativação agressiva de estudantes, pesquisas acadêmicas e microempreendedores individuais",
      "Integração com WhatsApp institucional para agendamento de reuniões técnicas"
    ],
    "regulatoryNote": "Conforme Provimento 205/2021 do CFOAB: discrição absoluta e caráter informativo sem mercantilização.",
    "faqs": [
      {
        "q": "Google Ads funciona para captação tributária B2B?",
        "a": "Sim, porque diretores e sócios de empresas pesquisam no Google no momento em que são notificados pela Receita ou buscam estratégias legais para otimizar a carga tributária."
      }
    ],
    "waMessage": "Olá, Leonardo! Sou advogado tributarista e quero atrair empresas e demandas de recuperação fiscal pelo Google."
  },
  "direito-imobiliario": {
    "slug": "direito-imobiliario",
    "nome": "Advogados Imobiliários e de Regularização",
    "badge": "Google Ads · Direito Imobiliário",
    "headline": "Google Ads e Google Maps para Escritórios de Direito Imobiliário e Contratos",
    "subheadline": "Atraia compradores, investidores e proprietários que necessitam de regularização de imóveis, usucapião, assessoria em leilões e disputas possessórias.",
    "campaignFocus": "Regularização imobiliária + Contratos de compra e venda + Usucapião",
    "typicalIntent": "Segurança jurídica patrimonial em operações financeiras e conflitos de alto valor",
    "bottomFunnelKeywords": [
      "advogado imobiliário especialista perto de mim",
      "advogado regularização de imóveis usucapião",
      "escritório advocacia direito imobiliário consulta",
      "assessoria jurídica compra e venda imóvel segurança",
      "advogado para arrematação leilão judicial imobiliário"
    ],
    "negativeKeywords": [
      "modelo contrato grátis",
      "aluguel barato",
      "defensoria pública",
      "cohab"
    ],
    "deliverables": [
      "Segmentação focada em transações e regularizações de patrimônio de médio e alto valor",
      "Posicionamento no Google Maps como referência jurídica imobiliária local",
      "Negativação de termos de modelos gratuitos de contratos e dúvidas acadêmicas",
      "Fluxo de triagem no WhatsApp para entender o caso antes da consulta formal"
    ],
    "regulatoryNote": "Em conformidade com o Provimento 205/2021 do CFOAB: sobriedade, foco informativo e respeito à dignidade da advocacia.",
    "faqs": [
      {
        "q": "Como o Google Ads capta clientes de regularização e usucapião?",
        "a": "Anunciamos para quem pesquisa termos de dor jurídica imediata ('como regularizar imóvel sem escritura', 'advogado usucapião'), direcionando para um contato consultivo."
      }
    ],
    "waMessage": "Olá, Leonardo! Sou advogado imobiliário e quero posicionar meu escritório no Google para causas e contratos patrimoniais."
  },
  "pediatria": {
    "slug": "pediatria",
    "nome": "Pediatras e Clínicas de Pediatria",
    "badge": "Google Ads · Pediatria & Puericultura",
    "headline": "Google Ads e Google Maps para Pediatras: Atraia Famílias para Consultas Particulares",
    "subheadline": "Posicione seu consultório para famílias que buscam puericultura, acompanhamento do desenvolvimento infantil e atendimento humanizado na sua cidade.",
    "campaignFocus": "Pesquisa por pediatra particular + Presença no Top 3 do Google Maps",
    "typicalIntent": "Urgência de saúde infantil ou busca de pediatra de confiança para acompanhamento contínuo",
    "bottomFunnelKeywords": [
      "pediatra particular perto de mim",
      "clínica de pediatria consulta particular",
      "médico pediatra puericultura agendamento",
      "consulta pediátrica recém nascido especialista",
      "pediatra humanizado acolhimento particular"
    ],
    "negativeKeywords": [
      "sus",
      "upa infantil",
      "posto de saúde",
      "grátis",
      "estágio"
    ],
    "deliverables": [
      "Campanhas segmentadas por raio geográfico estrito próximo aos bairros residenciais familiares",
      "Perfil no Google Maps transmitindo aconchego, segurança e reputação impecável",
      "Negativação de termos do SUS e emergências públicas",
      "Botão de WhatsApp integrado para agendamento direto com a secretária"
    ],
    "regulatoryNote": "Em conformidade com a Resolução CFM nº 2.336/2023: caráter educativo, menção clara de CRM e RQE, sem promessas sensacionalistas.",
    "faqs": [
      {
        "q": "Como famílias encontram pediatras no Google?",
        "a": "Mães e pais utilizam o Google Maps e a Pesquisa no smartphone buscando 'pediatra particular perto de mim'. O perfil com melhores avaliações e localização clara é o primeiro a ser contatado."
      }
    ],
    "waMessage": "Olá, Leonardo! Sou médico pediatra e quero posicionar meu consultório no Google para consultas particulares."
  },
  "ortodontia": {
    "slug": "ortodontia",
    "nome": "Ortodontistas e Clínicas Odontológicas",
    "badge": "Google Ads · Ortodontia & Alinhadores",
    "headline": "Google Ads e Google Maps para Ortodontistas: Atraia Pacientes para Alinhadores e Aparelhos",
    "subheadline": "Domine o topo do Google para tratamentos de alto valor como alinhadores invisíveis e estética do sorriso com agendamento direto no WhatsApp.",
    "campaignFocus": "Rede de Pesquisa por alinhadores invisíveis + Google Maps + Triagem no WhatsApp",
    "typicalIntent": "Alta consideração estética e busca por tratamentos ortodônticos modernos",
    "bottomFunnelKeywords": [
      "ortodontista especialista perto de mim",
      "alinhador invisível consulta avaliação orçamento",
      "clínica de ortodontia estética particular",
      "aparelho ortodôntico transparente especialista",
      "invisalign consulta ortodontista credenciado"
    ],
    "negativeKeywords": [
      "grátis",
      "manutenção barata",
      "curso",
      "faculdade",
      "sindicato",
      "tabela sus"
    ],
    "deliverables": [
      "Segmentação de campanhas por alinhadores invisíveis e estética do sorriso",
      "Destaque no Google Maps com avaliações de pacientes e fotos da infraestrutura clínica",
      "Exclusão diária de buscas populares por aparelhos gratuitos ou manutenções a preço de custo",
      "Rastreamento de conversões reais no WhatsApp da recepção com script de triagem"
    ],
    "regulatoryNote": "Conforme o Código de Ética Odontológica do CFO: comunicação sóbria, informativa e sem sensacionalismo de antes e depois.",
    "faqs": [
      {
        "q": "Como o Google Ads atrai pacientes particulares de alinhadores invisíveis?",
        "a": "Posicionamos seu consultório para pesquisas de alta intenção como 'alinhador transparente preço consulta' com anúncios focados em previsibilidade, conforto e tecnologia."
      },
      {
        "q": "Como qualificar o lead que busca ortodontia?",
        "a": "Utilizamos termos específicos de marcas e materiais estéticos, excluindo termos populares de aparelhos metálicos convencionais de baixo custo."
      }
    ],
    "waMessage": "Olá, Leonardo! Sou ortodontista e quero estruturar o Google Ads e Maps para atrair pacientes particulares para alinhadores."
  },
  "climatizacao": {
    slug: "climatizacao",
    nome: "Climatização e Ar Condicionado",
    badge: "Google Ads · Climatização e Ar Condicionado",
    headline: "Google Ads para Climatização e Ar Condicionado: Atraia Clientes Qualificados no Fundo de Funil",
    subheadline: "Campanhas na Rede de Pesquisa e Google Maps estruturadas por intenção imediata, eliminando desperdício e focando em fechamentos diretos no WhatsApp.",
    campaignFocus: "Rede de Pesquisa + Extensão de Local no Google Maps + Atendimento Consultivo",
    typicalIntent: "Alta intenção de contratação e busca por profissionais de confiança",
    bottomFunnelKeywords: [
      "climatização e ar condicionado especialista perto de mim",
      "climatização e ar condicionado particular orçamento",
      "melhor climatização e ar condicionado na minha cidade",
      "serviço de climatização e ar condicionado atendimento imediato"
    ],
    negativeKeywords: ["grátis", "curso", "vaga", "modelo", "pdf", "barato"],
    deliverables: [
      "Campanhas segmentadas por raio geográfico estrito",
      "Bloqueio diário de curiosos e palavras-chave de baixa intenção",
      "Integração do Google Meu Negócio ao anúncio para exibir avaliações em estrelas",
      "Rastreamento de conversões reais de chamadas e mensagens iniciadas no WhatsApp"
    ],
    faqs: [
      {
        q: "Vale a pena anunciar Climatização e Ar Condicionado no Google Ads?",
        a: "Sim. Quem pesquisa por Climatização e Ar Condicionado no Google já tomou a decisão de compra ou contratação e busca quem transmite mais segurança e rapidez de atendimento."
      }
    ],
    waMessage: "Olá, Leonardo! Atuo com Climatização e Ar Condicionado e quero estruturar campanhas de Google Ads focadas em conversão no WhatsApp."
  },
  "direito-familia": {
    slug: "direito-familia",
    nome: "Direito de Família",
    badge: "Google Ads · Direito de Família",
    headline: "Google Ads para Direito de Família: Atraia Clientes Qualificados no Fundo de Funil",
    subheadline: "Campanhas na Rede de Pesquisa e Google Maps estruturadas por intenção imediata, eliminando desperdício e focando em fechamentos diretos no WhatsApp.",
    campaignFocus: "Rede de Pesquisa + Extensão de Local no Google Maps + Atendimento Consultivo",
    typicalIntent: "Alta intenção de contratação e busca por profissionais de confiança",
    bottomFunnelKeywords: [
      "direito de família especialista perto de mim",
      "direito de família particular orçamento",
      "melhor direito de família na minha cidade",
      "serviço de direito de família atendimento imediato"
    ],
    negativeKeywords: ["grátis", "curso", "vaga", "modelo", "pdf", "barato"],
    deliverables: [
      "Campanhas segmentadas por raio geográfico estrito",
      "Bloqueio diário de curiosos e palavras-chave de baixa intenção",
      "Integração do Google Meu Negócio ao anúncio para exibir avaliações em estrelas",
      "Rastreamento de conversões reais de chamadas e mensagens iniciadas no WhatsApp"
    ],
    faqs: [
      {
        q: "Vale a pena anunciar Direito de Família no Google Ads?",
        a: "Sim. Quem pesquisa por Direito de Família no Google já tomou a decisão de compra ou contratação e busca quem transmite mais segurança e rapidez de atendimento."
      }
    ],
    waMessage: "Olá, Leonardo! Atuo com Direito de Família e quero estruturar campanhas de Google Ads focadas em conversão no WhatsApp."
  },
  "direito-trabalhista": {
    slug: "direito-trabalhista",
    nome: "Direito Trabalhista",
    badge: "Google Ads · Direito Trabalhista",
    headline: "Google Ads para Direito Trabalhista: Atraia Clientes Qualificados no Fundo de Funil",
    subheadline: "Campanhas na Rede de Pesquisa e Google Maps estruturadas por intenção imediata, eliminando desperdício e focando em fechamentos diretos no WhatsApp.",
    campaignFocus: "Rede de Pesquisa + Extensão de Local no Google Maps + Atendimento Consultivo",
    typicalIntent: "Alta intenção de contratação e busca por profissionais de confiança",
    bottomFunnelKeywords: [
      "direito trabalhista especialista perto de mim",
      "direito trabalhista particular orçamento",
      "melhor direito trabalhista na minha cidade",
      "serviço de direito trabalhista atendimento imediato"
    ],
    negativeKeywords: ["grátis", "curso", "vaga", "modelo", "pdf", "barato"],
    deliverables: [
      "Campanhas segmentadas por raio geográfico estrito",
      "Bloqueio diário de curiosos e palavras-chave de baixa intenção",
      "Integração do Google Meu Negócio ao anúncio para exibir avaliações em estrelas",
      "Rastreamento de conversões reais de chamadas e mensagens iniciadas no WhatsApp"
    ],
    faqs: [
      {
        q: "Vale a pena anunciar Direito Trabalhista no Google Ads?",
        a: "Sim. Quem pesquisa por Direito Trabalhista no Google já tomou a decisão de compra ou contratação e busca quem transmite mais segurança e rapidez de atendimento."
      }
    ],
    waMessage: "Olá, Leonardo! Atuo com Direito Trabalhista e quero estruturar campanhas de Google Ads focadas em conversão no WhatsApp."
  },
  "direito-previdenciario": {
    slug: "direito-previdenciario",
    nome: "Direito Previdenciário",
    badge: "Google Ads · Direito Previdenciário",
    headline: "Google Ads para Direito Previdenciário: Atraia Clientes Qualificados no Fundo de Funil",
    subheadline: "Campanhas na Rede de Pesquisa e Google Maps estruturadas por intenção imediata, eliminando desperdício e focando em fechamentos diretos no WhatsApp.",
    campaignFocus: "Rede de Pesquisa + Extensão de Local no Google Maps + Atendimento Consultivo",
    typicalIntent: "Alta intenção de contratação e busca por profissionais de confiança",
    bottomFunnelKeywords: [
      "direito previdenciário especialista perto de mim",
      "direito previdenciário particular orçamento",
      "melhor direito previdenciário na minha cidade",
      "serviço de direito previdenciário atendimento imediato"
    ],
    negativeKeywords: ["grátis", "curso", "vaga", "modelo", "pdf", "barato"],
    deliverables: [
      "Campanhas segmentadas por raio geográfico estrito",
      "Bloqueio diário de curiosos e palavras-chave de baixa intenção",
      "Integração do Google Meu Negócio ao anúncio para exibir avaliações em estrelas",
      "Rastreamento de conversões reais de chamadas e mensagens iniciadas no WhatsApp"
    ],
    faqs: [
      {
        q: "Vale a pena anunciar Direito Previdenciário no Google Ads?",
        a: "Sim. Quem pesquisa por Direito Previdenciário no Google já tomou a decisão de compra ou contratação e busca quem transmite mais segurança e rapidez de atendimento."
      }
    ],
    waMessage: "Olá, Leonardo! Atuo com Direito Previdenciário e quero estruturar campanhas de Google Ads focadas em conversão no WhatsApp."
  },
  "oftalmologia": {
    slug: "oftalmologia",
    nome: "Oftalmologia",
    badge: "Google Ads · Oftalmologia",
    headline: "Google Ads para Oftalmologia: Atraia Clientes Qualificados no Fundo de Funil",
    subheadline: "Campanhas na Rede de Pesquisa e Google Maps estruturadas por intenção imediata, eliminando desperdício e focando em fechamentos diretos no WhatsApp.",
    campaignFocus: "Rede de Pesquisa + Extensão de Local no Google Maps + Atendimento Consultivo",
    typicalIntent: "Alta intenção de contratação e busca por profissionais de confiança",
    bottomFunnelKeywords: [
      "oftalmologia especialista perto de mim",
      "oftalmologia particular orçamento",
      "melhor oftalmologia na minha cidade",
      "serviço de oftalmologia atendimento imediato"
    ],
    negativeKeywords: ["grátis", "curso", "vaga", "modelo", "pdf", "barato"],
    deliverables: [
      "Campanhas segmentadas por raio geográfico estrito",
      "Bloqueio diário de curiosos e palavras-chave de baixa intenção",
      "Integração do Google Meu Negócio ao anúncio para exibir avaliações em estrelas",
      "Rastreamento de conversões reais de chamadas e mensagens iniciadas no WhatsApp"
    ],
    faqs: [
      {
        q: "Vale a pena anunciar Oftalmologia no Google Ads?",
        a: "Sim. Quem pesquisa por Oftalmologia no Google já tomou a decisão de compra ou contratação e busca quem transmite mais segurança e rapidez de atendimento."
      }
    ],
    waMessage: "Olá, Leonardo! Atuo com Oftalmologia e quero estruturar campanhas de Google Ads focadas em conversão no WhatsApp."
  },
  "dermatologia": {
    slug: "dermatologia",
    nome: "Dermatologia",
    badge: "Google Ads · Dermatologia",
    headline: "Google Ads para Dermatologia: Atraia Clientes Qualificados no Fundo de Funil",
    subheadline: "Campanhas na Rede de Pesquisa e Google Maps estruturadas por intenção imediata, eliminando desperdício e focando em fechamentos diretos no WhatsApp.",
    campaignFocus: "Rede de Pesquisa + Extensão de Local no Google Maps + Atendimento Consultivo",
    typicalIntent: "Alta intenção de contratação e busca por profissionais de confiança",
    bottomFunnelKeywords: [
      "dermatologia especialista perto de mim",
      "dermatologia particular orçamento",
      "melhor dermatologia na minha cidade",
      "serviço de dermatologia atendimento imediato"
    ],
    negativeKeywords: ["grátis", "curso", "vaga", "modelo", "pdf", "barato"],
    deliverables: [
      "Campanhas segmentadas por raio geográfico estrito",
      "Bloqueio diário de curiosos e palavras-chave de baixa intenção",
      "Integração do Google Meu Negócio ao anúncio para exibir avaliações em estrelas",
      "Rastreamento de conversões reais de chamadas e mensagens iniciadas no WhatsApp"
    ],
    faqs: [
      {
        q: "Vale a pena anunciar Dermatologia no Google Ads?",
        a: "Sim. Quem pesquisa por Dermatologia no Google já tomou a decisão de compra ou contratação e busca quem transmite mais segurança e rapidez de atendimento."
      }
    ],
    waMessage: "Olá, Leonardo! Atuo com Dermatologia e quero estruturar campanhas de Google Ads focadas em conversão no WhatsApp."
  },
  "cirurgia-plastica": {
    slug: "cirurgia-plastica",
    nome: "Cirurgia Plástica",
    badge: "Google Ads · Cirurgia Plástica",
    headline: "Google Ads para Cirurgia Plástica: Atraia Clientes Qualificados no Fundo de Funil",
    subheadline: "Campanhas na Rede de Pesquisa e Google Maps estruturadas por intenção imediata, eliminando desperdício e focando em fechamentos diretos no WhatsApp.",
    campaignFocus: "Rede de Pesquisa + Extensão de Local no Google Maps + Atendimento Consultivo",
    typicalIntent: "Alta intenção de contratação e busca por profissionais de confiança",
    bottomFunnelKeywords: [
      "cirurgia plástica especialista perto de mim",
      "cirurgia plástica particular orçamento",
      "melhor cirurgia plástica na minha cidade",
      "serviço de cirurgia plástica atendimento imediato"
    ],
    negativeKeywords: ["grátis", "curso", "vaga", "modelo", "pdf", "barato"],
    deliverables: [
      "Campanhas segmentadas por raio geográfico estrito",
      "Bloqueio diário de curiosos e palavras-chave de baixa intenção",
      "Integração do Google Meu Negócio ao anúncio para exibir avaliações em estrelas",
      "Rastreamento de conversões reais de chamadas e mensagens iniciadas no WhatsApp"
    ],
    faqs: [
      {
        q: "Vale a pena anunciar Cirurgia Plástica no Google Ads?",
        a: "Sim. Quem pesquisa por Cirurgia Plástica no Google já tomou a decisão de compra ou contratação e busca quem transmite mais segurança e rapidez de atendimento."
      }
    ],
    waMessage: "Olá, Leonardo! Atuo com Cirurgia Plástica e quero estruturar campanhas de Google Ads focadas em conversão no WhatsApp."
  },
  dentistas: {
    slug: "dentistas",
    nome: "Dentistas e Clínicas Odontológicas",
    badge: "Google Ads · Odontologia",
    headline: "Google Ads para Dentistas: atraia pacientes particulares para procedimentos de alto valor",
    subheadline:
      "Campanhas na Rede de Pesquisa e Google Maps estruturadas por tratamento (implantes, próteses, lentes, alinhadores e urgência), sem desperdiçar verba com buscas por convênio ou tratamentos gratuitos.",
    campaignFocus: "Rede de Pesquisa por procedimento + Extensão de Local no Google Maps + Landing Page de WhatsApp",
    typicalIntent: "Alta intenção imediata e procedimentos de ticket elevado",
    bottomFunnelKeywords: [
      "implante dentário perto de mim",
      "clínica odontológica particular [sua cidade]",
      "dentista urgência 24h [seu bairro]",
      "alinhador invisível preço consulta",
      "prótese protocolo dentista especialista",
    ],
    negativeKeywords: ["sus", "gratuito", "faculdade odontologia", "vaga auxiliar", "convênio barato", "curso"],
    deliverables: [
      "Grupos de anúncios separados por tratamento de maior margem (implantes, estética, ortodontia)",
      "Bloqueio diário de termos de convênio, SUS e curiosos de preço sem intenção de agendar",
      "Vinculação da conta Google Ads ao Google Meu Negócio para exibir nota em estrelas no anúncio",
      "Rastreamento de conversões reais de cliques e agendamentos iniciados no WhatsApp",
    ],
    regulatoryNote:
      "Anúncios redigidos em conformidade com as normas do CFO: comunicação informativa, sem promessa de resultado garantido e sem mercantilização indevida.",
    faqs: [
      {
        q: "Vale a pena rodar Google Ads para clínica odontológica?",
        a: "Sim, especialmente para procedimentos particulares de maior margem como implantes, prótese protocolo, alinhadores e reabilitação oral. Quando bem segmentado por raio geográfico e negativado contra convênios/SUS, um único tratamento fechado costuma pagar meses de mídia.",
      },
      {
        q: "Como evitar contatos pedindo atendimento por plano odontológico?",
        a: "Aplicamos uma lista robusta de palavras-chave negativas ('plano', 'convênio', 'amil', 'sulamérica', 'odontoprev', 'gratuito') e deixamos claro no título do anúncio que o atendimento é particular.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho uma clínica odontológica e quero estruturar campanhas de Google Ads para atrair pacientes particulares no WhatsApp.",
  },
  medicos: {
    slug: "medicos",
    nome: "Médicos e Clínicas",
    badge: "Google Ads · Medicina (CFM)",
    headline: "Google Ads para Médicos: capte pacientes particulares com ética e conformidade CFM",
    subheadline:
      "Anúncios sóbrios na Rede de Pesquisa do Google para sua especialidade e RQE, focados em pacientes que buscam consulta particular na sua cidade — sem depender exclusivamente de convênios.",
    campaignFocus: "Pesquisa por especialidade/sintoma qualificado + Extensão de Local + Rastreamento de Secretária",
    typicalIntent: "Busca ativa por especialista confiável na região",
    bottomFunnelKeywords: [
      "[especialidade] particular [sua cidade]",
      "consulta [especialidade] [seu bairro]",
      "clínica de [especialidade] perto de mim",
      "médico especialista em [tratamento] [cidade]",
    ],
    negativeKeywords: ["sus", "posto de saúde", "unimed", "convênio", "pdf", "residência", "salário", "faculdade"],
    deliverables: [
      "Copy 100% aderente à Resolução CFM nº 2.336/2023 (sem sensacionalismo ou promessa de cura)",
      "Segmentação cirúrgica por bairro/raio da clínica e horários em que a recepção responde rápido",
      "Negativação contra buscas acadêmicas, sintomas genéricos de curiosos e planos de saúde",
      "Integração com Perfil da Empresa no Google para maximizar confiança pela nota e avaliações",
    ],
    regulatoryNote:
      "Estratégia revisada sob as diretrizes da Resolução CFM nº 2.336/2023: anúncios informativos com foco em especialidade, formação e canais oficiais de agendamento.",
    faqs: [
      {
        q: "Médicos podem anunciar no Google Ads segundo o CFM?",
        a: "Sim. A publicidade médica informativa em buscadores é permitida pela Resolução CFM nº 2.336/2023, desde que respeite limites éticos: sem promessas de resultado, sem autopromoção sensacionalista e sem exposição indevida de pacientes.",
      },
      {
        q: "Qual a diferença entre anunciar no Google Ads e no Instagram para médicos?",
        a: "No Instagram você interrompe quem está se distraindo. No Google Ads você aparece no exato segundo em que o paciente já reconheceu o problema e digitou sua especialidade procurando agendar uma consulta.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Sou médico(a) / gestor de clínica e quero estruturar campanhas éticas de Google Ads para consultas particulares.",
  },
  advogados: {
    slug: "advogados",
    nome: "Advogados e Escritórios de Advocacia",
    badge: "Google Ads · Advocacia (OAB)",
    headline: "Google Ads para Advogados: captação passiva e sóbria dentro do Provimento 205 da OAB",
    subheadline:
      "Posicione sua banca nas buscas exatas da sua área de atuação (trabalhista, previdenciário, família, cível, empresarial ou criminal) com comunicação informativa e foco em consultas qualificadas.",
    campaignFocus: "Rede de Pesquisa por área do Direito + Página Informativa de Autoridade + Filtro de Qualificação",
    typicalIntent: "Demanda jurídica ativa e urgente na comarca",
    bottomFunnelKeywords: [
      "advogado [área do direito] [sua cidade]",
      "escritório de advocacia especialista em [demanda]",
      "consulta advogado [área] [seu bairro]",
      "advogado [especialidade] perto de mim",
    ],
    negativeKeywords: ["defensoria pública", "gratuito", "oab prova", "modelo petição", "jusbrasil", "estágio", "vaga"],
    deliverables: [
      "Redação estritamente informativa e sóbria alinhada ao Provimento 205/2021 da OAB",
      "Campanhas segregadas por tese/área jurídica para controlar custo por lead em cada frente",
      "Negativação pesada contra estudantes de direito, modelos de petição e assistência gratuita",
      "Medição precisa de contatos iniciados no WhatsApp e formulários do escritório",
    ],
    regulatoryNote:
      "Campanhas estruturadas conforme o Provimento 205/2021 da OAB: marketing de conteúdo informativo, sem mercantilização, sem captação indevida e sem promessa de ganho de causa.",
    faqs: [
      {
        q: "Advogado pode anunciar no Google Ads sem violar o Código de Ética da OAB?",
        a: "Sim. O Provimento 205/2021 da OAB autoriza expressamente o uso de ferramentas de aquisição de palavras-chave (como o Google Ads) desde que o anúncio tenha caráter meramente informativo e discrição compatível com a advocacia.",
      },
      {
        q: "Como evitar cliques de estudantes de direito e pessoas buscando consulta gratuita?",
        a: "Construímos uma blindagem prévia com centenas de palavras-chave negativas ('grátis', 'defensoria', 'modelo', 'artigo', 'tcc', 'oab', 'concurso') e revisamos os termos de pesquisa semanalmente.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Sou advogado(a) e quero estruturar campanhas de Google Ads dentro das normas da OAB para meu escritório.",
  },
  psicologas: {
    slug: "psicologas",
    nome: "Psicólogos e Clínicas de Psicologia",
    badge: "Google Ads · Psicologia",
    headline: "Google Ads para Psicólogos: atraia pacientes particulares presenciais e online",
    subheadline:
      "Saia da dependência de plataformas de valor social e apareça no topo do Google quando alguém procura psicólogo particular para ansiedade, terapia de casal ou atendimento clínico na sua cidade.",
    campaignFocus: "Pesquisa Local + Pesquisa Nacional (Terapia Online) + Extensão de Local Maps",
    typicalIntent: "Decisão ativa de iniciar psicoterapia particular",
    bottomFunnelKeywords: [
      "psicólogo particular [sua cidade]",
      "terapia presencial [seu bairro]",
      "psicóloga especialista em ansiedade",
      "terapia de casal particular [cidade]",
    ],
    negativeKeywords: ["gratuito", "sus", "valor social", "faculdade", "estágio", "pdf", "teste grátis", "crp"],
    deliverables: [
      "Campanhas separadas para atendimento presencial local e psicoterapia online",
      "Filtro rigoroso contra buscas de terapia gratuita, valor social e estudantes de psicologia",
      "Anúncios acolhedores e éticos compatíveis com as diretrizes do CFP",
      "Integração com Google Meu Negócio e WhatsApp para agendamento sem fricção",
    ],
    faqs: [
      {
        q: "Psicólogo que atende online e presencial pode usar a mesma campanha?",
        a: "O ideal é separar em duas campanhas: uma com raio geográfico restrito ao consultório (maior taxa de conversão presencial) e outra voltada para buscas de terapia online em regiões de maior poder aquisitivo.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Sou psicólogo(a) e quero estruturar Google Ads para captar pacientes particulares.",
  },
  nutricionistas: {
    slug: "nutricionistas",
    nome: "Nutricionistas",
    badge: "Google Ads · Nutrição",
    headline: "Google Ads para Nutricionistas: preencha sua agenda com planos de acompanhamento",
    subheadline:
      "Capture pacientes buscando nutricionista esportivo, clínico ou de emagrecimento na sua região, qualificando o clique para acompanhamento particular de maior ticket.",
    campaignFocus: "Pesquisa por nicho nutricional + Extensão de Local Maps + WhatsApp Direto",
    typicalIntent: "Busca ativa por acompanhamento nutricional particular",
    bottomFunnelKeywords: [
      "nutricionista esportivo [sua cidade]",
      "nutricionista emagrecimento [seu bairro]",
      "consulta nutricionista particular",
      "nutricionista clínica perto de mim",
    ],
    negativeKeywords: ["cardápio grátis", "dieta pdf", "unimed", "convênio", "faculdade", "salário"],
    deliverables: [
      "Segmentação por objetivo do paciente (esportiva, emagrecimento, saúde da mulher, clínica)",
      "Negativação contra downloads de dietas prontas e buscas por convênio",
      "Integração do Perfil no Google Maps com anúncios locais",
      "Monitoramento de conversões reais de agendamento no WhatsApp",
    ],
    faqs: [
      {
        q: "Google Ads funciona para nutricionistas com orçamento inicial enxuto?",
        a: "Sim. Ao restringir o raio de atendimento ao seu bairro/cidade e focar apenas em palavras de intenção de agendamento ('consulta nutricionista', 'nutricionista esportivo + cidade'), evitamos desperdício e geramos contatos qualificados mesmo com verba moderada.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Sou nutricionista e quero estruturar campanhas de Google Ads para atrair pacientes particulares.",
  },
  arquitetos: {
    slug: "arquitetos",
    nome: "Arquitetos e Escritórios de Arquitetura",
    badge: "Google Ads · Arquitetura",
    headline: "Google Ads para Arquitetos: gere pedidos de orçamento para projetos residenciais e comerciais",
    subheadline:
      "Apareça para proprietários e empresários pesquisando projeto arquitetônico, reforma de alto padrão e design de interiores na sua cidade.",
    campaignFocus: "Pesquisa de Alto Ticket + Segmentação por Bairros Nobres + Portfólio Rápido",
    typicalIntent: "Contratar projeto arquitetônico ou reforma completa",
    bottomFunnelKeywords: [
      "escritório de arquitetura [sua cidade]",
      "arquiteto projeto residencial [cidade]",
      "projeto de interiores alto padrão",
      "arquiteto reforma comercial [cidade]",
    ],
    negativeKeywords: ["faculdade", "estágio", "bloco autocad", "revit grátis", "planta pronta grátis", "salário"],
    deliverables: [
      "Segmentação por renda/bairros-alvo e tipos de projeto de maior margem",
      "Bloqueio de estudantes procurando blocos CAD, portfólio TCC e plantas gratuitas",
      "Anúncios com extensões de portfólio, local e botão direto de briefing no WhatsApp",
    ],
    faqs: [
      {
        q: "Como filtrar clientes com orçamento compatível no Google Ads para arquitetura?",
        a: "Combinamos palavras-chave comerciais específicas ('escritório de arquitetura', 'projeto casa condomínio'), segmentação por bairros/cidades de maior ticket e qualificação na página de destino.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho um escritório de arquitetura e quero captar projetos qualificados pelo Google Ads.",
  },
  contadores: {
    slug: "contadores",
    nome: "Contadores e Escritórios de Contabilidade",
    badge: "Google Ads · Contabilidade B2B",
    headline: "Google Ads para Contadores: feche contratos recorrentes de abertura e troca de contabilidade",
    subheadline:
      "Capte empresários locais buscando abrir CNPJ, migrar de MEI para ME ou trocar de escritório contábil, construindo receita mensal previsível.",
    campaignFocus: "Pesquisa B2B por nicho (médicos, empresas, MEI->ME) + Extensão de Local",
    typicalIntent: "Empresário buscando contratação imediata de contabilidade",
    bottomFunnelKeywords: [
      "escritório de contabilidade [sua cidade]",
      "abrir empresa contador [cidade]",
      "contabilidade para médicos [cidade]",
      "trocar de contador empresa",
    ],
    negativeKeywords: ["vaga", "estágio", "curso", "crc prova", "planilha grátis", "mei gratuito gov"],
    deliverables: [
      "Campanhas dedicadas para abertura de empresa, troca de contabilidade e nichos de alto honorário",
      "Negativação contra pessoas buscando resolver pendências de graça no portal Gov.br",
      "Medição de leads B2B no WhatsApp comercial e formulário de proposta",
    ],
    faqs: [
      {
        q: "Vale a pena anunciar contabilidade local se existem contabilidades online baratas?",
        a: "Muito! Empresas que faturam bem e profissionais liberais (médicos, clínicas, comércios) buscam ativamente um contador próximo e consultivo na própria cidade justamente porque cansaram de suporte lento em plataformas baratas.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho um escritório de contabilidade e quero estruturar campanhas de Google Ads B2B.",
  },
  esteticistas: {
    slug: "esteticistas",
    nome: "Clínicas de Estética",
    badge: "Google Ads · Estética Avançada",
    headline: "Google Ads para Clínicas de Estética: agenda cheia em procedimentos de alta margem",
    subheadline:
      "Atraia clientes da sua região buscando harmonização, bioestimuladores, depilação a laser, limpeza de pele e protocolos corporais direto no WhatsApp da clínica.",
    campaignFocus: "Pesquisa por Procedimento + Anúncios no Google Maps + Raio Geográfico Local",
    typicalIntent: "Pesquisa por clínica confiável e avaliação do procedimento",
    bottomFunnelKeywords: [
      "clínica de estética [seu bairro]",
      "harmonização facial [sua cidade]",
      "depilação a laser [sua cidade]",
      "bioestimulador de colágeno clínica",
    ],
    negativeKeywords: ["curso", "aparelho comprar", "antes e depois fotos", "estágio", "franquia"],
    deliverables: [
      "Campanhas por procedimento carro-chefe da clínica com verba alocada por margem",
      "Conexão com o Google Meu Negócio para exibir avaliações 5 estrelas e localização",
      "Rastreamento de agendamentos de avaliação no WhatsApp",
    ],
    faqs: [
      {
        q: "Qual a vantagem do Google Ads frente ao Instagram para clínicas de estética?",
        a: "No Google Ads você captura o cliente que já decidiu fazer o procedimento e está procurando qual clínica escolher no bairro. Isso reduz drasticamente os curiosos que só perguntam preço no direct e somem.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho uma clínica de estética e quero gerar agendamentos qualificados via Google Ads.",
  },
  corretores: {
    slug: "corretores",
    nome: "Corretores de Imóveis e Imobiliárias",
    badge: "Google Ads · Mercado Imobiliário",
    headline: "Google Ads para Imobiliárias e Corretores: capte compradores com intenção real por bairro",
    subheadline:
      "Posicione lançamentos, imóveis de médio/alto padrão e captação de proprietários nas buscas exatas por bairro e tipologia — sem depender apenas de portais compartilhados.",
    campaignFocus: "Pesquisa por Bairro/Empreendimento + Landing Page de Captura + WhatsApp",
    typicalIntent: "Busca ativa para comprar ou alugar imóvel em região específica",
    bottomFunnelKeywords: [
      "apartamento à venda [bairro] [cidade]",
      "imobiliária [bairro] [cidade]",
      "casa em condomínio [cidade]",
      "lançamento imobiliário [região]",
    ],
    negativeKeywords: ["olx", "quintoandar", "zap", "aluguel barato", "kitnet", "vaga corretor", "creci"],
    deliverables: [
      "Estrutura de campanhas por bairro, faixa de preço e empreendimento prioritário",
      "Negativação contra buscas de aluguel popular quando o foco é venda/alto padrão",
      "Medição de contatos qualificados enviados ao plantão de WhatsApp",
    ],
    faqs: [
      {
        q: "Google Ads funciona melhor que portais imobiliários?",
        a: "Nos portais seu cliente vê 20 anúncios concorrentes na mesma tela. No Google Ads com página dedicada, o comprador cai direto na sua oferta exclusiva e conversa apenas com você ou sua equipe.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Atuo no mercado imobiliário e quero gerar leads qualificados pelo Google Ads.",
  },
  fisioterapeutas: {
    slug: "fisioterapeutas",
    nome: "Fisioterapeutas e Estúdios de Pilates",
    badge: "Google Ads · Fisioterapia & Pilates",
    headline: "Google Ads para Fisioterapeutas: capte pacientes para reabilitação, coluna e pilates",
    subheadline:
      "Apareça no topo do Google quando alguém no seu bairro busca tratamento para dor na coluna, pós-operatório, fisioterapia esportiva ou pilates clínico.",
    campaignFocus: "Pesquisa por Dor/Tratamento + Raio Geográfico Curto + Google Maps Ads",
    typicalIntent: "Dor aguda ou busca por clínica próxima para sessões recorrentes",
    bottomFunnelKeywords: [
      "clínica de fisioterapia [seu bairro]",
      "fisioterapeuta coluna [sua cidade]",
      "estúdio de pilates [seu bairro]",
      "fisioterapia esportiva perto de mim",
    ],
    negativeKeywords: ["exercício youtube", "sus", "faculdade", "estágio", "convênio", "pdf"],
    deliverables: [
      "Segmentação em raio de 3 km a 8 km ao redor da clínica (onde está quem fecha sessões semanais)",
      "Separação de campanhas entre Fisioterapia Particular, Quiropraxia/Osteopatia e Pilates",
      "Integração com Google Meu Negócio para destacar avaliações reais de pacientes",
    ],
    faqs: [
      {
        q: "Qual o raio ideal para anunciar clínica de fisioterapia ou pilates?",
        a: "Como o paciente precisa ir de 1 a 3 vezes por semana, campanhas concentradas em um raio de 3 km a 8 km da clínica trazem taxa de conversão muito maior e custo por lead menor.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho clínica de fisioterapia / pilates e quero estruturar campanhas de Google Ads locais.",
  },
  engenheiros: {
    slug: "engenheiros",
    nome: "Engenheiros e Empresas de Engenharia",
    badge: "Google Ads · Engenharia",
    headline: "Google Ads para Engenheiros: atraia demandas de laudos, ART, projetos estruturais e obras",
    subheadline:
      "Capture síndicos, empresas e proprietários procurando laudo técnico, regularização de imóveis, projeto estrutural, elétrico ou acompanhamento de obra.",
    campaignFocus: "Pesquisa de Serviços Técnicos B2B e Residenciais + Orçamento WhatsApp",
    typicalIntent: "Necessidade técnica/legal imediata com urgência de laudo ou projeto",
    bottomFunnelKeywords: [
      "engenheiro civil laudo técnico [cidade]",
      "emissão de art reforma [cidade]",
      "projeto estrutural engenharia [cidade]",
      "empresa de engenharia civil [cidade]",
    ],
    negativeKeywords: ["faculdade", "crea concurso", "vaga", "estágio", "salário", "modelo laudo pdf"],
    deliverables: [
      "Grupos de anúncios por serviço técnico (ART, laudos, inspeção predial, projetos)",
      "Negativação contra estudantes e modelos prontos de laudo",
      "Rastreamento de pedidos de orçamento via WhatsApp e formulário",
    ],
    faqs: [
      {
        q: "Serviços técnicos como ART e laudos vendem rápido no Google Ads?",
        a: "Sim. Quem pesquisa por emissão de ART ou laudo técnico geralmente tem prazo de condomínio, prefeitura ou obra correndo e precisa contratar um engenheiro habilitado na mesma semana.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Sou engenheiro(a) e quero captar projetos e laudos técnicos pelo Google Ads.",
  },
  "personal-trainers": {
    slug: "personal-trainers",
    nome: "Personal Trainers e Estúdios",
    badge: "Google Ads · Fitness Personalizado",
    headline: "Google Ads para Personal Trainers: feche alunos presenciais no seu bairro ou consultoria online",
    subheadline:
      "Apareça para quem já decidiu contratar acompanhamento individual de treino em academia, condomínio ou estúdio privado.",
    campaignFocus: "Pesquisa Local por Bairro/Condomínio + Consultoria Online Segmentada",
    typicalIntent: "Busca ativa por personal trainer particular",
    bottomFunnelKeywords: [
      "personal trainer [seu bairro]",
      "estúdio personal trainer [sua cidade]",
      "personal trainer em condomínio [cidade]",
      "consultoria de treino online particular",
    ],
    negativeKeywords: ["treino grátis", "app grátis", "salário", "curso cref", "vaga academia"],
    deliverables: [
      "Segmentação por bairros de alto poder aquisitivo e academias da região",
      "Anúncios diferenciando atendimento presencial exclusivo de consultoria online",
      "CTA direto para agendamento de aula experimental no WhatsApp",
    ],
    faqs: [
      {
        q: "Preciso ter academia própria para anunciar no Google Ads?",
        a: "Não. Você pode anunciar com foco nos bairros onde atende (em condomínios ou academias parceiras) ou no formato de consultoria online para todo o Brasil.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Sou personal trainer / tenho estúdio e quero atrair novos alunos pelo Google Ads.",
  },
  "energia-solar": {
    slug: "energia-solar",
    nome: "Empresas de Energia Solar",
    badge: "Google Ads · Energia Solar",
    headline: "Google Ads para Energia Solar: gere orçamentos qualificados de residências, comércios e agro",
    subheadline:
      "Capture proprietários e empresas pesquisando orçamento de placa solar e redução de conta de luz na sua região de atuação, filtrando curiosos sem perfil.",
    campaignFocus: "Pesquisa Comercial de Alto Ticket + Qualificação por Valor de Conta de Luz",
    typicalIntent: "Pedido de simulação e orçamento de sistema fotovoltaico",
    bottomFunnelKeywords: [
      "empresa de energia solar [sua cidade]",
      "orçamento placa solar residencial [cidade]",
      "instalação energia solar comercial [estado]",
      "projeto energia solar rural",
    ],
    negativeKeywords: ["curso instalador", "vaga", "como funciona", "trabalho escola", "kit solar portátil"],
    deliverables: [
      "Campanhas separadas para projetos residenciais, comerciais/industriais e rurais",
      "Negativação contra kits portáteis, cursos de instalador e pesquisas escolares",
      "Integração de eventos de conversão com WhatsApp comercial e CRM",
    ],
    faqs: [
      {
        q: "Como melhorar a qualidade dos leads de energia solar no Google Ads?",
        a: "Usamos palavras-chave estritamente comerciais ('empresa de energia solar', 'orçamento sistema fotovoltaico'), restringimos ao raio onde sua equipe instala e qualificamos na página por consumo mensal de energia.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho uma empresa de energia solar e quero gerar orçamentos qualificados no Google Ads.",
  },
  "oficinas-mecanicas": {
    slug: "oficinas-mecanicas",
    nome: "Oficinas Mecânicas e Auto Centers",
    badge: "Google Ads · Automotivo",
    headline: "Google Ads para Oficinas Mecânicas: lote o pátio com serviços de maior ticket",
    subheadline:
      "Apareça primeiro quando motoristas na sua cidade pesquisam revisão, freios, suspensão, câmbio automático, injeção eletrônica ou mecânico perto de mim.",
    campaignFocus: "Google Maps Ads + Pesquisa por Serviço/Marca + Ligação Direta",
    typicalIntent: "Necessidade urgente ou manutenção preventiva imediata",
    bottomFunnelKeywords: [
      "oficina mecânica perto de mim",
      "auto center [seu bairro]",
      "manutenção câmbio automático [cidade]",
      "mecânico especialista [marca] [cidade]",
    ],
    negativeKeywords: ["curso mecânica", "vaga mecânico", "peça mercado livre", "como trocar em casa", "youtube"],
    deliverables: [
      "Campanhas focadas nos serviços de maior margem (câmbio, injeção, revisão completa, freios)",
      "Extensão de Local e Chamada para gerar ligações e rotas diretas pelo celular",
      "Integração com Google Meu Negócio para exibir estrutura do pátio e avaliações 5 estrelas",
    ],
    faqs: [
      {
        q: "Google Ads funciona para oficina especializada em marcas importadas ou câmbio?",
        a: "Excelentemente! Quanto mais específico o serviço (ex: câmbio automático, BMW/Audi/Jeep, diesel), menor a concorrência no leilão e maior o ticket médio de cada carro que entra na oficina.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho uma oficina mecânica / auto center e quero gerar mais serviços pelo Google Ads.",
  },
  eletricistas: {
    slug: "eletricistas",
    nome: "Eletricistas e Serviços Elétricos",
    badge: "Google Ads · Urgência & Projetos",
    headline: "Google Ads para Eletricistas: receba ligações e chamados no WhatsApp todos os dias",
    subheadline:
      "Capture clientes residenciais e comerciais procurando eletricista 24h, troca de disjuntor, padrão de entrada, curto-circuito e instalação elétrica na sua cidade.",
    campaignFocus: "Campanha de Chamada/WhatsApp + Pesquisa Local por Horário de Atendimento",
    typicalIntent: "Urgência imediata com fechamento no mesmo dia",
    bottomFunnelKeywords: [
      "eletricista perto de mim",
      "eletricista 24 horas [sua cidade]",
      "eletricista residencial [seu bairro]",
      "instalação padrão de energia [cidade]",
    ],
    negativeKeywords: ["curso senai", "vaga", "salário", "como instalar", "esquema elétrico pdf"],
    deliverables: [
      "Programação de anúncios exatamente nos horários em que você atende o telefone/WhatsApp",
      "Anúncios de chamada direta para celular e extensão de local no Google Maps",
      "Bloqueio de curiosos procurando tutoriais 'faça você mesmo' e cursos técnicos",
    ],
    faqs: [
      {
        q: "Posso pausar os anúncios quando minha agenda do dia já estiver lotada?",
        a: "Sim. No Google Ads controlamos horários, dias da semana e orçamento diário em tempo real para acompanhar sua capacidade de atendimento.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Presto serviços elétricos e quero receber mais chamados qualificados pelo Google Ads.",
  },
  pedreiros: {
    slug: "pedreiros",
    nome: "Pedreiros, Reformas e Empreiteiras",
    badge: "Google Ads · Construção & Reformas",
    headline: "Google Ads para Reformas e Empreiteiras: feche obras completas na sua região",
    subheadline:
      "Posicione sua equipe nas buscas por reforma de apartamentos, casas, porcelanato, telhados e construção civil — evitando pequenos bicos sem margem.",
    campaignFocus: "Pesquisa por Tipo de Reforma + Raio Geográfico + Orçamento no WhatsApp",
    typicalIntent: "Proprietário buscando orçamento de reforma ou construção",
    bottomFunnelKeywords: [
      "empresa de reformas [sua cidade]",
      "empreiteira reforma apartamento [cidade]",
      "pedreiro profissional [seu bairro]",
      "reforma residencial completa [cidade]",
    ],
    negativeKeywords: ["vaga ajudante", "diária barata", "como rebocar", "curso"],
    deliverables: [
      "Foco em palavras-chave de reformas completas, empreiteiras e acabamentos de maior valor",
      "Segmentação por bairros-alvo e bloqueio de buscas por emprego/diária",
      "Acompanhamento de pedidos de visita técnica no WhatsApp",
    ],
    faqs: [
      {
        q: "Como evitar contatos pedindo apenas reparos minúsculos sem margem?",
        a: "Focamos as palavras-chave em 'empresa de reformas', 'reforma de apartamento', 'empreiteira' e deixamos o escopo claro no texto do anúncio e na página.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Trabalho com reformas / empreiteira e quero fechar obras maiores com Google Ads.",
  },
  guinchos: {
    slug: "guinchos",
    nome: "Guinchos e Auto Socorro 24h",
    badge: "Google Ads · Urgência 24h",
    headline: "Google Ads para Guincho 24h: apareça em 1º no exato segundo da pane na estrada",
    subheadline:
      "Quando o carro para no meio da avenida ou rodovia, o motorista digita 'guincho perto de mim' no celular e liga para o primeiro número. Colocamos seu botão de ligação no topo.",
    campaignFocus: "Campanhas Mobile-First + Extensão de Chamada + Raio Exato de Cobertura",
    typicalIntent: "Urgência extrema (decisão em menos de 60 segundos)",
    bottomFunnelKeywords: [
      "guincho 24 horas perto de mim",
      "guincho [sua cidade]",
      "auto socorro rodovia [região]",
      "reboque carro [seu bairro]",
    ],
    negativeKeywords: ["seguro grátis", "vaga motorista", "caminhão guincho à venda", "olx"],
    deliverables: [
      "Otimização extrema para celular com botão de ligação direta na pesquisa",
      "Segmentação cirúrgica por rodovias, bairros e raio onde o deslocamento compensa",
      "Negativação contra compra/venda de caminhão guincho e vagas de motorista",
    ],
    faqs: [
      {
        q: "Google Ads para guincho gera ligações imediatas?",
        a: "Sim. Guincho é um dos nichos de conversão mais rápida do Google Ads, pois a busca acontece no momento exato da emergência. O segredo para lucrar é controlar o raio geográfico e negativar termos de compra de caminhão/vagas.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho serviço de guincho / auto socorro e quero receber ligações diretas pelo Google Ads.",
  },
  "assistencia-celulares": {
    slug: "assistencia-celulares",
    nome: "Assistência Técnica de Celulares",
    badge: "Google Ads · Reparo de Smartphones",
    headline: "Google Ads para Assistência Técnica de Celulares: atraia reparos de tela, bateria e placa",
    subheadline:
      "Capture clientes procurando conserto de iPhone, Samsung e smartphones no seu bairro com anúncios no Google Pesquisa e Google Maps.",
    campaignFocus: "Pesquisa por Modelo/Defeito + Google Maps Ads + Raio Local",
    typicalIntent: "Urgência alta (celular quebrado precisa de conserto hoje)",
    bottomFunnelKeywords: [
      "conserto de celular perto de mim",
      "troca de tela iphone [sua cidade]",
      "assistência técnica celular [seu bairro]",
      "trocar bateria celular [cidade]",
    ],
    negativeKeywords: ["comprar celular usado", "curso manutenção", "peça atacado", "como abrir em casa"],
    deliverables: [
      "Campanhas segmentadas pelos modelos e reparos de maior lucro (iPhone, telas premium, placa)",
      "Extensão de local vinculada ao Google Meu Negócio para rotas rápidas até a loja",
      "Bloqueio de buscas por peças no atacado e cursos de manutenção",
    ],
    faqs: [
      {
        q: "Vale a pena anunciar conserto de iPhone separado de Android?",
        a: "Sim! Separar grupos de anúncios por marca/modelo permite direcionar mais verba aos reparos com maior margem líquida e ajustar lances conforme a demanda da sua bancada.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho uma assistência técnica de celulares e quero atrair mais consertos pelo Google Ads.",
  },
  "manutencao-computadores": {
    slug: "manutencao-computadores",
    nome: "Manutenção de Computadores e Notebooks",
    badge: "Google Ads · Informática & TI",
    headline: "Google Ads para Assistência de Notebooks e TI: gere reparos e contratos empresariais",
    subheadline:
      "Apareça para quem precisa de formatação, upgrade SSD, reparo de notebook Mac/Windows ou suporte de TI local para empresas.",
    campaignFocus: "Pesquisa Local + B2B Suporte TI + Google Maps Ads",
    typicalIntent: "Problema ativo impedindo trabalho ou estudo",
    bottomFunnelKeywords: [
      "conserto de notebook [sua cidade]",
      "assistência técnica informática [seu bairro]",
      "manutenção macbook [cidade]",
      "suporte ti para empresas [cidade]",
    ],
    negativeKeywords: ["download windows", "como formatar grátis", "curso informática", "peça aliexpress"],
    deliverables: [
      "Separação de campanhas entre atendimento balcão (notebook/Mac) e suporte TI B2B",
      "Negativação contra tutoriais gratuitos e downloads de software",
      "Rastreamento de ligações, rotas e chamados no WhatsApp",
    ],
    faqs: [
      {
        q: "Consigo captar contratos mensais de TI para empresas pelo Google Ads?",
        a: "Sim. Criamos uma frente específica para decisores B2B pesquisando 'suporte de TI empresarial', 'manutenção de computadores para empresas' e 'redes corporativas' na sua cidade.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Trabalho com manutenção de computadores / TI e quero estruturar campanhas de Google Ads.",
  },
  "clinicas-veterinarias": {
    slug: "clinicas-veterinarias",
    nome: "Clínicas Veterinárias e Hospitais Pet",
    badge: "Google Ads · Veterinária",
    headline: "Google Ads para Clínicas Veterinárias: capte consultas, exames, cirurgias e plantão 24h",
    subheadline:
      "Esteja no topo do Google Pesquisa e Maps quando tutores da sua região precisam de atendimento veterinário confiável, vacinas, especialistas ou emergência.",
    campaignFocus: "Pesquisa de Urgência/Especialidade + Google Maps Ads + Botão de Ligação",
    typicalIntent: "Urgência emocional alta — escolha imediata pela confiança e proximidade",
    bottomFunnelKeywords: [
      "clínica veterinária perto de mim",
      "veterinário 24 horas [sua cidade]",
      "consulta veterinária [seu bairro]",
      "castração / cirurgia veterinária [cidade]",
    ],
    negativeKeywords: ["gratuito", "prefeitura", "ong", "faculdade veterinária", "remédio caseiro"],
    deliverables: [
      "Campanhas separadas para plantão 24h/emergência, consultas de rotina e especialidades",
      "Bloqueio de buscas por atendimento gratuito de prefeitura e receitas caseiras",
      "Integração com Google Meu Negócio para destacar avaliações dos tutores e rota rápida",
    ],
    faqs: [
      {
        q: "Por que vincular o Google Meu Negócio ao Google Ads é essencial para clínicas veterinárias?",
        a: "Em emergências com pets, o tutor olha imediatamente a distância no mapa e a nota em estrelas. Anunciar com extensão de local exibe sua clínica no topo do Maps com botão direto de ligar e traçar rota.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho uma clínica veterinária e quero atrair mais tutores pelo Google Ads.",
  },
  "pet-shops": {
    slug: "pet-shops",
    nome: "Pet Shops e Banho e Tosa",
    badge: "Google Ads · Mercado Pet Local",
    headline: "Google Ads para Pet Shops: atraia tutores do bairro para banho, tosa, creche e pacotes",
    subheadline:
      "Domine o raio de 3 km a 5 km ao redor da sua loja no Google Pesquisa e Google Maps para conquistar clientes recorrentes toda semana.",
    campaignFocus: "Raio Hiperlocal + Google Maps Ads + WhatsApp de Agendamento",
    typicalIntent: "Busca por banho e tosa confiável perto de casa",
    bottomFunnelKeywords: [
      "banho e tosa perto de mim",
      "pet shop [seu bairro]",
      "tosa higiênica cachorro [sua cidade]",
      "hotelzinho / creche pet [seu bairro]",
    ],
    negativeKeywords: ["vaga banhista", "curso tosa", "franquia", "atacado ração"],
    deliverables: [
      "Segmentação hiperlocal focada nos bairros atendidos (inclusive com táxi dog)",
      "Anúncios destacando diferenciais de segurança, agendamento rápido e pacotes mensais",
      "Conexão com o Perfil no Google Maps para impulsionar rotas e ligações",
    ],
    faqs: [
      {
        q: "Qual o segredo para Pet Shop ter retorno positivo no Google Ads?",
        a: "Restringir o raio exatamente à área de entrega/táxi dog e focar na conversão para pacotes mensais de banho e tosa (recorrência), multiplicando o valor de cada novo tutor captado.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho um pet shop / banho e tosa e quero atrair mais tutores da minha região no Google Ads.",
  },
  agropecuarias: {
    slug: "agropecuarias",
    nome: "Casas Agropecuárias e Agro",
    badge: "Google Ads · Agropecuária",
    headline: "Google Ads para Agropecuárias: gere visitas na loja e orçamentos de insumos e rações",
    subheadline:
      "Apareça para produtores rurais e clientes da cidade buscando rações, medicamentos veterinários, sementes, cercas e insumos agrícolas na sua região.",
    campaignFocus: "Pesquisa Regional + Google Maps Ads + Estoque/Categorias Principais",
    typicalIntent: "Compra direta em loja física ou pedido de cotação no WhatsApp",
    bottomFunnelKeywords: [
      "casa agropecuária perto de mim",
      "agropecuária [sua cidade]",
      "ração atacado [região]",
      "insumos agrícolas loja [cidade]",
    ],
    negativeKeywords: ["concurso", "faculdade agronomia", "vaga", "pdf"],
    deliverables: [
      "Campanhas por linhas de produto de maior giro e margem (rações, linha rural, pet, jardim)",
      "Extensão de local no Google Maps para atrair fluxo físico para a loja",
      "Atalho direto para cotação no WhatsApp do balcão",
    ],
    faqs: [
      {
        q: "Google Ads ajuda agropecuária a vender também para municípios vizinhos?",
        a: "Sim. Podemos configurar raios por cidade e região rural atendida, destacando entrega regional e estoque imediato.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho uma casa agropecuária e quero aumentar vendas e visitas pelo Google Ads.",
  },
  restaurantes: {
    slug: "restaurantes",
    nome: "Restaurantes e Gastronomia",
    badge: "Google Ads · Gastronomia Local",
    headline: "Google Ads para Restaurantes: lote mesas, reservas e delivery próprio sem pagar comissão alta",
    subheadline:
      "Apareça no topo do Google Maps e da Pesquisa na hora do almoço, jantar e fins de semana para quem procura onde comer na sua região.",
    campaignFocus: "Google Maps Ads por Horário de Pico + Reservas/Cardápio Próprio",
    typicalIntent: "Decisão imediata de onde almoçar, jantar ou pedir hoje",
    bottomFunnelKeywords: [
      "restaurante perto de mim",
      "melhor [culinária] [sua cidade]",
      "churrascaria / pizzaria [seu bairro]",
      "reserva restaurante jantar [cidade]",
    ],
    negativeKeywords: ["receita", "como fazer", "vaga garçom", "cozinheiro currículo"],
    deliverables: [
      "Programação inteligente por horário (almoço, happy hour, jantar, sexta a domingo)",
      "Foco em anúncios de local no Google Maps (rotas + ligações + link de reserva/delivery direto)",
      "Negativação contra receitas culinárias e vagas de emprego",
    ],
    faqs: [
      {
        q: "Anunciar no Google ajuda a depender menos de apps de delivery?",
        a: "Sim! Você direciona o cliente direto para seu cardápio próprio, WhatsApp de pedidos ou reserva de mesa, mantendo margem muito maior do que nas comissões de marketplaces.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho um restaurante e quero gerar mais reservas e pedidos diretos com Google Ads.",
  },
  chaveiros: {
    slug: "chaveiros",
    nome: "Chaveiros 24h e Automotivos",
    badge: "Google Ads · Urgência 24h",
    headline: "Google Ads para Chaveiros: capture chamados de abertura e chaves codificadas na hora",
    subheadline:
      "Quem trancou a chave dentro de casa ou do carro busca no celular e liga imediatamente para o topo do Google. Estruturamos campanhas de alta rentabilidade por raio real.",
    campaignFocus: "Mobile Call-First + Pesquisa de Urgência + Chaves Automotivas",
    typicalIntent: "Emergência imediata com contratação no primeiro telefonema",
    bottomFunnelKeywords: [
      "chaveiro 24 horas perto de mim",
      "chaveiro automotivo [sua cidade]",
      "chave codificada carro [cidade]",
      "abrir porta trancada chaveiro [bairro]",
    ],
    negativeKeywords: ["curso chaveiro", "máquina copiar chave", "vaga", "como abrir com grampo"],
    deliverables: [
      "Separação de campanhas para emergências 24h e chaves codificadas automotivas (ticket alto)",
      "Proteção contra cliques fora da sua área de atendimento e curiosos",
      "Rastreamento de ligações diretas e mensagens no WhatsApp",
    ],
    faqs: [
      {
        q: "Por que tantos chaveiros perdem dinheiro no Google Ads?",
        a: "Porque deixam correspondência ampla aberta pagando cliques caros de pessoas fora da cidade ou pesquisando 'como abrir cadeado sozinho'. Com negativação cirúrgica e segmentação por presença física, o retorno muda completamente.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Trabalho como chaveiro e quero receber chamados qualificados pelo Google Ads.",
  },
  encanadores: {
    slug: "encanadores",
    nome: "Encanadores e Caça-Vazamentos",
    badge: "Google Ads · Hidráulica & Urgência",
    headline: "Google Ads para Encanadores e Caça-Vazamentos: chamados diários no WhatsApp e telefone",
    subheadline:
      "Apareça no topo do Google para vazamentos ocultos, infiltrações, troca de tubulação, registros e emergências hidráulicas residenciais e prediais.",
    campaignFocus: "Pesquisa de Urgência + Caça-Vazamento (Ticket Alto) + Botão de Ligação",
    typicalIntent: "Problema ativo em casa, condomínio ou empresa exigindo solução rápida",
    bottomFunnelKeywords: [
      "encanador perto de mim",
      "caça vazamento [sua cidade]",
      "encanador 24 horas [seu bairro]",
      "detectar vazamento de água [cidade]",
    ],
    negativeKeywords: ["como consertar", "youtube", "vaga", "curso hidráulica", "comprar registro"],
    deliverables: [
      "Campanhas distintas para emergências hidráulicas e serviços de caça-vazamento com geofone",
      "Segmentação por bairros e horários reais de atendimento da equipe",
      "Negativação contra tutoriais caseiros e lojas de material de construção",
    ],
    faqs: [
      {
        q: "Qual serviço hidráulico dá mais retorno no Google Ads?",
        a: "Caça-vazamentos com equipamento (geofone/termografia) e manutenção predial/condominial costumam ter ticket médio mais alto e ótimo ROI quando separados em campanhas dedicadas.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Trabalho com hidráulica / caça-vazamentos e quero gerar mais chamados pelo Google Ads.",
  },
  desentupidoras: {
    slug: "desentupidoras",
    nome: "Desentupidoras 24h",
    badge: "Google Ads · Desentupidora 24h",
    headline: "Google Ads para Desentupidoras: reduza o custo por chamada em um dos leilões mais disputados",
    subheadline:
      "O leilão de desentupidoras exige gestão sênior: sem blindagem de palavras negativas, horários e raio exato, o orçamento evapora em horas. Estruturamos campanhas focadas em lucro real.",
    campaignFocus: "Gestão Sênior de Leilão Competitivo + Call-Only/WhatsApp + Proteção de Verba",
    typicalIntent: "Emergência imediata residencial, comercial ou condominial",
    bottomFunnelKeywords: [
      "desentupidora 24 horas [sua cidade]",
      "desentupidora de esgoto perto de mim",
      "limpa fossa [sua cidade]",
      "hidrojateamento comercial [cidade]",
    ],
    negativeKeywords: ["soda cáustica", "caseiro", "diabo verde", "como desentupir pia", "vaga", "franquia"],
    deliverables: [
      "Blindagem pesada de palavras-chave negativas contra receitas caseiras e produtos de mercado",
      "Estratégia de lances por horário e bairro para não desperdiçar verba em cliques inválidos",
      "Separação de grupos para desentupimento residencial, limpa fossa e contratos comerciais",
    ],
    faqs: [
      {
        q: "Por que o clique de desentupidora é caro e como torná-lo lucrativo?",
        a: "É um setor de alta concorrência no leilão. O lucro vem de eliminar 100% dos cliques de curiosos, segmentar apenas sua área de atendimento rápido, otimizar o Índice de Qualidade e combinar o anúncio com um Google Meu Negócio nota 4.8+ no Maps.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Tenho uma desentupidora e quero estruturar ou auditar minhas campanhas de Google Ads para melhorar o ROI.",
  },
  "instalacao-ar-condicionado": {
    slug: "instalacao-ar-condicionado",
    nome: "Instalação e Manutenção de Ar Condicionado",
    badge: "Google Ads · Climatização & PMOC",
    headline: "Google Ads para Ar Condicionado: feche instalações, higienização e contratos PMOC",
    subheadline:
      "Capture clientes residenciais no pico do calor e empresas buscando manutenção preventiva (PMOC) e climatização comercial o ano inteiro.",
    campaignFocus: "Pesquisa por Serviço (Instalação / Higienização / PMOC B2B) + Google Maps Ads",
    typicalIntent: "Necessidade imediata de instalação, conserto ou contrato empresarial",
    bottomFunnelKeywords: [
      "instalação ar condicionado split [sua cidade]",
      "manutenção ar condicionado perto de mim",
      "limpeza e higienização ar condicionado [bairro]",
      "contrato pmoc ar condicionado empresas [cidade]",
    ],
    negativeKeywords: ["comprar ar condicionado", "casas bahia", "magalu", "curso refrigeração", "erro código manual"],
    deliverables: [
      "Campanhas separadas para instalação/limpeza residencial e contratos PMOC empresariais",
      "Bloqueio rigoroso contra quem está pesquisando para comprar o aparelho em e-commerces",
      "Ajuste sazonal de verba e anúncios com botão direto de orçamento no WhatsApp",
    ],
    faqs: [
      {
        q: "Como não pagar cliques de pessoas procurando comprar aparelho de ar condicionado?",
        a: "Usamos correspondência de frase/exata focada em serviço ('instalação', 'técnico', 'conserto', 'limpeza', 'pmoc') e negativamos marcas de varejo e termos de compra de equipamento.",
      },
    ],
    waMessage:
      "Olá, Leonardo! Trabalho com instalação e manutenção de ar condicionado e quero gerar mais serviços pelo Google Ads.",
  },
};

export function getGoogleAdsNiche(slug?: string, fallbackName?: string): GoogleAdsNicheConfig {
  if (slug && GOOGLE_ADS_NICHES[slug]) {
    return GOOGLE_ADS_NICHES[slug];
  }
  const cleanName = fallbackName || (slug ? slug.replace(/-/g, " ") : "Negócios Locais");
  return {
    slug: slug || "negocios-locais",
    nome: cleanName,
    badge: `Google Ads · ${cleanName}`,
    headline: `Google Ads para ${cleanName}: atraia clientes prontos para contratar no WhatsApp`,
    subheadline: `Campanhas profissionais na Rede de Pesquisa e Google Maps para ${cleanName}, focadas em palavras-chave de compra imediata e controle rigoroso de desperdício de verba.`,
    campaignFocus: "Rede de Pesquisa Fundo de Funil + Extensão de Local Maps + Rastreamento WhatsApp",
    typicalIntent: "Busca ativa por prestador qualificado na cidade",
    bottomFunnelKeywords: [
      `${cleanName.toLowerCase()} perto de mim`,
      `orçamento ${cleanName.toLowerCase()} [sua cidade]`,
      `especialista ${cleanName.toLowerCase()} [seu bairro]`,
    ],
    negativeKeywords: ["grátis", "curso", "vaga", "salário", "pdf", "como fazer sozinho"],
    deliverables: [
      "Pesquisa de palavras-chave fundo de funil e lista robusta de palavras negativas",
      "Segmentação geográfica precisa pela sua área real de atendimento",
      "Vinculação com o Google Meu Negócio para aparecer também no topo do Google Maps",
      "Configuração de rastreamento de conversões no WhatsApp e ligações",
    ],
    faqs: [
      {
        q: `Como funciona a gestão de Google Ads para ${cleanName}?`,
        a: `Realizamos o diagnóstico da conta ou criação do zero, estruturamos campanhas separadas por serviço de maior margem, negativamos buscas curiosas semanalmente e medimos os leads reais recebidos no WhatsApp.`,
      },
    ],
    waMessage: `Olá, Leonardo! Atuo no segmento de ${cleanName} e quero estruturar campanhas de Google Ads para gerar mais clientes no WhatsApp.`,
  };
}
