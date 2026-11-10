# Especificação de Design: Central de Clientes, Histórico Antes × Depois, Automação e Relatórios WhatsApp (`/crm/clientes`)

- **Status:** Aguardando Revisão Final do Usuário
- **Data:** 10/11/2026
- **Autor:** Leonardo Brasil & Antigravity
- **Repositório:** `https://github.com/leoferrazdev/leonardo-brasil`
- **Caminho Local:** `D:\LEONARDO\Drive\Projetos\leonardo-brasil`
- **Domínio de Produção:** `https://leonardobrasil.com.br/crm/clientes`

---

## 1. Visão Geral e Objetivos

Estender o CRM existente em `leonardobrasil.com.br/crm` com um módulo completo de **Pós-Venda, Auditoria Contínua, Registro Antes × Depois e Relatórios para WhatsApp**, permitindo:

1. **Preservar o "Antes" pré-gestão (`Baseline`)**: registrar automaticamente o cenário inicial de cada cliente antes de executar ajustes *(métricas históricas passadas, configurações faltantes, links quebrados e prints de tela)* sem que futuras otimizações sobrescrevam o estado original;
2. **Acompanhar múltiplas frentes por cliente**: suportar **Perfil da Empresa no Google (GMN)**, **Google Ads** e **Site** *(novo ou redesign com controle de versões `v1 → v2`)* de forma modular conforme o escopo contratado;
3. **Automatizar o registro ponta a ponta**: permitir que o agente (Antigravity) e coletores automatizados gravem auditorias iniciais, log de implementações executadas, checagens de saúde do site, métricas Google Ads e fechamentos mensais diretamente no Supabase — com edição manual de contingência na UI;
4. **Apresentar presencialmente no Notebook ou Celular (*Mobile-First*)**: oferecer um **Modo Apresentação** responsivo e limpo, ocultando valores comerciais da agência e notas internas privadas, adaptado tanto para tela larga quanto para smartphone em visitas locais;
5. **Gerar Relatórios prontos para WhatsApp**: compilar automaticamente resumos factuais de *Marco Zero* e *Acompanhamento Mensal* em formato nativo de leitura no WhatsApp, com disparo via `https://wa.me/...` (compatível com app móvel e WhatsApp Web) e cópia em 1 clique.

---

## 2. Stack, Restrições Globais e Segurança

- **Stack do Repositório:** React 18 + TypeScript 5 (`strict: true`), Vite 8, TailwindCSS 3, `lucide-react`, `react-hot-toast`, `@supabase/supabase-js`, Express 5 (`server/app.mjs`).
- **Banco de Dados e Mídia:** Supabase PostgreSQL + Supabase Storage (bucket privado `client-evidences` no projeto `juvwfxnlusrnvcarkrmc.supabase.co`).
- **Isolamento SEO & SSR:** Todas as rotas sob `/crm/*` continuam carregadas via `React.lazy`, injetam `<meta name="robots" content="noindex, nofollow" />` via `react-helmet-async` / `SeoHead` e **permanecem excluídas** de `scripts/prerender.mjs`.
- **Integridade de Métricas e Comunicação (Regra Operacional):** Os textos gerados nos relatórios e no Modo Apresentação relatam exclusivamente métricas observáveis *(visualizações, interações, ligações, rotas, cliques, impressões, custo, conversões, avaliações, saúde do site)* e entregas verificadas — **sem prometer posição garantida no Google nem afirmar causalidade direta de faturamento sem comprovação**.
- **Aviso Explícito de Sessão Offline:** Como `src/pages/crm/Login.tsx` mantém opção de contingência local (`crm_offline_session`), as telas de `/crm/clientes*` verificam se há `supabase.auth.getSession()` ativa. Sem sessão Supabase real, um banner claro alerta o operador que os dados na tela não estão sincronizados com a nuvem/outros dispositivos e solicita login real com e-mail e senha.

---

## 3. Arquitetura de Rotas e Navegação Unificada no CRM

