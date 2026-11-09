# Especificação de Design: Planejador de Palavras-Chave Local & Integração Google Ads API (/crm/planejador)

- **Status:** Aprovado para Implementação
- **Data:** 08/11/2026
- **Autor:** Leonardo Brasil & Antigravity
- **Repositório:** [https://github.com/leoferrazdev/leonardo-brasil](https://github.com/leoferrazdev/leonardo-brasil)
- **Caminho Local:** `D:\LEONARDO\Drive\Projetos\leonardo-brasil`
- **Domínio de Produção:** `https://leonardobrasil.com.br/crm/planejador`

---

## 1. Visão Geral e Objetivos

Construir um sistema interno de **Pesquisa, Inteligência de Demanda e Planejamento de Palavras-Chave** integrado à área restrita do CRM (`/crm/planejador`), conectado à API oficial do Google Ads (`KeywordPlanIdeaService`) com motor híbrido de contingência em tempo real.

A ferramenta atende a dois momentos críticos da operação de consultoria e tráfego local do Leonardo Brasil:
1. **Pré-Venda / Prospecção Comercial:** Levantar dados concretos de volume de buscas locais, sazonalidade e custo por clique (CPC) para embasar propostas e gerar em 1 clique um **Pitch de Demanda Reprimida** pronto para disparo no WhatsApp.
2. **Pós-Venda / Engenharia de Campanha:** Estruturar rapidamente novos clientes com clusterização automática de palavras-chave em Grupos de Anúncios por intenção de compra, geração de lista de palavras-chave negativas locais, simulação de orçamento e exportação em CSV/Google Ads.

---

## 2. Arquitetura de Rotas e Integração com o CRM

### 2.1 Mapeamento de Rotas (`src/main.tsx`)
- `/crm/planejador`: Rota protegida pelo componente [`CrmProtectedRoute`](file:///d:/LEONARDO/Drive/Projetos/leonardo-brasil/src/pages/crm/components/CrmProtectedRoute.tsx).
- Diretiva SEO estrita: `<meta name="robots" content="noindex, nofollow" />` via [`SeoHead`](file:///d:/LEONARDO/Drive/Projetos/leonardo-brasil/src/components/SeoHead.tsx).
- Suporte a parâmetros de consulta (*query params*):
  - `/crm/planejador?q=Clínica+Veterinária&city=porto-alegre&neighborhood=Tristeza&lead=Ceron+Centro+Veterinário`
  - Permite que qualquer card do Kanban em `/crm/dashboard` abra o planejador já pré-configurado para aquele prospecto.

### 2.2 Navegação Unificada
- Atualização do [`CrmHeader.tsx`](file:///d:/LEONARDO/Drive/Projetos/leonardo-brasil/src/pages/crm/components/CrmHeader.tsx) com barra de navegação superior entre:
  - **Kanban de Prospecção** (`/crm/dashboard`)
  - **Planejador de Palavras-Chave** (`/crm/planejador`)
- Atualização do [`KanbanCard.tsx`](file:///d:/LEONARDO/Drive/Projetos/leonardo-brasil/src/pages/crm/components/KanbanCard.tsx) com botão de ação rápida **"Analisar Demanda (Ads)"**.

---

## 3. Arquitetura de Backend e Integração Google Ads API

### 3.1 Módulo de Serviço (`server/google-ads-keywords.mjs`)
Responsável pela comunicação com a API do Google Ads e pelo motor híbrido de contingência:

1. **Autenticação OAuth2 + Google Ads REST API (`v18`):**
   - Troca automática de `GOOGLE_ADS_REFRESH_TOKEN` por `access_token` via `https://oauth2.googleapis.com/token`.
   - Chamada ao endpoint oficial:
     `POST https://googleads.googleapis.com/v18/customers/{customerId}:generateKeywordIdeas`
   - Cabeçalhos obrigatórios:
     - `Authorization: Bearer {access_token}`
     - `developer-token: {GOOGLE_ADS_DEVELOPER_TOKEN}`
     - `login-customer-id: {GOOGLE_ADS_LOGIN_CUSTOMER_ID}` (ID da conta MCC sem traços)
   - Parâmetros enviados:
     - `language`: `languageConstants/1014` (Português)
     - `geoTargetConstants`: IDs oficiais do Google Ads para cidades/estados brasileiros (ex.: Porto Alegre `1001706`, São Paulo `1001773`, Rio de Janeiro `1001634`, Curitiba `1001686`, Florianópolis `1001729`, Belo Horizonte `1001566`, Brasil `2076`).
     - `keywordPlanNetwork`: `GOOGLE_SEARCH_AND_PARTNERS`
     - `keywordSeed` / `keywordAndUrlSeed` / `urlSeed`.

2. **Assistente OAuth2 e Configuração Local:**
   - `GET /api/ads/status`: Informa quais variáveis de ambiente estão configuradas e se a conexão oficial Google Ads está pronta.
   - `POST /api/ads/credentials`: Salva/atualiza credenciais no arquivo `.env` local e valida o formato dos IDs da MCC (removendo hifens automaticamente).
   - `GET /api/ads/oauth/url`: Gera a URL de autorização OAuth2 do Google Cloud com escopo `https://www.googleapis.com/auth/adwords`.
   - `GET /api/ads/oauth/callback`: Recebe o `code` do Google, troca pelo `refresh_token`, persiste no `.env` e redireciona de volta para `/crm/planejador?oauth=success`.

3. **Motor Híbrido de Contingência (Real-Time Google Suggest + Heurística Local):**
   - Enquanto o *Developer Token* estiver em modo de teste (*Test Account Access*) ou sem credenciais completas, ou caso a conta consultada retorne faixas sem histórico completo, o sistema:
     - Consulta sugestões reais do Google Search Autocomplete (`suggestqueries.google.com`) combinadas com modificadores locais da cidade/bairro pesquisado;
     - Calcula estimativas calibradas para o mercado brasileiro de serviços locais (volume mensal, sazonalidade de 12 meses, índice de concorrência e faixa de CPC em R$), identificando claramente na interface a fonte dos dados (`Google Ads API Oficial` vs. `Estimativa Inteligente Local`).

4. **Classificador Semântico e Gerador de Negativas:**
   - Cada palavra-chave retornada é automaticamente classificada em:
     - **Intenção de Busca:** `Transacional (Fundo de Funil)`, `Comercial (Comparação/Preço)`, `Local (Geográfica)`, `Informacional (Topo de Funil)`.
     - **Grupo de Anúncio Sugerido (Cluster):**
       - `01. Urgência & Atendimento Imediato` (ex.: 24h, emergência, plantão, agora, telefone, whatsapp)
       - `02. Localização & Proximidade` (ex.: bairro, cidade, perto de mim, zona sul, centro)
       - `03. Preço, Valor & Consulta` (ex.: preço, valor, quanto custa, orçamento, consulta, particular)
       - `04. Especialidade & Procedimentos` (termos técnicos e serviços específicos do nicho)
       - `05. Pesquisa Geral & Institucional` (termos amplos da categoria)

---

## 4. Especificação da Interface (`src/pages/crm/KeywordPlanner.tsx`)

### 4.1 Painel de Busca e Parâmetros Locais
- **Palavras-chave Semente (Seed Keywords):** Input de termos separados por vírgula + seletores rápidos de nichos locais (Clínica Veterinária, Odontologia, Médicos/Clínicas, Advocacia, Oficina Mecânica, Estética, Dedetizadora/Serviços).
- **Localização Geográfica:** Seletor de Cidade/Estado (Porto Alegre - RS, São Paulo - SP, Curitiba - PR, Florianópolis - SC, Rio de Janeiro - RJ, Belo Horizonte - MG, Todo o Brasil) + campo opcional de **Bairro Foco** (ex.: Tristeza, Moinhos de Vento, Ipanema).
- **URL do Cliente/Concorrente (Opcional):** Para extração combinada (`keywordAndUrlSeed`).
- **Indicador de Status da API:** Badge interativo no topo mostrando `Google Ads API Conectada` ou `Configurar MCC / API` (abre o modal de configuração guiada).

### 4.2 Modo 1: Prospecção & Argumento de Vendas (Pré-Venda)
- **KPIs Executivos de Demanda:**
  - Volume Total de Buscas/Mês na Cidade
  - Volume de Buscas de Alta Intenção (Fundo de Funil + Local)
  - CPC Médio Estimado (Mín. e Máx. em R$)
  - Nível de Disputa Local
- **Calculadora de Oportunidades no WhatsApp:**
  - Controles deslizantes (*sliders*) para:
    - Participação de Cliques / CTR Estimado (padrão: `6%`)
    - Taxa de Conversão em Mensagem no WhatsApp (padrão: `12%`)
    - Taxa de Fechamento de Clientes (padrão: `25%`)
    - Ticket Médio do Serviço (padrão: `R$ 450`)
  - Resultados calculados em tempo real:
    - Visitantes Qualificados / mês
    - Leads no WhatsApp / mês
    - Novos Clientes Estimados / mês
    - Faturamento Potencial Mensal (R$)
- **Gerador de Pitch Comercial para WhatsApp:**
  - Card com texto persuasivo gerado automaticamente usando os dados reais da pesquisa (nome do lead, bairro/cidade, volume exato das 3 principais palavras-chave, projeção de leads) com botões **"Copiar Pitch"** e **"Enviar no WhatsApp"**.

### 4.3 Modo 2: Engenharia de Campanha (Pós-Venda)
- **Tabela Completa de Palavras-Chave:**
  - Busca interna, filtro por intenção (`Todas`, `Transacional`, `Local`, `Comercial`, `Informacional`), filtro por grupo de anúncios e ordenação por Volume, CPC ou Concorrência.
  - Mini-gráfico de barras de sazonalidade (12 meses) em cada linha.
  - Seleção de palavras-chave para o plano da campanha.
- **Visão de Grupos de Anúncios (Clusters Prontos):**
  - Cards organizados por Grupo de Anúncio com botões para alternar correspondência (`"Frase"` vs `[Exata]`) e copiar a lista pronta para colar no Google Ads.
- **Blindagem de Verba (Palavras-Chave Negativas):**
  - Lista curada por nicho local de termos negativos (ex.: *grátis, sus, prefeitura, curso, faculdade, salário, vaga, emprego, como fazer, pdf*) com cópia em 1 clique.
- **Exportação:**
  - Botão **Exportar CSV (Google Ads)** com todas as colunas e métricas.

---

## 5. Critérios de Aceite e Testes

1. **Testes Automatizados de Servidor (`server/app.test.mjs`):**
   - Validar `GET /api/ads/status`.
   - Validar `POST /api/ads/keyword-ideas` com validação de entrada, retorno estruturado de métricas, classificação de intenção, agrupamento em clusters e geração de palavras negativas.
   - Validar integração com a API oficial do Google Ads via mock de `fetch` (`generateKeywordIdeas`) e fallback resiliente.
2. **Verificação de Tipagem e Build:**
   - `npm run typecheck`, `npm run build` e `npm test` passando com zero erros.
