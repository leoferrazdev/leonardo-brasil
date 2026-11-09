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
  },
  {
    slug: "eletricistas",
    title: "Google Meu Negócio para Eletricistas | Leonardo Brasil",
    description: "Coloque seus serviços de eletricista no Top 3 do Google Maps. Receba chamados de emergência residencial e predial direto no WhatsApp.",
    badge: "Instalações Elétricas & Emergência",
    h1: "Perdendo chamados elétricos de emergência na sua cidade? Domine o ",
    h1Highlight: "Google Maps para serviços elétricos 24h.",
    subheadline: "Quando ocorre um curto-circuito ou queda de fase, o cliente pesquisa eletricista no Google Maps e liga para os três primeiros. Estruturamos seu perfil com palavras-chave de alta conversão para você liderar os chamados.",
    painPoints: [
      "Perfil no Google Maps sem relevância para termos de emergência elétrica e padrão de energia",
      "Perda de chamados de alto valor para profissionais vizinhos melhor posicionados",
      "Dependência de plataformas intermediárias que cobram comissões abusivas por contato"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Eletricistas",
    waMessage: "Olá, Leonardo! Sou eletricista e quero posicionar meus serviços no Top 3 do Google Maps para receber chamados emergenciais."
  },
  {
    slug: "pedreiros",
    title: "Google Meu Negócio para Pedreiros e Empreiteiras | Leonardo Brasil",
    description: "Posicione seus serviços de pedreiro, reformas e construção civil no Google Maps. Feche contratos de obras na sua região.",
    badge: "Construção Civil & Reformas",
    h1: "Cansado de depender de indicação boca a boca? Domine o ",
    h1Highlight: "Google Maps para obras e reformas.",
    subheadline: "Proprietários que planejam reformas residenciais ou comerciais pesquisam no Google Maps por pedreiros e construtores de confiança. Otimizamos seu perfil para transmitir autoridade e fechar contratos por empreitada.",
    painPoints: [
      "Perfil invisível nas buscas locais por reformas, alvenaria e assentamento de pisos",
      "Guerra de preços por diárias em vez de contratos estruturados por valor de obra",
      "Falta de fotos profissionais de obras executadas e avaliações que geram credibilidade imediata"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Construção",
    waMessage: "Olá, Leonardo! Trabalho com obras e reformas e quero posicionar meus serviços no Google Maps para fechar contratos de valor."
  },
  {
    slug: "guinchos",
    title: "Google Meu Negócio para Guinchos e Auto Socorro | Leonardo Brasil",
    description: "Esteja no Top 3 do Google Maps quando o motorista mais precisa. Receba ligações de guincho 24h e reboque na sua região.",
    badge: "Auto Socorro & Resgate 24h",
    h1: "Motoristas parados na estrada ligam para o 1º do Google. Coloque seu ",
    h1Highlight: "guincho e auto socorro no topo do Maps.",
    subheadline: "Em panes mecânicas ou acidentes, 90% dos motoristas ligam para os 3 primeiros perfis do Google Maps. Otimizamos seu serviço de guincho plataforma para dominar as buscas locais 24 horas por dia.",
    painPoints: [
      "Guincho parado no pátio enquanto concorrentes melhor ranqueados recebem todas as chamadas de socorro",
      "Perfil sem configuração estratégica de horário 24h, raio de atendimento e palavras-chave de urgência",
      "Dependência exclusiva de seguradoras que pagam valores defasados por quilômetro rodado"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Guinchos",
    waMessage: "Olá, Leonardo! Tenho serviço de guincho e auto socorro e quero dominar as primeiras posições do Google Maps na minha região."
  },
  {
    slug: "assistencia-celulares",
    title: "Google Meu Negócio para Assistência Técnica de Celulares | Leonardo Brasil",
    description: "Atraia clientes para troca de tela, bateria e manutenção de smartphones no Google Maps. Lidere as buscas do seu bairro e cidade.",
    badge: "Assistência Técnica Mobile",
    h1: "Bancada vazia na sua assistência de celulares? Domine o ",
    h1Highlight: "Google Maps para troca de tela e reparos.",
    subheadline: "Quando o celular quebra, o cliente busca a assistência mais próxima e confiável no Google Maps. Estruturamos seu Perfil da Empresa com catálogo de marcas (iPhone, Samsung, Xiaomi) e avaliações de confiança.",
    painPoints: [
      "Concorrência informal desleal atraindo clientes apenas por proximidade física",
      "Perfil sem catálogo de serviços estruturado (troca de vidro, bateria, reparo de placas)",
      "Poucas avaliações detalhadas que transmitam a segurança necessária para o cliente deixar o aparelho"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Celulares",
    waMessage: "Olá, Leonardo! Tenho assistência técnica de celulares e quero liderar as buscas do Google Maps na minha cidade."
  },
  {
    slug: "manutencao-computadores",
    title: "Google Meu Negócio para Manutenção de Computadores e Notebooks | Leonardo Brasil",
    description: "Destaque sua assistência de informática no Google Maps. Atraia reparos de notebooks, upgrades e contratos de suporte em TI.",
    badge: "Informática & Suporte TI",
    h1: "Perdendo consertos de notebooks e computadores? Lidere o ",
    h1Highlight: "Google Maps para serviços de informática.",
    subheadline: "Usuários e empresas locais pesquisam diariamente no Google Maps por formatação, troca de SSD, conserto de notebook e manutenção de PCs. Otimizamos seu perfil para atrair serviços de alto valor.",
    painPoints: [
      "Assistência técnica com excelente serviço técnico porém invisível nas buscas geolocalizadas",
      "Dificuldade em captar contratos corporativos recorrentes de manutenção de computadores",
      "Perfil sem palavras-chave técnicas de reparo que ativam as respostas do Google e das IAs"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Informática",
    waMessage: "Olá, Leonardo! Tenho assistência técnica de informática e quero atrair consertos de computadores e notebooks pelo Google."
  },
  {
    slug: "oficinas-mecanicas",
    title: "Google Meu Negócio para Oficinas Mecânicas e Auto Centers | Leonardo Brasil",
    description: "Lote o pátio da sua oficina mecânica com proprietários de veículos da sua cidade. Otimização de Google Maps para serviços automotivos.",
    badge: "Mecânica Automotiva & Auto Center",
    h1: "Elevadores vazios na sua oficina mecânica? Coloque seu ",
    h1Highlight: "auto center no Top 3 do Google Maps.",
    subheadline: "Proprietários de veículos pesquisam oficinas mecânicas no Google Maps avaliando notas, fotos da oficina e agilidade de atendimento. Colocamos sua oficina mecânica nas primeiras posições para freios, suspensão e motor.",
    painPoints: [
      "Oficina com excelente ferramental mas pátio ocioso dependendo apenas de clientes antigos",
      "Desconfiança do público que busca oficinas com dezenas de avaliações reais e fotos profissionais",
      "Perfil sem menção aos serviços de revisão preventiva, injeção eletrônica e diagnóstico computadorizado"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Oficinas",
    waMessage: "Olá, Leonardo! Tenho oficina mecânica / auto center e quero atrair proprietários de veículos pelo Google Maps."
  },
  {
    slug: "clinicas-veterinarias",
    title: "Google Meu Negócio para Clínicas Veterinárias e Hospitais Pet | Leonardo Brasil",
    description: "Atraia tutores para consultas, exames e emergências 24h no Google Maps, em total conformidade com o Conselho Federal de Medicina Veterinária (CFMV).",
    badge: "Medicina Veterinária & Saúde Pet",
    h1: "Tutores desesperados procuram atendimento no Google. Posicione sua ",
    h1Highlight: "clínica veterinária no topo do Maps.",
    subheadline: "Quando o pet adoece ou precisa de vacinas e exames urgentes, o tutor abre o Google Maps. Posicionamos sua clínica veterinária no Top 3 com credibilidade ética, fotos acolhedoras e botão de emergência direto no WhatsApp.",
    painPoints: [
      "Plantão 24h ocioso enquanto concorrentes menos equipados recebem as emergências da cidade",
      "Insegurança sobre publicidade ética e receio de infrações junto às normas do CFMV",
      "Ausência de destaque para especialidades veterinárias (dermatologia, oftalmologia, ortopedia pet)"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Veterinárias",
    waMessage: "Olá, Leonardo! Sou médico(a) veterinário(a) e quero posicionar minha clínica no topo do Google Maps com conformidade ética."
  },
  {
    slug: "pet-shops",
    title: "Google Meu Negócio para Pet Shops e Banho e Tosa | Leonardo Brasil",
    description: "Lote a agenda de banho e tosa e aumente a venda de rações no seu pet shop com presença dominante no Google Maps do seu bairro.",
    badge: "Estética Animal & Pet Shop",
    h1: "Agenda de banho e tosa com horários vagos? Domine o ",
    h1Highlight: "Google Maps do seu bairro.",
    subheadline: "Tutores valorizam conveniência e proximidade para cuidar dos seus pets. Otimizamos o perfil do seu pet shop para você ser a primeira opção de banho, tosa, hidratação e venda de rações da sua vizinhança.",
    painPoints: [
      "Moradores do próprio bairro comprando ração e agendando tosa em concorrentes mais distantes",
      "Falta de catálogo visual de serviços e fotos de pets bem cuidados que geram desejo imediato",
      "Poucas avaliações que comprovem carinho, higiene e segurança no manuseio dos animais"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Pet Shop",
    waMessage: "Olá, Leonardo! Tenho um pet shop / banho e tosa e quero captar tutores do meu bairro pelo Google Maps."
  },
  {
    slug: "agropecuarias",
    title: "Google Meu Negócio para Casas Agropecuárias | Leonardo Brasil",
    description: "Destaque sua loja agropecuária no Google Maps. Atraia produtores rurais, criadores e clientes urbanos para rações, ferramentas e insumos.",
    badge: "Agropecuária & Insumos Rurais",
    h1: "Vendas de insumos agrícolas e rações em queda? Domine o ",
    h1Highlight: "Google Maps na sua região.",
    subheadline: "Produtores, sitiantes e tutores buscam casas agropecuárias no Google Maps para checar estoques de rações, defensivos e ferramentas. Colocamos sua agropecuária no topo para gerar contatos diretos no WhatsApp.",
    painPoints: [
      "Loja tradicional com anos de mercado mas perfil fantasma ou desatualizado no Google",
      "Perda de clientes para distribuidores online ou novas lojas agropecuárias da região",
      "Perfil sem catálogo de produtos sazonais (sementes, fertilizantes, vacinas de rebanho)"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Agropecuária",
    waMessage: "Olá, Leonardo! Tenho uma loja agropecuária e quero posicionar meus produtos e insumos no Google Maps da região."
  },
  {
    slug: "restaurantes",
    title: "Google Meu Negócio para Restaurantes e Gastronomia Local | Leonardo Brasil",
    description: "Encha seu salão e receba pedidos no WhatsApp sem pagar comissões abusivas de aplicativos. Otimização de Google Maps para restaurantes.",
    badge: "Gastronomia & Delivery Local",
    h1: "Refém das taxas abusivas de aplicativos de entrega? Domine o ",
    h1Highlight: "Google Maps e receba pedidos direto no WhatsApp.",
    subheadline: "Quem busca onde almoçar ou jantar pesquisa fotos de pratos, cardápio e notas no Google Maps. Colocamos seu restaurante no Top 3 para atrair clientes para o salão e delivery próprio sem intermediários.",
    painPoints: [
      "Margem de lucro esmagada por comissões de até 27% em plataformas de entrega terceirizadas",
      "Perfil sem cardápio atualizado, fotos atrativas dos pratos ou horário especial de funcionamento",
      "Avaliações negativas sem resposta estratégica que afastam novos clientes indecisos"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Restaurantes",
    waMessage: "Olá, Leonardo! Tenho restaurante e quero posicionar meu estabelecimento no Google Maps para atrair clientes locais sem intermediários."
  },
  {
    slug: "chaveiros",
    title: "Google Meu Negócio para Chaveiros e Aberturas 24h | Leonardo Brasil",
    description: "Esteja no Top 3 do Google Maps quando o cliente trancar a chave para fora. Receba chamados de emergência residencial e automotiva 24h no WhatsApp.",
    badge: "Chaveiro & Aberturas 24h",
    h1: "Perdendo aberturas de emergência na sua cidade? Domine o ",
    h1Highlight: "Google Maps para chaveiros 24h.",
    subheadline: "Quando a pessoa fica trancada para fora de casa ou do carro, ela abre o Google Maps e liga para os três primeiros colocados. Estruturamos seu perfil para você liderar os atendimentos rápidos da sua região.",
    painPoints: [
      "Perfil sem configuração de horário 24h perdendo os chamados de maior rentabilidade",
      "Concorrentes informais aparecendo na frente apenas por termos 'aberto agora'",
      "Falta de catálogo com serviços de cópias codificadas, travas e abertura de cofres"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Chaveiros",
    waMessage: "Olá, Leonardo! Sou chaveiro e quero posicionar meu serviço de emergência no Top 3 do Google Maps."
  },
  {
    slug: "encanadores",
    title: "Google Meu Negócio para Encanadores e Caça-Vazamentos | Leonardo Brasil",
    description: "Coloque seus serviços hidráulicos no topo do Google Maps. Receba ligações de caça-vazamento, desentupimento e reparos hidráulicos urgentes.",
    badge: "Serviços Hidráulicos & Caça-Vazamento",
    h1: "Cano estourado ou vazamento oculto? Seja o primeiro ",
    h1Highlight: "encanador encontrado no Google Maps.",
    subheadline: "Vazamentos geram contas de água altíssimas e desespero. O morador busca encanador no Google Maps e liga imediatamente para quem tem avaliações de confiança e atendimento rápido.",
    painPoints: [
      "Perfil sem relevância para termos de alto valor como 'caça-vazamento não destrutivo'",
      "Dependência de indicações lentas enquanto os vizinhos fecham reparos diários no Google",
      "Ausência de fotos de ferramentas especializadas e geolocalização por bairros atendidos"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Encanadores",
    waMessage: "Olá, Leonardo! Sou encanador / caça-vazamento e quero atrair chamados pelo Google Maps."
  },
  {
    slug: "desentupidoras",
    title: "Google Meu Negócio para Desentupidoras e Hidrojateamento 24h | Leonardo Brasil",
    description: "Lidere as buscas de desentupimento de esgoto, pias, ralos e hidrojateamento no Google Maps. Atenda condomínios, residências e empresas da sua região.",
    badge: "Desentupimento & Hidrojateamento 24h",
    h1: "Esgoto entupido exige socorro imediato. Coloque sua ",
    h1Highlight: "desentupidora no topo do Google Maps.",
    subheadline: "Desentupimento é o nicho com o maior CPC do Google Ads. Posicionamos sua desentupidora organicamente no Top 3 do Google Maps para você faturar com margem alta e custo por clique zero.",
    painPoints: [
      "Custos astronômicos no Google Ads comendo toda a margem de lucro dos serviços",
      "Perfil suspenso ou mal visto devido à má reputação histórica do mercado de desentupimento",
      "Falta de contratos recorrentes de manutenção preventiva com condomínios e restaurantes"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Desentupidoras",
    waMessage: "Olá, Leonardo! Tenho uma desentupidora e quero dominar o topo do Google Maps organicamente."
  },
  {
    slug: "instalacao-ar-condicionado",
    title: "Google Meu Negócio para Instalação e Limpeza de Ar-Condicionado | Leonardo Brasil",
    description: "Atraia clientes para instalação split, manutenção preventiva, recarga de gás e higienização de ar-condicionado pelo Google Maps na sua cidade.",
    badge: "Climatização & Refrigeração",
    h1: "Dias quentes com agenda vazia? Coloque sua empresa de ",
    h1Highlight: "ar-condicionado no topo do Google Maps.",
    subheadline: "Nas ondas de calor, a procura por instalação de ar-condicionado e recarga de gás explode no Google. Quem domina o Top 3 do Maps fecha orçamentos todos os dias sem pagar comissões.",
    painPoints: [
      "Sazonalidade extrema sofrendo com meses de baixa por não captar contratos corporativos e PMOC",
      "Perfil sem catálogo de serviços (instalação split, inverter, higienização e conserto)",
      "Poucas avaliações que atestem acabamento limpo e pontualidade na instalação"
    ],
    ctaText: "Diagnóstico de Google Meu Negócio para Climatização",
    waMessage: "Olá, Leonardo! Trabalho com instalação e manutenção de ar-condicionado e quero lotar minha agenda pelo Google Maps."
  }
];