### 3.1 Novas Rotas (`src/main.tsx`)
Utilizando o roteador existente `src/lib/local-router.tsx` (que suporta parâmetros dinâmicos `:slug` via `matchPath` e `useParams`):
- `/crm/clientes` → [`CrmProtectedRoute`](../../../src/pages/crm/components/CrmProtectedRoute.tsx) → `ClientPortfolio.tsx` (Carteira de Clientes Ativos + importação de leads fechados do Kanban).
- `/crm/clientes/:slug` → [`CrmProtectedRoute`](../../../src/pages/crm/components/CrmProtectedRoute.tsx) → `ClientDetail.tsx` (Ficha completa com alternador `Modo Gestão` × `Modo Apresentação` e gerador de Relatório WhatsApp).

### 3.2 Navegação Superior Unificada (`src/pages/crm/components/CrmNavBar.tsx`)
Criar componente leve de navegação compartilhada usado em `/crm/dashboard`, `/crm/clientes`, `/crm/clientes/:slug` e `/crm/planejador` com 3 abas principais (em layout *scrollable* horizontal confortável ao toque no mobile):
1. **Kanban Prospecção** (`/crm/dashboard`)
2. **Clientes & Histórico** (`/crm/clientes`)
3. **Planejador Google Ads** (`/crm/planejador`)

### 3.3 Integração com o Kanban Existente (`Dashboard.tsx` & `MessageBlocksDrawer.tsx`)
- Nos cartões ou na gaveta lateral de qualquer lead em estágio `fechado_ganho` *(ex.: `O-005 Angelo Car Oficina Mecânica`)*, exibir botão **"Criar / Abrir Ficha de Cliente"**:
  - Se já existir cliente com `lead_id` correspondente no Supabase, navega diretamente para `/crm/clientes/<slug>`;
  - Caso contrário, navega para `/crm/clientes?fromLead=<leadId>` abrindo o modal de criação já pré-preenchido com os dados auditados do lead (`lead_id`, nome, segmento, bairro, cidade, endereço, WhatsApp, link Maps e site).

---

## 4. Modelo de Dados no Supabase (`supabase/migrations/20261110_crm_clients_history.sql`)

Todas as tabelas terão `RLS` habilitado com política para usuários autenticados (`auth.role() = 'authenticated'`), além de índices e restrições `UNIQUE` para permitir sincronização automática idempotente sem duplicações.

### 4.1 Tabela `clients`
Armazena o cadastro central e as frentes contratadas de cada cliente:
- `id`: `uuid primary key default gen_random_uuid()`
- `slug`: `text unique not null` (ex.: `'angelo-car'`)
- `lead_id`: `text` (ex.: `'O-005'`, vínculo opcional com card do Kanban)
- `name`: `text not null`
- `segment`: `text not null`
- `city`: `text not null default 'Porto Alegre'`
- `neighborhood`: `text`
- `address`: `text`
- `whatsapp`: `text` (sanitizado `55519...`)
- `owner_name`: `text`
- `owner_email`: `text`
- `status`: `text not null default 'onboarding'` (`'onboarding' | 'ativo' | 'pausado' | 'encerrado'`)
- `services_scope`: `jsonb not null` *(onde `website_mode` aceita `'novo' | 'redesign' | 'manutencao' | 'nenhum'`)*:
  ```json
  {
    "gbp": true,
    "google_ads": true,
    "website": true,
    "website_mode": "redesign"
  }
  ```
- `external_ids`: `jsonb not null default '{}'::jsonb` — `{ gbpMapsUrl, gbpReviewUrl, websiteDomain, websiteVersionLabel, adsAccountIds: ["623-199-6692", ...] }`
- `contract_meta`: `jsonb not null default '{}'::jsonb` — **nunca renderizado no Modo Apresentação** (`planLabel`, `setupFeeBrl`, `monthlyFeeBrl`, `paymentNotes`, `privateNotes`)
- `started_at`: `date`
- `created_at`: `timestamptz default now()`
- `updated_at`: `timestamptz default now()`

