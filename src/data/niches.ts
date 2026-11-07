export interface NicheData {
  slug: string;
  title: string; // Para tag <title>
  description: string; // Para meta description
  badge: string;
  h1: string;
  h1Highlight: string;
  subheadline: string;
  painPoints: string[];
  ctaText: string;
  waMessage: string;
}

export const NICHES: NicheData[] = [
  {
    slug: "dentistas",
    title: "Google Meu Negócio para Dentistas e Clínicas Odontológicas | Leonardo Brasil",
    description: "Coloque sua clínica odontológica no Top 3 do Google Maps. Atraia pacientes particulares para implantes, próteses e alinhadores na sua cidade.",
    badge: "Odontologia & Clínicas",
    h1: "Sua clínica odontológica fora do Top 3 do Google Maps? Crie uma ",
    h1Highlight: "máquina de pacientes particulares no Google.",
    subheadline: "Quando o paciente sente dor ou quer fazer implantes, ele abre o Google Maps. Otimizamos seu Perfil da Empresa no Google e suas avaliações para você dominar as primeiras posições da sua região.",
    painPoints: [
      "Perfil no Google Maps mal configurado perdendo pacientes para concorrentes vizinhos",
      "Poucas avaliações e sem respostas estratégicas com palavras-chave de SEO local",
      "Falta de previsibilidade na agenda de procedimentos de alto valor (implantes e alinhadores)"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Dentistas",
    waMessage: "Olá, Leonardo! Tenho uma clínica odontológica e quero posicionar meu perfil no topo do Google Maps."
  },
  {
    slug: "medicos",
    title: "Google Meu Negócio para Médicos e Consultórios | Leonardo Brasil",
    description: "Apareça no topo das buscas do Google Maps na sua cidade. Atraia pacientes particulares qualificados para sua especialidade médica.",
    badge: "Medicina & Consultórios",
    h1: "Agenda médica refém de repasses baixos de convênio? Domine o ",
    h1Highlight: "Google Maps para consultas particulares.",
    subheadline: "Pacientes particulares pesquisam por especialistas médicos no Google Maps diariamente. Colocamos seu consultório no topo das buscas locais com autoridade, avaliações e conformidade ética.",
    painPoints: [
      "Perfil invisível nas buscas por especialidade médica na sua cidade",
      "Dependência de repasses baixos e atrasados de convênios de saúde",
      "Falta de posicionamento local que transmita autoridade e acolhimento"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Médicos",
    waMessage: "Olá, Leonardo! Sou médico(a) e quero posicionar meu consultório no topo do Google Maps para pacientes particulares."
  },
  {
    slug: "psicologas",
    title: "Google Meu Negócio para Psicólogas | Leonardo Brasil",
    description: "Otimização de Google Meu Negócio para psicólogas. Atraia pacientes particulares que buscam terapia presencial e online na sua cidade.",
    badge: "Psicologia",
    h1: "Refém de plataformas de terapia de baixo custo? Domine o ",
    h1Highlight: "Google Maps para pacientes particulares.",
    subheadline: "Pessoas que buscam terapia na sua cidade abrem o Google diariamente. Estruturamos seu Perfil da Empresa no Google para atrair quem valoriza seu trabalho e paga o valor justo pelas sessões.",
    painPoints: [
      "Exaustão atendendo por plataformas de baixo custo com margens mínimas",
      "Perfil no Google Maps sem otimização de categorias e termos de busca essenciais",
      "Falta de previsibilidade na captação ética de pacientes particulares"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Psicólogas",
    waMessage: "Olá, Leonardo! Sou psicóloga e quero otimizar meu perfil no Google Maps para captar pacientes particulares."
  },
  {
    slug: "nutricionistas",
    title: "Google Meu Negócio para Nutricionistas | Leonardo Brasil",
    description: "Destaque seu consultório de nutrição no Google Maps. Atraia pacientes qualificados da sua cidade para planos de acompanhamento.",
    badge: "Nutrição & Acompanhamento",
    h1: "Pacientes que desistem após a primeira consulta? Domine o ",
    h1Highlight: "Google Maps para atrair pacientes comprometidos.",
    subheadline: "Quem busca por nutricionista no Google Maps já tomou a decisão de investir na saúde. Posicionamos seu perfil nas primeiras posições locais para converter buscas em agendamentos diretos no WhatsApp.",
    painPoints: [
      "Perfil desatualizado no Google perdendo destaque para consultórios concorrentes",
      "Briga de preço por consultas avulsas em vez de planos de acompanhamento",
      "Ausência de estratégia de fotos, categorias e avaliações no Perfil da Empresa"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Nutrição",
    waMessage: "Olá, Leonardo! Sou nutricionista e quero posicionar meu consultório no topo do Google Maps."
  },
  {
    slug: "fisioterapeutas",
    title: "Google Meu Negócio para Fisioterapeutas | Leonardo Brasil",
    description: "Destaque sua clínica de fisioterapia no Google Maps e receba ligações e contatos no WhatsApp de pacientes locais todos os dias.",
    badge: "Fisioterapia",
    h1: "Perdendo pacientes locais para a concorrência? Domine as ",
    h1Highlight: "buscas no Google Maps.",
    subheadline: "Quando o paciente sente dor nas costas ou precisa de reabilitação urgente, ele abre o Google Maps. Se sua clínica não aparece no Top 3, você está perdendo pacientes todos os dias.",
    painPoints: [
      "Falta de visibilidade local no Google Maps para serviços de fisioterapia e pilates",
      "Perfil com poucas avaliações e sem respostas otimizadas para SEO Local",
      "Dependência exclusiva de indicações boca a boca para manter o faturamento"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Fisioterapia",
    waMessage: "Olá, Leonardo! Tenho uma clínica de fisioterapia e quero posicionar meu perfil no Google Maps."
  },
  {
    slug: "terapeutas",
    title: "Google Meu Negócio para Terapeutas | Leonardo Brasil",
    description: "Posicione seu espaço terapêutico no topo do Google Maps e atraia clientes que buscam ativamente pelos seus serviços na sua região.",
    badge: "Terapia Holística & Integrativa",
    h1: "Atraindo pouca visibilidade local? Posicione seu espaço no ",
    h1Highlight: "topo do Google Maps.",
    subheadline: "Pessoas que buscam terapias integrativas na sua região precisam encontrar seu espaço com clareza, fotos profissionais e depoimentos que geram confiança imediata.",
    painPoints: [
      "Pouca visibilidade no Google Maps para termos específicos de terapia na cidade",
      "Dificuldade em atrair clientes qualificados sem depender de redes sociais",
      "Perfil sem estratégia de palavras-chave, horários e fotos de autoridade"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Terapeutas",
    waMessage: "Olá, Leonardo! Sou terapeuta e quero posicionar meu espaço no topo do Google Maps."
  },
  {
    slug: "massoterapeutas",
    title: "Google Meu Negócio para Massoterapeutas | Leonardo Brasil",
    description: "Otimização de Google Meu Negócio para massoterapeutas. Lote sua agenda com clientes da sua cidade que buscam massagem relaxante e terapêutica.",
    badge: "Massoterapia",
    h1: "Agenda vazia na sua clínica de massoterapia? Domine o ",
    h1Highlight: "Google Maps da sua cidade.",
    subheadline: "Clientes que buscam alívio de estresse e dores musculares pesquisam no Google Maps por massoterapeutas perto de casa ou do trabalho. Otimizamos seu perfil para liderar o ranking local.",
    painPoints: [
      "Perfil com baixa relevância local que não aparece no raio de atendimento da clínica",
      "Dependência extrema de promoções com margem esmagada para conseguir clientes",
      "Falta de catálogo de serviços estruturado no Perfil da Empresa no Google"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Massoterapia",
    waMessage: "Olá, Leonardo! Sou massoterapeuta e quero otimizar meu perfil no Google Maps para atrair clientes."
  },
  {
    slug: "advogados",
    title: "Google Meu Negócio para Advogados | Leonardo Brasil",
    description: "Posicione seu escritório de advocacia no topo do Google Maps para demandas jurídicas locais de alto valor com conformidade ética da OAB.",
    badge: "Advocacia & Direito",
    h1: "Cansado de atender contatos desqualificados? Domine o ",
    h1Highlight: "Google Maps para sua especialidade jurídica.",
    subheadline: "Quando uma empresa ou pessoa física tem um problema jurídico urgente na sua cidade, o primeiro lugar onde procura um escritório de advocacia de confiança é no Google Maps.",
    painPoints: [
      "Perfil jurídico invisível nas pesquisas por especialidades no Google da sua cidade",
      "Perda de demandas de alto valor para escritórios concorrentes melhor ranqueados",
      "Insegurança sobre como otimizar o perfil no Google respeitando o Provimento da OAB"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Advocacia",
    waMessage: "Olá, Leonardo! Sou advogado(a) e quero posicionar meu escritório no topo do Google Maps."
  },
  {
    slug: "arquitetos",
    title: "Google Meu Negócio para Arquitetos | Leonardo Brasil",
    description: "Destaque seu escritório de arquitetura no Google Maps e atraia clientes locais para projetos residenciais e comerciais de alto padrão.",
    badge: "Arquitetura & Urbanismo",
    h1: "Dependendo apenas de indicações para novos projetos? Domine o ",
    h1Highlight: "Google Maps na sua região.",
    subheadline: "Clientes com alto poder aquisitivo que vão construir ou reformar na sua cidade pesquisam arquitetos no Google Maps para ver fotos de projetos, avaliações e localização do escritório.",
    painPoints: [
      "Projetos incríveis no portfólio mas perfil do Google Maps apagado e sem alcance local",
      "Falta de previsibilidade na entrada de novos contratos de projetos completos",
      "Concorrentes locais menos experientes aparecendo na frente no Google Maps"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Arquitetos",
    waMessage: "Olá, Leonardo! Sou arquiteto(a) e quero posicionar meu escritório no topo do Google Maps."
  },
  {
    slug: "contadores",
    title: "Google Meu Negócio para Contadores | Leonardo Brasil",
    description: "Otimização de Google Meu Negócio para escritórios de contabilidade. Atraia empresas locais que buscam assessoria contábil e tributária.",
    badge: "Contabilidade & BPO",
    h1: "Perdendo clientes para contabilidades online? Domine o ",
    h1Highlight: "Google Maps para empresas da sua cidade.",
    subheadline: "Empresários locais preferem contratar escritórios contábeis da própria cidade para ter proximidade e segurança. Colocamos seu escritório contábil no Top 3 do Google Maps.",
    painPoints: [
      "Guerra de preços com serviços básicos de contabilidade digital sem presença local",
      "Perfil no Google Maps sem catálogo detalhado de serviços (BPO, consultoria, planejamento tributário)",
      "Captação passiva dependendo apenas de indicações de clientes atuais"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Contabilidade",
    waMessage: "Olá, Leonardo! Tenho um escritório de contabilidade e quero atrair clientes empresariais locais pelo Google Maps."
  },
  {
    slug: "clinicas-de-estetica",
    title: "Google Meu Negócio para Clínicas de Estética | Leonardo Brasil",
    description: "Coloque sua clínica de estética no Top 3 do Google Maps. Atraia clientes interessadas em procedimentos avançados de alto valor.",
    badge: "Estética Avançada",
    h1: "Poucas ligações e agendamentos na sua clínica? Domine o ",
    h1Highlight: "Google Maps com Perfil Otimizado.",
    subheadline: "A busca por harmonização facial, bioestimuladores e tecnologias estéticas começa no Google Maps. Quem está nas 3 primeiras posições com fotos impecáveis e 5 estrelas recebe todas as mensagens no WhatsApp.",
    painPoints: [
      "Clínica investe em equipamentos caros mas continua invisível no mapa da cidade",
      "Perfil com fotos amadoras ou sem estratégia de postagens semanais no Google",
      "Perda de clientes de alto valor para clínicas vizinhas que dominam o Google Maps"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Estética",
    waMessage: "Olá, Leonardo! Tenho uma clínica de estética e quero posicioná-la no topo do Google Maps."
  }
];
