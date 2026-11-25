import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const STATE_FILE = path.join(ROOT_DIR, 'src', 'data', 'daily-seo-state.json');
const NICHES_FILE = path.join(ROOT_DIR, 'src', 'data', 'niches.ts');
const ADS_NICHES_FILE = path.join(ROOT_DIR, 'src', 'data', 'googleAdsNiches.ts');
const BLOG_FILE = path.join(ROOT_DIR, 'src', 'data', 'blogData.ts');
const PRERENDER_FILE = path.join(ROOT_DIR, 'scripts', 'prerender.mjs');
const SITEMAP_FILE = path.join(ROOT_DIR, 'scripts', 'generate-sitemap.mjs');

// Catálogo Mestre de Nichos para Money Pages (Camada 1)
const MASTER_NICHES = [
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
  }
];

// Catálogo de Cidades Prioritárias (Camada 2 - Polos Econômicos)
const MASTER_CITIES = [
  { slug: "campinas", name: "Campinas", state: "São Paulo", uf: "SP", regiao: "no maior polo tecnológico do interior paulista" },
  { slug: "santos", name: "Santos", state: "São Paulo", uf: "SP", regiao: "na Baixada Santista e polo portuário" },
  { slug: "ribeirao-preto", name: "Ribeirão Preto", state: "São Paulo", uf: "SP", regiao: "na capital do agronegócio e interior de SP" },
  { slug: "londrina", name: "Londrina", state: "Paraná", uf: "PR", regiao: "no norte do Paraná" },
  { slug: "maringa", name: "Maringá", state: "Paraná", uf: "PR", regiao: "no noroeste paranaense" },
  { slug: "caxias-do-sul", name: "Caxias do Sul", state: "Rio Grande do Sul", uf: "RS", regiao: "na Serra Gaúcha e polo metalmecânico" },
  { slug: "florianopolis", name: "Florianópolis", state: "Santa Catarina", uf: "SC", regiao: "na capital catarinense e polo de inovação" },
  { slug: "blumenau", name: "Blumenau", state: "Santa Catarina", uf: "SC", regiao: "no Vale do Itajaí e polo econômico de SC" }
];

// Catálogo de Artigos de Blog (Camada 3 - Alta Intenção Comercial)
const MASTER_BLOG_POSTS = [
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
  }
];

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

  // 5. Injetar novos Artigos de Blog em src/data/blogData.ts
  if (batchBlog.length > 0) {
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

  // 6. Atualizar Cidades em prerender.mjs e generate-sitemap.mjs
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

  // 7. Atualizar Estado
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