### 4.2 Tabela `client_checklists` (Matriz Técnica "Antes × Depois")
Garante que o estado original pré-gestão (`before_*`) permaneça preservado após a execução das otimizações (`current_*`):
- `id`: `uuid primary key default gen_random_uuid()`
- `client_id`: `uuid not null references public.clients(id) on delete cascade`
- `pillar`: `text not null` (`'gbp' | 'website' | 'google_ads'`)
- `item_key`: `text not null` (identificador estável para upsert automatizado, ex.: `'gbp_social_profiles'`)
- `category_label`: `text not null` (ex.: `'Cadastro & Redes'`, `'SEO Local'`, `'Mídia'`, `'Estrutura Site'`, `'Higiene Ads'`)
- `title`: `text not null`
- `impact_level`: `text not null default 'alta'` (`'alta' | 'media' | 'baixa'`)
- `before_status`: `text not null` (`'ausente' | 'incompleto' | 'incorreto' | 'ok' | 'na'`)
- `before_value`: `text` (descrição factual inicial, ex.: *"0 redes sociais vinculadas"*)
- `current_status`: `text not null` (`'pendente' | 'em_andamento' | 'otimizado' | 'nao_aplicavel'`)
- `current_value`: `text` (estado atual, ex.: *"Instagram e Facebook vinculados"*)
- `sort_order`: `integer not null default 0`
- `updated_at`: `timestamptz default now()`
- `completed_at`: `timestamptz`
- Constraint: `unique (client_id, item_key)`

**Regra de preservação no Sync:** Em `on conflict (client_id, item_key)`, atualizações automáticas pós-onboarding só alteram `current_status`, `current_value`, `completed_at` e `updated_at` — **não sobrescrevem `before_status` nem `before_value`**, salvo quando o comando passar explicitamente `--force-baseline`.

### 4.3 Tabela `client_snapshots` (Baseline Passado & Evolução Mensal)
Armazena cada mês fechado ou histórico pré-gestão:
- `id`: `uuid primary key default gen_random_uuid()`
- `client_id`: `uuid not null references public.clients(id) on delete cascade`
- `period_key`: `text not null` (formato `'YYYY-MM'`, ex.: `'2026-06'`, `'2026-11'`)
- `period_label`: `text not null` (ex.: `'Jun/2026'`, `'Nov/2026'`)
- `snapshot_type`: `text not null` (`'baseline_historico' | 'mensal'`)
- `is_baseline`: `boolean not null default false` *(marca o marco zero oficial pré-otimização, ex.: último mês/média antes da entrega)*
- `source`: `text not null` (`'agente_browser' | 'google_ads_api' | 'site_probe' | 'hibrido' | 'manual'`)
- `gbp_metrics`: `jsonb default '{}'::jsonb` — `{ viewsTotal, viewsSearch, viewsMaps, interactionsTotal, calls, routes, siteClicks, rating, reviewCount, photosCount, profileStrengthPct, targetKeyword, targetKeywordRank, periodNotes }`
- `ads_metrics`: `jsonb default '{}'::jsonb` — `{ activeAccountId, legacyAccountsCount, impressions, clicks, ctrPct, cpcAvgBrl, spendBrl, conversions, costPerConversionBrl, activeCampaignsCount, statusLabel }`
- `site_metrics`: `jsonb default '{}'::jsonb` — `{ versionLabel, targetUrl, httpOkCount, brokenUrlsCount, brokenPaths: string[], hasSsl, hasWhatsappCta, pagespeedMobile, pagespeedDesktop, whatsappClicks, organicClicksGsc }`
- `overall_status`: `text not null default 'estavel'` (`'baseline' | 'avanco' | 'estavel' | 'retrocesso'`)
- `executive_summary`: `text`
- `collection_warnings`: `jsonb default '[]'::jsonb` *(ex.: alertas parciais quando Ads API ou PageSpeed falharem sem quebrar o snapshot)*
- `recorded_at`: `timestamptz default now()`
- Constraints:
  - `unique (client_id, period_key, snapshot_type)` *(permite guardar no mesmo mês `'2026-11'` o registro pré-otimização `'baseline_historico'` e o fechamento pós-execução `'mensal'` sem colisão)*
  - Índice único parcial `create unique index ... on public.client_snapshots(client_id) where is_baseline = true` *(assegura 1 marco zero oficial inequívoco por cliente)*.

