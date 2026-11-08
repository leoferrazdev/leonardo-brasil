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
  "oficinas-mecanicas": {
    title: "Google Meu Negócio para Oficinas Mecânicas e Auto Centers",
    heroSubtitle: "Atraia proprietários de veículos para revisões, freios, suspensão e motor. Coloque sua oficina mecânica e centro automotivo no Top 3 do Google Maps.",
    painPointTitle: "Quando o carro quebra ou precisa de revisão, o cliente abre o Google Maps. Você está no topo?",
    painPointDescription: "A escolha de uma oficina mecânica, auto center ou oficina de veículos é baseada em confiança, avaliações reais e rapidez. Se o seu perfil no Google Maps não exibe sua estrutura limpa, avaliações positivas respondidas e catálogo de serviços, o motorista vai para o concorrente da avenida vizinha.",
    benefits: [
      "Botão de agendamento de revisão preventiva e SOS mecânico direto no WhatsApp",
      "Galeria de fotos destacando equipamentos computadorizados, limpeza do box e organização",
      "Foco em serviços automotivos de alto ticket (cabeçote, suspensão, freios e injeção eletrônica)"
    ],
    faqs: [
      { question: "O perfil otimizado atrai clientes para serviços mecânicos de alto valor?", answer: "Sim. Otimizamos as categorias primárias e secundárias para atrair motoristas que buscam diagnóstico computadorizado, troca de embreagem e reparos pesados, além de trocas rápidas de óleo." },
      { question: "Como funciona para auto centers e estética automotiva?", answer: "Estruturamos catálogos segmentados no Perfil da Empresa no Google, permitindo ranquear tanto para serviços mecânicos quanto para alinhamento, balanceamento e polimento." },
      { question: "Como superar oficinas concorrentes mais antigas?", answer: "Através da consistência NAP, fotos atualizadas semanalmente, postagens locais de ofertas e um fluxo ativo de avaliações 5 estrelas com palavras-chave de peças e serviços." }
    ]
  },
  "eletricistas": {
    title: "Google Meu Negócio para Eletricistas e Instalações Elétricas",
    heroSubtitle: "Receba chamados de emergência elétrica residencial e predial na sua cidade. Posicione seus serviços no topo das pesquisas locais do Google Maps.",
    painPointTitle: "Chamados de emergência elétrica vão para quem está no Top 3 do Google Maps",
    painPointDescription: "Ninguém espera o dia seguinte quando um disjuntor desarma, ocorre um curto-circuito ou falta fase na rede elétrica. O morador ou síndico abre o celular e liga imediatamente para os primeiros resultados locais. Se você não aparece no mapa, está perdendo chamados urgentes todos os dias.",
    benefits: [
      "Chamada de emergência 24h com botão direto de ligação e WhatsApp",
      "Destaque para serviços residenciais, comerciais e industriais de alta margem",
      "Posicionamento local geolocalizado para atender chamados no menor raio de deslocamento"
    ],
    faqs: [
      { question: "Eletricista autônomo sem ponto comercial pode aparecer no Google Maps?", answer: "Sim. O Google permite cadastrar como 'Área de Atendimento', exibindo os bairros e cidades onde você atende sem precisar expor seu endereço residencial particular." },
      { question: "Como captar reformas elétricas e troca de padrão de luz?", answer: "Configuramos o catálogo de serviços com termos estratégicos de alta intenção como 'troca de fiação', 'instalação de padrão Copel/Enel/Ceee' e 'laudo elétrico'." },
      { question: "Quanto tempo leva para começar a receber chamados?", answer: "Por se tratar de um nicho de urgência extrema, a maioria dos eletricistas começa a receber ligações nas primeiras duas semanas após a correção de categorias e publicação do perfil." }
    ]
  },
  "pedreiros": {
    title: "Google Meu Negócio para Pedreiros, Obras e Empreiteiras",
    heroSubtitle: "Feche contratos de reformas e construções na sua cidade. Conquiste previsibilidade de agenda no Google Maps sem depender de indicação boca a boca.",
    painPointTitle: "Cansado de depender de indicação ou disputar diárias apertadas?",
    painPointDescription: "Proprietários que vão reformar apartamentos, construir casas ou revitalizar imóveis comerciais buscam no Google Maps por profissionais sérios, com fotos de obras finalizadas e avaliações de pontualidade. Um perfil blindado posiciona você como empreiteiro de confiança.",
    benefits: [
      "Portfólio visual com fotos de obras, assentamento de porcelanato e acabamentos",
      "Foco em fechar contratos por empreitada completa em vez de diárias avulsas",
      "Reputação blindada com avaliações de clientes destacando pontualidade e limpeza"
    ],
    faqs: [
      { question: "Como o Google Maps ajuda a fechar obras maiores?", answer: "Clientes com maior poder aquisitivo exigem ver fotos de serviços executados e depoimentos reais antes de contratar. Um perfil profissional no Google transmite a segurança que fecha contratos de alto valor." },
      { question: "Posso atender mais de uma cidade da minha região?", answer: "Sim. Configuramos sua área de cobertura metropolitana para cobrir municípios vizinhos onde o ticket de construção civil é mais elevado." },
      { question: "Preciso de CNPJ para ter perfil de pedreiro no Google?", answer: "Não é obrigatório ter CNPJ para criar o perfil, mas ter MEI registrado aumenta a credibilidade, facilita a verificação e permite atrair clientes corporativos." }
    ]
  },
  "guinchos": {
    title: "Google Meu Negócio para Guinchos e Auto Socorro 24h",
    heroSubtitle: "Esteja no primeiro lugar do Google Maps no momento exato em que o motorista precisa de resgate na rodovia ou na cidade. Chamadas diretas 24 horas.",
    painPointTitle: "90% das ligações de socorro mecânico vão para os três primeiros do Google Maps",
    painPointDescription: "Quando o veículo quebra no trânsito ou sofre um acidente, o condutor não pesquisa muito: ele digita 'guincho 24h perto de mim' e liga para o primeiro telefone que aparece. Ter o perfil posicionado no Top 3 é a garantia de manter os caminhões rodando sem parar.",
    benefits: [
      "Botão de ligação imediata e compartilhamento de localização via WhatsApp",
      "Configuração de horário de atendimento 24 horas com plantão ativo",
      "Destaque para guincho plataforma, reboque de motos, vans e utilitários leves e pesados"
    ],
    faqs: [
      { question: "Como ranquear o guincho para buscas em rodovias e cidades vizinhas?", answer: "Definimos uma malha de 'Área de Atendimento' cobrindo o raio rodoviário e as cidades-satélite atendidas pelas suas bases e caminhões." },
      { question: "Vale a pena investir no Google Maps se já presto serviço para seguradoras?", answer: "Com certeza. Os chamados particulares captados diretamente pelo Google Maps pagam à vista no PIX, sem tabelas defasadas e sem prazos de 30 a 60 dias das seguradoras." },
      { question: "Como evitar suspensão da ficha de guincho no Google?", answer: "O nicho de guinchos é rigorosamente monitorado contra spams. Nossa consultoria aplica todas as diretrizes documentais oficiais para garantir um perfil 100% legítimo e blindado." }
    ]
  },
  "assistencia-celulares": {
    title: "Google Meu Negócio para Assistência Técnica de Celulares",
    heroSubtitle: "Lote a bancada da sua assistência técnica com troca de tela, substituição de bateria e consertos rápidos de smartphones na sua cidade.",
    painPointTitle: "O cliente quebra a tela do smartphone e procura a assistência mais confiável no Maps",
    painPointDescription: "O smartphone guarda a vida pessoal e bancária das pessoas. Na hora de escolher onde deixar o aparelho, o cliente prioriza a loja mais bem avaliada, com fotos do balcão e dezenas de depoimentos de clientes satisfeitos. Se sua loja não tem esse destaque, o cliente vai ao concorrente.",
    benefits: [
      "Destaque para consertos no mesmo dia (troca de tela express, conectores e baterias)",
      "Catálogo de marcas mais buscadas: Apple iPhone, Samsung Galaxy, Xiaomi e Motorola",
      "Mecanismo de captação de avaliações que transforma clientes atendidos em notas 5 estrelas"
    ],
    faqs: [
      { question: "Como se destacar da grande concorrência de bancadas informais?", answer: "Destacamos sua garantia de peças, fotos do laboratório com equipamentos antiestáticos e depoimentos que comprovam o sigilo e segurança dos dados do cliente." },
      { question: "Posso incluir serviços de troca de vidro sem trocar o display?", answer: "Sim, configuramos itens específicos no catálogo de serviços para captar buscas por recuperação de vidro original, aumentando sua margem de lucro." },
      { question: "O perfil ajuda a vender acessórios como capas e películas?", answer: "Sim. O fluxo de clientes que vão até sua loja física buscar reparos aproveita para comprar cabos, carregadores homologados e películas de proteção." }
    ]
  },
  "manutencao-computadores": {
    title: "Google Meu Negócio para Assistência de Computadores e Notebooks",
    heroSubtitle: "Atraia reparos de notebooks, upgrades para SSD, montagem de PCs gamers e suporte técnico para empresas da sua região pelo Google Maps.",
    painPointTitle: "Usuários e empresas locais buscam técnicos de informática qualificados no Google",
    painPointDescription: "Seja um notebook de trabalho que não liga ou uma empresa local precisando de manutenção preventiva na rede, a busca começa no Google Maps. Posicionamos sua assistência técnica para atrair demandas particulares e contratos B2B recorrentes.",
    benefits: [
      "Captação de reparos avançados em placas-mãe de notebooks e computadores",
      "Abertura de canal de atendimento direto para empresas locais e escritórios",
      "Catálogo detalhado de formatação, limpeza térmica, upgrades e recuperação de dados"
    ],
    faqs: [
      { question: "Como o Google Maps ajuda a conseguir contratos de suporte corporativo (B2B)?", answer: "Empresários locais procuram no Google Maps por assistências próximas para suporte rápido. Posicionamos seu perfil com palavras-chave de TI corporativa, servidores e contratos mensais." },
      { question: "Vale a pena destacar montagem de computadores gamers?", answer: "Sim. A busca por montagem, cable management e otimização de PCs gamers tem ticket médio alto e atrai clientes apaixonados dispostos a pagar pelo serviço especializado." },
      { question: "Como mostrar autoridade técnica no perfil?", answer: "Utilizamos fotos da bancada com osciloscópios, gravadores de BIOS e certificações técnicas que comprovam expertise em nível eletrônico." }
    ]
  },
  "clinicas-veterinarias": {
    title: "Google Meu Negócio para Clínicas Veterinárias e Hospitais Pet",
    heroSubtitle: "Atraia tutores para consultas, exames, vacinas e emergências 24h com segurança e total conformidade com o Conselho Federal de Medicina Veterinária (CFMV).",
    painPointTitle: "Tutores tratam pets como membros da família e exigem clínicas com máxima credibilidade",
    painPointDescription: "Em momentos de urgência ou para procedimentos de rotina, o tutor pesquisa no Google Maps avaliando a estrutura hospitalar, a equipe médica veterinária e os comentários de outros donos de animais. Estruturamos seu perfil com foco em acolhimento e respeito às normas do CFMV.",
    benefits: [
      "Canal de emergência pet 24 horas destacado com rota direta e ligação no WhatsApp",
      "Total conformidade ética com as normas de publicidade veterinária do CFMV",
      "Destaque para especialidades (oncologia, dermatologia, odontologia veterinária e felinos)"
    ],
    faqs: [
      { question: "Médicos veterinários podem ter perfil no Google sem violar as regras do CFMV?", answer: "Sim. O Perfil da Empresa no Google é considerado utilidade pública e informativa. Adequamos os textos para não prometer curas nem usar sensacionalismo, respeitando rigorosamente o código de ética do CFMV." },
      { question: "Como atrair consultas para especialidades veterinárias?", answer: "Criamos categorias secundárias e catálogo de serviços detalhando cada área atendida, como ortopedia, cardiologia e exames de imagem (ultrassom e raio-x)." },
      { question: "O perfil ajuda a lotar o plantão noturno da clínica?", answer: "Com certeza. Quando uma emergência acontece na madrugada, o Google Maps é o único lugar onde o tutor busca clínicas abertas 24h na cidade." }
    ]
  },
  "pet-shops": {
    title: "Google Meu Negócio para Pet Shops e Estética Animal",
    heroSubtitle: "Lote a agenda de banho e tosa e aumente o fluxo de venda de rações e medicamentos no seu pet shop com presença dominante no seu bairro.",
    painPointTitle: "Vizinhos do seu bairro estão comprando ração e tosa em concorrentes no Google",
    painPointDescription: "A conveniência e o amor pelos animais movem o mercado pet. Quem tem cachorro ou gato quer um pet shop perto de casa que ofereça serviço de táxi dog, banho com produtos de qualidade e profissionais carinhosos. Posicionamos seu pet shop para ser a referência número 1 do bairro.",
    benefits: [
      "Agendamento de banho e tosa via WhatsApp com fotos de tosas de raças específicas",
      "Catálogo de rações super premium, farmácia veterinária e petiscos",
      "Avaliações 5 estrelas destacando higiene, ambiente climatizado e carinho com os animais"
    ],
    faqs: [
      { question: "Como fidelizar tutores para planos semanais de banho?", answer: "Destacamos no perfil pacotes mensais e benefícios de rotina, incentivando o tutor a manter uma frequência de agendamentos no seu banho e tosa." },
      { question: "Ajuda a divulgar o serviço de busca e entrega (táxi dog)?", answer: "Sim. O serviço de transporte pet é um dos maiores fatores de decisão para quem trabalha fora e pode ser destacado no topo do perfil." },
      { question: "Como se diferenciar de grandes redes de pet shop?", answer: "O Google Maps privilegia a proximidade e o atendimento humanizado de lojas locais. Destacamos o cuidado individualizado que as grandes redes impessoais não conseguem entregar." }
    ]
  },
  "agropecuarias": {
    title: "Google Meu Negócio para Lojas Agropecuárias e Produtos Rurais",
    heroSubtitle: "Destaque sua loja agropecuária no Google Maps para produtores rurais, criadores e clientes urbanos que buscam rações, ferramentas e insumos.",
    painPointTitle: "Sua loja agropecuária perde vendas para distribuidoras por falta de presença no Google?",
    painPointDescription: "Produtores rurais, chacreiros e moradores que cuidam de quintais ou animais de grande porte pesquisam no Google Maps por lojas que tenham estoque imediato de rações, sementes, arames, adubos e ferragens. Estruturamos seu perfil para mostrar tudo o que você vende.",
    benefits: [
      "Catálogo de insumos agrícolas, rações a granel, defensivos e ferramentas",
      "Atendimento direto aos produtores rurais da região com cotação rápida no WhatsApp",
      "Posicionamento para quem pesquisa termos rurais em cidades do interior e polos agrícolas"
    ],
    faqs: [
      { question: "Lojas agropecuárias fora do centro urbano conseguem ranquear bem?", answer: "Sim. Configuramos o raio de cobertura para abranger tanto a zona urbana quanto a zona rural do município, facilitando a localização pelos produtores." },
      { question: "Posso expor medicamentos veterinários para rebanho?", answer: "Sim. É possível estruturar o catálogo de saúde animal para bovinos, equinos, aves e suínos, respeitando as normas vigentes." },
      { question: "O perfil atrai compradores de ferramentas e equipamentos rurais?", answer: "Com certeza. As pesquisas por roçadeiras, motosserras, bombas d'água e telas no Google Maps geram ligações diretas para a sua equipe de balcão." }
    ]
  },
  "restaurantes": {
    title: "Google Meu Negócio para Restaurantes e Gastronomia Local",
    heroSubtitle: "Encha seu salão e receba pedidos no WhatsApp sem pagar comissões abusivas de aplicativos de entrega. Seja o restaurante mais desejado do Google Maps.",
    painPointTitle: "Cansado de entregar até 27% do faturamento para aplicativos de delivery?",
    painPointDescription: "Quando as pessoas sentem fome, elas abrem o Google Maps para ver fotos suculentas de pratos, cardápio atualizado e notas de outros frequentadores. Se o seu perfil estiver no Top 3 com botão direto de pedido no WhatsApp, você vende com margem integral e sem comissões.",
    benefits: [
      "Cardápio visual interativo com fotos de alta qualidade dos pratos e bebidas",
      "Botão de pedidos de delivery direto no WhatsApp sem taxa de intermediação",
      "Destaque para reservas de mesas, horário de almoço executivo e happy hour"
    ],
    faqs: [
      { question: "Como o Google Maps ajuda a diminuir a dependência do iFood?", answer: "Ao posicionar seu restaurante no topo das buscas da cidade com o link do seu cardápio próprio no WhatsApp, os clientes compram diretamente de você com preços mais atrativos e margem livre de comissões." },
      { question: "Como lidar com avaliações negativas de clientes?", answer: "Desenvolvemos respostas estratégicas profissionais que revertem a impressão negativa perante novos visitantes e incentivamos um fluxo constante de clientes satisfeitos deixando notas 5 estrelas." },
      { question: "Funciona para restaurantes a quilo ou marmitarias?", answer: "Perfeitamente. O almoço executivo corporativo é uma das buscas mais frequentes no Google Maps durante a semana por trabalhadores da região." }
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
