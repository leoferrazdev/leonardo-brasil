export interface FAQItem {
  question: string;
  answer: string;
}

export interface NicheData {
  title: string;
  heroSubtitle: string;
  painPointTitle: string;
  painPointDescription: string;
  benefits: string[];
  faqs?: FAQItem[];
}

export const seoNicheData: Record<string, NicheData> = {
  psicologas: {
    title: "Site para Psicólogas",
    heroSubtitle: "Atraia pacientes particulares que buscam terapia na sua cidade. Um ambiente virtual acolhedor que facilita o primeiro contato e o agendamento.",
    painPointTitle: "Por que uma presença digital humanizada é vital na psicologia?",
    painPointDescription: "Buscar terapia é um momento de vulnerabilidade. Quando alguém procura por um profissional na sua cidade, o primeiro contato com seu site precisa transmitir empatia e profissionalismo. Estruturamos sua página para acolher e converter sem parecer agressivo.",
    benefits: [
      "Comunicação empática e layout acolhedor",
      "Facilidade de agendamento online via WhatsApp",
      "Posicionamento focado em pacientes particulares"
    ],
    faqs: [
      { question: "O site ajuda a captar pacientes particulares?", answer: "Sim. Focamos a linguagem e o design no valor da transformação terapêutica, atraindo pacientes dispostos a investir em saúde mental fora dos planos de saúde." },
      { question: "Posso oferecer terapia online pelo site?", answer: "Com certeza. Podemos destacar tanto o seu atendimento presencial na cidade quanto a flexibilidade dos seus atendimentos online, ampliando sua agenda." },
      { question: "O site passa segurança e sigilo?", answer: "Utilizamos as melhores práticas de design para transmitir acolhimento, ética e total confidencialidade logo nos primeiros segundos de navegação." }
    ]
  },
  nutricionistas: {
    title: "Site para Nutricionistas",
    heroSubtitle: "Conquiste pacientes engajados com a própria saúde. Seu site profissional é o primeiro passo para encher sua agenda na sua região.",
    painPointTitle: "Como se destacar no mercado de nutrição da sua cidade?",
    painPointDescription: "As pessoas procuram por emagrecimento, hipertrofia e qualidade de vida o tempo todo. Se o seu site não explica claramente a sua abordagem e os seus resultados, o paciente escolhe outro profissional da sua cidade. Nós resolvemos isso.",
    benefits: [
      "Destaque para sua especialidade (esportiva, clínica, etc)",
      "Espaço para depoimentos e resultados (provas sociais)",
      "Botão de agendamento direto e sem fricção"
    ],
    faqs: [
      { question: "Como destacar minha abordagem nutricional no site?", answer: "O site terá seções específicas explicando o seu método (ex: sem terrorismo nutricional, foco em hipertrofia), conectando-se exatamente com o público que você deseja." },
      { question: "O site ajuda a vender pacotes e não apenas consultas avulsas?", answer: "Sim. Estruturamos a página para demonstrar o valor do acompanhamento de longo prazo, facilitando a venda de pacotes e planos trimestrais/semestrais." },
      { question: "Como atrair clientes da minha região específica?", answer: "Aplicamos técnicas avançadas de SEO local nas meta tags e no conteúdo, fazendo seu site ranquear quando pesquisarem por 'nutricionista em [Sua Cidade]'." }
    ]
  },
  contadores: {
    title: "Site para Escritórios de Contabilidade",
    heroSubtitle: "Atraia empresas e empresários locais que precisam de gestão contábil de confiança. Mais contratos mensais com menos esforço de vendas.",
    painPointTitle: "Como atrair empresas sólidas para a sua contabilidade?",
    painPointDescription: "Empresários locais procuram por soluções para impostos e gestão financeira no Google. Se o seu site de contabilidade for apenas institucional, ele não vende. Nossa estrutura foca em passar solidez e facilitar o pedido de proposta.",
    benefits: [
      "Visual corporativo que transmite segurança financeira",
      "Destaque para troca de contabilidade e abertura de empresas",
      "Captação direta de leads empresariais (B2B) da cidade"
    ],
    faqs: [
      { question: "O site capta clientes B2B (empresas)?", answer: "Sim, toda a arquitetura de conversão é pensada no modelo B2B, atacando as dores do empresário como: alta carga tributária, lentidão da contabilidade atual e burocracia." },
      { question: "Podemos destacar a migração de contabilidade?", answer: "Com certeza. Teremos seções evidenciando como é fácil, seguro e sem dor de cabeça transferir a empresa para o seu escritório." },
      { question: "O site vai gerar contatos qualificados?", answer: "Utilizando CTAs diretos e copywriting persuasivo, garantimos que o empresário sinta confiança para solicitar uma proposta formal imediatamente." }
    ]
  },
  fisioterapeutas: {
    title: "Site para Fisioterapeutas",
    heroSubtitle: "Reabilitação e prevenção com agenda cheia. Atraia pacientes da sua região que buscam alívio para dores e tratamentos especializados.",
    painPointTitle: "Como ser a principal referência em fisioterapia local?",
    painPointDescription: "Quando o paciente está com dor na sua cidade, ele quer uma solução rápida e confiável. Seu site precisa mostrar autoridade no tratamento e facilitar absurdamente o primeiro contato. Nós desenhamos a estrutura para o paciente confiar em você.",
    benefits: [
      "Exposição clara das especialidades (traumato, pélvica, etc)",
      "Linguagem focada em resolução de dores e bem-estar",
      "Redução da barreira de contato via agendamento simplificado"
    ],
    faqs: [
      { question: "O site comunica bem a minha especialização?", answer: "Sim. Se você é focado em esportiva, traumato ou RPG, nós calibramos o texto (copywriting) e as imagens para atrair exatamente esse perfil de paciente." },
      { question: "Ajuda a vender pacotes preventivos e Pilates?", answer: "Certamente. Mostramos o valor da fisioterapia não apenas na dor aguda, mas na prevenção e performance, facilitando a conversão para planos mensais." },
      { question: "A pessoa com dor consegue agendar rápido pelo celular?", answer: "O design mobile-first garante que o botão de agendamento esteja sempre visível e no alcance do polegar do paciente, sem cliques desnecessários." }
    ]
  },
  engenheiros: {
    title: "Site para Engenheiros e Profissionais Autônomos",
    heroSubtitle: "Feche contratos de projetos e consultoria. Exiba autoridade e precisão que seu cliente espera na sua região.",
    painPointTitle: "A solidez do seu site reflete a qualidade dos seus serviços?",
    painPointDescription: "Contratar serviços técnicos exige extrema confiança. Clientes da sua cidade precisam visualizar seu histórico e ter facilidade para solicitar propostas. Construímos páginas com a estrutura perfeita para gerar credibilidade instantânea.",
    benefits: [
      "Estrutura otimizada para captar orçamentos detalhados",
      "Destaque para o portfólio de laudos, ARTs e projetos",
      "Design corporativo focado em prestação de serviço de alto valor"
    ],
    faqs: [
      { question: "Consigo exibir fotos de projetos ou estudos de caso?", answer: "Sim, o site conta com áreas dedicadas ao portfólio visual, o que é fundamental para gerar confiança." },
      { question: "Atrai clientes residenciais e empresariais?", answer: "O site é moldado de acordo com seu foco. Podemos ter seções para B2B e outras para consumidores finais." },
      { question: "O cliente pode solicitar propostas formais?", answer: "Integramos formulários onde o cliente já envia os dados iniciais do escopo, poupando o tempo do seu atendimento." }
    ]
  },
  'personal-trainers': {
    title: "Site para Personal Trainers",
    heroSubtitle: "Venda consultorias presenciais e online. Destaque-se no mercado fitness da sua cidade atraindo alunos que querem resultados de verdade.",
    painPointTitle: "Sua autoridade fitness vai além das redes sociais",
    painPointDescription: "Alunos dispostos a pagar o preço justo pelo seu acompanhamento na cidade fazem pesquisas além das redes sociais. Um site próprio mostra que você não é apenas um entusiasta, mas um profissional certificado que entrega transformação real.",
    benefits: [
      "Apresentação forte de metodologias e provas sociais (antes/depois)",
      "Captação de alunos para presencial na cidade ou online",
      "Destaque claro para os planos e valores de acompanhamento"
    ],
    faqs: [
      { question: "O site vende consultoria online?", answer: "Sim. Além de focar na sua região para treinos presenciais, estruturamos uma área completa para captação de clientes de consultoria online de qualquer lugar do mundo." },
      { question: "Posso colocar as fotos dos meus alunos (antes/depois)?", answer: "Provas sociais são o coração de um site fitness. Teremos blocos poderosos dedicados a mostrar as transformações que o seu método gera." },
      { question: "O botão de WhatsApp envia mensagem padronizada?", answer: "Sim. O aluno clica e já cai no seu celular com uma mensagem prévia tipo 'Olá, quero saber mais sobre a consultoria', acelerando o fechamento." }
    ]
  },
  terapeutas: {
    title: "Site para Terapeutas",
    heroSubtitle: "Acolhimento desde o primeiro clique. Atraia clientes para terapias holísticas, integrativas ou convencionais na sua região.",
    painPointTitle: "Seu espaço terapêutico precisa de uma recepção digital",
    painPointDescription: "Muitos que buscam terapias holísticas ou complementares ainda têm dúvidas sobre como funciona. O seu site será a ponte que educa, acolhe e gera o desejo de agendar a primeira sessão com segurança.",
    benefits: [
      "Ambiente visual leve e relaxante",
      "Explicação clara sobre a abordagem terapêutica",
      "Agendamento via WhatsApp sem burocracia"
    ],
    faqs: [
      { question: "Posso oferecer diferentes tipos de terapia no site?", answer: "Sim. Se você aplica Reiki, ThetaHealing, Terapia Floral ou outras modalidades, criamos seções explicando os benefícios de cada uma." },
      { question: "Funciona bem para quem atende online?", answer: "Perfeitamente. O site posiciona tanto o seu atendimento local quanto a facilidade da terapia à distância." },
      { question: "Ajuda a construir autoridade?", answer: "Ter um site com domínio próprio e textos que explicam suas formações transmite muito mais seriedade do que atuar apenas pelo Instagram." }
    ]
  },
  massoterapeutas: {
    title: "Site para Massoterapeutas",
    heroSubtitle: "Agenda lotada para relaxamento e bem-estar. Atraia clientes da sua cidade que buscam alívio de tensão e autocuidado.",
    painPointTitle: "Como transformar a busca por relaxamento em agendamentos?",
    painPointDescription: "Quando alguém procura por massagem relaxante ou terapêutica no Google, a decisão é tomada rápido. Se o seu site não transmitir calma, higiene e profissionalismo, o cliente marca com outro. Garantimos que sua primeira impressão digital seja impecável.",
    benefits: [
      "Destaque visual para o ambiente de atendimento e técnicas",
      "Pacotes e mensalidades claros para fidelizar clientes",
      "Botão flutuante para marcação rápida de horários"
    ],
    faqs: [
      { question: "O site ajuda a vender pacotes recorrentes?", answer: "Sim! Podemos criar uma área explicando as vantagens de pacotes semanais ou mensais para o alívio contínuo do estresse." },
      { question: "Consigo explicar a diferença das minhas massagens?", answer: "Com certeza. Explicamos detalhadamente as diferenças entre massagem relaxante, desportiva, drenagem, etc., para o cliente saber o que comprar." },
      { question: "Posso captar vouchers para presentes?", answer: "Podemos incluir CTAs focados em 'Dê Bem-Estar de Presente', incentivando a compra de vouchers terapêuticos." }
    ]
  },
  arquitetos: {
    title: "Site para Escritórios de Arquitetura",
    heroSubtitle: "Capte projetos residenciais e comerciais de alto padrão na sua região. Um portfólio digital focado em gerar reuniões de fechamento.",
    painPointTitle: "Por que depender apenas de indicação atrasa o seu crescimento?",
    painPointDescription: "O boca a boca traz clientes, mas sem previsibilidade. Quando alguém da sua cidade pesquisa por projetos de arquitetura, seu site precisa transparecer exclusividade, confiança e um portfólio que justifique o valor do seu trabalho.",
    benefits: [
      "Layout minimalista e sofisticado para destacar seu portfólio",
      "Foco na captação de leads qualificados (filtros de orçamento)",
      "Posicionamento focado em clientes de alto padrão da sua cidade"
    ],
    faqs: [
      { question: "O site ajuda a atrair projetos mais caros?", answer: "Sim. A arquitetura de conversão (copy + design) é pensada para demonstrar valor agregado e autoridade, afastando o cliente que busca apenas 'o mais barato'." },
      { question: "Posso exibir meus projetos em alta qualidade?", answer: "Com certeza. Estruturamos galerias otimizadas que carregam rápido, sem perder a resolução que o seu projeto exige." },
      { question: "O cliente consegue solicitar um orçamento direto?", answer: "Sim. Integramos botões para que o lead converse com você via WhatsApp, já informando o tipo de projeto (comercial/residencial)." }
    ]
  },
  advogados: {
    title: "Site para Advogados e Escritórios Jurídicos",
    heroSubtitle: "Posicionamento digital em conformidade com a OAB. Capte clientes corporativos ou físicos que buscam resolução urgente na sua cidade.",
    painPointTitle: "Como crescer na advocacia respeitando o Código de Ética?",
    painPointDescription: "A OAB restringe publicidade ostensiva, o que torna o SEO e o Inbound Marketing as armas mais poderosas do advogado. Quando o cliente busca um especialista em sua cidade, seu site deve transmitir autoridade e agilidade, induzindo o contato imediato.",
    benefits: [
      "Estrutura ética de captação (Inbound Marketing Jurídico)",
      "Separação clara por áreas de atuação (Trabalhista, Tributário, etc)",
      "Call-to-Action focado na urgência do cliente"
    ],
    faqs: [
      { question: "Esse modelo de site fere o provimento da OAB?", answer: "De forma alguma. Nosso foco é informativo e na resolução da intenção de busca (inbound), modelo totalmente aprovado pelos tribunais de ética." },
      { question: "Ajuda a captar clientes B2B (empresas)?", answer: "Sim. Estruturamos a copy focando na dor do empresário (preventivo tributário, trabalhista), gerando contatos qualificados para reuniões B2B." },
      { question: "O site converte demandas de urgência (física)?", answer: "Sim. Para áreas como criminal ou família, o design foca no botão de 'Falar com Especialista Agora' via WhatsApp." }
    ]
  },
  dentistas: {
    title: "Site para Odontologia e Dentistas",
    heroSubtitle: "Lotando a agenda do seu consultório com procedimentos de alto valor agregado, como implantes e estética dental, na sua cidade.",
    painPointTitle: "Sua clínica depende apenas de convênios?",
    painPointDescription: "Atrair pacientes particulares requer confiança. Quando pesquisam por implantes ou lentes de contato dental na região, seu site precisa oferecer uma experiência premium, focada na transformação do sorriso e na segurança técnica.",
    benefits: [
      "Destaque para tratamentos high-ticket (Invisalign, Implantes, Lentes)",
      "Área focada em Prova Social e estrutura da clínica",
      "Agendamento de avaliação direto via WhatsApp"
    ],
    faqs: [
      { question: "O site ajuda a vender implantes e tratamentos caros?", answer: "Sim. Toda a jornada (funil) é construída para ancorar valor e transmitir autoridade máxima, aumentando a taxa de comparecimento nas avaliações." },
      { question: "Posso focar em pacientes particulares?", answer: "Exato. A linguagem e o direcionamento das campanhas são moldados para pacientes dispostos a investir em saúde e estética odontológica." },
      { question: "O site tem espaço para exibir a tecnologia da clínica?", answer: "Sim, sabemos que estrutura (Scanner 3D, Raio-X) gera confiança, então criamos seções específicas para os seus diferenciaz." }
    ]
  },
  medicos: {
    title: "Site para Médicos e Clínicas Especializadas",
    heroSubtitle: "Posicionamento premium para atrair pacientes particulares e consolidar sua autoridade médica na região.",
    painPointTitle: "Como o Google pode encher sua agenda particular?",
    painPointDescription: "Pacientes particulares pesquisam sintomas e especialistas muito antes de marcar a consulta. Se o seu site comunica sua formação técnica aliada a um atendimento humanizado, você se torna a escolha óbvia na sua cidade.",
    benefits: [
      "Comunicação técnica e humanizada, gerando credibilidade",
      "Destaque claro das especialidades, exames e cirurgias",
      "Redução de faltas (No-show) via pré-atendimento no WhatsApp"
    ],
    faqs: [
      { question: "Como destacar minha formação e especialidades?", answer: "O site possui seções de Autoridade (Mini-currículo, RQE) essenciais para a confiança do paciente particular." },
      { question: "Posso captar pacientes de outras cidades (Telemedicina)?", answer: "Sim, além da presença forte na sua cidade física, criamos frentes de atração focadas em teleconsultas a nível estadual ou nacional." },
      { question: "Atende às normas do CFM?", answer: "Sim, o layout e o copywriting são construídos com total respeito ao manual de publicidade médica." }
    ]
  },
  corretores: {
    title: "Site para Corretores de Imóveis",
    heroSubtitle: "Capte leads imobiliários qualificados e venda imóveis de alto padrão. Destaque sua carteira na sua região sem depender de grandes portais.",
    painPointTitle: "Cansado de depender de leads frios de portais engessados?",
    painPointDescription: "Quando o cliente busca por imóveis na sua cidade, ele costuma cair em grandes portais onde você é só mais um corretor no meio de centenas. Com um site próprio focado em conversão, você atrai leads que querem falar exclusivamente com VOCÊ, valorizando o seu atendimento premium.",
    benefits: [
      "Integração fácil e apresentação luxuosa de imóveis",
      "Captação de leads (compradores e investidores) direto pro WhatsApp",
      "Posicionamento como o corretor autoridade da cidade"
    ],
    faqs: [
      { question: "O site ajuda a vender imóveis de alto padrão?", answer: "Sim. O design transmite exclusividade, fundamental para quem atua no mercado de luxo e quer se diferenciar." },
      { question: "Os leads vão para o meu CRM ou WhatsApp?", answer: "Sim! Construímos botões de contato onde o cliente já clica informando qual imóvel interessou, agilizando o seu atendimento." },
      { question: "Posso captar imóveis para venda (proprietários)?", answer: "Com certeza. Podemos criar uma página específica no site para donos de imóveis que desejam anunciar exclusivamente com você." }
    ]
  },
  esteticistas: {
    title: "Site para Clínicas de Estética e Harmonização",
    heroSubtitle: "Lote a agenda da sua clínica com procedimentos de alto valor. Atraia clientes locais que buscam excelência, beleza e segurança.",
    painPointTitle: "Sua clínica está perdendo pacientes por não transmitir luxo digital?",
    painPointDescription: "Na área da estética e harmonização, a percepção de valor é tudo. Se o cliente procura por procedimentos avançados na sua cidade e o seu site não transmite sofisticação, higiene e luxo, ele vai para a concorrência. Nós construímos o ambiente digital perfeito para ancorar o valor dos seus serviços.",
    benefits: [
      "Destaque elegante para provas sociais e resultados (Antes/Depois)",
      "Foco em vender tratamentos high-ticket e harmonização facial",
      "Agendamento de avaliação perfeitamente integrado e sem fricção"
    ],
    faqs: [
      { question: "Posso destacar equipamentos específicos (ex: Ultraformer)?", answer: "Sim! Pacientes buscam por tecnologias específicas. Teremos páginas detalhando os equipamentos que sua clínica possui." },
      { question: "O design passa a imagem de clínica de luxo?", answer: "Totalmente. O layout é limpo, utiliza as cores da sua marca e fontes modernas que remetem ao mercado de estética premium." },
      { question: "Como funciona a captação local?", answer: "Otimizamos o site para ranquear no Google da sua cidade sempre que procurarem por 'harmonização facial em [Sua Cidade]' ou tratamentos estéticos." }
    ]
  },
  'energia-solar': {
    title: "Site para Empresas de Energia Solar",
    heroSubtitle: "Gere orçamentos corporativos (B2B) e residenciais todos os dias. Capture o cliente no exato momento em que ele pesquisa por economia.",
    painPointTitle: "Seus vendedores perdem tempo com curiosos desqualificados?",
    painPointDescription: "O mercado de energia solar explodiu. Quando uma indústria ou residência na sua cidade decide instalar painéis, eles buscam no Google. Se o seu site não explica o ROI, o financiamento e não facilita o orçamento da fatura, você perde o projeto. Nós montamos uma máquina de captação solar.",
    benefits: [
      "Formulário inteligente para pré-qualificar a fatura de energia",
      "Foco total em gerar orçamentos B2B (empresas, indústrias e rural)",
      "Copywriting agressivo focando em ROI e economia imediata"
    ],
    faqs: [
      { question: "Como o site qualifica o lead de energia solar?", answer: "Utilizamos formulários que pedem o valor médio da conta de luz antes de liberar o contato, poupando o tempo do seu time comercial." },
      { question: "Ajuda a vender para indústrias e comércio?", answer: "Sim! Teremos páginas específicas abordando a economia de ICMS e o ROI focado no empresário local." },
      { question: "Posso expor os sistemas já instalados?", answer: "Com certeza. Ter um portfólio de usinas instaladas na região gera a segurança necessária para o cliente fechar projetos caros." }
    ]
  },
  'oficinas-mecanicas': {
    title: "Site para Oficinas Mecânicas e Estética Automotiva",
    heroSubtitle: "Atraia clientes locais que buscam confiança e qualidade para seus veículos. Lotamos o seu box com revisões rentáveis e vitrificação.",
    painPointTitle: "Quando o carro quebra, o cliente pesquisa no Google. Você está lá?",
    painPointDescription: "A escolha de uma oficina mecânica ou centro de detalhamento automotivo é 100% baseada em confiança e urgência. Se o seu site não mostra a sua estrutura, transparência e avaliações reais na sua cidade, o cliente escolhe o concorrente. Nós criamos a estrutura perfeita.",
    benefits: [
      "Botão de agendamento de revisão e 'SOS' direto para o WhatsApp",
      "Galeria mostrando a organização, equipamentos premium e limpeza do box",
      "Foco em serviços altamente rentáveis (revisão programada, PPF)"
    ],
    faqs: [
      { question: "Funciona para estética automotiva (Detailer)?", answer: "Perfeitamente. O site destaca os resultados de polimento, vitrificação e PPF, atraindo donos de carros premium da região." },
      { question: "Como captar clientes para revisão mecânica?", answer: "Focamos a copy em 'segurança da família' e 'manutenção preventiva', incentivando o cliente a não esperar o carro quebrar." },
      { question: "O site passa confiança para quem não entende de carro?", answer: "Sim. O copywriting é focado em transparência, honestidade e explicação fácil, quebrando o maior medo do cliente de mecânica." }
    ]
  }
};