### 4.4 Tabela `client_change_logs` (Linha do Tempo de Ações e Versões)
Registra cada auditoria, entrega aplicada, versão do site ou ajuste de campanha:
- `id`: `uuid primary key default gen_random_uuid()`
- `client_id`: `uuid not null references public.clients(id) on delete cascade`
- `occurred_at`: `timestamptz not null default now()`
- `pillar`: `text not null` (`'gbp' | 'website' | 'google_ads' | 'reputacao'`)
- `action_type`: `text not null` (`'auditoria_inicial' | 'implementacao' | 'correcao' | 'versao_site' | 'campanha_ads' | 'monitoramento'`)
- `title`: `text not null`
- `before_state`: `text`
- `after_state`: `text`
- `automation_source`: `text not null default 'antigravity'` (`'antigravity' | 'script_cron' | 'manual'`)
- `visible_to_client`: `boolean not null default true`
- `external_ref`: `text` (opcional — chave estável para idempotência no sync)
- Constraint: `unique (client_id, external_ref)` *(permite reexecutar um pacote de log sem duplicar entradas quando `external_ref` estiver preenchido)*

### 4.5 Tabela `client_evidences` e Bucket `client-evidences`
Armazena screenshots pareados para comparação **Antes × Depois**:
- `id`: `uuid primary key default gen_random_uuid()`
- `client_id`: `uuid not null references public.clients(id) on delete cascade`
- `pillar`: `text not null` (`'gbp' | 'website' | 'google_ads'`)
- `phase`: `text not null` (`'antes' | 'depois' | 'mensal'`)
- `period_key`: `text`
- `pair_key`: `text` (ex.: `'perfil-capa-logo'`, `'maps-publico'`, `'site-home'`, `'ads-visao-geral'`)
- `title`: `text not null`
- `caption`: `text`
- `storage_path`: `text not null`
- `created_at`: `timestamptz default now()`
- Constraint: `unique (client_id, storage_path)`
- **Storage Bucket:** `client-evidences` configurado com `public = false`. A interface gera URLs assinadas temporárias (`createSignedUrl(path, 3600)`) para usuários autenticados, garantindo privacidade dos prints de contas de clientes.

---

## 5. Motor Determinístico de Evolução (Avanço × Estável × Retrocesso)

Implementado em módulo puro compartilhado e testável (`src/pages/crm/utils/clientAnalytics.ts`):

1. **Comparativo Duplo por Métrica:**
   - **Vs. Mês Anterior (`MoM`):** compara o snapshot selecionado contra o snapshot cronologicamente anterior do mesmo cliente.
   - **Vs. Baseline (`Antes → Atual`):** compara o snapshot selecionado contra o snapshot marcado com `is_baseline: true` (ponto de partida pré-gestão).
2. **Direção da Métrica:**
   - Métricas "maior é melhor": Visualizações, Interações, Ligações, Rotas, Cliques Site, Nota média, Avaliações, Força do Perfil %, Cliques Ads, Conversões Ads, PageSpeed Mobile/Desktop.
   - Métricas "menor é melhor": Posição no Maps (`5º → 2º` é **avanço**), Custo por Conversão, Links Quebrados 404 (`2 → 0` é **avanço**).
3. **Classificação Automática do Mês (`overall_status`):**
   - Se `is_baseline === true` → `'baseline'`.
   - Caso contrário, pontua indicadores-chave disponíveis do mês atual vs. mês anterior *(tolerância ±5% = neutro)*:
     - `avanco`: maioria dos indicadores principais subiu ou houve ganho relevante sem quedas críticas *(ex.: `>= +5%` nas interações/conversões ou melhora de posição/saúde do site)*.
     - `retrocesso`: queda relevante em indicadores principais *(ex.: `<= -10%` nas interações do GMN, queda de nota/avaliações, novo erro 404 no site ou queda acentuada de conversões Ads)*.
     - `estavel`: variações dentro da faixa de estabilidade `(-10% < delta < +5%)` ou sem variação significativa.

---

## 6. Arquitetura da Automação Ponta-a-Ponta

### 6.1 Script Central de Sincronização (`scripts/crm-client-sync.mjs`)
Script Node.js CLI idempotente consumido pelo agente Antigravity após auditorias, implementações ou rotinas mensais agendadas:
- **Autenticação segura:** Lê `VITE_SUPABASE_URL` do `.env` e usa `SUPABASE_SERVICE_ROLE_KEY` (preferencial para automação headless) ou `CRM_ADMIN_EMAIL` + `CRM_ADMIN_PASSWORD` + `VITE_SUPABASE_ANON_KEY` via `supabase.auth.signInWithPassword`. Nunca expõe `SERVICE_ROLE_KEY` em código `src/`.
- **Entrada (`--file <payload.json>`):** Aceita um único pacote JSON estruturado contendo opcionalmente:
  - `client`: dados cadastrais + `services_scope` + `external_ids` + `contract_meta`
  - `checklistItems`: itens do Antes × Depois (`before_*` preservado em atualizações posteriores, exceto se `--force-baseline`)
  - `snapshots`: array de snapshots históricos (`baseline_historico` dos últimos meses anteriores à gestão) e/ou mês corrente (`mensal`)
  - `changeLogs`: ações executadas (`implementacao`, `versao_site`, etc.) com `external_ref` único
  - `evidences`: caminhos de imagens locais que o script envia via upload automático para `client-evidences/<slug>/<phase>-<filename>` e vincula em `client_evidences`.
- **Modo `--audit-site` integrado:** Opcionalmente invoca o auditor de site antes de salvar o snapshot.

### 6.2 Coletor Automático de Saúde do Site (`scripts/lib/siteAuditor.mjs`)
Módulo puro reutilizável e testável sem browser pesado:
- Verifica HTTPS e status HTTP real das rotas cadastradas (`/` + URLs críticas monitoradas do cliente, ex.: `/socorro-mecanico-24h`, `/contato`, etc.) via `fetch` com timeout (8s) seguindo redirecionamentos e registrando códigos `200`, `301/302` ou `404/5xx`.
- Faz parsing leve do HTML da home para detectar presença de `<title>`, canonical e links diretos de contato (`wa.me/`, `api.whatsapp.com`, `tel:`).
- Consulta opcionalmente a **Google PageSpeed Insights API** (chave opcional `PAGESPEED_API_KEY` ou quota pública) para extrair notas Mobile/Desktop (`0–100`); em caso de erro/rate-limit da API externa, grava aviso em `collection_warnings` sem impedir o salvamento do snapshot.

### 6.3 Coletor Opcional de Google Ads (`scripts/lib/adsMetricsCollector.mjs`)
- Reutiliza o padrão OAuth2 de `server/google-ads-keywords.mjs` (`GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_LOGIN_CUSTOMER_ID`).
- Dado um `customerId` e janela `YYYY-MM`, consulta via `googleAds:searchStream` métricas mensais agregadas (`impressions`, `clicks`, `ctr`, `average_cpc`, `cost_micros`, `conversions`).
- Quando a conta MCC ainda estiver em modo teste ou o cliente não tiver conta ativa no OAuth, retorna resultado estruturado `{ ok: false, warning: '...' }` para que o snapshot salve normalmente com origem manual/agente sem quebrar a coleta mensal.

---

## 7. Experiência Visual, Responsividade Mobile-First & Modo Apresentação