export const getDefaultNicheData = (nicho: string, cidade: string): NicheData => {
  return {
    title: `Site Profissional para ${nicho.charAt(0).toUpperCase() + nicho.slice(1)}`,
    heroSubtitle: `Clientes em ${cidade} pesquisam no Google por seus serviços todos os dias. Tenha uma página que passa confiança e transforma visitas em conversas no WhatsApp.`,
    painPointTitle: `Por que ter um site otimizado para sua cidade?`,
    painPointDescription: `Concorrentes em ${cidade} já estão aparecendo no topo. Um site estruturado garante que quem procure por ${nicho} na região encontre seu negócio preparado para atender.`,
    benefits: [
      "Integração total com WhatsApp e redes sociais",
      "Página super rápida para não perder clientes no celular",
      "Estrutura focada em gerar agendamentos todos os dias"
    ],
    faqs: [
      { question: "Como funciona a criação do site?", answer: `Montamos o projeto focado especificamente na área de ${nicho}, visando a máxima conversão de leads em ${cidade}.` },
      { question: "Vou aparecer no Google?", answer: `Nossa estrutura já contempla todas as boas práticas de SEO local, desenhadas para você dominar as buscas orgânicas em ${cidade}.` },
      { question: "O suporte é contínuo?", answer: "Sim. Trabalhamos com uma infraestrutura robusta garantindo que o seu funil de captação fique online 24h por dia, sem travamentos." }
    ]
  };
};