### 7.1 Diretrizes Responsivas (*Notebook + Celular*)
- Layout construído *mobile-first* usando a paleta executiva existente (`#0a0d14`, `#0e1320`, `#1a2030`, Azul `#3B82F6`, Âmbar `#F59E0B`, Esmeralda `#10B981`, Rosa `#F43F5E`).
- Zero rolagem horizontal acidental (`overflow-x-hidden`); alvos de toque com altura mínima confortável (`min-h-[44px]`).
- **Cards de KPI:** `grid-cols-2` no mobile (`gap-2.5`) expandindo para `md:grid-cols-3 lg:grid-cols-5` no desktop, com números usando `tabular-nums`.
- **Gráfico de Evolução Mensal:** Componente SVG próprio e leve (`ClientEvolutionChart.tsx`) sem novas dependências externas pesadas; no celular suporta **seleção por toque no mês** (exibindo um painel compacto abaixo com os valores exatos do mês tocado) + lista de cards mensais empilhados em telas `< md` (tabela completa apenas em `md:table`).
- **Comparativo de Prints Antes × Depois:** No desktop exibe pares lado a lado (`grid-cols-2`); no celular oferece um seletor segmentado rápido `[ Antes | Depois | Lado a Lado ]` para visualização nítida em tela vertical estreita.

### 7.2 Separação Estrita: `Modo Gestão` vs `Modo Apresentação`
Um botão proeminente no topo de `/crm/clientes/:slug` alterna entre os dois modos (também acessível direto por `?present=1` para abrir em 1 toque no celular na frente do cliente):
- **Oculto automaticamente no `Modo Apresentação`:**
  - Barra de navegação principal do CRM / links de prospecção (`CrmNavBar`);
  - Bloco `contract_meta` (valor pago, parcelas, receita da agência, notas privadas);
  - Entradas da timeline com `visible_to_client === false`;
  - Controles de edição rápida / exclusão / geração de script interno *(fica visível apenas um botão discreto "Sair da Apresentação" e alternador de período/frente)*.
- **Exibido no `Modo Apresentação`:**
  1. Cabeçalho limpo com Nome do Cliente, Segmento, Cidade/Bairro, escopo ativo (`GMN` · `Ads` · `Site`) e selo de status do último mês (`Avanço ↑` / `Estável` / `Retrocesso ↓`);
  2. **Bloco 1 — Placar Executivo (`Antes × Agora`):** comparação visual direta contra o Baseline inicial e variação vs. mês anterior;
  3. **Bloco 2 — Evolução Mês a Mês:** gráfico + seletor de mês filtrando dinamicamente **apenas pelas frentes habilitadas** em `services_scope`;
  4. **Bloco 3 — Antes × Depois Técnico & Evidências Visuais:** resumo de progresso do checklist + itens já otimizados *(ex.: Redes Sociais vinculadas, Descrição SEO, Correção de 404)* + galeria de prints Antes/Depois;
  5. **Bloco 4 — Linha do Tempo de Entregas:** histórico datado e claro do que foi executado pela consultoria.

---

## 8. Gerador de Relatório WhatsApp (`src/pages/crm/utils/whatsappReportFormatter.ts`)

Módulo puro com função determinística `formatClientWhatsAppReport(params)`:
- **Estilos disponíveis:**
  1. **`marco_zero` (Antes × Depois Inicial):** destaca o que foi encontrado antes de assumirmos, o que já foi corrigido/implementado (com base em `client_checklists` concluídos e `client_change_logs` visíveis) e próximos passos.
  2. **`mensal` (Acompanhamento Mensal):** apresenta os números do mês selecionado, comparação objetiva com o mês anterior (`↑` / `↓` / `=`) e com o Baseline (`Antes`), apenas para as frentes ativas em `services_scope`, além das principais entregas do período.
- **Formatação segura para celular no WhatsApp:**
  - Apenas `*negrito*`, quebras de linha `\n`, bullets curtos `•` e números formatados `pt-BR`; nenhuma tabela larga com pipes.
- **Disparo Universal (Mobile + Desktop):**
  - **Copiar Relatório:** `navigator.clipboard.writeText(text)` + toast de confirmação.
  - **Enviar no WhatsApp:** gera link `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(text)}` (abre o app nativo quando acionado no celular e o WhatsApp Web no notebook). Nota: aproveitar para compatibilizar o uso de `wa.me` apenas no novo módulo sem quebrar o comportamento existente do Kanban.

---

## 9. Carga Inicial Real: Cliente #1 — Ângelo Car

Após validação da aplicação e criação das tabelas no Supabase, a primeira execução real do pipeline automatizado (`scripts/crm-client-sync.mjs`) cadastrará **Ângelo Car Oficina Mecânica** (`slug: 'angelo-car'`, `lead_id: 'O-005'`) com seu **Marco Zero ("Antes") completo** antes de realizarmos qualquer edição nas contas do Google:
- **Frentes habilitadas:** `gbp: true`, `google_ads: true` (4 IDs mapeados: `623-199-6692` ativa + `219-234-5984` suspensa/antiga + `521-209-8291` + `323-951-6460`), `website: true` (`website_mode: 'redesign'`, `websiteVersionLabel: 'v1 (Atual legado)'`).
- **Snapshots Históricos (`is_baseline: true` no fechamento pré-otimização):**
  - Meses históricos passados observados no Painel Google (`Jun/2026` a `Nov/2026`, totalizando `6.967` visualizações e `1.005` interações no acumulado recente, `4.1★` com `267` avaliações e `20%` de força de perfil).
- **Checklist Antes × Depois inicializado:**
  - Itens pendentes mapeados na auditoria (Redes sociais ausentes, Nome sem termo `"Oficina Mecânica"` / site legado em inglês `"Mechanical"`, Descrição curta, Categoria secundária `Serviço de autoelétrica` ausente, Catálogo de serviços vazio, Foto de fachada ausente/capa antiga, Link curto de avaliações sem estratégia ativa, URLs `/socorro-mecanico-24h` em `404`, Higiene das 4 contas Ads).
- **Evidências (`Antes`) enviadas automaticamente para o Storage:**
  - `evidencia-fotos-capa-logo.png`, `evidencia-maps-publico.png`, `evidencia-streetview-fachada.png`.

---

## 10. Estratégia de Testes e Critérios de Aceite

1. **Testes Unitários Automatizados (`npm test` / `node --test server/*.test.mjs`):**
   Seguindo exatamente o padrão já usado em `server/webmcp.test.mjs` *(transpilação on-the-fly via `typescript` para utilitários `.ts` e import direto para módulos `scripts/lib/*.mjs`)*:
   - `server/crm-client-analytics.test.mjs`: validar cálculos de `deltaMoMPct`, `deltaVsBaselinePct`, inversão de direção para posição no Maps e links 404, e classificação `avanco` / `estavel` / `retrocesso` (inclusive quando faltarem frentes opcionais).
   - `server/crm-whatsapp-report.test.mjs`: validar saída para `marco_zero` e `mensal`, omissão de frentes inativas (`google_ads: false`), preservação de formatação WhatsApp e geração do link `https://wa.me/...`.
   - `server/crm-site-auditor.test.mjs`: validar parsing de status HTTP (`200` vs `404`), detecção de link WhatsApp e fallback gracioso quando PageSpeed falhar.
   - `server/crm-client-sync.test.mjs`: validar que o sync **nunca sobrescreve** `before_status` / `before_value` após o onboarding sem `--force-baseline`, e que reexecuções geram payload idempotente.
2. **Verificação Técnica do Projeto:**
   - `npm run typecheck` sem erros TypeScript;
   - `npm run build` concluído com sucesso (SSR + prerender + bundles do CRM intactos);
   - `npm test` 100% aprovado (testes existentes + novos).
3. **Verificação Visual & Mobile em Navegador Real:**
   - Verificar `/crm/clientes` e `/crm/clientes/angelo-car` em viewport Desktop (`1440×900`) e Mobile (`390×844`), validando ausência de overflow horizontal, legibilidade do Modo Apresentação (ocultando valores internos da agência) e carregamento das imagens via URL assinada do Supabase Storage.
