# Central de Clientes CRM (`/crm/clientes`), Histórico Antes × Depois, Automação e Relatórios WhatsApp — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o módulo completo de Pós-Venda e Clientes Ativos em `leonardobrasil.com.br/crm/clientes` com registro imutável do "Antes" (`Baseline`), checklist multi-frente (GMN, Google Ads, Site), série histórica mensal com detecção automática de avanço/retrocesso, pipeline CLI automatizado de sincronização + upload de prints, **Modo Apresentação** responsivo (notebook e celular) e gerador de relatórios para WhatsApp.

**Architecture:** Módulo SPA lazy-loaded em `src/pages/crm/` protegido por `CrmProtectedRoute` e integrado ao Supabase PostgreSQL + Storage privado (`client-evidences`), compartilhando navegação unificada entre Kanban, Clientes e Planejador Ads. Toda lógica determinística de cálculo de evolução (`clientAnalytics.ts`) e formatação WhatsApp (`whatsappReportFormatter.ts`) vive em módulos puros testáveis via `node --test server/*.test.mjs`, enquanto scripts Node idempotentes (`scripts/crm-client-sync.mjs`, `scripts/lib/siteAuditor.mjs`, `scripts/lib/adsMetricsCollector.mjs`) automatizam auditorias, implementações e fechamentos mensais diretamente na nuvem.

**Tech Stack:** React 18, TypeScript 5 (`strict: true`), Vite 8, TailwindCSS 3, `@supabase/supabase-js`, `lucide-react`, `react-hot-toast`, Node.js 22 (`node --test`).

## Global Constraints

- Repositório alvo: `D:\LEONARDO\Drive\Projetos\leonardo-brasil`.
- Comandos de verificação obrigatórios do projeto: `npm run typecheck`, `npm run build` e `npm test` (`node --test server/*.test.mjs`).
- Todas as rotas `/crm/*` devem permanecer fora de `scripts/prerender.mjs` e injetar `<meta name="robots" content="noindex, nofollow" />` via `SeoHead`.
- **Nunca sobrescrever o "Antes" (`before_status` / `before_value`)** nem o snapshot `is_baseline: true` em reexecuções automáticas de sync (salvo flag explícita `--force-baseline`).
- **Modo Apresentação (`?present=1` ou botão toggle):** deve ocultar `CrmNavBar`, `contract_meta` (preços/valores da agência e notas privadas) e `client_change_logs` com `visible_to_client === false`.
- **Responsividade Mobile-First:** sem overflow horizontal em `390px`, alvos de toque `>= 44px`, cards em vez de tabelas largas em `< md`, seletor visual adaptável para prints e link universal `https://wa.me/...` no gerador WhatsApp.
- **Integridade Analítica:** relatórios e textos nunca devem prometer posição garantida no Google nem afirmar causalidade direta de faturamento sem comprovação.
- **Segurança:** `SUPABASE_SERVICE_ROLE_KEY` nunca pode ser referenciada em `src/`; bucket `client-evidences` permanece privado com URLs assinadas (`createSignedUrl`).

## Mapa de Arquivos

- **Database & Seed:**
  - Create: `supabase/migrations/20261110_crm_clients_history.sql` — 5 tabelas, índices idempotentes, triggers `updated_at`, RLS e bucket privado `client-evidences`.
  - Create: `scripts/data/angelo-car-baseline.json` — carga inicial oficial do "Antes" da Ângelo Car (`O-005`).
- **Domain, Analytics & WhatsApp Formatter (Frontend + Tests):**
  - Create: `src/pages/crm/clientTypes.ts` — contratos TypeScript completos para clientes, snapshots, checklist, logs e evidências.
  - Create: `src/pages/crm/utils/clientAnalytics.ts` — comparação dupla (`MoM` e `vsBaseline`), deltas e classificação `avanco | estavel | retrocesso`.
  - Create: `src/pages/crm/utils/whatsappReportFormatter.ts` — gerador determinístico `marco_zero` e `mensal` + link `https://wa.me/...`.
  - Create: `server/crm-client-analytics.test.mjs` — testes unitários do motor analítico.
  - Create: `server/crm-whatsapp-report.test.mjs` — testes unitários do formatador WhatsApp.
- **Automation Scripts & Libraries:**
  - Create: `scripts/lib/envLoader.mjs` — leitura segura do `.env` sem dependências externas.
  - Create: `scripts/lib/siteAuditor.mjs` — auditor automático HTTP (`200` vs `404`), HTTPS, `<title>`, CTA WhatsApp e PageSpeed API.
  - Create: `scripts/lib/adsMetricsCollector.mjs` — coletor OAuth2 + GAQL Google Ads mensal com fallback não bloqueante.
  - Create: `scripts/lib/crmSyncCore.mjs` — lógica pura de montagem/validação/merge idempotente e preservação do `Antes`.
  - Create: `scripts/crm-client-sync.mjs` — CLI principal para gravar auditorias, implementações, prints no Storage e fechamentos mensais no Supabase.
  - Create: `server/crm-site-auditor.test.mjs` — testes unitários do auditor de site.
  - Create: `server/crm-client-sync.test.mjs` — testes unitários de idempotência e proteção do `Antes`.
- **Cloud Service & CRM UI:**
  - Create: `src/pages/crm/utils/clientDefaults.ts` — helper puro de geração de slug, seed padrão de checklist por escopo contratado e pré-preenchimento a partir de `ProspectLead`.
  - Create: `server/crm-client-defaults.test.mjs` — testes unitários para slug, checklist padrão e importação de lead.
  - Create: `src/pages/crm/services/crmClientService.ts` — CRUD Supabase + Storage signed URLs + cache local seguro + seed de checklist padrão por frente contratada + importação de `ProspectLead`.
  - Create: `src/pages/crm/components/CrmNavBar.tsx` — navegação unificada entre Kanban, Clientes e Planejador Ads.
  - Create: `src/pages/crm/components/CloudSyncBanner.tsx` — alerta explícito quando operando sem sessão Supabase Cloud.
  - Create: `src/pages/crm/components/ClientEvolutionChart.tsx` — gráfico SVG responsivo tocável + cards mobile / tabela desktop.
  - Create: `src/pages/crm/components/ClientBeforeAfterSection.tsx` — matriz Antes × Depois + galeria pareada responsiva `[ Antes | Depois | Lado a Lado ]`.
  - Create: `src/pages/crm/components/ClientWhatsAppReportPanel.tsx` — painel de geração/edição/cópia/envio do relatório WhatsApp.
  - Create: `src/pages/crm/components/ClientEditPanels.tsx` — modais/formulários para edição rápida no `Modo Gestão` (novo cliente, novo mês, novo item/log, upload de print).
  - Create: `src/pages/crm/ClientPortfolio.tsx` — página `/crm/clientes`.
  - Create: `src/pages/crm/ClientDetail.tsx` — página `/crm/clientes/:slug` com `Modo Gestão` × `Modo Apresentação`.
  - Modify: `src/main.tsx`, `src/pages/crm/components/CrmHeader.tsx`, `src/pages/crm/KeywordPlanner.tsx`, `src/pages/crm/components/KanbanCard.tsx`, `src/pages/crm/components/KanbanColumn.tsx`, `src/pages/crm/components/MessageBlocksDrawer.tsx`, `src/pages/crm/Dashboard.tsx`.

---

### Task 1: Schema Relacional no Supabase & Storage Privado

**Files:**
- Create: `supabase/migrations/20261110_crm_clients_history.sql`

**Interfaces:**
- Produces: Tabelas `public.clients`, `public.client_checklists`, `public.client_snapshots`, `public.client_change_logs`, `public.client_evidences`; bucket `client-evidences` (`public = false`) com políticas RLS para `authenticated`.

- [ ] **Step 1: Escrever a migration SQL completa e idempotente**

Criar `supabase/migrations/20261110_crm_clients_history.sql`:

```sql
-- Migration: Central de Clientes, Histórico Antes x Depois e Evidências (/crm/clientes)
-- Executar no SQL Editor do projeto Supabase juvwfxnlusrnvcarkrmc.supabase.co

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. Cadastro central de clientes e escopo contratado
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  lead_id text,
  name text not null,
  segment text not null,
  city text not null default 'Porto Alegre',
  neighborhood text,
  address text,
  whatsapp text,
  owner_name text,
  owner_email text,
  status text not null default 'onboarding' check (status in ('onboarding', 'ativo', 'pausado', 'encerrado')),
  services_scope jsonb not null default '{"gbp": true, "google_ads": false, "website": false, "website_mode": "nenhum"}'::jsonb,
  external_ids jsonb not null default '{}'::jsonb,
  contract_meta jsonb not null default '{}'::jsonb,
  started_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_clients_lead_id on public.clients (lead_id);
create index if not exists idx_clients_status on public.clients (status);

drop trigger if exists trg_clients_updated_at on public.clients;
create trigger trg_clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

-- 2. Checklist técnico Antes x Depois
create table if not exists public.client_checklists (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  pillar text not null check (pillar in ('gbp', 'website', 'google_ads')),
  item_key text not null,
  category_label text not null,
  title text not null,
  impact_level text not null default 'alta' check (impact_level in ('alta', 'media', 'baixa')),
  before_status text not null check (before_status in ('ausente', 'incompleto', 'incorreto', 'ok', 'na')),
  before_value text,
  current_status text not null check (current_status in ('pendente', 'em_andamento', 'otimizado', 'nao_aplicavel')),
  current_value text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (client_id, item_key)
);

create index if not exists idx_client_checklists_client_pillar on public.client_checklists (client_id, pillar, sort_order);

drop trigger if exists trg_client_checklists_updated_at on public.client_checklists;
create trigger trg_client_checklists_updated_at
  before update on public.client_checklists
  for each row execute function public.set_updated_at();

-- 3. Snapshots históricos (pré-gestão) e fechamentos mensais
create table if not exists public.client_snapshots (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  period_key text not null,
  period_label text not null,
  snapshot_type text not null check (snapshot_type in ('baseline_historico', 'mensal')),
  is_baseline boolean not null default false,
  source text not null default 'agente_browser' check (source in ('agente_browser', 'google_ads_api', 'site_probe', 'hibrido', 'manual')),
  gbp_metrics jsonb not null default '{}'::jsonb,
  ads_metrics jsonb not null default '{}'::jsonb,
  site_metrics jsonb not null default '{}'::jsonb,
  overall_status text not null default 'estavel' check (overall_status in ('baseline', 'avanco', 'estavel', 'retrocesso')),
  executive_summary text,
  collection_warnings jsonb not null default '[]'::jsonb,
  recorded_at timestamptz not null default now(),
  unique (client_id, period_key, snapshot_type)
);

create unique index if not exists idx_client_snapshots_single_baseline
  on public.client_snapshots (client_id)
  where is_baseline = true;

create index if not exists idx_client_snapshots_period
  on public.client_snapshots (client_id, period_key);

-- 4. Linha do tempo cronológica de implementações e versões
create table if not exists public.client_change_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  pillar text not null check (pillar in ('gbp', 'website', 'google_ads', 'reputacao')),
  action_type text not null check (action_type in ('auditoria_inicial', 'implementacao', 'correcao', 'versao_site', 'campanha_ads', 'monitoramento')),
  title text not null,
  before_state text,
  after_state text,
  automation_source text not null default 'antigravity' check (automation_source in ('antigravity', 'script_cron', 'manual')),
  visible_to_client boolean not null default true,
  external_ref text,
  unique (client_id, external_ref)
);

create index if not exists idx_client_change_logs_client_date
  on public.client_change_logs (client_id, occurred_at desc);

-- 5. Prints e evidências visuais (Antes x Depois)
create table if not exists public.client_evidences (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  pillar text not null check (pillar in ('gbp', 'website', 'google_ads')),
  phase text not null check (phase in ('antes', 'depois', 'mensal')),
  period_key text,
  pair_key text,
  title text not null,
  caption text,
  storage_path text not null,
  created_at timestamptz not null default now(),
  unique (client_id, storage_path)
);

create index if not exists idx_client_evidences_client_phase
  on public.client_evidences (client_id, phase, pillar);

-- 6. Row Level Security (apenas usuários autenticados do CRM)
alter table public.clients enable row level security;
alter table public.client_checklists enable row level security;
alter table public.client_snapshots enable row level security;
alter table public.client_change_logs enable row level security;
alter table public.client_evidences enable row level security;

drop policy if exists "CRM authenticated full access clients" on public.clients;
create policy "CRM authenticated full access clients"
  on public.clients for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "CRM authenticated full access checklists" on public.client_checklists;
create policy "CRM authenticated full access checklists"
  on public.client_checklists for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "CRM authenticated full access snapshots" on public.client_snapshots;
create policy "CRM authenticated full access snapshots"
  on public.client_snapshots for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "CRM authenticated full access change_logs" on public.client_change_logs;
create policy "CRM authenticated full access change_logs"
  on public.client_change_logs for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "CRM authenticated full access evidences" on public.client_evidences;
create policy "CRM authenticated full access evidences"
  on public.client_evidences for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 7. Bucket privado para prints de evidência Antes x Depois
insert into storage.buckets (id, name, public)
values ('client-evidences', 'client-evidences', false)
on conflict (id) do update set public = false;

drop policy if exists "CRM authenticated storage select client-evidences" on storage.objects;
create policy "CRM authenticated storage select client-evidences"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'client-evidences');

drop policy if exists "CRM authenticated storage insert client-evidences" on storage.objects;
create policy "CRM authenticated storage insert client-evidences"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'client-evidences');

drop policy if exists "CRM authenticated storage update client-evidences" on storage.objects;
create policy "CRM authenticated storage update client-evidences"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'client-evidences');

drop policy if exists "CRM authenticated storage delete client-evidences" on storage.objects;
create policy "CRM authenticated storage delete client-evidences"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'client-evidences');
```

- [ ] **Step 2: Validar sintaxe básica do SQL (contagem de blocos e palavras-chave)**

Run: `node -e "const fs = require('fs'); const s = fs.readFileSync('D:/LEONARDO/Drive/Projetos/leonardo-brasil/supabase/migrations/20261110_crm_clients_history.sql','utf8'); console.log('Tables:', (s.match(/create table if not exists/g)||[]).length, 'Policies:', (s.match(/create policy/g)||[]).length);"`
Expected: `Tables: 5 Policies: 9`

- [ ] **Step 3: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add supabase/migrations/20261110_crm_clients_history.sql
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add supabase schema and private storage migration for client history"
```

---

### Task 2: Tipos de Domínio & Motor Determinístico de Evolução (`clientTypes.ts` + `clientAnalytics.ts`)

**Files:**
- Create: `src/pages/crm/clientTypes.ts`
- Create: `src/pages/crm/utils/clientAnalytics.ts`
- Test: `server/crm-client-analytics.test.mjs`

**Interfaces:**
- Produces:
  - Todos os tipos em `src/pages/crm/clientTypes.ts`: `ClientAccount`, `ClientServicesScope`, `ClientChecklistItem`, `ClientSnapshot`, `ClientChangeLog`, `ClientEvidence`, `ClientTrendStatus`, `MetricDelta`, `ClientComparisonSummary`.
  - Funções em `src/pages/crm/utils/clientAnalytics.ts`: `sortSnapshotsChronological(snapshots)`, `findBaselineSnapshot(snapshots)`, `computeMetricDelta(currentVal, referenceVal, direction)`, `classifySnapshotStatus(currentSnapshot, previousSnapshot, scope)`, `computeChecklistProgress(items)`, `buildClientComparisonSummary(snapshots, checklistItems, scope)`.

- [ ] **Step 1: Criar `src/pages/crm/clientTypes.ts` com todos os contratos tipados**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\clientTypes.ts`:

```typescript
export type ClientStatus = "onboarding" | "ativo" | "pausado" | "encerrado";
export type ClientPillar = "gbp" | "website" | "google_ads";
export type WebsiteMode = "novo" | "redesign" | "manutencao" | "nenhum";

export interface ClientServicesScope {
  gbp: boolean;
  google_ads: boolean;
  website: boolean;
  website_mode: WebsiteMode;
}

export interface ClientExternalIds {
  gbpMapsUrl?: string;
  gbpReviewUrl?: string;
  websiteDomain?: string;
  websiteVersionLabel?: string;
  monitoredPaths?: string[];
  adsAccountIds?: string[];
}

export interface ClientContractMeta {
  planLabel?: string;
  setupFeeBrl?: number;
  monthlyFeeBrl?: number;
  paymentNotes?: string;
  privateNotes?: string;
}

export interface ClientAccount {
  id: string;
  slug: string;
  lead_id?: string | null;
  name: string;
  segment: string;
  city: string;
  neighborhood?: string | null;
  address?: string | null;
  whatsapp?: string | null;
  owner_name?: string | null;
  owner_email?: string | null;
  status: ClientStatus;
  services_scope: ClientServicesScope;
  external_ids: ClientExternalIds;
  contract_meta: ClientContractMeta;
  started_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type ChecklistBeforeStatus = "ausente" | "incompleto" | "incorreto" | "ok" | "na";
export type ChecklistCurrentStatus = "pendente" | "em_andamento" | "otimizado" | "nao_aplicavel";
export type ImpactLevel = "alta" | "media" | "baixa";

export interface ClientChecklistItem {
  id: string;
  client_id: string;
  pillar: ClientPillar;
  item_key: string;
  category_label: string;
  title: string;
  impact_level: ImpactLevel;
  before_status: ChecklistBeforeStatus;
  before_value?: string | null;
  current_status: ChecklistCurrentStatus;
  current_value?: string | null;
  sort_order: number;
  updated_at: string;
  completed_at?: string | null;
}

export interface GbpMetricsSnapshot {
  viewsTotal?: number;
  viewsSearch?: number;
  viewsMaps?: number;
  interactionsTotal?: number;
  calls?: number;
  routes?: number;
  siteClicks?: number;
  chatClicks?: number;
  bookings?: number;
  rating?: number;
  reviewCount?: number;
  photosCount?: number;
  profileStrengthPct?: number;
  targetKeyword?: string;
  targetKeywordRank?: number;
  periodNotes?: string;
}

export interface AdsMetricsSnapshot {
  activeAccountId?: string;
  legacyAccountsCount?: number;
  impressions?: number;
  clicks?: number;
  ctrPct?: number;
  cpcAvgBrl?: number;
  spendBrl?: number;
  conversions?: number;
  costPerConversionBrl?: number;
  activeCampaignsCount?: number;
  statusLabel?: string;
}

export interface SiteMetricsSnapshot {
  versionLabel?: string;
  targetUrl?: string;
  httpOkCount?: number;
  brokenUrlsCount?: number;
  brokenPaths?: string[];
  hasSsl?: boolean;
  hasWhatsappCta?: boolean;
  pagespeedMobile?: number;
  pagespeedDesktop?: number;
  whatsappClicks?: number;
  organicClicksGsc?: number;
}

export type SnapshotType = "baseline_historico" | "mensal";
export type SnapshotSource = "agente_browser" | "google_ads_api" | "site_probe" | "hibrido" | "manual";
export type ClientTrendStatus = "baseline" | "avanco" | "estavel" | "retrocesso";

export interface ClientSnapshot {
  id: string;
  client_id: string;
  period_key: string;
  period_label: string;
  snapshot_type: SnapshotType;
  is_baseline: boolean;
  source: SnapshotSource;
  gbp_metrics: GbpMetricsSnapshot;
  ads_metrics: AdsMetricsSnapshot;
  site_metrics: SiteMetricsSnapshot;
  overall_status: ClientTrendStatus;
  executive_summary?: string | null;
  collection_warnings: string[];
  recorded_at: string;
}

export type ChangeLogPillar = ClientPillar | "reputacao";
export type ChangeLogActionType =
  | "auditoria_inicial"
  | "implementacao"
  | "correcao"
  | "versao_site"
  | "campanha_ads"
  | "monitoramento";

export interface ClientChangeLog {
  id: string;
  client_id: string;
  occurred_at: string;
  pillar: ChangeLogPillar;
  action_type: ChangeLogActionType;
  title: string;
  before_state?: string | null;
  after_state?: string | null;
  automation_source: "antigravity" | "script_cron" | "manual";
  visible_to_client: boolean;
  external_ref?: string | null;
}

export type EvidencePhase = "antes" | "depois" | "mensal";

export interface ClientEvidence {
  id: string;
  client_id: string;
  pillar: ClientPillar;
  phase: EvidencePhase;
  period_key?: string | null;
  pair_key?: string | null;
  title: string;
  caption?: string | null;
  storage_path: string;
  signedUrl?: string | null;
  created_at: string;
}

export interface ClientFullBundle {
  client: ClientAccount;
  checklist: ClientChecklistItem[];
  snapshots: ClientSnapshot[];
  changeLogs: ClientChangeLog[];
  evidences: ClientEvidence[];
}

export type MetricDirection = "up" | "down";
export type MetricOutcome = "melhora" | "neutro" | "piora";

export interface MetricDelta {
  current: number | null;
  reference: number | null;
  absoluteDiff: number | null;
  percentDiff: number | null;
  direction: MetricDirection;
  outcome: MetricOutcome;
}

export interface ChecklistProgressSummary {
  total: number;
  applicable: number;
  optimized: number;
  inProgress: number;
  pending: number;
  completionPct: number;
}

export interface ClientComparisonSummary {
  orderedSnapshots: ClientSnapshot[];
  baselineSnapshot: ClientSnapshot | null;
  previousSnapshot: ClientSnapshot | null;
  latestSnapshot: ClientSnapshot | null;
  checklistProgress: ChecklistProgressSummary;
  latestComputedStatus: ClientTrendStatus;
  deltasVsPrevious: Record<string, MetricDelta>;
  deltasVsBaseline: Record<string, MetricDelta>;
}

export type WhatsAppReportStyle = "marco_zero" | "mensal";
```

- [ ] **Step 2: Escrever o teste unitário falhando para `clientAnalytics.ts`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-client-analytics.test.mjs`:

```javascript
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = await readFile(new URL('../src/pages/crm/utils/clientAnalytics.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext }
}).outputText;
const analytics = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('computeMetricDelta respects direction (up vs down) and tolerance threshold', () => {
  const upGain = analytics.computeMetricDelta(260, 200, 'up');
  assert.equal(upGain.absoluteDiff, 60);
  assert.equal(upGain.percentDiff, 30);
  assert.equal(upGain.outcome, 'melhora');

  // Ranking improvement: 5th -> 2nd position is a positive improvement when direction='down'
  const rankGain = analytics.computeMetricDelta(2, 5, 'down');
  assert.equal(rankGain.absoluteDiff, -3);
  assert.equal(rankGain.outcome, 'melhora');

  // Regression in broken links: 0 -> 2 is worse when direction='down'
  const brokenRegression = analytics.computeMetricDelta(2, 0, 'down');
  assert.equal(brokenRegression.outcome, 'piora');

  // Minor fluctuation within +-4% stays neutral
  const noise = analytics.computeMetricDelta(102, 100, 'up');
  assert.equal(noise.outcome, 'neutro');
});

test('sortSnapshotsChronological places baseline_historico before mensal in same period', () => {
  const sorted = analytics.sortSnapshotsChronological([
    { id: '2', period_key: '2026-11', snapshot_type: 'mensal', is_baseline: false },
    { id: '1', period_key: '2026-11', snapshot_type: 'baseline_historico', is_baseline: true },
    { id: '0', period_key: '2026-10', snapshot_type: 'baseline_historico', is_baseline: false }
  ]);
  assert.deepEqual(sorted.map((s) => s.id), ['0', '1', '2']);
});

test('classifySnapshotStatus detects avanco, retrocesso and baseline cleanly', () => {
  const scope = { gbp: true, google_ads: true, website: true, website_mode: 'redesign' };
  const base = {
    id: 'b',
    period_key: '2026-11',
    snapshot_type: 'baseline_historico',
    is_baseline: true,
    gbp_metrics: { viewsTotal: 1900, interactionsTotal: 220, rating: 4.1, reviewCount: 267, targetKeywordRank: 6 },
    ads_metrics: { clicks: 100, conversions: 10, costPerConversionBrl: 40 },
    site_metrics: { brokenUrlsCount: 1, pagespeedMobile: 62 }
  };
  assert.equal(analytics.classifySnapshotStatus(base, null, scope), 'baseline');

  const improved = {
    id: 'm1',
    period_key: '2026-12',
    snapshot_type: 'mensal',
    is_baseline: false,
    gbp_metrics: { viewsTotal: 2500, interactionsTotal: 310, rating: 4.3, reviewCount: 295, targetKeywordRank: 2 },
    ads_metrics: { clicks: 140, conversions: 16, costPerConversionBrl: 31 },
    site_metrics: { brokenUrlsCount: 0, pagespeedMobile: 92 }
  };
  assert.equal(analytics.classifySnapshotStatus(improved, base, scope), 'avanco');

  const regressed = {
    id: 'm2',
    period_key: '2026-12',
    snapshot_type: 'mensal',
    is_baseline: false,
    gbp_metrics: { viewsTotal: 1200, interactionsTotal: 140, rating: 4.0, reviewCount: 267, targetKeywordRank: 9 },
    ads_metrics: { clicks: 80, conversions: 4, costPerConversionBrl: 65 },
    site_metrics: { brokenUrlsCount: 3, pagespeedMobile: 48 }
  };
  assert.equal(analytics.classifySnapshotStatus(regressed, base, scope), 'retrocesso');
});

test('computeChecklistProgress excludes nao_aplicavel from denominator', () => {
  const progress = analytics.computeChecklistProgress([
    { current_status: 'otimizado' },
    { current_status: 'otimizado' },
    { current_status: 'em_andamento' },
    { current_status: 'pendente' },
    { current_status: 'nao_aplicavel' }
  ]);
  assert.deepEqual(progress, {
    total: 5,
    applicable: 4,
    optimized: 2,
    inProgress: 1,
    pending: 1,
    completionPct: 50
  });
});
```

- [ ] **Step 3: Executar teste para confirmar que falha por módulo inexistente**

Run: `node --test "D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-client-analytics.test.mjs"`
Expected: FAIL (`ENOENT: no such file or directory, open '...clientAnalytics.ts'`)

- [ ] **Step 4: Implementar `src/pages/crm/utils/clientAnalytics.ts`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\utils\clientAnalytics.ts`:

```typescript
import type {
  ChecklistProgressSummary,
  ClientChecklistItem,
  ClientComparisonSummary,
  ClientServicesScope,
  ClientSnapshot,
  ClientTrendStatus,
  MetricDelta,
  MetricDirection,
  MetricOutcome,
} from "../clientTypes";

const NEUTRAL_PERCENT_TOLERANCE = 5;

function toFiniteNumber(val: unknown): number | null {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  return null;
}

export function sortSnapshotsChronological<
  T extends Pick<ClientSnapshot, "period_key" | "snapshot_type" | "is_baseline">,
>(snapshots: T[]): T[] {
  return [...snapshots].sort((a, b) => {
    const keyCmp = a.period_key.localeCompare(b.period_key);
    if (keyCmp !== 0) return keyCmp;
    if (a.snapshot_type !== b.snapshot_type) {
      return a.snapshot_type === "baseline_historico" ? -1 : 1;
    }
    if (a.is_baseline !== b.is_baseline) {
      return a.is_baseline ? -1 : 1;
    }
    return 0;
  });
}

export function findBaselineSnapshot(snapshots: ClientSnapshot[]): ClientSnapshot | null {
  const ordered = sortSnapshotsChronological(snapshots);
  const explicit = ordered.find((s) => s.is_baseline);
  if (explicit) return explicit;
  return ordered[0] ?? null;
}

export function computeMetricDelta(
  currentRaw: number | null | undefined,
  referenceRaw: number | null | undefined,
  direction: MetricDirection = "up",
): MetricDelta {
  const current = toFiniteNumber(currentRaw);
  const reference = toFiniteNumber(referenceRaw);

  if (current === null || reference === null) {
    return {
      current,
      reference,
      absoluteDiff: null,
      percentDiff: null,
      direction,
      outcome: "neutro",
    };
  }

  const absoluteDiff = Number((current - reference).toFixed(2));
  const percentDiff =
    reference === 0
      ? current === 0
        ? 0
        : null
      : Number((((current - reference) / Math.abs(reference)) * 100).toFixed(1));

  let outcome: MetricOutcome = "neutro";

  if (direction === "up") {
    if (percentDiff !== null) {
      if (percentDiff >= NEUTRAL_PERCENT_TOLERANCE) outcome = "melhora";
      else if (percentDiff <= -NEUTRAL_PERCENT_TOLERANCE) outcome = "piora";
    } else if (absoluteDiff > 0) {
      outcome = "melhora";
    } else if (absoluteDiff < 0) {
      outcome = "piora";
    }
  } else {
    // Lower is better (e.g. Maps rank #5 -> #2, broken URLs 2 -> 0, CPA 50 -> 30)
    if (absoluteDiff === 0) {
      outcome = "neutro";
    } else if (percentDiff !== null) {
      if (percentDiff <= -NEUTRAL_PERCENT_TOLERANCE || (reference <= 10 && absoluteDiff <= -1)) {
        outcome = "melhora";
      } else if (percentDiff >= NEUTRAL_PERCENT_TOLERANCE || (reference <= 10 && absoluteDiff >= 1)) {
        outcome = "piora";
      }
    } else if (reference === 0 && current > 0) {
      outcome = "piora";
    }
  }

  return {
    current,
    reference,
    absoluteDiff,
    percentDiff,
    direction,
    outcome,
  };
}

export function extractSnapshotMetricMap(
  current: ClientSnapshot,
  reference: ClientSnapshot | null,
  scope: ClientServicesScope,
): Record<string, MetricDelta> {
  const map: Record<string, MetricDelta> = {};

  if (scope.gbp) {
    const cG = current.gbp_metrics || {};
    const rG = reference?.gbp_metrics || {};
    map.gbp_views = computeMetricDelta(cG.viewsTotal, rG.viewsTotal, "up");
    map.gbp_interactions = computeMetricDelta(cG.interactionsTotal, rG.interactionsTotal, "up");
    map.gbp_calls = computeMetricDelta(cG.calls, rG.calls, "up");
    map.gbp_routes = computeMetricDelta(cG.routes, rG.routes, "up");
    map.gbp_site_clicks = computeMetricDelta(cG.siteClicks, rG.siteClicks, "up");
    map.gbp_rating = computeMetricDelta(cG.rating, rG.rating, "up");
    map.gbp_reviews = computeMetricDelta(cG.reviewCount, rG.reviewCount, "up");
    map.gbp_profile_strength = computeMetricDelta(cG.profileStrengthPct, rG.profileStrengthPct, "up");
    map.gbp_rank = computeMetricDelta(cG.targetKeywordRank, rG.targetKeywordRank, "down");
  }

  if (scope.google_ads) {
    const cA = current.ads_metrics || {};
    const rA = reference?.ads_metrics || {};
    map.ads_impressions = computeMetricDelta(cA.impressions, rA.impressions, "up");
    map.ads_clicks = computeMetricDelta(cA.clicks, rA.clicks, "up");
    map.ads_conversions = computeMetricDelta(cA.conversions, rA.conversions, "up");
    map.ads_spend = computeMetricDelta(cA.spendBrl, rA.spendBrl, "up");
    map.ads_cpa = computeMetricDelta(cA.costPerConversionBrl, rA.costPerConversionBrl, "down");
  }

  if (scope.website) {
    const cS = current.site_metrics || {};
    const rS = reference?.site_metrics || {};
    map.site_broken_urls = computeMetricDelta(cS.brokenUrlsCount, rS.brokenUrlsCount, "down");
    map.site_pagespeed_mobile = computeMetricDelta(cS.pagespeedMobile, rS.pagespeedMobile, "up");
    map.site_whatsapp_clicks = computeMetricDelta(cS.whatsappClicks, rS.whatsappClicks, "up");
  }

  return map;
}

export function classifySnapshotStatus(
  current: ClientSnapshot,
  previous: ClientSnapshot | null,
  scope: ClientServicesScope,
): ClientTrendStatus {
  if (current.is_baseline || !previous) {
    return current.is_baseline ? "baseline" : "estavel";
  }

  const deltas = extractSnapshotMetricMap(current, previous, scope);
  const keySignals = [
    deltas.gbp_views,
    deltas.gbp_interactions,
    deltas.gbp_rating,
    deltas.gbp_rank,
    deltas.ads_conversions,
    deltas.ads_clicks,
    deltas.site_broken_urls,
    deltas.site_pagespeed_mobile,
  ].filter((d): d is MetricDelta => Boolean(d && d.current !== null && d.reference !== null));

  if (keySignals.length === 0) return "estavel";

  let improvements = 0;
  let regressions = 0;
  let criticalRegression = false;

  for (const delta of keySignals) {
    if (delta.outcome === "melhora") improvements += 1;
    if (delta.outcome === "piora") {
      regressions += 1;
      if (delta.percentDiff !== null && Math.abs(delta.percentDiff) >= 10) {
        criticalRegression = true;
      }
    }
  }

  if (deltas.site_broken_urls?.outcome === "piora") {
    criticalRegression = true;
  }

  if (regressions > improvements || (criticalRegression && improvements === 0)) {
    return "retrocesso";
  }
  if (improvements > regressions && improvements >= 1) {
    return "avanco";
  }
  return "estavel";
}

export function computeChecklistProgress(
  items: Pick<ClientChecklistItem, "current_status">[],
): ChecklistProgressSummary {
  const total = items.length;
  const applicableItems = items.filter((item) => item.current_status !== "nao_aplicavel");
  const applicable = applicableItems.length;
  const optimized = applicableItems.filter((item) => item.current_status === "otimizado").length;
  const inProgress = applicableItems.filter((item) => item.current_status === "em_andamento").length;
  const pending = applicableItems.filter((item) => item.current_status === "pendente").length;
  const completionPct = applicable > 0 ? Math.round((optimized / applicable) * 100) : 0;

  return { total, applicable, optimized, inProgress, pending, completionPct };
}

export function buildClientComparisonSummary(
  snapshots: ClientSnapshot[],
  checklistItems: ClientChecklistItem[],
  scope: ClientServicesScope,
  selectedPeriodKey?: string,
): ClientComparisonSummary {
  const orderedSnapshots = sortSnapshotsChronological(snapshots);
  const baselineSnapshot = findBaselineSnapshot(orderedSnapshots);

  let latestIdx = orderedSnapshots.length - 1;
  if (selectedPeriodKey && orderedSnapshots.length > 0) {
    const matchedIdx = [...orderedSnapshots]
      .reverse()
      .findIndex((s) => s.period_key === selectedPeriodKey);
    if (matchedIdx >= 0) {
      latestIdx = orderedSnapshots.length - 1 - matchedIdx;
    }
  }

  const latestSnapshot = latestIdx >= 0 ? orderedSnapshots[latestIdx] : null;
  const previousSnapshot = latestIdx >= 1 ? orderedSnapshots[latestIdx - 1] : null;
  const checklistProgress = computeChecklistProgress(checklistItems);

  const latestComputedStatus = latestSnapshot
    ? classifySnapshotStatus(latestSnapshot, previousSnapshot, scope)
    : "estavel";

  const deltasVsPrevious = latestSnapshot
    ? extractSnapshotMetricMap(latestSnapshot, previousSnapshot, scope)
    : {};

  const deltasVsBaseline = latestSnapshot
    ? extractSnapshotMetricMap(
        latestSnapshot,
        baselineSnapshot && baselineSnapshot.id !== latestSnapshot.id ? baselineSnapshot : null,
        scope,
      )
    : {};

  return {
    orderedSnapshots,
    baselineSnapshot,
    previousSnapshot,
    latestSnapshot,
    checklistProgress,
    latestComputedStatus,
    deltasVsPrevious,
    deltasVsBaseline,
  };
}
```

- [ ] **Step 5: Executar os testes unitários do motor analítico e checar `typecheck`**

Run: `node --test "D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-client-analytics.test.mjs"`
Expected: `4/4 passing`

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run typecheck`
Expected: Exits cleanly with 0 errors.

- [ ] **Step 6: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add src/pages/crm/clientTypes.ts src/pages/crm/utils/clientAnalytics.ts server/crm-client-analytics.test.mjs
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add client history types and deterministic analytics engine"
```

---

### Task 3: Formatador de Relatório WhatsApp (`whatsappReportFormatter.ts`)

**Files:**
- Create: `src/pages/crm/utils/whatsappReportFormatter.ts`
- Test: `server/crm-whatsapp-report.test.mjs`

**Interfaces:**
- Consumes: `ClientAccount`, `ClientSnapshot`, `ClientChecklistItem`, `ClientChangeLog`, `WhatsAppReportStyle`, `buildClientComparisonSummary` (`./clientAnalytics`).
- Produces: `sanitizeWhatsAppPhone(phone)`, `buildWhatsAppUniversalUrl(phone, text)`, `formatClientWhatsAppReport({ client, snapshots, checklist, changeLogs, style, targetPeriodKey })`.

- [ ] **Step 1: Escrever o teste unitário falhando para o formatador WhatsApp**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-whatsapp-report.test.mjs`:

```javascript
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import test from 'node:test';
import assert from 'node:assert/strict';

const analyticsSrc = await readFile(new URL('../src/pages/crm/utils/clientAnalytics.ts', import.meta.url), 'utf8');
const formatterSrc = await readFile(new URL('../src/pages/crm/utils/whatsappReportFormatter.ts', import.meta.url), 'utf8');

// Replace local relative TS import with injected module in test sandbox
const combinedSrc = `${analyticsSrc}\n${formatterSrc.replace(/import\s+\{[^}]+\}\s+from\s+["']\.\/clientAnalytics["'];/, '')}`;
const compiled = ts.transpileModule(combinedSrc, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext }
}).outputText;
const mod = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const baseClient = {
  id: 'c1',
  slug: 'angelo-car',
  name: 'Ângelo Car',
  segment: 'Oficina Mecânica',
  city: 'Porto Alegre',
  neighborhood: 'Cavalhada',
  whatsapp: '(51) 98428-1009',
  owner_name: 'Ângelo',
  status: 'ativo',
  services_scope: { gbp: true, google_ads: false, website: true, website_mode: 'redesign' },
  external_ids: { websiteDomain: 'https://angelocarmecanica.com.br/' },
  contract_meta: {},
  created_at: '2026-11-10T00:00:00Z',
  updated_at: '2026-11-10T00:00:00Z'
};

test('sanitizeWhatsAppPhone adds DDI 55 and builds universal wa.me URL', () => {
  assert.equal(mod.sanitizeWhatsAppPhone('(51) 98428-1009'), '5551984281009');
  assert.equal(mod.sanitizeWhatsAppPhone('5551984281009'), '5551984281009');
  const url = mod.buildWhatsAppUniversalUrl('(51) 98428-1009', 'Olá Ângelo');
  assert.equal(url, 'https://wa.me/5551984281009?text=Ol%C3%A1%20%C3%82ngelo');
});

test('formatClientWhatsAppReport marco_zero summarizes Antes vs Depois and hides inactive services', () => {
  const report = mod.formatClientWhatsAppReport({
    client: baseClient,
    snapshots: [
      {
        id: 's1',
        client_id: 'c1',
        period_key: '2026-11',
        period_label: 'Nov/2026 (Antes)',
        snapshot_type: 'baseline_historico',
        is_baseline: true,
        source: 'agente_browser',
        gbp_metrics: { viewsTotal: 1906, interactionsTotal: 249, rating: 4.1, reviewCount: 267, profileStrengthPct: 20 },
        ads_metrics: {},
        site_metrics: { versionLabel: 'v1', brokenUrlsCount: 1 },
        overall_status: 'baseline',
        collection_warnings: [],
        recorded_at: '2026-11-10T10:00:00Z'
      }
    ],
    checklist: [
      {
        id: 'k1',
        client_id: 'c1',
        pillar: 'gbp',
        item_key: 'gbp_social_profiles',
        category_label: 'Cadastro',
        title: 'Redes sociais vinculadas no perfil',
        impact_level: 'alta',
        before_status: 'ausente',
        before_value: 'Nenhuma rede vinculada',
        current_status: 'otimizado',
        current_value: 'Instagram e Facebook vinculados',
        sort_order: 1,
        updated_at: '2026-11-10T12:00:00Z'
      },
      {
        id: 'k2',
        client_id: 'c1',
        pillar: 'website',
        item_key: 'site_404',
        category_label: 'Site',
        title: 'Correção de URL 404 /socorro-mecanico-24h',
        impact_level: 'alta',
        before_status: 'incorreto',
        before_value: 'Erro 404 ativo',
        current_status: 'pendente',
        current_value: 'Aguardando publicação do novo site',
        sort_order: 2,
        updated_at: '2026-11-10T12:00:00Z'
      }
    ],
    changeLogs: [
      {
        id: 'l1',
        client_id: 'c1',
        occurred_at: '2026-11-10T12:00:00Z',
        pillar: 'gbp',
        action_type: 'implementacao',
        title: 'Vinculados Instagram e Facebook oficiais no GBP',
        automation_source: 'antigravity',
        visible_to_client: true
      },
      {
        id: 'l2',
        client_id: 'c1',
        occurred_at: '2026-11-10T12:05:00Z',
        pillar: 'gbp',
        action_type: 'monitoramento',
        title: 'Nota interna privada da agência',
        automation_source: 'manual',
        visible_to_client: false
      }
    ],
    style: 'marco_zero'
  });

  assert.match(report, /\*Marco Zero & Evolução — Ângelo Car\*/);
  assert.match(report, /Redes sociais vinculadas no perfil/);
  assert.match(report, /Vinculados Instagram e Facebook/);
  assert.doesNotMatch(report, /Nota interna privada/);
  assert.doesNotMatch(report, /Google Ads/); // inactive service omitted
  assert.doesNotMatch(report, /\|/); // no desktop pipe tables
});

test('formatClientWhatsAppReport mensal includes MoM comparison without rank guarantees', () => {
  const report = mod.formatClientWhatsAppReport({
    client: {
      ...baseClient,
      services_scope: { gbp: true, google_ads: true, website: true, website_mode: 'redesign' }
    },
    snapshots: [
      {
        id: 's0',
        client_id: 'c1',
        period_key: '2026-10',
        period_label: 'Out/2026',
        snapshot_type: 'baseline_historico',
        is_baseline: true,
        source: 'agente_browser',
        gbp_metrics: { viewsTotal: 1900, interactionsTotal: 200, calls: 90, routes: 80, siteClicks: 30, rating: 4.1, reviewCount: 267 },
        ads_metrics: { clicks: 100, conversions: 12, spendBrl: 450 },
        site_metrics: { versionLabel: 'v1', brokenUrlsCount: 1, pagespeedMobile: 58 },
        overall_status: 'baseline',
        collection_warnings: [],
        recorded_at: '2026-11-01T10:00:00Z'
      },
      {
        id: 's1',
        client_id: 'c1',
        period_key: '2026-11',
        period_label: 'Nov/2026',
        snapshot_type: 'mensal',
        is_baseline: false,
        source: 'hibrido',
        gbp_metrics: { viewsTotal: 2470, interactionsTotal: 260, calls: 118, routes: 98, siteClicks: 44, rating: 4.3, reviewCount: 285 },
        ads_metrics: { clicks: 145, conversions: 21, spendBrl: 500 },
        site_metrics: { versionLabel: 'v2 Nova', brokenUrlsCount: 0, pagespeedMobile: 94 },
        overall_status: 'avanco',
        executive_summary: 'Novo site no ar e aumento consistente nas interações no Maps.',
        collection_warnings: [],
        recorded_at: '2026-12-01T10:00:00Z'
      }
    ],
    checklist: [],
    changeLogs: [],
    style: 'mensal',
    targetPeriodKey: '2026-11'
  });

  assert.match(report, /\*Relatório Mensal — Ângelo Car \(Nov\/2026\)\*/);
  assert.match(report, /Visualizações: \*2\.470\*/);
  assert.match(report, /\(\+30%/);
  assert.match(report, /Google Ads/);
  assert.match(report, /Site \(v2 Nova\)/);
  assert.doesNotMatch(report, /garantimos 1º lugar/i);
});
```

- [ ] **Step 2: Executar teste para confirmar que falha por módulo inexistente**

Run: `node --test "D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-whatsapp-report.test.mjs"`
Expected: FAIL (`ENOENT: no such file or directory, open '...whatsappReportFormatter.ts'`)

- [ ] **Step 3: Implementar `src/pages/crm/utils/whatsappReportFormatter.ts`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\utils\whatsappReportFormatter.ts`:

```typescript
import type {
  ClientAccount,
  ClientChangeLog,
  ClientChecklistItem,
  ClientSnapshot,
  MetricDelta,
  WhatsAppReportStyle,
} from "../clientTypes";
import { buildClientComparisonSummary } from "./clientAnalytics";

export function sanitizeWhatsAppPhone(phone?: string | null): string {
  const digits = String(phone || "").replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  return `55${digits}`;
}

export function buildWhatsAppUniversalUrl(phone: string | null | undefined, text: string): string {
  const clean = sanitizeWhatsAppPhone(phone);
  const encoded = encodeURIComponent(text);
  return clean ? `https://wa.me/${clean}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

function fmtInt(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return Math.round(value).toLocaleString("pt-BR");
}

function fmtCurrency(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDeltaTag(delta?: MetricDelta): string {
  if (!delta || delta.percentDiff === null) return "";
  const sign = delta.percentDiff > 0 ? "+" : "";
  return ` (${sign}${delta.percentDiff.toLocaleString("pt-BR")}%)`;
}

export interface FormatClientWhatsAppReportInput {
  client: ClientAccount;
  snapshots: ClientSnapshot[];
  checklist: ClientChecklistItem[];
  changeLogs: ClientChangeLog[];
  style: WhatsAppReportStyle;
  targetPeriodKey?: string;
}

export function formatClientWhatsAppReport({
  client,
  snapshots,
  checklist,
  changeLogs,
  style,
  targetPeriodKey,
}: FormatClientWhatsAppReportInput): string {
  const greetingName = client.owner_name?.trim() || client.name;
  const summary = buildClientComparisonSummary(snapshots, checklist, client.services_scope, targetPeriodKey);
  const latest = summary.latestSnapshot;
  const visibleLogs = changeLogs
    .filter((log) => log.visible_to_client)
    .slice(0, 6);

  if (style === "marco_zero") {
    const completedItems = checklist.filter((item) => item.current_status === "otimizado");
    const pendingItems = checklist.filter(
      (item) => item.current_status === "pendente" || item.current_status === "em_andamento",
    );

    const lines: string[] = [
      `Olá, *${greetingName}*! Segue o resumo transparente do trabalho na conta da *${client.name}*.`,
      "",
      `*Marco Zero & Evolução — ${client.name}*`,
      `📍 Progresso técnico: *${summary.checklistProgress.optimized} de ${summary.checklistProgress.applicable} ajustes concluídos* (${summary.checklistProgress.completionPct}%)`,
    ];

    if (latest && client.services_scope.gbp) {
      const g = latest.gbp_metrics;
      lines.push(
        "",
        "*Perfil no Google (Cenário registrado):*",
        `• Visualizações no período: *${fmtInt(g.viewsTotal)}*`,
        `• Interações (ligações, rotas, site, Whats): *${fmtInt(g.interactionsTotal)}*`,
        `• Reputação atual: *${g.rating ? g.rating.toFixed(1).replace(".", ",") : "—"}★* (${fmtInt(g.reviewCount)} avaliações)`,
      );
    }

    if (completedItems.length > 0) {
      lines.push("", "*✅ O que já ajustamos (Antes → Depois):*");
      for (const item of completedItems.slice(0, 8)) {
        lines.push(
          `• *${item.title}:* ${item.before_value || item.before_status} → ${item.current_value || "Otimizado"}`,
        );
      }
    }

    if (visibleLogs.length > 0) {
      lines.push("", "*🛠️ Últimas entregas registradas:*");
      for (const log of visibleLogs.slice(0, 4)) {
        lines.push(`• ${log.title}`);
      }
    }

    if (pendingItems.length > 0) {
      lines.push("", "*⏭️ Próximos passos em andamento:*");
      for (const item of pendingItems.slice(0, 4)) {
        lines.push(`• ${item.title}`);
      }
    }

    lines.push(
      "",
      "Seguimos acompanhando os números reais mês a mês para atrair cada vez mais motoristas/clientes qualificados da região.",
    );

    return lines.join("\n");
  }

  // Estilo mensal
  const periodTitle = latest ? `${client.name} (${latest.period_label})` : client.name;
  const statusLabel =
    summary.latestComputedStatus === "avanco"
      ? "📈 Tendência do mês: *Avanço*"
      : summary.latestComputedStatus === "retrocesso"
        ? "⚠️ Ponto de atenção: *Oscilação / Retrocesso observado*"
        : summary.latestComputedStatus === "baseline"
          ? "📌 Registro inicial (*Baseline*)"
          : "⚖️ Tendência do mês: *Estável*";

  const lines: string[] = [
    `Olá, *${greetingName}*! Segue o acompanhamento mensal de desempenho da *${client.name}*.`,
    "",
    `*Relatório Mensal — ${periodTitle}*`,
    statusLabel,
  ];

  if (latest?.executive_summary) {
    lines.push(`_${latest.executive_summary}_`);
  }

  if (latest && client.services_scope.gbp) {
    const g = latest.gbp_metrics;
    const d = summary.deltasVsPrevious;
    lines.push(
      "",
      "*📍 Google Meu Negócio (Perfil da Empresa):*",
      `• Visualizações: *${fmtInt(g.viewsTotal)}*${fmtDeltaTag(d.gbp_views)}`,
      `• Interações totais: *${fmtInt(g.interactionsTotal)}*${fmtDeltaTag(d.gbp_interactions)}`,
      `• Ligações: *${fmtInt(g.calls)}*${fmtDeltaTag(d.gbp_calls)} | Rotas: *${fmtInt(g.routes)}*${fmtDeltaTag(d.gbp_routes)}`,
      `• Nota no Google: *${g.rating ? g.rating.toFixed(1).replace(".", ",") : "—"}★* (${fmtInt(g.reviewCount)} avaliações)`,
    );
  }

  if (latest && client.services_scope.google_ads) {
    const a = latest.ads_metrics;
    const d = summary.deltasVsPrevious;
    lines.push(
      "",
      "*🎯 Google Ads:*",
      `• Impressões: *${fmtInt(a.impressions)}* | Cliques: *${fmtInt(a.clicks)}*${fmtDeltaTag(d.ads_clicks)}`,
      `• Conversões registradas: *${fmtInt(a.conversions)}*${fmtDeltaTag(d.ads_conversions)}`,
      `• Investimento: *${fmtCurrency(a.spendBrl)}*`,
    );
  }

  if (latest && client.services_scope.website) {
    const s = latest.site_metrics;
    const vLabel = s.versionLabel ? ` (${s.versionLabel})` : "";
    lines.push(
      "",
      `*🌐 Site${vLabel}:*`,
      `• Saúde das URLs: *${s.brokenUrlsCount === 0 ? "100% no ar (sem erros 404)" : `${s.brokenUrlsCount} URL(s) com atenção`}*`,
    );
    if (typeof s.pagespeedMobile === "number") {
      lines.push(`• Desempenho Mobile (PageSpeed): *${s.pagespeedMobile}/100*`);
    }
    if (typeof s.whatsappClicks === "number") {
      lines.push(`• Cliques diretos para WhatsApp no site: *${fmtInt(s.whatsappClicks)}*`);
    }
  }

  if (visibleLogs.length > 0) {
    lines.push("", "*🛠️ Melhorias e ações registradas:*");
    for (const log of visibleLogs.slice(0, 5)) {
      lines.push(`• ${log.title}`);
    }
  }

  lines.push(
    "",
    `Checklist técnico geral: *${summary.checklistProgress.optimized}/${summary.checklistProgress.applicable} itens otimizados*. Qualquer dúvida para nossa próxima revisão, me chame por aqui!`,
  );

  return lines.join("\n");
}
```

- [ ] **Step 4: Executar testes unitários do formatador WhatsApp e `typecheck`**

Run: `node --test "D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-whatsapp-report.test.mjs"`
Expected: `3/3 passing`

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run typecheck`
Expected: Exits cleanly with 0 errors.

- [ ] **Step 5: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add src/pages/crm/utils/whatsappReportFormatter.ts server/crm-whatsapp-report.test.mjs
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add whatsapp client report formatter and universal wa.me links"
```

---

### Task 4: Coletores Automáticos de Site e Google Ads (`envLoader.mjs`, `siteAuditor.mjs`, `adsMetricsCollector.mjs`)

**Files:**
- Create: `scripts/lib/envLoader.mjs`
- Create: `scripts/lib/siteAuditor.mjs`
- Create: `scripts/lib/adsMetricsCollector.mjs`
- Test: `server/crm-site-auditor.test.mjs`

**Interfaces:**
- Produces:
  - `loadEnvFile(envPath)` em `scripts/lib/envLoader.mjs`
  - `auditClientWebsite({ baseUrl, monitoredPaths, versionLabel, env, fetchImpl })` em `scripts/lib/siteAuditor.mjs` -> retorna `{ metrics: SiteMetricsSnapshot, warnings: string[], checkedUrls: Array<{ url, status, ok }> }`
  - `collectMonthlyAdsMetrics({ customerId, periodKey, env, fetchImpl })` em `scripts/lib/adsMetricsCollector.mjs` -> retorna `{ ok: boolean, metrics: AdsMetricsSnapshot | null, warning?: string }`

- [ ] **Step 1: Escrever o teste unitário falhando para o auditor automático de Site**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-site-auditor.test.mjs`:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { auditClientWebsite } from '../scripts/lib/siteAuditor.mjs';

test('auditClientWebsite detects 200 vs 404 routes, title, SSL, WhatsApp CTA and handles PageSpeed failure gracefully', async () => {
  const mockFetch = async (url) => {
    const u = String(url);
    if (u === 'https://angelocarmecanica.com.br/') {
      return new Response(
        '<html><head><title>Angelo Car</title><link rel="canonical" href="https://angelocarmecanica.com.br/" /></head><body><a href="https://wa.me/5551984281009">WhatsApp</a></body></html>',
        { status: 200, headers: { 'content-type': 'text/html' } }
      );
    }
    if (u.includes('/socorro-mecanico-24h')) {
      return new Response('Not Found', { status: 404 });
    }
    if (u.includes('pagespeedonline.googleapis.com')) {
      return new Response(JSON.stringify({ error: { message: 'Quota exceeded' } }), { status: 429 });
    }
    return new Response('OK', { status: 200 });
  };

  const result = await auditClientWebsite({
    baseUrl: 'https://angelocarmecanica.com.br',
    monitoredPaths: ['/', '/socorro-mecanico-24h'],
    versionLabel: 'v1 legado',
    fetchImpl: mockFetch,
    env: {}
  });

  assert.equal(result.metrics.versionLabel, 'v1 legado');
  assert.equal(result.metrics.hasSsl, true);
  assert.equal(result.metrics.hasWhatsappCta, true);
  assert.equal(result.metrics.httpOkCount, 1);
  assert.equal(result.metrics.brokenUrlsCount, 1);
  assert.deepEqual(result.metrics.brokenPaths, ['/socorro-mecanico-24h']);
  assert.equal(result.metrics.pagespeedMobile, undefined);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /PageSpeed/i);
});

test('auditClientWebsite extracts PageSpeed Mobile and Desktop scores when API responds 200', async () => {
  const mockFetch = async (url) => {
    const u = String(url);
    if (u.includes('strategy=mobile')) {
      return new Response(
        JSON.stringify({ lighthouseResult: { categories: { performance: { score: 0.91 } } } }),
        { status: 200 }
      );
    }
    if (u.includes('strategy=desktop')) {
      return new Response(
        JSON.stringify({ lighthouseResult: { categories: { performance: { score: 0.98 } } } }),
        { status: 200 }
      );
    }
    return new Response('<title>Site OK</title><a href="tel:51984281009">Ligar</a>', { status: 200 });
  };

  const result = await auditClientWebsite({
    baseUrl: 'https://angelocarmecanica.com.br/',
    monitoredPaths: ['/'],
    versionLabel: 'v2 novo',
    fetchImpl: mockFetch,
    env: {}
  });

  assert.equal(result.metrics.brokenUrlsCount, 0);
  assert.equal(result.metrics.pagespeedMobile, 91);
  assert.equal(result.metrics.pagespeedDesktop, 98);
  assert.equal(result.warnings.length, 0);
});
```

- [ ] **Step 2: Executar teste para confirmar que falha por módulo inexistente**

Run: `node --test "D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-site-auditor.test.mjs"`
Expected: FAIL (`Cannot find module '.../scripts/lib/siteAuditor.mjs'`)

- [ ] **Step 3: Implementar `scripts/lib/envLoader.mjs`, `scripts/lib/siteAuditor.mjs` e `scripts/lib/adsMetricsCollector.mjs`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\lib\envLoader.mjs`:

```javascript
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultEnvPath = path.resolve(__dirname, '..', '..', '.env');

export function loadEnvFile(envPath = defaultEnvPath, targetEnv = process.env) {
  if (!existsSync(envPath)) return targetEnv;

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!targetEnv[key]) {
        targetEnv[key] = val;
      }
    }
  }
  return targetEnv;
}
```

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\lib\siteAuditor.mjs`:

```javascript
const DEFAULT_TIMEOUT_MS = 8000;

async function fetchWithTimeout(fetchImpl, url, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'LeonardoBrasil-SiteAuditor/1.0 (+https://leonardobrasil.com.br)'
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchPageSpeedScore({ fetchImpl, targetUrl, strategy, apiKey }) {
  const params = new URLSearchParams({
    url: targetUrl,
    strategy,
    category: 'performance'
  });
  if (apiKey) params.set('key', apiKey);

  const response = await fetchWithTimeout(
    fetchImpl,
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
    15000
  );
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  const rawScore = data?.lighthouseResult?.categories?.performance?.score;
  if (typeof rawScore !== 'number') {
    throw new Error('Score ausente na resposta');
  }
  return Math.round(rawScore * 100);
}

export async function auditClientWebsite({
  baseUrl,
  monitoredPaths = ['/'],
  versionLabel = '',
  env = process.env,
  fetchImpl = fetch,
  skipPageSpeed = false
}) {
  const normalizedBase = String(baseUrl || '').trim().replace(/\/+$/, '');
  if (!normalizedBase) {
    return {
      metrics: { versionLabel, brokenUrlsCount: 0, httpOkCount: 0 },
      warnings: ['URL do site não configurada para auditoria automática.'],
      checkedUrls: []
    };
  }

  const paths = Array.from(
    new Set(
      (monitoredPaths.length ? monitoredPaths : ['/']).map((p) =>
        p.startsWith('/') ? p : `/${p}`
      )
    )
  );

  const checkedUrls = [];
  const brokenPaths = [];
  let httpOkCount = 0;
  let hasWhatsappCta = false;
  let homeTitleFound = false;

  for (const routePath of paths) {
    const fullUrl = routePath === '/' ? `${normalizedBase}/` : `${normalizedBase}${routePath}`;
    try {
      const res = await fetchWithTimeout(fetchImpl, fullUrl);
      const ok = res.status >= 200 && res.status < 400;
      checkedUrls.push({ url: fullUrl, path: routePath, status: res.status, ok });
      if (ok) {
        httpOkCount += 1;
        if (routePath === '/') {
          const html = await res.text();
          homeTitleFound = /<title>[^<]+<\/title>/i.test(html);
          hasWhatsappCta = /(wa\.me\/|api\.whatsapp\.com|whatsapp)/i.test(html);
        }
      } else {
        brokenPaths.push(routePath);
      }
    } catch (error) {
      checkedUrls.push({ url: fullUrl, path: routePath, status: 0, ok: false, error: error.message });
      brokenPaths.push(routePath);
    }
  }

  const warnings = [];
  if (!homeTitleFound && httpOkCount > 0) {
    warnings.push('Home sem tag <title> detectada na resposta HTML.');
  }

  let pagespeedMobile;
  let pagespeedDesktop;

  if (!skipPageSpeed) {
    const apiKey = env.PAGESPEED_API_KEY?.trim() || '';
    try {
      pagespeedMobile = await fetchPageSpeedScore({
        fetchImpl,
        targetUrl: `${normalizedBase}/`,
        strategy: 'mobile',
        apiKey
      });
    } catch (err) {
      warnings.push(`PageSpeed Mobile indisponível (${err.message}).`);
    }

    try {
      pagespeedDesktop = await fetchPageSpeedScore({
        fetchImpl,
        targetUrl: `${normalizedBase}/`,
        strategy: 'desktop',
        apiKey
      });
    } catch (err) {
      warnings.push(`PageSpeed Desktop indisponível (${err.message}).`);
    }
  }

  const metrics = {
    ...(versionLabel ? { versionLabel } : {}),
    targetUrl: `${normalizedBase}/`,
    httpOkCount,
    brokenUrlsCount: brokenPaths.length,
    brokenPaths,
    hasSsl: normalizedBase.startsWith('https://'),
    hasWhatsappCta,
    ...(typeof pagespeedMobile === 'number' ? { pagespeedMobile } : {}),
    ...(typeof pagespeedDesktop === 'number' ? { pagespeedDesktop } : {})
  };

  return { metrics, warnings, checkedUrls };
}
```

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\lib\adsMetricsCollector.mjs`:

```javascript
import { getAdsIntegrationStatus, sanitizeCustomerId } from '../../server/google-ads-keywords.mjs';

function buildMonthDateRange(periodKey) {
  const match = /^(\d{4})-(\d{2})$/.exec(String(periodKey || '').trim());
  if (!match) {
    throw new Error(`periodKey inválido para consulta Ads: ${periodKey}`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const startDate = `${match[1]}-${match[2]}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${match[1]}-${match[2]}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
}

async function fetchAdsAccessToken({ env, fetchImpl }) {
  const response = await fetchImpl('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_ADS_CLIENT_ID.trim(),
      client_secret: env.GOOGLE_ADS_CLIENT_SECRET.trim(),
      refresh_token: env.GOOGLE_ADS_REFRESH_TOKEN.trim(),
      grant_type: 'refresh_token'
    }).toString()
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Falha OAuth2 Google Ads.');
  }
  return data.access_token;
}

export async function collectMonthlyAdsMetrics({
  customerId,
  periodKey,
  env = process.env,
  fetchImpl = fetch
}) {
  const cleanId = sanitizeCustomerId(customerId);
  if (!cleanId) {
    return { ok: false, metrics: null, warning: 'Customer ID Google Ads não informado para o cliente.' };
  }

  const status = getAdsIntegrationStatus({ ...env, GOOGLE_ADS_CUSTOMER_ID: cleanId });
  if (!status.ready) {
    return {
      ok: false,
      metrics: null,
      warning: 'Credenciais Google Ads API (OAuth/Developer Token) ainda não completas no .env; usando métricas do agente/manual.'
    };
  }

  try {
    const { startDate, endDate } = buildMonthDateRange(periodKey);
    const accessToken = await fetchAdsAccessToken({ env, fetchImpl });
    const loginCustomerId = sanitizeCustomerId(env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || cleanId);

    const query = `
      SELECT
        campaign.id,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    `;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'developer-token': env.GOOGLE_ADS_DEVELOPER_TOKEN.trim(),
      'Content-Type': 'application/json'
    };
    if (loginCustomerId) headers['login-customer-id'] = loginCustomerId;

    const res = await fetchImpl(
      `https://googleads.googleapis.com/v18/customers/${cleanId}/googleAds:search`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ query })
      }
    );

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error?.message || `Google Ads HTTP ${res.status}`);
    }

    const rows = Array.isArray(json.results) ? json.results : [];
    let impressions = 0;
    let clicks = 0;
    let costMicros = 0;
    let conversions = 0;
    const activeCampaignIds = new Set();

    for (const row of rows) {
      const m = row.metrics || {};
      impressions += Number(m.impressions || 0);
      clicks += Number(m.clicks || 0);
      costMicros += Number(m.costMicros || 0);
      conversions += Number(m.conversions || 0);
      if (row.campaign?.status === 'ENABLED' && row.campaign?.id) {
        activeCampaignIds.add(String(row.campaign.id));
      }
    }

    const spendBrl = Number((costMicros / 1_000_000).toFixed(2));
    const ctrPct = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
    const cpcAvgBrl = clicks > 0 ? Number((spendBrl / clicks).toFixed(2)) : 0;
    const costPerConversionBrl = conversions > 0 ? Number((spendBrl / conversions).toFixed(2)) : 0;

    return {
      ok: true,
      metrics: {
        activeAccountId: cleanId,
        impressions,
        clicks,
        ctrPct,
        cpcAvgBrl,
        spendBrl,
        conversions: Number(conversions.toFixed(1)),
        costPerConversionBrl,
        activeCampaignsCount: activeCampaignIds.size,
        statusLabel: 'Sincronizado via Google Ads API'
      }
    };
  } catch (error) {
    return {
      ok: false,
      metrics: null,
      warning: `Google Ads API fallback (${error.message})`
    };
  }
}
```

- [ ] **Step 4: Executar testes unitários do auditor de site**

Run: `node --test "D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-site-auditor.test.mjs"`
Expected: `2/2 passing`

- [ ] **Step 5: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add scripts/lib/envLoader.mjs scripts/lib/siteAuditor.mjs scripts/lib/adsMetricsCollector.mjs server/crm-site-auditor.test.mjs
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add automated website health auditor and google ads metrics collector"
```

---

### Task 5: Pipeline CLI Idempotente (`crmSyncCore.mjs` + `crm-client-sync.mjs`)

**Files:**
- Create: `scripts/lib/crmSyncCore.mjs`
- Create: `scripts/crm-client-sync.mjs`
- Test: `server/crm-client-sync.test.mjs`

**Interfaces:**
- Consumes: `auditClientWebsite` (`./siteAuditor.mjs`), `collectMonthlyAdsMetrics` (`./adsMetricsCollector.mjs`), `loadEnvFile` (`./envLoader.mjs`), `@supabase/supabase-js`.
- Produces: `prepareChecklistUpsertRows(clientId, existingRows, incomingItems, forceBaseline)`, `buildStorageObjectPath(slug, phase, filePath)`, CLI `node scripts/crm-client-sync.mjs --file <payload.json> [--audit-site] [--sync-ads] [--force-baseline] [--dry-run]`.

- [ ] **Step 1: Escrever teste unitário falhando validando preservação do "Antes" e caminhos no Storage**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-client-sync.test.mjs`:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStorageObjectPath, prepareChecklistUpsertRows } from '../scripts/lib/crmSyncCore.mjs';

test('prepareChecklistUpsertRows NEVER overwrites before_status or before_value without forceBaseline', () => {
  const existing = [
    {
      client_id: 'uuid-1',
      item_key: 'gbp_social_profiles',
      pillar: 'gbp',
      category_label: 'Cadastro',
      title: 'Perfis de redes sociais',
      before_status: 'ausente',
      before_value: '0 redes vinculadas',
      current_status: 'pendente',
      current_value: null,
      sort_order: 1
    }
  ];

  const incoming = [
    {
      item_key: 'gbp_social_profiles',
      pillar: 'gbp',
      category_label: 'Cadastro',
      title: 'Perfis de redes sociais',
      before_status: 'ok', // must be ignored unless forceBaseline = true
      before_value: 'Tentativa indevida',
      current_status: 'otimizado',
      current_value: 'Instagram + Facebook vinculados',
      sort_order: 1
    }
  ];

  const merged = prepareChecklistUpsertRows('uuid-1', existing, incoming, false, '2026-11-10T15:00:00.000Z');
  assert.equal(merged.length, 1);
  assert.equal(merged[0].before_status, 'ausente');
  assert.equal(merged[0].before_value, '0 redes vinculadas');
  assert.equal(merged[0].current_status, 'otimizado');
  assert.equal(merged[0].current_value, 'Instagram + Facebook vinculados');
  assert.equal(merged[0].completed_at, '2026-11-10T15:00:00.000Z');
});

test('prepareChecklistUpsertRows allows before_* override only with forceBaseline = true', () => {
  const existing = [
    {
      client_id: 'uuid-1',
      item_key: 'site_404',
      pillar: 'website',
      before_status: 'incompleto',
      before_value: 'Antigo',
      current_status: 'pendente'
    }
  ];
  const incoming = [
    {
      item_key: 'site_404',
      pillar: 'website',
      category_label: 'Site',
      title: 'Corrigir 404',
      before_status: 'incorreto',
      before_value: 'URL /socorro-mecanico-24h 404',
      current_status: 'pendente'
    }
  ];

  const forced = prepareChecklistUpsertRows('uuid-1', existing, incoming, true, '2026-11-10T15:00:00.000Z');
  assert.equal(forced[0].before_status, 'incorreto');
  assert.equal(forced[0].before_value, 'URL /socorro-mecanico-24h 404');
});

test('buildStorageObjectPath normalizes filenames deterministically for idempotent upload', () => {
  const p = buildStorageObjectPath('angelo-car', 'antes', 'C:\\tmp\\evidencia-fotos-capa-logo.png');
  assert.equal(p, 'angelo-car/antes-evidencia-fotos-capa-logo.png');
});
```

- [ ] **Step 2: Executar teste para confirmar que falha**

Run: `node --test "D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-client-sync.test.mjs"`
Expected: FAIL (`Cannot find module '.../scripts/lib/crmSyncCore.mjs'`)

- [ ] **Step 3: Implementar `scripts/lib/crmSyncCore.mjs` e `scripts/crm-client-sync.mjs`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\lib\crmSyncCore.mjs`:

```javascript
import path from 'node:path';

export function buildStorageObjectPath(slug, phase, filePath) {
  const baseName = path.basename(String(filePath || 'evidencia.png'))
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-');
  const cleanSlug = String(slug || 'cliente').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  const cleanPhase = String(phase || 'antes').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  return `${cleanSlug}/${cleanPhase}-${baseName}`;
}

export function prepareChecklistUpsertRows(
  clientId,
  existingRows = [],
  incomingItems = [],
  forceBaseline = false,
  nowIso = new Date().toISOString()
) {
  const existingMap = new Map(existingRows.map((row) => [row.item_key, row]));

  return incomingItems.map((item, idx) => {
    const existing = existingMap.get(item.item_key);
    const keepBefore = Boolean(existing) && !forceBaseline;

    const currentStatus = item.current_status || (existing ? existing.current_status : 'pendente');
    let completedAt = existing?.completed_at || null;
    if (currentStatus === 'otimizado' && !completedAt) {
      completedAt = item.completed_at || nowIso;
    } else if (currentStatus !== 'otimizado') {
      completedAt = null;
    }

    return {
      client_id: clientId,
      pillar: item.pillar || existing?.pillar || 'gbp',
      item_key: item.item_key,
      category_label: item.category_label || existing?.category_label || 'Geral',
      title: item.title || existing?.title || item.item_key,
      impact_level: item.impact_level || existing?.impact_level || 'alta',
      before_status: keepBefore ? existing.before_status : (item.before_status || 'ausente'),
      before_value: keepBefore ? existing.before_value : (item.before_value ?? null),
      current_status: currentStatus,
      current_value: item.current_value !== undefined ? item.current_value : (existing?.current_value ?? null),
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : (existing?.sort_order ?? idx + 1),
      completed_at: completedAt
    };
  });
}

export function normalizeSnapshotPayload(clientId, snapshot, baseDir = '') {
  return {
    client_id: clientId,
    period_key: snapshot.period_key,
    period_label: snapshot.period_label,
    snapshot_type: snapshot.snapshot_type || 'mensal',
    is_baseline: Boolean(snapshot.is_baseline),
    source: snapshot.source || 'agente_browser',
    gbp_metrics: snapshot.gbp_metrics || {},
    ads_metrics: snapshot.ads_metrics || {},
    site_metrics: snapshot.site_metrics || {},
    overall_status: snapshot.overall_status || (snapshot.is_baseline ? 'baseline' : 'estavel'),
    executive_summary: snapshot.executive_summary ?? null,
    collection_warnings: Array.isArray(snapshot.collection_warnings) ? snapshot.collection_warnings : [],
    recorded_at: snapshot.recorded_at || new Date().toISOString()
  };
}
```

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\crm-client-sync.mjs`:

```javascript
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { loadEnvFile } from './lib/envLoader.mjs';
import { auditClientWebsite } from './lib/siteAuditor.mjs';
import { collectMonthlyAdsMetrics } from './lib/adsMetricsCollector.mjs';
import {
  buildStorageObjectPath,
  normalizeSnapshotPayload,
  prepareChecklistUpsertRows
} from './lib/crmSyncCore.mjs';

loadEnvFile();

function parseArgs(argv) {
  const flags = {
    file: '',
    auditSite: false,
    syncAds: false,
    forceBaseline: false,
    dryRun: false
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--file' && argv[i + 1]) {
      flags.file = argv[++i];
    } else if (arg === '--audit-site') {
      flags.auditSite = true;
    } else if (arg === '--sync-ads') {
      flags.syncAds = true;
    } else if (arg === '--force-baseline') {
      flags.forceBaseline = true;
    } else if (arg === '--dry-run') {
      flags.dryRun = true;
    }
  }
  return flags;
}

async function createAuthenticatedSupabase() {
  const url = process.env.VITE_SUPABASE_URL || 'https://juvwfxnlusrnvcarkrmc.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yHgMqSz5KFAAPpWUht81vA_Rrjy36VF';

  if (serviceKey) {
    return createClient(url, serviceKey, { auth: { persistSession: false } });
  }

  const supabase = createClient(url, anonKey, { auth: { persistSession: false } });
  const email = process.env.CRM_ADMIN_EMAIL?.trim();
  const password = process.env.CRM_ADMIN_PASSWORD?.trim();
  if (!email || !password) {
    throw new Error(
      'Defina SUPABASE_SERVICE_ROLE_KEY (recomendado) ou CRM_ADMIN_EMAIL + CRM_ADMIN_PASSWORD no .env para sincronizar com o Supabase.'
    );
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(`Falha ao autenticar script no Supabase: ${error.message}`);
  }
  return supabase;
}

function guessContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return 'application/octet-stream';
}

async function main() {
  const flags = parseArgs(process.argv);
  if (!flags.file) {
    console.error('Uso: node scripts/crm-client-sync.mjs --file <payload.json> [--audit-site] [--sync-ads] [--force-baseline] [--dry-run]');
    process.exit(1);
  }

  const absPayloadPath = path.resolve(process.cwd(), flags.file);
  if (!existsSync(absPayloadPath)) {
    throw new Error(`Arquivo JSON não encontrado: ${absPayloadPath}`);
  }

  const payload = JSON.parse(readFileSync(absPayloadPath, 'utf8'));
  if (!payload?.client?.slug || !payload?.client?.name) {
    throw new Error('Payload precisa conter client.slug e client.name.');
  }

  const clientData = payload.client;
  const snapshots = Array.isArray(payload.snapshots) ? structuredClone(payload.snapshots) : [];
  const checklistItems = Array.isArray(payload.checklistItems) ? payload.checklistItems : [];
  const changeLogs = Array.isArray(payload.changeLogs) ? payload.changeLogs : [];
  const evidences = Array.isArray(payload.evidences) ? payload.evidences : [];

  // Coleta automática opcional de Site / Ads no último snapshot
  const latestSnapshot = snapshots[snapshots.length - 1];
  if (latestSnapshot && flags.auditSite && clientData.services_scope?.website && clientData.external_ids?.websiteDomain) {
    const siteAudit = await auditClientWebsite({
      baseUrl: clientData.external_ids.websiteDomain,
      monitoredPaths: clientData.external_ids.monitoredPaths || ['/'],
      versionLabel: clientData.external_ids.websiteVersionLabel || latestSnapshot.site_metrics?.versionLabel || '',
      env: process.env
    });
    latestSnapshot.site_metrics = { ...(latestSnapshot.site_metrics || {}), ...siteAudit.metrics };
    latestSnapshot.collection_warnings = [
      ...(latestSnapshot.collection_warnings || []),
      ...siteAudit.warnings
    ];
  }

  if (latestSnapshot && flags.syncAds && clientData.services_scope?.google_ads && clientData.external_ids?.adsAccountIds?.[0]) {
    const adsRes = await collectMonthlyAdsMetrics({
      customerId: clientData.external_ids.adsAccountIds[0],
      periodKey: latestSnapshot.period_key,
      env: process.env
    });
    if (adsRes.ok && adsRes.metrics) {
      latestSnapshot.ads_metrics = { ...(latestSnapshot.ads_metrics || {}), ...adsRes.metrics };
    } else if (adsRes.warning) {
      latestSnapshot.collection_warnings = [
        ...(latestSnapshot.collection_warnings || []),
        adsRes.warning
      ];
    }
  }

  if (flags.dryRun) {
    console.log('[DRY-RUN] Validação concluída para:', clientData.slug);
    console.log(
      JSON.stringify(
        {
          slug: clientData.slug,
          checklistCount: checklistItems.length,
          snapshotsCount: snapshots.length,
          changeLogsCount: changeLogs.length,
          evidencesCount: evidences.length,
          evidencesStoragePaths: evidences.map((e) => buildStorageObjectPath(clientData.slug, e.phase, e.localPath || e.storage_path))
        },
        null,
        2
      )
    );
    return;
  }

  const supabase = await createAuthenticatedSupabase();

  // 1. Upsert cliente
  const { data: upsertedClient, error: clientErr } = await supabase
    .from('clients')
    .upsert(
      {
        slug: clientData.slug,
        lead_id: clientData.lead_id ?? null,
        name: clientData.name,
        segment: clientData.segment || 'Negócio Local',
        city: clientData.city || 'Porto Alegre',
        neighborhood: clientData.neighborhood ?? null,
        address: clientData.address ?? null,
        whatsapp: clientData.whatsapp ?? null,
        owner_name: clientData.owner_name ?? null,
        owner_email: clientData.owner_email ?? null,
        status: clientData.status || 'onboarding',
        services_scope: clientData.services_scope || { gbp: true, google_ads: false, website: false, website_mode: 'nenhum' },
        external_ids: clientData.external_ids || {},
        contract_meta: clientData.contract_meta || {},
        started_at: clientData.started_at ?? null
      },
      { onConflict: 'slug' }
    )
    .select()
    .single();

  if (clientErr || !upsertedClient) {
    throw new Error(`Erro ao salvar client: ${clientErr?.message || 'desconhecido'}`);
  }

  const clientId = upsertedClient.id;

  // 2. Checklist preservando before_* existente
  if (checklistItems.length > 0) {
    const { data: existingChecklist, error: fetchCheckErr } = await supabase
      .from('client_checklists')
      .select('*')
      .eq('client_id', clientId);
    if (fetchCheckErr) throw new Error(`Erro ao ler checklist existente: ${fetchCheckErr.message}`);

    const mergedRows = prepareChecklistUpsertRows(clientId, existingChecklist || [], checklistItems, flags.forceBaseline);
    const { error: upsertCheckErr } = await supabase
      .from('client_checklists')
      .upsert(mergedRows, { onConflict: 'client_id,item_key' });
    if (upsertCheckErr) throw new Error(`Erro ao salvar checklist: ${upsertCheckErr.message}`);
  }

  // 3. Snapshots históricos / mensais
  if (snapshots.length > 0) {
    const { data: existingBaseline } = await supabase
      .from('client_snapshots')
      .select('id, period_key, snapshot_type')
      .eq('client_id', clientId)
      .eq('is_baseline', true)
      .maybeSingle();

    const rows = snapshots.map((s) => {
      const normalized = normalizeSnapshotPayload(clientId, s);
      if (
        normalized.is_baseline &&
        existingBaseline &&
        !flags.forceBaseline &&
        (existingBaseline.period_key !== normalized.period_key || existingBaseline.snapshot_type !== normalized.snapshot_type)
      ) {
        normalized.is_baseline = false;
      }
      return normalized;
    });

    const { error: snapErr } = await supabase
      .from('client_snapshots')
      .upsert(rows, { onConflict: 'client_id,period_key,snapshot_type' });
    if (snapErr) throw new Error(`Erro ao salvar snapshots: ${snapErr.message}`);
  }

  // 4. Logs de entregas (idempotentes quando external_ref informado)
  for (const log of changeLogs) {
    const row = {
      client_id: clientId,
      occurred_at: log.occurred_at || new Date().toISOString(),
      pillar: log.pillar || 'gbp',
      action_type: log.action_type || 'implementacao',
      title: log.title,
      before_state: log.before_state ?? null,
      after_state: log.after_state ?? null,
      automation_source: log.automation_source || 'antigravity',
      visible_to_client: log.visible_to_client !== false,
      external_ref: log.external_ref ?? null
    };
    const { error: logErr } = row.external_ref
      ? await supabase.from('client_change_logs').upsert(row, { onConflict: 'client_id,external_ref' })
      : await supabase.from('client_change_logs').insert(row);
    if (logErr) throw new Error(`Erro ao salvar log "${log.title}": ${logErr.message}`);
  }

  // 5. Upload de evidências visuais para bucket privado + metadados
  for (const ev of evidences) {
    let storagePath = ev.storage_path || buildStorageObjectPath(clientData.slug, ev.phase, ev.localPath);
    if (ev.localPath) {
      const absImg = path.isAbsolute(ev.localPath)
        ? ev.localPath
        : path.resolve(path.dirname(absPayloadPath), ev.localPath);
      if (existsSync(absImg)) {
        const buffer = readFileSync(absImg);
        const { error: uploadErr } = await supabase.storage
          .from('client-evidences')
          .upload(storagePath, buffer, {
            contentType: guessContentType(absImg),
            upsert: true
          });
        if (uploadErr) throw new Error(`Erro no upload de ${storagePath}: ${uploadErr.message}`);
      } else {
        console.warn(`[sync] Imagem não encontrada localmente, pulando upload: ${absImg}`);
        continue;
      }
    }

    const { error: evErr } = await supabase
      .from('client_evidences')
      .upsert(
        {
          client_id: clientId,
          pillar: ev.pillar || 'gbp',
          phase: ev.phase || 'antes',
          period_key: ev.period_key ?? null,
          pair_key: ev.pair_key ?? null,
          title: ev.title,
          caption: ev.caption ?? null,
          storage_path: storagePath
        },
        { onConflict: 'client_id,storage_path' }
      );
    if (evErr) throw new Error(`Erro ao registrar evidência "${ev.title}": ${evErr.message}`);
  }

  console.log(`Sync concluído com sucesso para cliente "${upsertedClient.name}" (${upsertedClient.slug}).`);
}

main().catch((err) => {
  console.error('[crm-client-sync] ERRO:', err.message);
  process.exit(1);
});
```

- [ ] **Step 4: Executar teste unitário de idempotência e proteção do "Antes"**

Run: `node --test "D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-client-sync.test.mjs"`
Expected: `3/3 passing`

- [ ] **Step 5: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add scripts/lib/crmSyncCore.mjs scripts/crm-client-sync.mjs server/crm-client-sync.test.mjs
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add idempotent client sync CLI protecting initial before state"
```


---

### Task 6: Templates Padrão & Serviço Cloud/Storage/Cache (`clientDefaults.ts` + `crmClientService.ts`)

**Files:**
- Create: `src/pages/crm/utils/clientDefaults.ts`
- Create: `src/pages/crm/services/crmClientService.ts`
- Test: `server/crm-client-defaults.test.mjs`

**Interfaces:**
- Consumes: `supabase` e `isSupabaseConfigured` (`src/lib/supabase.ts`), `ProspectLead` (`src/pages/crm/types.ts`), tipos em `src/pages/crm/clientTypes.ts`, `classifySnapshotStatus` e `sortSnapshotsChronological` (`src/pages/crm/utils/clientAnalytics.ts`).
- Produces:
  - Em `src/pages/crm/utils/clientDefaults.ts`: `slugifyClientName(name)`, `buildDefaultChecklistForScope(clientId, scope)`, `buildPrefillFromLead(lead)`.
  - Em `src/pages/crm/services/crmClientService.ts`: `hasActiveCloudSession()`, `resolveSignedEvidenceUrls(evidences, expiresInSeconds?)`, `crmClientService` (`listClients`, `findClientByLeadId`, `getClientBundleBySlug`, `createClientFromForm`, `updateChecklistStatus`, `addChecklistItem`, `upsertSnapshot`, `addChangeLog`, `uploadEvidence`, `deleteEvidence`).

- [ ] **Step 1: Escrever o teste unitário falhando para `clientDefaults.ts`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-client-defaults.test.mjs`:

```javascript
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = await readFile(new URL('../src/pages/crm/utils/clientDefaults.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext }
}).outputText;
const defaults = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('slugifyClientName strips accents, symbols and spaces cleanly', () => {
  assert.equal(defaults.slugifyClientName('Ângelo Car — Oficina Mecânica!'), 'angelo-car-oficina-mecanica');
  assert.equal(defaults.slugifyClientName('Clínica Saúde & Vida'), 'clinica-saude-vida');
});

test('buildDefaultChecklistForScope includes only items for enabled services', () => {
  const gbpOnly = defaults.buildDefaultChecklistForScope('c1', {
    gbp: true,
    google_ads: false,
    website: false,
    website_mode: 'nenhum'
  });
  assert.ok(gbpOnly.length >= 6);
  assert.ok(gbpOnly.every((item) => item.pillar === 'gbp'));
  assert.ok(gbpOnly.every((item) => item.client_id === 'c1'));

  const multi = defaults.buildDefaultChecklistForScope('c2', {
    gbp: true,
    google_ads: true,
    website: true,
    website_mode: 'redesign'
  });
  assert.ok(multi.some((item) => item.pillar === 'gbp'));
  assert.ok(multi.some((item) => item.pillar === 'google_ads'));
  assert.ok(multi.some((item) => item.pillar === 'website'));
});

test('buildPrefillFromLead maps Kanban ProspectLead into client form defaults', () => {
  const prefill = defaults.buildPrefillFromLead({
    id: 'O-005',
    sampleId: 'O-005',
    name: 'Angelo Car Oficina Mecânica',
    segment: 'Oficina Mecânica',
    neighborhood: 'Cavalhada',
    city: 'Porto Alegre',
    address: 'Av. Vicente Monteggia, 333',
    phone: '(51) 98428-1009',
    formattedPhone: '5551984281009',
    whatsappConfirmed: true,
    mapsUrl: 'https://maps.google.com/?q=Angelo+Car',
    siteUrl: 'https://angelocarmecanica.com.br/',
    opportunityClass: 'Classe A',
    opportunityIssue: 'Fora do Top 3',
    searchKeyword: 'oficina mecânica',
    monthlySearches: '1.900',
    stage: 'fechado_ganho',
    bloco1: '',
    bloco1Volume: '',
    bloco1Falha: '',
    bloco2: '',
    bloco3: '',
    bloco4: '',
    updatedAt: '2026-11-10T00:00:00Z'
  });

  assert.equal(prefill.lead_id, 'O-005');
  assert.equal(prefill.slug, 'angelo-car-oficina-mecanica');
  assert.equal(prefill.whatsapp, '5551984281009');
  assert.equal(prefill.website, true);
  assert.equal(prefill.websiteDomain, 'https://angelocarmecanica.com.br/');
});
```

- [ ] **Step 2: Executar teste para confirmar falha**

Run: `node --test "D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-client-defaults.test.mjs"`
Expected: FAIL (`ENOENT: no such file or directory, open '...clientDefaults.ts'`)

- [ ] **Step 3: Implementar `src/pages/crm/utils/clientDefaults.ts`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\utils\clientDefaults.ts`:

```typescript
import type {
  ChecklistBeforeStatus,
  ChecklistCurrentStatus,
  ClientPillar,
  ClientServicesScope,
  ImpactLevel,
  WebsiteMode,
} from "../clientTypes";
import type { ProspectLead } from "../types";

export interface ChecklistDraftItem {
  client_id: string;
  pillar: ClientPillar;
  item_key: string;
  category_label: string;
  title: string;
  impact_level: ImpactLevel;
  before_status: ChecklistBeforeStatus;
  before_value: string | null;
  current_status: ChecklistCurrentStatus;
  current_value: string | null;
  sort_order: number;
  completed_at: string | null;
}

export function slugifyClientName(name: string): string {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "cliente";
}

export function buildDefaultChecklistForScope(
  clientId: string,
  scope: ClientServicesScope,
): ChecklistDraftItem[] {
  const items: Omit<ChecklistDraftItem, "client_id" | "sort_order" | "completed_at">[] = [];

  if (scope.gbp) {
    items.push(
      {
        pillar: "gbp",
        item_key: "gbp_categories_services",
        category_label: "SEO Local & Categorias",
        title: "Categorias principal e secundárias + serviços nativos",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Categorias e serviços secundários ausentes",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_description_seo",
        category_label: "SEO Local",
        title: "Descrição comercial otimizada (bairros e especialidades)",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Descrição genérica ou desatualizada",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_social_profiles",
        category_label: "Cadastro & Redes",
        title: "Vínculo de perfis oficiais de redes sociais (Instagram/Facebook)",
        impact_level: "media",
        before_status: "ausente",
        before_value: "Redes sociais não vinculadas no GBP",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_links_utm_whatsapp",
        category_label: "Conversão & Links",
        title: "Site com UTM + link direto WhatsApp/Agendamento",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Links sem rastreamento ou ausentes",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_photos_facade_logo",
        category_label: "Mídia & Fachada",
        title: "Capa estratégica, logotipo limpo e fotos da fachada/equipe",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Capa inadequada ou ausência de foto externa",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_products_posts_qa",
        category_label: "Vitrine & Atividade",
        title: "Catálogo de Produtos, Posts recentes e Perguntas & Respostas",
        impact_level: "media",
        before_status: "ausente",
        before_value: "Vitrine vazia ou publicações antigas",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_reviews_strategy",
        category_label: "Reputação",
        title: "Respostas estratégicas nas avaliações + link curto 5★",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Avaliações sem resposta ou resposta genérica",
        current_status: "pendente",
        current_value: null,
      },
    );
  }

  if (scope.website) {
    items.push(
      {
        pillar: "website",
        item_key: "site_health_urls_ssl",
        category_label: "Estrutura Site",
        title: "Correção de erros 404, HTTPS ativo e redirecionamentos 301",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "URLs legadas ou arquitetura one-page sem rotas de serviço",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "website",
        item_key: "site_local_seo_cta",
        category_label: "CRO & SEO Local",
        title: "Páginas por serviço + Schema LocalBusiness + botão fixo WhatsApp",
        impact_level: "alta",
        before_status: "ausente",
        before_value: "Sem páginas dedicadas por serviço/bairro ou tracking",
        current_status: "pendente",
        current_value: null,
      },
    );
  }

  if (scope.google_ads) {
    items.push(
      {
        pillar: "google_ads",
        item_key: "ads_hygiene_negatives",
        category_label: "Higiene Ads",
        title: "Desativar aplicação automática + listas de palavras negativas",
        impact_level: "alta",
        before_status: "incorreto",
        before_value: "Termos irrelevantes consumindo orçamento",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "google_ads",
        item_key: "ads_conversion_tracking",
        category_label: "Mensuração Ads",
        title: "Rastreamento de conversões (WhatsApp/Ligar) + extensão de local",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Conversões incompletas ou conta desvinculada do GBP",
        current_status: "pendente",
        current_value: null,
      },
    );
  }

  return items.map((item, idx) => ({
    ...item,
    client_id: clientId,
    sort_order: idx + 1,
    completed_at: null,
  }));
}

export interface ClientFormPrefill {
  lead_id?: string;
  name: string;
  slug: string;
  segment: string;
  city: string;
  neighborhood: string;
  address: string;
  whatsapp: string;
  gbp: boolean;
  google_ads: boolean;
  website: boolean;
  website_mode: WebsiteMode;
  gbpMapsUrl: string;
  websiteDomain: string;
}

export function buildPrefillFromLead(lead: ProspectLead): ClientFormPrefill {
  const cleanPhone = String(lead.formattedPhone || lead.phone || "").replace(/\D+/g, "");
  const hasSite = Boolean(lead.siteUrl && lead.siteUrl.trim().length > 0);
  return {
    lead_id: lead.id,
    name: lead.name,
    slug: slugifyClientName(lead.name),
    segment: lead.segment || "Negócio Local",
    city: lead.city || "Porto Alegre",
    neighborhood: lead.neighborhood || "",
    address: lead.address || "",
    whatsapp: cleanPhone ? (cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`) : "",
    gbp: true,
    google_ads: false,
    website: hasSite,
    website_mode: hasSite ? "redesign" : "novo",
    gbpMapsUrl: lead.mapsUrl || "",
    websiteDomain: lead.siteUrl || "",
  };
}
```

- [ ] **Step 4: Executar testes unitários de `clientDefaults.ts`**

Run: `node --test "D:\LEONARDO\Drive\Projetos\leonardo-brasil\server\crm-client-defaults.test.mjs"`
Expected: `3/3 passing`

- [ ] **Step 5: Implementar `src/pages/crm/services/crmClientService.ts`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\services\crmClientService.ts`:

```typescript
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import type {
  ChecklistBeforeStatus,
  ChecklistCurrentStatus,
  ClientAccount,
  ClientChangeLog,
  ClientChecklistItem,
  ClientEvidence,
  ClientFullBundle,
  ClientPillar,
  ClientServicesScope,
  ClientSnapshot,
  ClientStatus,
  EvidencePhase,
  ImpactLevel,
} from "../clientTypes";
import { classifySnapshotStatus, sortSnapshotsChronological } from "../utils/clientAnalytics";
import { buildDefaultChecklistForScope, slugifyClientName } from "../utils/clientDefaults";

const CLIENTS_CACHE_KEY = "crm_clients_cache_v1";
const BUNDLE_CACHE_PREFIX = "crm_client_bundle_v1_";

function readLocalJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("Falha ao salvar cache local de clientes:", err);
  }
}

export async function hasActiveCloudSession(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return Boolean(session?.user);
  } catch {
    return false;
  }
}

export async function resolveSignedEvidenceUrls(
  evidences: ClientEvidence[],
  expiresInSeconds = 3600,
): Promise<ClientEvidence[]> {
  if (evidences.length === 0) return [];
  const hasSession = await hasActiveCloudSession();
  if (!hasSession) {
    return evidences.map((ev) => ({ ...ev, signedUrl: ev.signedUrl ?? null }));
  }

  const paths = Array.from(new Set(evidences.map((e) => e.storage_path).filter(Boolean)));
  if (paths.length === 0) return evidences;

  try {
    const { data, error } = await supabase.storage
      .from("client-evidences")
      .createSignedUrls(paths, expiresInSeconds);

    if (error || !data) {
      console.warn("Aviso ao gerar URLs assinadas:", error?.message);
      return evidences;
    }

    const urlByPath = new Map<string, string>();
    for (const item of data) {
      if (item.path && item.signedUrl) {
        urlByPath.set(item.path, item.signedUrl);
      }
    }

    return evidences.map((ev) => ({
      ...ev,
      signedUrl: urlByPath.get(ev.storage_path) ?? null,
    }));
  } catch (err) {
    console.warn("Erro ao assinar imagens do Storage:", err);
    return evidences;
  }
}

export interface CreateClientInput {
  lead_id?: string | null;
  name: string;
  slug?: string;
  segment: string;
  city: string;
  neighborhood?: string;
  address?: string;
  whatsapp?: string;
  owner_name?: string;
  owner_email?: string;
  status?: ClientStatus;
  services_scope: ClientServicesScope;
  gbpMapsUrl?: string;
  websiteDomain?: string;
  websiteVersionLabel?: string;
  planLabel?: string;
  setupFeeBrl?: number;
  monthlyFeeBrl?: number;
  privateNotes?: string;
}

function nowPeriodKey(): { period_key: string; period_label: string } {
  const now = new Date();
  const year = now.getFullYear();
  const monthIdx = now.getMonth();
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return {
    period_key: `${year}-${String(monthIdx + 1).padStart(2, "0")}`,
    period_label: `${monthNames[monthIdx]}/${year}`,
  };
}

export const crmClientService = {
  async listClients(): Promise<{ clients: ClientAccount[]; cloudSynced: boolean }> {
    const cloudSession = await hasActiveCloudSession();
    if (cloudSession) {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("updated_at", { ascending: false });

        if (!error && Array.isArray(data)) {
          const clients = data as ClientAccount[];
          writeLocalJson(CLIENTS_CACHE_KEY, clients);
          return { clients, cloudSynced: true };
        }
      } catch (err) {
        console.warn("Falha ao listar clientes do Supabase; usando cache:", err);
      }
    }

    const cached = readLocalJson<ClientAccount[]>(CLIENTS_CACHE_KEY, []);
    return { clients: cached, cloudSynced: false };
  },

  async findClientByLeadId(leadId: string): Promise<ClientAccount | null> {
    if (!leadId) return null;
    const { clients } = await this.listClients();
    return clients.find((c) => c.lead_id === leadId) ?? null;
  },

  async getClientBundleBySlug(
    slug: string,
  ): Promise<{ bundle: ClientFullBundle | null; cloudSynced: boolean }> {
    const cloudSession = await hasActiveCloudSession();
    if (cloudSession) {
      try {
        const { data: clientRow, error: clientErr } = await supabase
          .from("clients")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (!clientErr && clientRow) {
          const client = clientRow as ClientAccount;
          const [checkRes, snapRes, logRes, evRes] = await Promise.all([
            supabase
              .from("client_checklists")
              .select("*")
              .eq("client_id", client.id)
              .order("sort_order", { ascending: true }),
            supabase
              .from("client_snapshots")
              .select("*")
              .eq("client_id", client.id)
              .order("period_key", { ascending: true }),
            supabase
              .from("client_change_logs")
              .select("*")
              .eq("client_id", client.id)
              .order("occurred_at", { ascending: false }),
            supabase
              .from("client_evidences")
              .select("*")
              .eq("client_id", client.id)
              .order("created_at", { ascending: true }),
          ]);

          const signedEvidences = await resolveSignedEvidenceUrls((evRes.data || []) as ClientEvidence[]);
          const bundle: ClientFullBundle = {
            client,
            checklist: (checkRes.data || []) as ClientChecklistItem[],
            snapshots: sortSnapshotsChronological((snapRes.data || []) as ClientSnapshot[]),
            changeLogs: (logRes.data || []) as ClientChangeLog[],
            evidences: signedEvidences,
          };

          writeLocalJson(`${BUNDLE_CACHE_PREFIX}${slug}`, bundle);
          return { bundle, cloudSynced: true };
        }
      } catch (err) {
        console.warn("Erro ao carregar ficha do Supabase; tentando cache local:", err);
      }
    }

    const cachedBundle = readLocalJson<ClientFullBundle | null>(`${BUNDLE_CACHE_PREFIX}${slug}`, null);
    return { bundle: cachedBundle, cloudSynced: false };
  },

  async createClientFromForm(
    input: CreateClientInput,
  ): Promise<{ client: ClientAccount; cloudSynced: boolean }> {
    const cloudSession = await hasActiveCloudSession();
    const cleanSlug = input.slug?.trim() ? slugifyClientName(input.slug) : slugifyClientName(input.name);
    const cleanPhone = String(input.whatsapp || "").replace(/\D+/g, "");
    const formattedPhone = cleanPhone
      ? cleanPhone.startsWith("55")
        ? cleanPhone
        : `55${cleanPhone}`
      : null;

    const payload = {
      lead_id: input.lead_id ?? null,
      slug: cleanSlug,
      name: input.name.trim(),
      segment: input.segment.trim() || "Negócio Local",
      city: input.city.trim() || "Porto Alegre",
      neighborhood: input.neighborhood?.trim() || null,
      address: input.address?.trim() || null,
      whatsapp: formattedPhone,
      owner_name: input.owner_name?.trim() || null,
      owner_email: input.owner_email?.trim() || null,
      status: input.status || "onboarding",
      services_scope: input.services_scope,
      external_ids: {
        ...(input.gbpMapsUrl ? { gbpMapsUrl: input.gbpMapsUrl.trim() } : {}),
        ...(input.websiteDomain ? { websiteDomain: input.websiteDomain.trim() } : {}),
        ...(input.websiteVersionLabel ? { websiteVersionLabel: input.websiteVersionLabel.trim() } : {}),
      },
      contract_meta: {
        ...(input.planLabel ? { planLabel: input.planLabel.trim() } : {}),
        ...(typeof input.setupFeeBrl === "number" ? { setupFeeBrl: input.setupFeeBrl } : {}),
        ...(typeof input.monthlyFeeBrl === "number" ? { monthlyFeeBrl: input.monthlyFeeBrl } : {}),
        ...(input.privateNotes ? { privateNotes: input.privateNotes.trim() } : {}),
      },
      started_at: new Date().toISOString().slice(0, 10),
    };

    if (cloudSession) {
      const { data: created, error } = await supabase
        .from("clients")
        .insert(payload)
        .select()
        .single();

      if (error || !created) {
        throw new Error(error?.message || "Não foi possível criar cliente no Supabase.");
      }

      const client = created as ClientAccount;
      const starterChecklist = buildDefaultChecklistForScope(client.id, client.services_scope);
      if (starterChecklist.length > 0) {
        await supabase.from("client_checklists").insert(starterChecklist);
      }

      await supabase.from("client_change_logs").insert({
        client_id: client.id,
        pillar: "gbp",
        action_type: "auditoria_inicial",
        title: "Cadastro inicial e abertura do histórico Antes × Depois",
        before_state: "Estado inicial capturado no onboarding",
        after_state: "Checklist técnico inicializado no CRM",
        automation_source: "manual",
        visible_to_client: true,
        external_ref: `onboarding-${client.slug}`,
      });

      const currentList = readLocalJson<ClientAccount[]>(CLIENTS_CACHE_KEY, []);
      writeLocalJson(CLIENTS_CACHE_KEY, [client, ...currentList.filter((c) => c.id !== client.id)]);
      return { client, cloudSynced: true };
    }

    // Fallback offline local (com aviso de ausência de nuvem via CloudSyncBanner)
    const nowIso = new Date().toISOString();
    const localId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`;
    const localClient: ClientAccount = {
      id: localId,
      slug: payload.slug,
      lead_id: payload.lead_id,
      name: payload.name,
      segment: payload.segment,
      city: payload.city,
      neighborhood: payload.neighborhood,
      address: payload.address,
      whatsapp: payload.whatsapp,
      owner_name: payload.owner_name,
      owner_email: payload.owner_email,
      status: payload.status,
      services_scope: payload.services_scope,
      external_ids: payload.external_ids,
      contract_meta: payload.contract_meta,
      started_at: payload.started_at,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const starterChecklist: ClientChecklistItem[] = buildDefaultChecklistForScope(
      localId,
      localClient.services_scope,
    ).map((item, idx) => ({
      ...item,
      id: `local-chk-${idx + 1}`,
      updated_at: nowIso,
    }));

    const localBundle: ClientFullBundle = {
      client: localClient,
      checklist: starterChecklist,
      snapshots: [],
      changeLogs: [
        {
          id: `local-log-${Date.now()}`,
          client_id: localId,
          occurred_at: nowIso,
          pillar: "gbp",
          action_type: "auditoria_inicial",
          title: "Cadastro inicial (apenas cache local)",
          automation_source: "manual",
          visible_to_client: true,
        },
      ],
      evidences: [],
    };

    const cachedList = readLocalJson<ClientAccount[]>(CLIENTS_CACHE_KEY, []);
    writeLocalJson(CLIENTS_CACHE_KEY, [localClient, ...cachedList.filter((c) => c.slug !== localClient.slug)]);
    writeLocalJson(`${BUNDLE_CACHE_PREFIX}${localClient.slug}`, localBundle);

    return { client: localClient, cloudSynced: false };
  },

  async updateChecklistStatus(
    clientId: string,
    slug: string,
    item: ClientChecklistItem,
    nextStatus: ChecklistCurrentStatus,
    nextValue?: string | null,
  ): Promise<ClientChecklistItem> {
    const completedAt =
      nextStatus === "otimizado" ? item.completed_at || new Date().toISOString() : null;
    const updatedItem: ClientChecklistItem = {
      ...item,
      current_status: nextStatus,
      current_value: nextValue !== undefined ? nextValue : item.current_value,
      completed_at: completedAt,
      updated_at: new Date().toISOString(),
    };

    const cloudSession = await hasActiveCloudSession();
    if (cloudSession) {
      const { error } = await supabase
        .from("client_checklists")
        .update({
          current_status: updatedItem.current_status,
          current_value: updatedItem.current_value ?? null,
          completed_at: updatedItem.completed_at,
        })
        .eq("id", item.id)
        .eq("client_id", clientId);
      if (error) throw new Error(error.message);
    }

    const cached = readLocalJson<ClientFullBundle | null>(`${BUNDLE_CACHE_PREFIX}${slug}`, null);
    if (cached) {
      cached.checklist = cached.checklist.map((c) => (c.id === item.id ? updatedItem : c));
      writeLocalJson(`${BUNDLE_CACHE_PREFIX}${slug}`, cached);
    }
    return updatedItem;
  },

  async addChecklistItem(
    clientId: string,
    slug: string,
    input: {
      pillar: ClientPillar;
      category_label: string;
      title: string;
      impact_level: ImpactLevel;
      before_status: ChecklistBeforeStatus;
      before_value?: string;
      current_status: ChecklistCurrentStatus;
      current_value?: string;
      sort_order: number;
    },
  ): Promise<ClientChecklistItem> {
    const itemKey = `${input.pillar}_${slugifyClientName(input.title).replace(/-/g, "_").slice(0, 40)}_${Date.now()}`;
    const completedAt = input.current_status === "otimizado" ? new Date().toISOString() : null;
    const payload = {
      client_id: clientId,
      pillar: input.pillar,
      item_key: itemKey,
      category_label: input.category_label.trim() || "Geral",
      title: input.title.trim(),
      impact_level: input.impact_level,
      before_status: input.before_status,
      before_value: input.before_value?.trim() || null,
      current_status: input.current_status,
      current_value: input.current_value?.trim() || null,
      sort_order: input.sort_order,
      completed_at: completedAt,
    };

    const cloudSession = await hasActiveCloudSession();
    if (cloudSession) {
      const { data, error } = await supabase
        .from("client_checklists")
        .insert(payload)
        .select()
        .single();
      if (error || !data) throw new Error(error?.message || "Erro ao adicionar item no checklist.");
      return data as ClientChecklistItem;
    }

    const localItem: ClientChecklistItem = {
      ...payload,
      id: `local-chk-${Date.now()}`,
      updated_at: new Date().toISOString(),
    };
    const cached = readLocalJson<ClientFullBundle | null>(`${BUNDLE_CACHE_PREFIX}${slug}`, null);
    if (cached) {
      cached.checklist.push(localItem);
      writeLocalJson(`${BUNDLE_CACHE_PREFIX}${slug}`, cached);
    }
    return localItem;
  },

  async upsertSnapshot(
    client: ClientAccount,
    existingSnapshots: ClientSnapshot[],
    input: Omit<ClientSnapshot, "id" | "client_id" | "overall_status" | "recorded_at">,
  ): Promise<ClientSnapshot> {
    const tempSnap: ClientSnapshot = {
      id: "pending",
      client_id: client.id,
      ...input,
      overall_status: input.is_baseline ? "baseline" : "estavel",
      recorded_at: new Date().toISOString(),
    };

    const others = sortSnapshotsChronological(
      existingSnapshots.filter(
        (s) => !(s.period_key === input.period_key && s.snapshot_type === input.snapshot_type),
      ),
    );
    const prev = others[others.length - 1] ?? null;
    const computedStatus = classifySnapshotStatus(tempSnap, prev, client.services_scope);

    const row = {
      client_id: client.id,
      period_key: input.period_key,
      period_label: input.period_label,
      snapshot_type: input.snapshot_type,
      is_baseline: input.is_baseline,
      source: input.source,
      gbp_metrics: input.gbp_metrics,
      ads_metrics: input.ads_metrics,
      site_metrics: input.site_metrics,
      overall_status: computedStatus,
      executive_summary: input.executive_summary ?? null,
      collection_warnings: input.collection_warnings || [],
      recorded_at: new Date().toISOString(),
    };

    const cloudSession = await hasActiveCloudSession();
    if (cloudSession) {
      const { data, error } = await supabase
        .from("client_snapshots")
        .upsert(row, { onConflict: "client_id,period_key,snapshot_type" })
        .select()
        .single();
      if (error || !data) throw new Error(error?.message || "Erro ao gravar snapshot mensal.");
      return data as ClientSnapshot;
    }

    const localSnap: ClientSnapshot = { ...row, id: `local-snap-${Date.now()}` };
    const cached = readLocalJson<ClientFullBundle | null>(`${BUNDLE_CACHE_PREFIX}${client.slug}`, null);
    if (cached) {
      cached.snapshots = sortSnapshotsChronological([...others, localSnap]);
      writeLocalJson(`${BUNDLE_CACHE_PREFIX}${client.slug}`, cached);
    }
    return localSnap;
  },

  async addChangeLog(
    clientId: string,
    slug: string,
    input: Omit<ClientChangeLog, "id" | "client_id" | "occurred_at">,
  ): Promise<ClientChangeLog> {
    const payload = {
      client_id: clientId,
      occurred_at: new Date().toISOString(),
      pillar: input.pillar,
      action_type: input.action_type,
      title: input.title.trim(),
      before_state: input.before_state?.trim() || null,
      after_state: input.after_state?.trim() || null,
      automation_source: input.automation_source || "manual",
      visible_to_client: input.visible_to_client,
      external_ref: input.external_ref ?? null,
    };

    const cloudSession = await hasActiveCloudSession();
    if (cloudSession) {
      const { data, error } = await supabase
        .from("client_change_logs")
        .insert(payload)
        .select()
        .single();
      if (error || !data) throw new Error(error?.message || "Erro ao registrar entrega na timeline.");
      return data as ClientChangeLog;
    }

    const localLog: ClientChangeLog = { ...payload, id: `local-log-${Date.now()}` };
    const cached = readLocalJson<ClientFullBundle | null>(`${BUNDLE_CACHE_PREFIX}${slug}`, null);
    if (cached) {
      cached.changeLogs = [localLog, ...cached.changeLogs];
      writeLocalJson(`${BUNDLE_CACHE_PREFIX}${slug}`, cached);
    }
    return localLog;
  },

  async uploadEvidence(params: {
    clientId: string;
    slug: string;
    file: File;
    pillar: ClientPillar;
    phase: EvidencePhase;
    period_key?: string;
    pair_key?: string;
    title: string;
    caption?: string;
  }): Promise<ClientEvidence> {
    const cloudSession = await hasActiveCloudSession();
    if (!cloudSession) {
      throw new Error("Faça login real no CRM (e-mail e senha) para enviar prints para o Storage seguro.");
    }

    const cleanFileName = params.file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const storagePath = `${params.slug}/${params.phase}-${Date.now()}-${cleanFileName}`;

    const { error: uploadErr } = await supabase.storage
      .from("client-evidences")
      .upload(storagePath, params.file, { contentType: params.file.type || "image/png", upsert: false });
    if (uploadErr) throw new Error(`Falha no upload do print: ${uploadErr.message}`);

    const { data: row, error: dbErr } = await supabase
      .from("client_evidences")
      .insert({
        client_id: params.clientId,
        pillar: params.pillar,
        phase: params.phase,
        period_key: params.period_key?.trim() || nowPeriodKey().period_key,
        pair_key: params.pair_key?.trim() || null,
        title: params.title.trim(),
        caption: params.caption?.trim() || null,
        storage_path: storagePath,
      })
      .select()
      .single();

    if (dbErr || !row) throw new Error(dbErr?.message || "Erro ao registrar metadados da evidência.");

    const [signed] = await resolveSignedEvidenceUrls([row as ClientEvidence]);
    return signed;
  },

  async deleteEvidence(clientId: string, evidence: ClientEvidence): Promise<void> {
    const cloudSession = await hasActiveCloudSession();
    if (!cloudSession) {
      throw new Error("Necessário login ativo na nuvem para excluir evidências.");
    }
    await supabase.storage.from("client-evidences").remove([evidence.storage_path]);
    const { error } = await supabase
      .from("client_evidences")
      .delete()
      .eq("id", evidence.id)
      .eq("client_id", clientId);
    if (error) throw new Error(error.message);
  },
};
```

- [ ] **Step 6: Validar `typecheck` e commit**

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run typecheck`
Expected: 0 erros TypeScript.

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add src/pages/crm/utils/clientDefaults.ts src/pages/crm/services/crmClientService.ts server/crm-client-defaults.test.mjs
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add client defaults mapper and supabase storage service"
```

---

### Task 7: Navegação Unificada (`CrmNavBar`), Alerta de Sessão Offline (`CloudSyncBanner`) & Vínculo no Kanban

**Files:**
- Create: `src/pages/crm/components/CrmNavBar.tsx`
- Create: `src/pages/crm/components/CloudSyncBanner.tsx`
- Modify: `src/pages/crm/components/CrmHeader.tsx:1-215`
- Modify: `src/pages/crm/KeywordPlanner.tsx:1-30,673-695`
- Modify: `src/pages/crm/components/KanbanCard.tsx:1-45,255-275`
- Modify: `src/pages/crm/components/KanbanColumn.tsx:6-25,65-79`
- Modify: `src/pages/crm/components/MessageBlocksDrawer.tsx:1-36,405-426`
- Modify: `src/pages/crm/Dashboard.tsx:1-110,315-363`

**Interfaces:**
- Consumes: `useLocation`, `Link`, `useNavigate` (`src/lib/local-router.tsx`), `crmClientService` (`../services/crmClientService`).
- Produces:
  - `<CrmNavBar />` compartilhada entre Kanban, Clientes e Planejador Ads.
  - `<CloudSyncBanner visible={!cloudSynced} />` exibindo aviso quando offline local.
  - Botão **"Abrir Ficha do Cliente"** / **"Criar Ficha de Cliente"** nos leads `fechado_ganho` ou já vinculados no Supabase.

- [ ] **Step 1: Criar `src/pages/crm/components/CrmNavBar.tsx` e `src/pages/crm/components/CloudSyncBanner.tsx`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\components\CrmNavBar.tsx`:

```typescript
import React from "react";
import { Link, useLocation } from "../../../lib/local-router";
import { BarChart3, Kanban, Users } from "lucide-react";

export const CrmNavBar: React.FC = () => {
  const { pathname } = useLocation();

  const items = [
    {
      label: "Kanban Prospecção",
      shortLabel: "Kanban",
      to: "/crm/dashboard",
      icon: Kanban,
      active: pathname === "/crm/dashboard",
      activeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      iconClass: "text-emerald-400",
    },
    {
      label: "Clientes & Histórico",
      shortLabel: "Clientes",
      to: "/crm/clientes",
      icon: Users,
      active: pathname === "/crm/clientes" || pathname.startsWith("/crm/clientes/"),
      activeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      iconClass: "text-amber-400",
    },
    {
      label: "Planejador Google Ads",
      shortLabel: "Ads Planner",
      to: "/crm/planejador",
      icon: BarChart3,
      active: pathname === "/crm/planejador",
      activeClass: "bg-blue-600/20 text-blue-300 border-blue-500/40",
      iconClass: "text-blue-400",
    },
  ];

  return (
    <nav
      aria-label="Navegação principal do CRM"
      className="flex items-center gap-1.5 bg-[#0f1420] border border-[#1a2030] p-1 rounded-xl overflow-x-auto max-w-full"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`inline-flex items-center gap-1.5 px-3 min-h-[40px] sm:min-h-[34px] py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
              item.active
                ? `${item.activeClass} shadow-sm`
                : "text-[#94a3b8] border-transparent hover:text-white hover:bg-[#161d2e]"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 shrink-0 ${item.active ? item.iconClass : "text-slate-400"}`} />
            <span className="sm:hidden">{item.shortLabel}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
```

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\components\CloudSyncBanner.tsx`:

```typescript
import React from "react";
import { Link } from "../../../lib/local-router";
import { ShieldAlert } from "lucide-react";

interface CloudSyncBannerProps {
  visible: boolean;
}

export const CloudSyncBanner: React.FC<CloudSyncBannerProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div
      role="status"
      className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200"
    >
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-300 font-bold">Modo Offline Local Ativo: </strong>
          você entrou sem autenticação real no Supabase. Os dados exibidos podem estar apenas no cache deste navegador e{" "}
          <strong>não sincronizam com seu celular ou outros dispositivos</strong>.
        </p>
      </div>
      <Link
        to="/crm/login"
        className="inline-flex items-center justify-center min-h-[40px] px-3.5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0"
      >
        Fazer Login Real (Nuvem)
      </Link>
    </div>
  );
};
```

- [ ] **Step 2: Adicionar `CrmNavBar` no `CrmHeader.tsx` e no `KeywordPlanner.tsx`**

Em `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\components\CrmHeader.tsx`, importar `CrmNavBar` após a linha 21 e ajustar a linha 130 para empilhar em mobile (`390px`) inserindo `<CrmNavBar />` após o `<Link to="/">...</Link>` (linha 151):

```typescript
// Adicionar aos imports no topo de CrmHeader.tsx:
import { CrmNavBar } from "./CrmNavBar";
```

```tsx
// Na linha 130, substituir <div className="flex items-center gap-4"> por:
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto min-w-0">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              {/* ...logo existente inalterada... */}
            </Link>
            <CrmNavBar />
          </div>
```

Em `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\KeywordPlanner.tsx`, importar `CrmNavBar` no topo e substituir o bloco `<nav>...</nav>` das linhas 675–690:

```typescript
// Adicionar nos imports no topo de KeywordPlanner.tsx:
import { CrmNavBar } from "./components/CrmNavBar";
```

```tsx
// Substituir as linhas 675-690 (<nav>...</nav>) por:
            <CrmNavBar />
```

- [ ] **Step 3: Integrar vínculo de Pós-Venda (`Abrir / Criar Ficha de Cliente`) em `KanbanCard.tsx`, `KanbanColumn.tsx`, `MessageBlocksDrawer.tsx` e `Dashboard.tsx`**

Em `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\components\KanbanCard.tsx`:
1. Importar `FolderOpen` ou `Users` do `lucide-react` e `useNavigate` do `../../../lib/local-router`.
2. Atualizar `KanbanCardProps` e renderizar o botão pós-venda quando `lead.stage === "fechado_ganho" || Boolean(linkedClientSlug)`:

```typescript
// Adicionar ao topo de KanbanCard.tsx:
import { useNavigate } from "../../../lib/local-router";
// Incluir Users na lista de imports de lucide-react
```

```typescript
interface KanbanCardProps {
  lead: ProspectLead;
  onOpenDrawer: (lead: ProspectLead) => void;
  onAdvanceStage: (leadId: string, nextStage: PipelineStageId) => void;
  onPreviousStage?: (leadId: string, prevStage: PipelineStageId) => void;
  linkedClientSlug?: string | null;
}
```

Dentro do componente `KanbanCard`, declarar `const navigate = useNavigate();` e logo abaixo da `div` de botões principais (`WhatsApp` e `Ver Roteiro`, após a linha 264), adicionar:

```tsx
      {(lead.stage === "fechado_ganho" || linkedClientSlug) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (linkedClientSlug) {
              navigate(`/crm/clientes/${linkedClientSlug}`);
            } else {
              navigate(`/crm/clientes?fromLead=${encodeURIComponent(lead.id)}`);
            }
          }}
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-[11px] font-bold transition-all"
        >
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>{linkedClientSlug ? "Abrir Ficha & Histórico do Cliente" : "Criar Ficha de Cliente"}</span>
        </button>
      )}
```

Em `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\components\KanbanColumn.tsx`:
Atualizar `KanbanColumnProps`, desestruturar `clientSlugByLeadId` nos parâmetros do componente e repassar `linkedClientSlug={clientSlugByLeadId?.[lead.id] ?? null}` para `<KanbanCard />`:

```typescript
interface KanbanColumnProps {
  stage: PipelineStage;
  leads: ProspectLead[];
  onOpenDrawer: (lead: ProspectLead) => void;
  onAdvanceStage: (leadId: string, nextStage: PipelineStageId) => void;
  onPreviousStage?: (leadId: string, prevStage: PipelineStageId) => void;
  isSingleView?: boolean;
  clientSlugByLeadId?: Record<string, string>;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  leads,
  onOpenDrawer,
  onAdvanceStage,
  onPreviousStage,
  isSingleView = false,
  clientSlugByLeadId,
}) => {
```

```tsx
// Na renderização da lista (linhas 68-76), substituir <KanbanCard ... /> por:
          leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              onOpenDrawer={onOpenDrawer}
              onAdvanceStage={onAdvanceStage}
              onPreviousStage={onPreviousStage}
              linkedClientSlug={clientSlugByLeadId?.[lead.id] ?? null}
            />
          ))
```

Em `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\components\MessageBlocksDrawer.tsx`:
Importar `useNavigate` de `../../../lib/local-router` e `Users` de `lucide-react`, atualizar `MessageBlocksDrawerProps` e a assinatura para incluir `linkedClientSlug?: string | null`, declarar `const navigate = useNavigate();` dentro do componente e adicionar o botão pós-venda logo abaixo da grade `Marcar Fechado / Descartar` (após linha 422):

```typescript
// Topo de MessageBlocksDrawer.tsx: adicionar import e estender props
import { useNavigate } from "../../../lib/local-router";
// Incluir Users na lista de imports de lucide-react

interface MessageBlocksDrawerProps {
  lead: ProspectLead | null;
  onClose: () => void;
  onAdvanceStage: (leadId: string, nextStage: PipelineStageId) => void;
  onSaveNotes: (leadId: string, notes: string) => void;
  linkedClientSlug?: string | null;
}

export const MessageBlocksDrawer: React.FC<MessageBlocksDrawerProps> = ({
  lead,
  onClose,
  onAdvanceStage,
  onSaveNotes,
  linkedClientSlug,
}) => {
  const navigate = useNavigate();
```

```tsx
            {(lead.stage === "fechado_ganho" || linkedClientSlug) && (
              <button
                type="button"
                onClick={() => {
                  if (linkedClientSlug) {
                    navigate(`/crm/clientes/${linkedClientSlug}`);
                  } else {
                    navigate(`/crm/clientes?fromLead=${encodeURIComponent(lead.id)}`);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/35 transition-all"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>
                  {linkedClientSlug
                    ? "Abrir Ficha de Cliente & Histórico"
                    : "Converter em Ficha de Cliente (/crm/clientes)"}
                </span>
              </button>
            )}
```

Em `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\Dashboard.tsx`:
1. Importar `crmClientService` de `./services/crmClientService`.
2. Carregar mapa `{ [lead_id]: slug }` dentro do `useEffect` existente (sem bloquear o Kanban caso a tabela ainda não exista):

```typescript
  const [clientSlugByLeadId, setClientSlugByLeadId] = useState<Record<string, string>>({});
```

```typescript
        crmClientService
          .listClients()
          .then(({ clients }) => {
            if (!isMounted) return;
            const nextMap: Record<string, string> = {};
            for (const c of clients) {
              if (c.lead_id) nextMap[c.lead_id] = c.slug;
            }
            setClientSlugByLeadId(nextMap);
          })
          .catch(() => {
            // Silencioso: Kanban continua operacional mesmo antes da migração
          });
```

3. Repassar `clientSlugByLeadId={clientSlugByLeadId}` para ambos os `<KanbanColumn />` (visão panorâmica e coluna única) e `linkedClientSlug={selectedLead ? clientSlugByLeadId[selectedLead.id] ?? null : null}` para `<MessageBlocksDrawer />`:

```tsx
// Nos dois blocos <KanbanColumn ... /> em Dashboard.tsx (linhas ~321 e ~339):
clientSlugByLeadId={clientSlugByLeadId}

// Em <MessageBlocksDrawer ... /> (linha ~355):
linkedClientSlug={selectedLead ? clientSlugByLeadId[selectedLead.id] ?? null : null}
```

- [ ] **Step 4: Validar compilação TypeScript**

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run typecheck`
Expected: 0 erros TypeScript.

- [ ] **Step 5: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add src/pages/crm/components/CrmNavBar.tsx src/pages/crm/components/CloudSyncBanner.tsx src/pages/crm/components/CrmHeader.tsx src/pages/crm/KeywordPlanner.tsx src/pages/crm/components/KanbanCard.tsx src/pages/crm/components/KanbanColumn.tsx src/pages/crm/components/MessageBlocksDrawer.tsx src/pages/crm/Dashboard.tsx
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add unified CrmNavBar, CloudSyncBanner and Kanban-to-Client linking"
```


---

### Task 8: Componentes Responsivos de Histórico, Antes × Depois, Edição & WhatsApp

**Files:**
- Create: `src/pages/crm/components/ClientEvolutionChart.tsx`
- Create: `src/pages/crm/components/ClientBeforeAfterSection.tsx`
- Create: `src/pages/crm/components/ClientWhatsAppReportPanel.tsx`
- Create: `src/pages/crm/components/ClientEditPanels.tsx`

**Interfaces:**
- Consumes: tipos em `../clientTypes`, `computeChecklistProgress` (`../utils/clientAnalytics`), `formatClientWhatsAppReport` e `buildWhatsAppUniversalUrl` (`../utils/whatsappReportFormatter`), `crmClientService` (`../services/crmClientService`), `ClientFormPrefill` (`../utils/clientDefaults`).
- Produces: Componentes UI `ClientEvolutionChart`, `ClientBeforeAfterSection`, `ClientWhatsAppReportPanel`, `NewClientModal`, `RecordSnapshotModal`, `AddChecklistOrLogModal`, `UploadEvidenceModal`.

- [ ] **Step 1: Implementar `src/pages/crm/components/ClientEvolutionChart.tsx` (SVG tocável + cards mobile + tabela desktop)**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\components\ClientEvolutionChart.tsx`:

```typescript
import React from "react";
import { ArrowDownRight, ArrowUpRight, Minus, TrendingUp } from "lucide-react";
import type {
  ClientPillar,
  ClientServicesScope,
  ClientSnapshot,
  ClientTrendStatus,
} from "../clientTypes";

interface ClientEvolutionChartProps {
  orderedSnapshots: ClientSnapshot[];
  selectedPeriodKey: string;
  onSelectPeriod: (periodKey: string) => void;
  scope: ClientServicesScope;
  activePillar: "todos" | ClientPillar;
}

function fmtNum(v?: number | null): string {
  if (typeof v !== "number" || !Number.isFinite(v)) return "—";
  return Math.round(v).toLocaleString("pt-BR");
}

function fmtBrl(v?: number | null): string {
  if (typeof v !== "number" || !Number.isFinite(v)) return "—";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function renderTrendBadge(status: ClientTrendStatus) {
  if (status === "baseline") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35">
        ◆ Baseline
      </span>
    );
  }
  if (status === "avanco") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35">
        <ArrowUpRight className="w-3.5 h-3.5" /> Avanço
      </span>
    );
  }
  if (status === "retrocesso") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/35">
        <ArrowDownRight className="w-3.5 h-3.5" /> Retrocesso
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
      <Minus className="w-3.5 h-3.5" /> Estável
    </span>
  );
}

export const ClientEvolutionChart: React.FC<ClientEvolutionChartProps> = ({
  orderedSnapshots,
  selectedPeriodKey,
  onSelectPeriod,
  scope,
  activePillar,
}) => {
  if (orderedSnapshots.length === 0) {
    return (
      <div className="rounded-2xl border border-[#1a2030] bg-[#0e1320] p-6 text-center text-xs text-[#94a3b8]">
        Ainda não há meses registrados neste histórico.
      </div>
    );
  }

  const chartFocus: ClientPillar =
    activePillar !== "todos"
      ? activePillar
      : scope.gbp
        ? "gbp"
        : scope.google_ads
          ? "google_ads"
          : "website";

  const chartSeries = orderedSnapshots.map((s) => {
    if (chartFocus === "google_ads") {
      return {
        snapshot: s,
        primary: s.ads_metrics?.clicks ?? 0,
        secondary: s.ads_metrics?.conversions ?? 0,
      };
    }
    if (chartFocus === "website") {
      return {
        snapshot: s,
        primary: s.site_metrics?.pagespeedMobile ?? 0,
        secondary: s.site_metrics?.whatsappClicks ?? 0,
      };
    }
    return {
      snapshot: s,
      primary: s.gbp_metrics?.viewsTotal ?? 0,
      secondary: s.gbp_metrics?.interactionsTotal ?? 0,
    };
  });

  const primaryLabel =
    chartFocus === "google_ads"
      ? "Cliques Ads"
      : chartFocus === "website"
        ? "PageSpeed Mobile"
        : "Visualizações GMN";
  const secondaryLabel =
    chartFocus === "google_ads"
      ? "Conversões Ads"
      : chartFocus === "website"
        ? "Cliques WhatsApp Site"
        : "Interações GMN";

  const maxPrimary = Math.max(10, ...chartSeries.map((d) => d.primary));
  const maxSecondary = Math.max(10, ...chartSeries.map((d) => d.secondary));

  const W = 680;
  const H = 210;
  const padX = 38;
  const padY = 26;
  const plotW = W - padX * 2;
  const plotH = H - padY * 2;

  const getX = (idx: number) => {
    if (chartSeries.length === 1) return W / 2;
    return padX + (idx / (chartSeries.length - 1)) * plotW;
  };
  const getPrimaryY = (val: number) => padY + plotH - (val / maxPrimary) * plotH;
  const getSecondaryY = (val: number) => padY + plotH - (val / maxSecondary) * plotH;

  const primaryPath = chartSeries
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getPrimaryY(d.primary).toFixed(1)}`)
    .join(" ");
  const secondaryPath = chartSeries
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getSecondaryY(d.secondary).toFixed(1)}`)
    .join(" ");

  const activePoint =
    orderedSnapshots.find((s) => s.period_key === selectedPeriodKey) ??
    orderedSnapshots[orderedSnapshots.length - 1];

  const showGbpCols = scope.gbp && (activePillar === "todos" || activePillar === "gbp");
  const showAdsCols = scope.google_ads && (activePillar === "todos" || activePillar === "google_ads");
  const showSiteCols = scope.website && (activePillar === "todos" || activePillar === "website");

  return (
    <section className="rounded-2xl border border-[#1a2030] bg-[#0e1320] p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400 shrink-0" />
            <span>Evolução Mês a Mês</span>
          </h2>
          <p className="text-xs text-[#94a3b8]">
            Toque ou clique em qualquer mês para inspecionar as métricas e comparar avanço ou retrocesso.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1.5 text-blue-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            {primaryLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            {secondaryLabel}
          </span>
        </div>
      </div>

      {/* Gráfico SVG Responsivo & Tocável */}
      <div className="rounded-xl bg-[#080b12] border border-[#1a2030] p-2 sm:p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44 sm:h-52 overflow-visible select-none">
          {[0.25, 0.5, 0.75, 1].map((step) => {
            const y = padY + plotH * (1 - step);
            return (
              <line
                key={step}
                x1={padX}
                y1={y}
                x2={W - padX}
                y2={y}
                stroke="#1a2030"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {chartSeries.length > 1 && (
            <>
              <path d={primaryPath} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
              <path d={secondaryPath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {chartSeries.map((d, i) => {
            const cx = getX(i);
            const cy1 = getPrimaryY(d.primary);
            const cy2 = getSecondaryY(d.secondary);
            const isSelected = d.snapshot.period_key === activePoint.period_key;

            return (
              <g
                key={`${d.snapshot.period_key}-${d.snapshot.snapshot_type}`}
                onClick={() => onSelectPeriod(d.snapshot.period_key)}
                className="cursor-pointer"
              >
                {isSelected && (
                  <line
                    x1={cx}
                    y1={padY - 8}
                    x2={cx}
                    y2={H - padY + 4}
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy1}
                  r={isSelected ? 6.5 : 4.5}
                  fill={d.snapshot.is_baseline ? "#F59E0B" : "#3B82F6"}
                  stroke="#080b12"
                  strokeWidth="2"
                />
                <circle
                  cx={cx}
                  cy={cy2}
                  r={isSelected ? 6 : 4}
                  fill="#10B981"
                  stroke="#080b12"
                  strokeWidth="2"
                />
                <text
                  x={cx}
                  y={H - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isSelected ? "700" : "500"}
                  fill={isSelected ? "#F59E0B" : "#94a3b8"}
                >
                  {d.snapshot.period_label.replace(/\s*\(.+\)/, "")}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Seletor Horizontal Confortável ao Toque */}
        <div className="mt-2 pt-2 border-t border-[#1a2030] flex items-center gap-1.5 overflow-x-auto pb-1">
          {orderedSnapshots.map((snap) => {
            const isSelected = snap.period_key === activePoint.period_key;
            return (
              <button
                key={`${snap.id}-pill`}
                type="button"
                onClick={() => onSelectPeriod(snap.period_key)}
                className={`min-h-[44px] sm:min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/45"
                    : "bg-[#0e1320] text-[#94a3b8] border-[#1a2030] hover:text-white"
                }`}
              >
                {snap.is_baseline ? "◆ " : ""}
                {snap.period_label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resumo Compacto do Mês Selecionado */}
      <div className="rounded-xl border border-blue-500/25 bg-[#0a0f1c] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-white text-sm">{activePoint.period_label}</span>
            {renderTrendBadge(activePoint.overall_status)}
          </div>
          {activePoint.executive_summary && (
            <p className="text-[#94a3b8] leading-relaxed">{activePoint.executive_summary}</p>
          )}
          {activePoint.gbp_metrics?.periodNotes && (
            <p className="text-[11px] text-slate-400">{activePoint.gbp_metrics.periodNotes}</p>
          )}
        </div>
      </div>

      {/* Mobile Cards (< md) */}
      <div className="grid grid-cols-1 gap-2.5 md:hidden">
        {[...orderedSnapshots].reverse().map((snap) => {
          const isSelected = snap.period_key === activePoint.period_key;
          return (
            <button
              key={`${snap.id}-card`}
              type="button"
              onClick={() => onSelectPeriod(snap.period_key)}
              className={`w-full text-left rounded-xl border p-3.5 space-y-2 transition-all ${
                isSelected
                  ? "border-amber-500/50 bg-[#12192b]"
                  : "border-[#1a2030] bg-[#0a0d14]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-extrabold text-white">{snap.period_label}</span>
                {renderTrendBadge(snap.overall_status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs tabular-nums">
                {showGbpCols && (
                  <>
                    <div className="rounded-lg bg-[#080b12] p-2 border border-[#1a2030]">
                      <span className="text-[10px] text-[#94a3b8] block">Views GMN</span>
                      <strong className="text-white">{fmtNum(snap.gbp_metrics?.viewsTotal)}</strong>
                    </div>
                    <div className="rounded-lg bg-[#080b12] p-2 border border-[#1a2030]">
                      <span className="text-[10px] text-[#94a3b8] block">Interações (Lig/Rotas)</span>
                      <strong className="text-emerald-300">
                        {fmtNum(snap.gbp_metrics?.interactionsTotal)} ({fmtNum(snap.gbp_metrics?.calls)}/{fmtNum(snap.gbp_metrics?.routes)})
                      </strong>
                    </div>
                  </>
                )}
                {showAdsCols && (
                  <div className="rounded-lg bg-[#080b12] p-2 border border-[#1a2030]">
                    <span className="text-[10px] text-[#94a3b8] block">Ads (Cliques / Conv.)</span>
                    <strong className="text-blue-300">
                      {fmtNum(snap.ads_metrics?.clicks)} / {fmtNum(snap.ads_metrics?.conversions)}
                    </strong>
                  </div>
                )}
                {showSiteCols && (
                  <div className="rounded-lg bg-[#080b12] p-2 border border-[#1a2030]">
                    <span className="text-[10px] text-[#94a3b8] block">Site ({snap.site_metrics?.versionLabel || "Web"})</span>
                    <strong className="text-slate-200">
                      {snap.site_metrics?.brokenUrlsCount === 0
                        ? "URLs 100% OK"
                        : `${snap.site_metrics?.brokenUrlsCount ?? "—"} erro(s) 404`}
                    </strong>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Desktop Table (md+) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#1a2030]">
        <table className="w-full text-left border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-[#080b12] border-b border-[#1a2030] text-[#94a3b8] uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3">Período</th>
              <th className="py-3 px-3">Status</th>
              {showGbpCols && (
                <>
                  <th className="py-3 px-3 text-right">Visualizações</th>
                  <th className="py-3 px-3 text-right">Interações</th>
                  <th className="py-3 px-3 text-right">Ligações</th>
                  <th className="py-3 px-3 text-right">Rotas</th>
                  <th className="py-3 px-3 text-right">Site/Chat</th>
                  <th className="py-3 px-3 text-right">Nota</th>
                </>
              )}
              {showAdsCols && (
                <>
                  <th className="py-3 px-3 text-right">Cliques Ads</th>
                  <th className="py-3 px-3 text-right">Conversões</th>
                  <th className="py-3 px-3 text-right">Investimento</th>
                </>
              )}
              {showSiteCols && (
                <>
                  <th className="py-3 px-3">Site</th>
                  <th className="py-3 px-3 text-right">PageSpeed M.</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a2030]">
            {[...orderedSnapshots].reverse().map((snap) => {
              const isSelected = snap.period_key === activePoint.period_key;
              const siteAndChat =
                (snap.gbp_metrics?.siteClicks ?? 0) + (snap.gbp_metrics?.chatClicks ?? 0);
              return (
                <tr
                  key={`${snap.id}-row`}
                  onClick={() => onSelectPeriod(snap.period_key)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-950/30" : "hover:bg-[#111726]"
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap">{snap.period_label}</td>
                  <td className="py-3 px-3 whitespace-nowrap">{renderTrendBadge(snap.overall_status)}</td>
                  {showGbpCols && (
                    <>
                      <td className="py-3 px-3 text-right font-semibold text-white">{fmtNum(snap.gbp_metrics?.viewsTotal)}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-300">{fmtNum(snap.gbp_metrics?.interactionsTotal)}</td>
                      <td className="py-3 px-3 text-right text-slate-300">{fmtNum(snap.gbp_metrics?.calls)}</td>
                      <td className="py-3 px-3 text-right text-slate-300">{fmtNum(snap.gbp_metrics?.routes)}</td>
                      <td className="py-3 px-3 text-right text-slate-300">
                        {snap.gbp_metrics?.siteClicks !== undefined || snap.gbp_metrics?.chatClicks !== undefined
                          ? fmtNum(siteAndChat)
                          : "—"}
                      </td>
                      <td className="py-3 px-3 text-right text-amber-300 font-semibold">
                        {snap.gbp_metrics?.rating ? `${snap.gbp_metrics.rating.toFixed(1)}★ (${snap.gbp_metrics.reviewCount ?? 0})` : "—"}
                      </td>
                    </>
                  )}
                  {showAdsCols && (
                    <>
                      <td className="py-3 px-3 text-right text-blue-300">{fmtNum(snap.ads_metrics?.clicks)}</td>
                      <td className="py-3 px-3 text-right text-emerald-300 font-bold">{fmtNum(snap.ads_metrics?.conversions)}</td>
                      <td className="py-3 px-3 text-right text-slate-300">{fmtBrl(snap.ads_metrics?.spendBrl)}</td>
                    </>
                  )}
                  {showSiteCols && (
                    <>
                      <td className="py-3 px-3 text-slate-200 whitespace-nowrap">
                        {snap.site_metrics?.versionLabel || "—"}
                        {typeof snap.site_metrics?.brokenUrlsCount === "number" && (
                          <span
                            className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              snap.site_metrics.brokenUrlsCount === 0
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-rose-500/15 text-rose-300"
                            }`}
                          >
                            {snap.site_metrics.brokenUrlsCount === 0 ? "0 404" : `${snap.site_metrics.brokenUrlsCount} 404`}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-200">
                        {snap.site_metrics?.pagespeedMobile !== undefined ? `${snap.site_metrics.pagespeedMobile}/100` : "—"}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Implementar `src/pages/crm/components/ClientBeforeAfterSection.tsx` (Checklist Antes × Depois + Galeria Pareada Mobile/Desktop + Lightbox)**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\components\ClientBeforeAfterSection.tsx`:

```typescript
import React, { useMemo, useState } from "react";
import { CheckCircle2, Clock, Image as ImageIcon, Trash2, X, ZoomIn } from "lucide-react";
import type {
  ChecklistCurrentStatus,
  ClientChecklistItem,
  ClientEvidence,
  ClientPillar,
  ClientServicesScope,
} from "../clientTypes";
import { computeChecklistProgress } from "../utils/clientAnalytics";

interface ClientBeforeAfterSectionProps {
  checklist: ClientChecklistItem[];
  evidences: ClientEvidence[];
  scope: ClientServicesScope;
  activePillar: "todos" | ClientPillar;
  presentationMode: boolean;
  onChangeChecklistStatus?: (item: ClientChecklistItem, nextStatus: ChecklistCurrentStatus) => Promise<void>;
  onDeleteEvidence?: (evidence: ClientEvidence) => Promise<void>;
}

const PILLAR_LABEL: Record<ClientPillar, string> = {
  gbp: "Google Meu Negócio",
  website: "Site",
  google_ads: "Google Ads",
};

const CURRENT_STATUS_STYLE: Record<ChecklistCurrentStatus, { label: string; cls: string }> = {
  otimizado: {
    label: "Otimizado ✓",
    cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/35",
  },
  em_andamento: {
    label: "Em andamento",
    cls: "bg-amber-500/15 text-amber-300 border-amber-500/35",
  },
  pendente: {
    label: "Pendente",
    cls: "bg-slate-800 text-slate-300 border-slate-700",
  },
  nao_aplicavel: {
    label: "N/A",
    cls: "bg-slate-900 text-slate-500 border-slate-800",
  },
};

export const ClientBeforeAfterSection: React.FC<ClientBeforeAfterSectionProps> = ({
  checklist,
  evidences,
  scope,
  activePillar,
  presentationMode,
  onChangeChecklistStatus,
  onDeleteEvidence,
}) => {
  const [evidenceViewMode, setEvidenceViewMode] = useState<"antes" | "depois" | "lado_a_lado">("lado_a_lado");
  const [zoomedEvidence, setZoomedEvidence] = useState<ClientEvidence | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const visibleChecklist = useMemo(() => {
    const allowedPillars = new Set<ClientPillar>([
      ...(scope.gbp ? (["gbp"] as const) : []),
      ...(scope.website ? (["website"] as const) : []),
      ...(scope.google_ads ? (["google_ads"] as const) : []),
    ]);

    return checklist
      .filter((item) => allowedPillars.has(item.pillar))
      .filter((item) => activePillar === "todos" || item.pillar === activePillar);
  }, [checklist, scope, activePillar]);

  const visibleEvidences = useMemo(() => {
    return evidences.filter((ev) => activePillar === "todos" || ev.pillar === activePillar);
  }, [evidences, activePillar]);

  const evidencePairs = useMemo(() => {
    const groups = new Map<string, { key: string; title: string; antes: ClientEvidence[]; depois: ClientEvidence[] }>();
    for (const ev of visibleEvidences) {
      const key = ev.pair_key || ev.id;
      const existing = groups.get(key) || { key, title: ev.title, antes: [], depois: [] };
      if (ev.phase === "antes") existing.antes.push(ev);
      else existing.depois.push(ev);
      groups.set(key, existing);
    }
    return Array.from(groups.values());
  }, [visibleEvidences]);

  const progress = useMemo(() => computeChecklistProgress(visibleChecklist), [visibleChecklist]);

  const handleStatusClick = async (item: ClientChecklistItem, nextStatus: ChecklistCurrentStatus) => {
    if (!onChangeChecklistStatus || updatingId) return;
    setUpdatingId(item.id);
    try {
      await onChangeChecklistStatus(item, nextStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Matriz Técnica Antes x Depois */}
      <section className="rounded-2xl border border-[#1a2030] bg-[#0e1320] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Checklist Antes × Depois</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              O estado encontrado na auditoria inicial permanece preservado mesmo após cada implementação.
            </p>
          </div>

          <div className="min-w-[200px] bg-[#080b12] border border-[#1a2030] rounded-xl px-3.5 py-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-[#94a3b8]">Execução Técnica</span>
              <span className="font-mono font-bold text-emerald-400">
                {progress.optimized}/{progress.applicable} ({progress.completionPct}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#161d2e] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progress.completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {visibleChecklist.length === 0 ? (
          <p className="text-xs text-[#94a3b8] py-4 text-center">Nenhum item de checklist para este filtro.</p>
        ) : (
          <>
            {/* Mobile Cards (< md) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {visibleChecklist.map((item) => {
                const st = CURRENT_STATUS_STYLE[item.current_status];
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#1a2030] bg-[#080b12] p-3.5 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                          {PILLAR_LABEL[item.pillar]} • {item.category_label}
                        </span>
                        <h3 className="text-sm font-bold text-white leading-snug mt-0.5">{item.title}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="rounded-lg bg-rose-950/20 border border-rose-500/20 p-2.5">
                        <span className="text-[10px] uppercase font-bold text-rose-300 block mb-0.5">
                          Antes ({item.before_status})
                        </span>
                        <p className="text-slate-200">{item.before_value || "Sem observação inicial"}</p>
                      </div>
                      <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-2.5">
                        <span className="text-[10px] uppercase font-bold text-emerald-300 block mb-0.5">
                          Depois / Atual
                        </span>
                        <p className="text-slate-200">
                          {item.current_value ||
                            (item.current_status === "otimizado"
                              ? "Ajuste implementado"
                              : "Aguardando execução")}
                        </p>
                      </div>
                    </div>

                    {!presentationMode && onChangeChecklistStatus && (
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        {(["pendente", "em_andamento", "otimizado"] as ChecklistCurrentStatus[]).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            disabled={updatingId === item.id}
                            onClick={() => handleStatusClick(item, opt)}
                            className={`min-h-[40px] rounded-lg text-[11px] font-bold border transition-all ${
                              item.current_status === opt
                                ? "bg-blue-600 text-white border-blue-400"
                                : "bg-[#0e1320] text-[#94a3b8] border-[#1a2030]"
                            }`}
                          >
                            {opt === "pendente" ? "Pendente" : opt === "em_andamento" ? "Em curso" : "Otimizado ✓"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table (md+) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-[#1a2030]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#080b12] border-b border-[#1a2030] text-[#94a3b8] uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Frente / Item</th>
                    <th className="py-3 px-3">Antes (Pré-gestão)</th>
                    <th className="py-3 px-3">Depois / Atual</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a2030]">
                  {visibleChecklist.map((item) => {
                    const st = CURRENT_STATUS_STYLE[item.current_status];
                    return (
                      <tr key={item.id} className="hover:bg-[#111726]/80 align-top">
                        <td className="py-3 px-3 max-w-xs">
                          <span className="text-[10px] font-bold uppercase text-blue-300 block">
                            {PILLAR_LABEL[item.pillar]} · {item.category_label}
                          </span>
                          <span className="font-bold text-white block mt-0.5">{item.title}</span>
                        </td>
                        <td className="py-3 px-3 text-rose-200/90 max-w-xs">
                          <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/25 mr-1.5">
                            {item.before_status}
                          </span>
                          <span>{item.before_value || "—"}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-200 max-w-xs">
                          {item.current_value ||
                            (item.current_status === "otimizado" ? "Ajuste concluído" : "Aguardando execução")}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {presentationMode || !onChangeChecklistStatus ? (
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.cls}`}>
                              {st.label}
                            </span>
                          ) : (
                            <select
                              aria-label={`Status de ${item.title}`}
                              disabled={updatingId === item.id}
                              value={item.current_status}
                              onChange={(e) =>
                                handleStatusClick(item, e.target.value as ChecklistCurrentStatus)
                              }
                              className="bg-[#080b12] border border-[#2d3748] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
                            >
                              <option value="pendente">Pendente</option>
                              <option value="em_andamento">Em andamento</option>
                              <option value="otimizado">Otimizado ✓</option>
                              <option value="nao_aplicavel">Não aplicável</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* Galeria Pareada de Evidências Visuais (Antes x Depois) */}
      <section className="rounded-2xl border border-[#1a2030] bg-[#0e1320] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Evidências Visuais (Prints Antes × Depois)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Toque em qualquer print para ampliar em tela cheia na frente do cliente.
            </p>
          </div>

          <div className="inline-flex items-center p-1 rounded-xl bg-[#080b12] border border-[#1a2030] self-start">
            {[
              { id: "antes" as const, label: "Antes" },
              { id: "depois" as const, label: "Depois" },
              { id: "lado_a_lado" as const, label: "Lado a Lado" },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setEvidenceViewMode(mode.id)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  evidenceViewMode === mode.id
                    ? "bg-blue-600 text-white"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {evidencePairs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#1a2030] bg-[#080b12] p-6 text-center text-xs text-[#94a3b8]">
            Nenhuma evidência visual enviada para este filtro ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {evidencePairs.map((pair) => {
              const showBefore = evidenceViewMode !== "depois";
              const showAfter = evidenceViewMode !== "antes";

              return (
                <div
                  key={pair.key}
                  className="rounded-xl border border-[#1a2030] bg-[#080b12] p-3.5 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {showBefore && (
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          Antes (Auditoria Inicial)
                        </span>
                        {pair.antes.length === 0 ? (
                          <div className="h-40 rounded-lg border border-dashed border-[#1a2030] flex items-center justify-center text-xs text-slate-500">
                            Sem print inicial neste par
                          </div>
                        ) : (
                          pair.antes.map((ev) => (
                            <div key={ev.id} className="rounded-lg border border-[#1a2030] bg-[#0e1320] overflow-hidden">
                              {ev.signedUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setZoomedEvidence(ev)}
                                  className="relative group block w-full text-left"
                                >
                                  <img
                                    src={ev.signedUrl}
                                    alt={ev.title}
                                    loading="lazy"
                                    className="w-full h-52 object-cover bg-black"
                                  />
                                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/75 text-white text-[11px] font-semibold inline-flex items-center gap-1">
                                    <ZoomIn className="w-3.5 h-3.5" /> Ampliar
                                  </span>
                                </button>
                              ) : (
                                <div className="h-40 flex items-center justify-center p-4 text-center text-xs text-amber-300">
                                  Conecte-se à nuvem para visualizar o print seguro ({ev.storage_path})
                                </div>
                              )}
                              <div className="p-2.5 flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-xs font-bold text-white">{ev.title}</p>
                                  {ev.caption && <p className="text-[11px] text-[#94a3b8] mt-0.5">{ev.caption}</p>}
                                </div>
                                {!presentationMode && onDeleteEvidence && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteEvidence(ev)}
                                    title="Remover print"
                                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {showAfter && (
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Depois / Evolução
                        </span>
                        {pair.depois.length === 0 ? (
                          <div className="h-52 rounded-lg border border-dashed border-[#1a2030] flex flex-col items-center justify-center p-4 text-center text-xs text-slate-400 gap-1.5">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span>O print do &quot;Depois&quot; será anexado automaticamente após a execução das otimizações.</span>
                          </div>
                        ) : (
                          pair.depois.map((ev) => (
                            <div key={ev.id} className="rounded-lg border border-[#1a2030] bg-[#0e1320] overflow-hidden">
                              {ev.signedUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setZoomedEvidence(ev)}
                                  className="relative group block w-full text-left"
                                >
                                  <img
                                    src={ev.signedUrl}
                                    alt={ev.title}
                                    loading="lazy"
                                    className="w-full h-52 object-cover bg-black"
                                  />
                                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/75 text-white text-[11px] font-semibold inline-flex items-center gap-1">
                                    <ZoomIn className="w-3.5 h-3.5" /> Ampliar
                                  </span>
                                </button>
                              ) : (
                                <div className="h-40 flex items-center justify-center p-4 text-center text-xs text-amber-300">
                                  Conecte-se à nuvem para visualizar o print seguro ({ev.storage_path})
                                </div>
                              )}
                              <div className="p-2.5 flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-xs font-bold text-white">{ev.title}</p>
                                  {ev.caption && <p className="text-[11px] text-[#94a3b8] mt-0.5">{ev.caption}</p>}
                                </div>
                                {!presentationMode && onDeleteEvidence && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteEvidence(ev)}
                                    title="Remover print"
                                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal Lightbox para Ampliar Evidência */}
      {zoomedEvidence && zoomedEvidence.signedUrl && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomedEvidence(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm p-3 sm:p-6 flex flex-col items-center justify-center gap-3"
        >
          <div className="w-full max-w-5xl flex items-center justify-between text-white">
            <div className="min-w-0 pr-3">
              <p className="text-sm font-bold truncate">{zoomedEvidence.title}</p>
              {zoomedEvidence.caption && (
                <p className="text-xs text-slate-300 truncate">{zoomedEvidence.caption}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setZoomedEvidence(null)}
              className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white shrink-0"
              aria-label="Fechar ampliação"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <img
            src={zoomedEvidence.signedUrl}
            alt={zoomedEvidence.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] max-w-full rounded-xl border border-slate-700 object-contain"
          />
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 3: Implementar `src/pages/crm/components/ClientWhatsAppReportPanel.tsx`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\components\ClientWhatsAppReportPanel.tsx`:

```typescript
import React, { useEffect, useMemo, useState } from "react";
import { Check, Copy, MessageCircle, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import type {
  ClientAccount,
  ClientChangeLog,
  ClientChecklistItem,
  ClientSnapshot,
  WhatsAppReportStyle,
} from "../clientTypes";
import {
  buildWhatsAppUniversalUrl,
  formatClientWhatsAppReport,
} from "../utils/whatsappReportFormatter";

interface ClientWhatsAppReportPanelProps {
  client: ClientAccount;
  snapshots: ClientSnapshot[];
  checklist: ClientChecklistItem[];
  changeLogs: ClientChangeLog[];
  selectedPeriodKey?: string;
}

export const ClientWhatsAppReportPanel: React.FC<ClientWhatsAppReportPanelProps> = ({
  client,
  snapshots,
  checklist,
  changeLogs,
  selectedPeriodKey,
}) => {
  const [style, setStyle] = useState<WhatsAppReportStyle>("mensal");
  const [copied, setCopied] = useState(false);

  const generatedText = useMemo(
    () =>
      formatClientWhatsAppReport({
        client,
        snapshots,
        checklist,
        changeLogs,
        style,
        targetPeriodKey: selectedPeriodKey,
      }),
    [client, snapshots, checklist, changeLogs, style, selectedPeriodKey],
  );

  const [draftText, setDraftText] = useState(generatedText);

  useEffect(() => {
    setDraftText(generatedText);
  }, [generatedText]);

  const waUrl = buildWhatsAppUniversalUrl(client.whatsapp, draftText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draftText);
      setCopied(true);
      toast.success("Relatório copiado para o WhatsApp!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Não foi possível acessar a área de transferência.");
    }
  };

  return (
    <section className="rounded-2xl border border-emerald-500/30 bg-[#0e1320] p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Gerador de Relatório para WhatsApp</span>
          </h2>
          <p className="text-xs text-[#94a3b8]">
            Texto formatado especialmente para leitura rápida no celular do cliente ({client.whatsapp || "sem telefone"}).
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-xl bg-[#080b12] border border-[#1a2030] self-start">
          <button
            type="button"
            onClick={() => setStyle("mensal")}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              style === "mensal" ? "bg-emerald-600 text-white" : "text-[#94a3b8] hover:text-white"
            }`}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setStyle("marco_zero")}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              style === "marco_zero" ? "bg-amber-500 text-slate-950" : "text-[#94a3b8] hover:text-white"
            }`}
          >
            Marco Zero (Antes × Depois)
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[#94a3b8]">
            Prévia editável antes do envio:
          </span>
          {draftText !== generatedText && (
            <button
              type="button"
              onClick={() => setDraftText(generatedText)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200"
            >
              <RefreshCw className="w-3 h-3" /> Restaurar automático
            </button>
          )}
        </div>
        <textarea
          rows={11}
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          className="w-full rounded-xl border border-[#1a2030] bg-[#060911] p-3.5 text-xs sm:text-sm font-mono text-slate-100 leading-relaxed focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copiado com Sucesso!" : "Copiar Relatório"}</span>
        </button>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all text-center"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Enviar no WhatsApp (App / Web)</span>
        </a>
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Implementar `src/pages/crm/components/ClientEditPanels.tsx` (Modais do Modo Gestão)**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\components\ClientEditPanels.tsx`:

```typescript
import React, { useEffect, useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import type {
  ChangeLogActionType,
  ChangeLogPillar,
  ChecklistBeforeStatus,
  ChecklistCurrentStatus,
  ClientAccount,
  ClientChangeLog,
  ClientChecklistItem,
  ClientEvidence,
  ClientPillar,
  ClientSnapshot,
  EvidencePhase,
  ImpactLevel,
  WebsiteMode,
} from "../clientTypes";
import type { ClientFormPrefill } from "../utils/clientDefaults";
import { slugifyClientName } from "../utils/clientDefaults";
import { crmClientService } from "../services/crmClientService";

/* ---------- 1. Modal de Novo Cliente ---------- */
interface NewClientModalProps {
  isOpen: boolean;
  prefill: ClientFormPrefill | null;
  onClose: () => void;
  onCreated: (client: ClientAccount, cloudSynced: boolean) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  prefill,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [segment, setSegment] = useState("Oficina Mecânica");
  const [city, setCity] = useState("Porto Alegre");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [gbp, setGbp] = useState(true);
  const [googleAds, setGoogleAds] = useState(false);
  const [website, setWebsite] = useState(false);
  const [websiteMode, setWebsiteMode] = useState<WebsiteMode>("nenhum");
  const [websiteDomain, setWebsiteDomain] = useState("");
  const [gbpMapsUrl, setGbpMapsUrl] = useState("");
  const [planLabel, setPlanLabel] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (prefill) {
      setName(prefill.name);
      setSlug(prefill.slug);
      setSegment(prefill.segment);
      setCity(prefill.city);
      setNeighborhood(prefill.neighborhood);
      setAddress(prefill.address);
      setWhatsapp(prefill.whatsapp);
      setGbp(prefill.gbp);
      setGoogleAds(prefill.google_ads);
      setWebsite(prefill.website);
      setWebsiteMode(prefill.website_mode);
      setWebsiteDomain(prefill.websiteDomain);
      setGbpMapsUrl(prefill.gbpMapsUrl);
    } else {
      setName("");
      setSlug("");
      setSegment("Negócio Local");
      setCity("Porto Alegre");
      setNeighborhood("");
      setAddress("");
      setWhatsapp("");
      setOwnerName("");
      setGbp(true);
      setGoogleAds(false);
      setWebsite(false);
      setWebsiteMode("nenhum");
      setWebsiteDomain("");
      setGbpMapsUrl("");
      setPlanLabel("");
      setMonthlyFee("");
    }
  }, [isOpen, prefill]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    setSubmitting(true);
    try {
      const { client, cloudSynced } = await crmClientService.createClientFromForm({
        lead_id: prefill?.lead_id ?? null,
        name,
        slug: slug || slugifyClientName(name),
        segment,
        city,
        neighborhood,
        address,
        whatsapp,
        owner_name: ownerName,
        status: "onboarding",
        services_scope: {
          gbp,
          google_ads: googleAds,
          website,
          website_mode: website ? websiteMode : "nenhum",
        },
        gbpMapsUrl,
        websiteDomain,
        planLabel,
        monthlyFeeBrl: monthlyFee ? Number(monthlyFee) : undefined,
      });
      toast.success(
        cloudSynced
          ? `Ficha de "${client.name}" criada na nuvem!`
          : `Ficha criada localmente (faça login real para sincronizar).`,
      );
      onCreated(client, cloudSynced);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl border border-[#1a2030] bg-[#0e1320] p-5 space-y-4 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-[#1a2030] pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white">Novo Cliente Pós-Venda</h3>
            <p className="text-xs text-[#94a3b8]">
              {prefill?.lead_id ? `Importando dados do lead ${prefill.lead_id}` : "Cadastro completo com checklist Antes × Depois"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Nome da Empresa *</label>
            <input
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!prefill) setSlug(slugifyClientName(e.target.value));
              }}
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Slug da URL (/crm/clientes/:slug)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-blue-300 font-mono"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Segmento</label>
            <input
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Responsável / Dono</label>
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Ex: Ângelo Pereira"
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">WhatsApp</label>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="5551984281009"
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white font-mono"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Bairro</label>
            <input
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Ex: Cavalhada"
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Cidade</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Porto Alegre"
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-300 mb-1">Endereço Comercial</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Av. Vicente Monteggia, 333 - Cavalhada"
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
            />
          </div>
        </div>

        {/* Frentes Contratadas */}
        <div className="rounded-xl border border-[#1a2030] bg-[#080b12] p-3.5 space-y-2.5 text-xs">
          <span className="font-bold text-white block">Frentes Contratadas:</span>
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 text-slate-200 min-h-[36px]">
              <input type="checkbox" checked={gbp} onChange={(e) => setGbp(e.target.checked)} />
              Google Meu Negócio
            </label>
            <label className="inline-flex items-center gap-2 text-slate-200 min-h-[36px]">
              <input type="checkbox" checked={googleAds} onChange={(e) => setGoogleAds(e.target.checked)} />
              Google Ads
            </label>
            <label className="inline-flex items-center gap-2 text-slate-200 min-h-[36px]">
              <input
                type="checkbox"
                checked={website}
                onChange={(e) => {
                  setWebsite(e.target.checked);
                  if (e.target.checked && websiteMode === "nenhum") setWebsiteMode("redesign");
                }}
              />
              Site (Novo / Redesign)
            </label>
          </div>
          {website && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <select
                value={websiteMode}
                onChange={(e) => setWebsiteMode(e.target.value as WebsiteMode)}
                className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-3 py-2 text-white"
              >
                <option value="novo">Criar site do zero</option>
                <option value="redesign">Versão melhor (Redesign)</option>
                <option value="manutencao">Manutenção / SEO</option>
              </select>
              <input
                value={websiteDomain}
                onChange={(e) => setWebsiteDomain(e.target.value)}
                placeholder="https://sitecliente.com.br"
                className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-3 py-2 text-white"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Plano / Pacote (Privado)</label>
            <input
              value={planLabel}
              onChange={(e) => setPlanLabel(e.target.value)}
              placeholder="Ex: Implantação + Gestão Mensal"
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Mensalidade R$ (Oculto na Apresentação)</label>
            <input
              type="number"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              placeholder="380"
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 rounded-xl border border-[#1a2030] text-xs font-bold text-[#94a3b8]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="min-h-[44px] px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white"
          >
            {submitting ? "Criando..." : "Criar Ficha do Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- 2. Modal de Snapshot Mensal / Baseline ---------- */
interface RecordSnapshotModalProps {
  isOpen: boolean;
  client: ClientAccount;
  existingSnapshots: ClientSnapshot[];
  onClose: () => void;
  onSaved: (snap: ClientSnapshot) => void;
}

export const RecordSnapshotModal: React.FC<RecordSnapshotModalProps> = ({
  isOpen,
  client,
  existingSnapshots,
  onClose,
  onSaved,
}) => {
  const now = new Date();
  const defaultPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [periodKey, setPeriodKey] = useState(defaultPeriod);
  const [periodLabel, setPeriodLabel] = useState("");
  const [snapshotType, setSnapshotType] = useState<"mensal" | "baseline_historico">("mensal");
  const [isBaseline, setIsBaseline] = useState(false);
  const [viewsTotal, setViewsTotal] = useState("");
  const [calls, setCalls] = useState("");
  const [routes, setRoutes] = useState("");
  const [siteClicks, setSiteClicks] = useState("");
  const [chatClicks, setChatClicks] = useState("");
  const [rating, setRating] = useState("");
  const [reviewCount, setReviewCount] = useState("");
  const [targetKeywordRank, setTargetKeywordRank] = useState("");
  const [adsClicks, setAdsClicks] = useState("");
  const [adsConversions, setAdsConversions] = useState("");
  const [adsSpendBrl, setAdsSpendBrl] = useState("");
  const [siteVersion, setSiteVersion] = useState(client.external_ids?.websiteVersionLabel || "");
  const [brokenUrls, setBrokenUrls] = useState("0");
  const [pagespeedMobile, setPagespeedMobile] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const numOrUndef = (val: string) => (val.trim() === "" ? undefined : Number(val));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const hasAnyInteraction =
        calls.trim() !== "" ||
        routes.trim() !== "" ||
        siteClicks.trim() !== "" ||
        chatClicks.trim() !== "";
      const c = numOrUndef(calls) ?? 0;
      const r = numOrUndef(routes) ?? 0;
      const sc = numOrUndef(siteClicks) ?? 0;
      const cc = numOrUndef(chatClicks) ?? 0;
      const totalInt = hasAnyInteraction ? c + r + sc + cc : undefined;

      const labelFallback = periodLabel.trim() || periodKey;
      const saved = await crmClientService.upsertSnapshot(client, existingSnapshots, {
        period_key: periodKey.trim(),
        period_label: labelFallback,
        snapshot_type: snapshotType,
        is_baseline: isBaseline,
        source: "manual",
        gbp_metrics: client.services_scope.gbp
          ? {
              viewsTotal: numOrUndef(viewsTotal),
              interactionsTotal: totalInt,
              calls: numOrUndef(calls),
              routes: numOrUndef(routes),
              siteClicks: numOrUndef(siteClicks),
              chatClicks: numOrUndef(chatClicks),
              rating: numOrUndef(rating),
              reviewCount: numOrUndef(reviewCount),
              targetKeywordRank: numOrUndef(targetKeywordRank),
            }
          : {},
        ads_metrics: client.services_scope.google_ads
          ? {
              clicks: numOrUndef(adsClicks),
              conversions: numOrUndef(adsConversions),
              spendBrl: numOrUndef(adsSpendBrl),
            }
          : {},
        site_metrics: client.services_scope.website
          ? {
              versionLabel: siteVersion.trim() || undefined,
              brokenUrlsCount: numOrUndef(brokenUrls),
              pagespeedMobile: numOrUndef(pagespeedMobile),
            }
          : {},
        executive_summary: summary.trim() || null,
        collection_warnings: [],
      });
      toast.success(`Mês ${saved.period_label} registrado com sucesso!`);
      onSaved(saved);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar mês.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl border border-[#1a2030] bg-[#0e1320] p-5 space-y-4 max-h-[92vh] overflow-y-auto text-xs"
      >
        <div className="flex items-center justify-between border-b border-[#1a2030] pb-3">
          <h3 className="text-base font-extrabold text-white">Registrar Fechamento Mensal / Snapshot</h3>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Chave (YYYY-MM)</label>
            <input
              required
              pattern="\d{4}-\d{2}"
              value={periodKey}
              onChange={(e) => setPeriodKey(e.target.value)}
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Rótulo (Ex: Dez/2026)</label>
            <input
              required
              value={periodLabel}
              onChange={(e) => setPeriodLabel(e.target.value)}
              placeholder="Dez/2026"
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Tipo</label>
            <select
              value={snapshotType}
              onChange={(e) => setSnapshotType(e.target.value as "mensal" | "baseline_historico")}
              className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2 text-white"
            >
              <option value="mensal">Fechamento Mensal</option>
              <option value="baseline_historico">Histórico Pré-Gestão</option>
            </select>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-amber-300 font-semibold">
          <input type="checkbox" checked={isBaseline} onChange={(e) => setIsBaseline(e.target.checked)} />
          Marcar como Marco Zero Oficial (Baseline)
        </label>

        {client.services_scope.gbp && (
          <div className="rounded-xl border border-[#1a2030] bg-[#080b12] p-3 space-y-2">
            <span className="font-bold text-blue-300 block">Google Meu Negócio</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <input type="number" placeholder="Views" value={viewsTotal} onChange={(e) => setViewsTotal(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" placeholder="Ligações" value={calls} onChange={(e) => setCalls(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" placeholder="Rotas" value={routes} onChange={(e) => setRoutes(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" placeholder="Cliques Site" value={siteClicks} onChange={(e) => setSiteClicks(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" placeholder="Cliques Chat" value={chatClicks} onChange={(e) => setChatClicks(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" step="0.1" placeholder="Nota (4.5)" value={rating} onChange={(e) => setRating(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" placeholder="Avaliações" value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" placeholder="Posição Maps" value={targetKeywordRank} onChange={(e) => setTargetKeywordRank(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
            </div>
          </div>
        )}

        {client.services_scope.google_ads && (
          <div className="rounded-xl border border-[#1a2030] bg-[#080b12] p-3 space-y-2">
            <span className="font-bold text-amber-300 block">Google Ads</span>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="Cliques" value={adsClicks} onChange={(e) => setAdsClicks(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" placeholder="Conversões" value={adsConversions} onChange={(e) => setAdsConversions(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" step="0.01" placeholder="Gasto R$" value={adsSpendBrl} onChange={(e) => setAdsSpendBrl(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
            </div>
          </div>
        )}

        {client.services_scope.website && (
          <div className="rounded-xl border border-[#1a2030] bg-[#080b12] p-3 space-y-2">
            <span className="font-bold text-emerald-300 block">Site</span>
            <div className="grid grid-cols-3 gap-2">
              <input placeholder="Versão (ex: v2)" value={siteVersion} onChange={(e) => setSiteVersion(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" placeholder="Erros 404" value={brokenUrls} onChange={(e) => setBrokenUrls(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
              <input type="number" placeholder="PageSpeed Mob." value={pagespeedMobile} onChange={(e) => setPagespeedMobile(e.target.value)} className="rounded-lg bg-[#0e1320] border border-[#1a2030] px-2.5 py-2 text-white" />
            </div>
          </div>
        )}

        <textarea
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Resumo executivo do mês (exibido ao cliente na evolução)"
          className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] p-3 text-white"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="min-h-[44px] px-4 rounded-xl border border-[#1a2030] font-bold text-[#94a3b8]">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="min-h-[44px] px-5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white">
            {saving ? "Salvando..." : "Salvar Mês"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- 3. Modal de Entrega na Timeline ou Novo Item Checklist ---------- */
interface AddChecklistOrLogModalProps {
  mode: "log" | "checklist" | null;
  client: ClientAccount;
  nextSortOrder: number;
  onClose: () => void;
  onChecklistAdded: (item: ClientChecklistItem) => void;
  onLogAdded: (log: ClientChangeLog) => void;
}

export const AddChecklistOrLogModal: React.FC<AddChecklistOrLogModalProps> = ({
  mode,
  client,
  nextSortOrder,
  onClose,
  onChecklistAdded,
  onLogAdded,
}) => {
  const [pillar, setPillar] = useState<ClientPillar>("gbp");
  const [actionType, setActionType] = useState<ChangeLogActionType>("implementacao");
  const [title, setTitle] = useState("");
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");
  const [visibleToClient, setVisibleToClient] = useState(true);
  const [beforeStatus, setBeforeStatus] = useState<ChecklistBeforeStatus>("ausente");
  const [currentStatus, setCurrentStatus] = useState<ChecklistCurrentStatus>("pendente");
  const [saving, setSaving] = useState(false);

  if (!mode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      if (mode === "log") {
        const log = await crmClientService.addChangeLog(client.id, client.slug, {
          pillar: pillar as ChangeLogPillar,
          action_type: actionType,
          title,
          before_state: beforeText || null,
          after_state: afterText || null,
          automation_source: "manual",
          visible_to_client: visibleToClient,
        });
        toast.success("Entrega registrada na linha do tempo!");
        onLogAdded(log);
      } else {
        const item = await crmClientService.addChecklistItem(client.id, client.slug, {
          pillar,
          category_label: pillar === "gbp" ? "GMN Personalizado" : pillar === "website" ? "Site" : "Ads",
          title,
          impact_level: "alta" as ImpactLevel,
          before_status: beforeStatus,
          before_value: beforeText,
          current_status: currentStatus,
          current_value: afterText,
          sort_order: nextSortOrder,
        });
        toast.success("Item adicionado ao checklist Antes × Depois!");
        onChecklistAdded(item);
      }
      setTitle("");
      setBeforeText("");
      setAfterText("");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar registro.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-[#1a2030] bg-[#0e1320] p-5 space-y-3.5 text-xs"
      >
        <div className="flex items-center justify-between border-b border-[#1a2030] pb-2.5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-400" />
            <span>{mode === "log" ? "Registrar Entrega / Versão" : "Adicionar Item Antes × Depois"}</span>
          </h3>
          <button type="button" onClick={onClose} className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={pillar}
            onChange={(e) => setPillar(e.target.value as ClientPillar)}
            className="rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
          >
            <option value="gbp">Google Meu Negócio</option>
            <option value="website">Site</option>
            <option value="google_ads">Google Ads</option>
          </select>

          {mode === "log" ? (
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value as ChangeLogActionType)}
              className="rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
            >
              <option value="implementacao">Implementação</option>
              <option value="versao_site">Versão do Site</option>
              <option value="campanha_ads">Campanha Ads</option>
              <option value="correcao">Correção</option>
              <option value="monitoramento">Monitoramento</option>
            </select>
          ) : (
            <select
              value={beforeStatus}
              onChange={(e) => setBeforeStatus(e.target.value as ChecklistBeforeStatus)}
              className="rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
            >
              <option value="ausente">Antes: Ausente</option>
              <option value="incompleto">Antes: Incompleto</option>
              <option value="incorreto">Antes: Incorreto</option>
            </select>
          )}
        </div>

        <input
          required
          placeholder="Título claro da melhoria ou entrega"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
        />
        <input
          placeholder="Estado Antes (ex: 0 redes sociais / Site v1 com 404)"
          value={beforeText}
          onChange={(e) => setBeforeText(e.target.value)}
          className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
        />
        <input
          placeholder="Estado Depois / Atual (ex: Instagram vinculado / Site v2 publicado)"
          value={afterText}
          onChange={(e) => setAfterText(e.target.value)}
          className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
        />

        {mode === "log" ? (
          <label className="inline-flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              checked={visibleToClient}
              onChange={(e) => setVisibleToClient(e.target.checked)}
            />
            Exibir no Modo Apresentação para o cliente
          </label>
        ) : (
          <select
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as ChecklistCurrentStatus)}
            className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
          >
            <option value="pendente">Status atual: Pendente</option>
            <option value="em_andamento">Status atual: Em andamento</option>
            <option value="otimizado">Status atual: Otimizado</option>
          </select>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="min-h-[44px] px-4 rounded-xl border border-[#1a2030] text-[#94a3b8] font-bold">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="min-h-[44px] px-5 rounded-xl bg-blue-600 text-white font-bold">
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- 4. Modal de Upload de Print Antes × Depois ---------- */
interface UploadEvidenceModalProps {
  isOpen: boolean;
  client: ClientAccount;
  onClose: () => void;
  onUploaded: (evidence: ClientEvidence) => void;
}

export const UploadEvidenceModal: React.FC<UploadEvidenceModalProps> = ({
  isOpen,
  client,
  onClose,
  onUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [pillar, setPillar] = useState<ClientPillar>("gbp");
  const [phase, setPhase] = useState<EvidencePhase>("depois");
  const [pairKey, setPairKey] = useState("perfil-capa-logo");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      toast.error("Selecione a imagem e informe o título.");
      return;
    }
    setUploading(true);
    try {
      const ev = await crmClientService.uploadEvidence({
        clientId: client.id,
        slug: client.slug,
        file,
        pillar,
        phase,
        pair_key: pairKey,
        title,
        caption,
      });
      toast.success("Evidência salva no Storage privado!");
      onUploaded(ev);
      setFile(null);
      setTitle("");
      setCaption("");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-[#1a2030] bg-[#0e1320] p-5 space-y-3.5 text-xs"
      >
        <div className="flex items-center justify-between border-b border-[#1a2030] pb-2.5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Enviar Print Antes × Depois</span>
          </h3>
          <button type="button" onClick={onClose} className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select value={pillar} onChange={(e) => setPillar(e.target.value as ClientPillar)} className="rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white">
            <option value="gbp">Google Meu Negócio</option>
            <option value="website">Site</option>
            <option value="google_ads">Google Ads</option>
          </select>
          <select value={phase} onChange={(e) => setPhase(e.target.value as EvidencePhase)} className="rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white">
            <option value="antes">Antes (Pré-gestão)</option>
            <option value="depois">Depois (Otimizado)</option>
            <option value="mensal">Fechamento Mensal</option>
          </select>
        </div>

        <input
          placeholder="Chave do Par (ex: perfil-capa-logo, maps-publico, site-home)"
          value={pairKey}
          onChange={(e) => setPairKey(e.target.value)}
          className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-blue-300 font-mono"
        />
        <input
          required
          placeholder="Título da evidência"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
        />
        <input
          placeholder="Legenda explicativa curta (opcional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] px-3 py-2.5 text-white"
        />
        <input
          required
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl bg-[#080b12] border border-[#1a2030] p-2.5 text-slate-300"
        />

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="min-h-[44px] px-4 rounded-xl border border-[#1a2030] text-[#94a3b8] font-bold">
            Cancelar
          </button>
          <button type="submit" disabled={uploading} className="min-h-[44px] px-5 rounded-xl bg-amber-500 text-slate-950 font-bold">
            {uploading ? "Enviando..." : "Salvar Print"}
          </button>
        </div>
      </form>
    </div>
  );
};
```

- [ ] **Step 5: Validar compilação TypeScript e commit**

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run typecheck`
Expected: 0 erros TypeScript.

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add src/pages/crm/components/ClientEvolutionChart.tsx src/pages/crm/components/ClientBeforeAfterSection.tsx src/pages/crm/components/ClientWhatsAppReportPanel.tsx src/pages/crm/components/ClientEditPanels.tsx
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add mobile-first client chart, before-after matrix, edit modals and whatsapp panel"
```

---

### Task 9: Páginas `/crm/clientes` & `/crm/clientes/:slug` + Roteamento no `src/main.tsx`

**Files:**
- Create: `src/pages/crm/ClientPortfolio.tsx`
- Create: `src/pages/crm/ClientDetail.tsx`
- Modify: `src/main.tsx:39-48,122-144`

**Interfaces:**
- Consumes: `SeoHead`, `CrmProtectedRoute`, `CrmNavBar`, `CloudSyncBanner`, `ClientEvolutionChart`, `ClientBeforeAfterSection`, `ClientWhatsAppReportPanel`, `NewClientModal`, `RecordSnapshotModal`, `AddChecklistOrLogModal`, `UploadEvidenceModal`, `crmClientService`, `crmProspectService`, `buildClientComparisonSummary`, `buildPrefillFromLead`.
- Produces: Páginas `/crm/clientes` e `/crm/clientes/:slug` (`?present=1` e `?fromLead=`).

- [ ] **Step 1: Criar `src/pages/crm/ClientPortfolio.tsx` (`/crm/clientes`)**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\ClientPortfolio.tsx`:

```typescript
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "../../lib/local-router";
import { Eye, Globe, LogOut, MapPin, Megaphone, Plus, Search, Sparkles, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { SeoHead } from "../../components/SeoHead";
import { supabase } from "../../lib/supabase";
import { CrmNavBar } from "./components/CrmNavBar";
import { CloudSyncBanner } from "./components/CloudSyncBanner";
import { NewClientModal } from "./components/ClientEditPanels";
import type { ClientAccount, ClientStatus } from "./clientTypes";
import { crmClientService } from "./services/crmClientService";
import { crmProspectService } from "./services/crmProspectService";
import { buildPrefillFromLead, type ClientFormPrefill } from "./utils/clientDefaults";

const STATUS_BADGE: Record<ClientStatus, { label: string; cls: string }> = {
  onboarding: { label: "Onboarding (Marco Zero)", cls: "bg-amber-500/15 text-amber-300 border-amber-500/35" },
  ativo: { label: "Ativo", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/35" },
  pausado: { label: "Pausado", cls: "bg-slate-800 text-slate-300 border-slate-700" },
  encerrado: { label: "Encerrado", cls: "bg-rose-500/15 text-rose-300 border-rose-500/35" },
};

export default function ClientPortfolio() {
  const location = useLocation();
  const navigate = useNavigate();

  const [clients, setClients] = useState<ClientAccount[]>([]);
  const [cloudSynced, setCloudSynced] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | ClientStatus>("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [prefill, setPrefill] = useState<ClientFormPrefill | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await crmClientService.listClients();
        if (!mounted) return;
        setClients(res.clients);
        setCloudSynced(res.cloudSynced);

        const params = new URLSearchParams(location.search);
        const fromLead = params.get("fromLead");
        if (fromLead) {
          const existing = res.clients.find((c) => c.lead_id === fromLead);
          if (existing) {
            navigate(`/crm/clientes/${existing.slug}`, { replace: true });
            return;
          }
          const leads = await crmProspectService.getLeads();
          const matchedLead = leads.find((l) => l.id === fromLead);
          if (matchedLead && mounted) {
            setPrefill(buildPrefillFromLead(matchedLead));
            setModalOpen(true);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [location.search, navigate]);

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      const matchStatus = statusFilter === "todos" || c.status === statusFilter;
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.segment.toLowerCase().includes(q) ||
        (c.neighborhood || "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [clients, search, statusFilter]);

  const handleLogout = async () => {
    localStorage.removeItem("crm_offline_session");
    localStorage.removeItem("crm_user_email");
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    toast.success("Sessão encerrada");
    navigate("/crm/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f1f5f9] flex flex-col overflow-x-hidden">
      <SeoHead
        title="Clientes & Histórico Antes × Depois | CRM Leonardo Brasil"
        description="Acompanhamento mensal de clientes, registro imutável do Antes, Modo Apresentação e Relatórios WhatsApp."
        canonicalUrl="https://leonardobrasil.com.br/crm/clientes"
        robots="noindex, nofollow"
      />

      <header className="border-b border-[#1a2030] bg-[#0a0d14]/95 backdrop-blur-xl sticky top-0 z-30">
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-emerald-500" />
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-400 p-[1.5px]">
                <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-white">Leonardo Brasil</span>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Clientes Ativos
                  </span>
                </div>
                <p className="text-[11px] text-[#94a3b8]">Histórico Antes × Depois · Apresentação · WhatsApp</p>
              </div>
            </Link>

            <CrmNavBar />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setPrefill(null);
                setModalOpen(true);
              }}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cliente</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#1a2030] bg-[#0f1420] text-[#94a3b8] hover:text-white text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        <CloudSyncBanner visible={!cloudSynced} />

        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente, segmento ou bairro..."
              className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-xl bg-[#0e1320] border border-[#1a2030] text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "todos" as const, label: `Todos (${clients.length})` },
              { id: "onboarding" as const, label: "Onboarding" },
              { id: "ativo" as const, label: "Ativos" },
              { id: "pausado" as const, label: "Pausados" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  statusFilter === tab.id
                    ? "bg-blue-600 text-white border-blue-400"
                    : "bg-[#0e1320] text-[#94a3b8] border-[#1a2030] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-xs text-[#94a3b8]">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-amber-400 rounded-full animate-spin mb-3" />
            Carregando carteira de clientes...
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1a2030] bg-[#0e1320] p-10 text-center space-y-3">
            <Users className="w-8 h-8 text-amber-400 mx-auto" />
            <h2 className="text-base font-extrabold text-white">Nenhum cliente cadastrado ainda</h2>
            <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
              Cadastre manualmente no botão acima, converta um lead fechado no Kanban ou execute a sincronização automática via CLI.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClients.map((c) => {
              const badge = STATUS_BADGE[c.status];
              return (
                <article
                  key={c.id}
                  className="rounded-2xl border border-[#1a2030] bg-gradient-to-b from-[#111726] to-[#0c101b] p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-lg"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                          {c.segment}
                        </span>
                        <h2 className="text-lg font-extrabold text-white leading-tight mt-0.5">{c.name}</h2>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-xs text-[#94a3b8] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{[c.neighborhood, c.city].filter(Boolean).join(", ")}</span>
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {c.services_scope.gbp && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-bold">
                          <MapPin className="w-3 h-3" /> GMN
                        </span>
                      )}
                      {c.services_scope.google_ads && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                          <Megaphone className="w-3 h-3" /> Google Ads
                        </span>
                      )}
                      {c.services_scope.website && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                          <Globe className="w-3 h-3" /> Site ({c.external_ids?.websiteVersionLabel || c.services_scope.website_mode})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1a2030]">
                    <Link
                      to={`/crm/clientes/${c.slug}`}
                      className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/35 text-blue-200 text-xs font-bold text-center"
                    >
                      Abrir Gestão
                    </Link>
                    <Link
                      to={`/crm/clientes/${c.slug}?present=1`}
                      className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-bold text-center"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Apresentar</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <NewClientModal
        isOpen={modalOpen}
        prefill={prefill}
        onClose={() => setModalOpen(false)}
        onCreated={(created) => {
          setModalOpen(false);
          navigate(`/crm/clientes/${created.slug}`);
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Criar `src/pages/crm/ClientDetail.tsx` (`/crm/clientes/:slug`)**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\pages\crm\ClientDetail.tsx`:

```typescript
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "../../lib/local-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  Plus,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { SeoHead } from "../../components/SeoHead";
import { CrmNavBar } from "./components/CrmNavBar";
import { CloudSyncBanner } from "./components/CloudSyncBanner";
import { ClientEvolutionChart, renderTrendBadge } from "./components/ClientEvolutionChart";
import { ClientBeforeAfterSection } from "./components/ClientBeforeAfterSection";
import { ClientWhatsAppReportPanel } from "./components/ClientWhatsAppReportPanel";
import {
  AddChecklistOrLogModal,
  RecordSnapshotModal,
  UploadEvidenceModal,
} from "./components/ClientEditPanels";
import type {
  ChecklistCurrentStatus,
  ClientChecklistItem,
  ClientEvidence,
  ClientFullBundle,
  ClientPillar,
  MetricDelta,
} from "./clientTypes";
import { buildClientComparisonSummary } from "./utils/clientAnalytics";
import { crmClientService } from "./services/crmClientService";

function fmtNumber(v?: number | null): string {
  if (typeof v !== "number" || !Number.isFinite(v)) return "—";
  return Math.round(v).toLocaleString("pt-BR");
}

function fmtDeltaLine(delta?: MetricDelta, labelPrefix = "vs anterior"): string {
  if (!delta || delta.reference === null || delta.percentDiff === null) return "Sem comparativo anterior";
  const arrow = delta.outcome === "melhora" ? "↑" : delta.outcome === "piora" ? "↓" : "=";
  const sign = delta.percentDiff > 0 ? "+" : "";
  return `${arrow} ${sign}${delta.percentDiff.toLocaleString("pt-BR")}% ${labelPrefix}`;
}

function deltaToneClass(delta?: MetricDelta): string {
  if (!delta || delta.reference === null) return "text-[#94a3b8]";
  if (delta.outcome === "melhora") return "text-emerald-400";
  if (delta.outcome === "piora") return "text-rose-400";
  return "text-[#94a3b8]";
}

export default function ClientDetail() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [bundle, setBundle] = useState<ClientFullBundle | null>(null);
  const [cloudSynced, setCloudSynced] = useState(true);
  const [loading, setLoading] = useState(true);
  const [presentationMode, setPresentationMode] = useState(
    () => new URLSearchParams(location.search).get("present") === "1",
  );
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string>("");
  const [activePillar, setActivePillar] = useState<"todos" | ClientPillar>("todos");

  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [addModalMode, setAddModalMode] = useState<"log" | "checklist" | null>(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  const loadBundle = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await crmClientService.getClientBundleBySlug(slug);
      setBundle(res.bundle);
      setCloudSynced(res.cloudSynced);
      if (res.bundle?.snapshots?.length) {
        const lastSnap = res.bundle.snapshots[res.bundle.snapshots.length - 1];
        setSelectedPeriodKey((prev) => prev || lastSnap.period_key);
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    setSelectedPeriodKey("");
  }, [slug]);

  useEffect(() => {
    loadBundle();
  }, [loadBundle]);

  useEffect(() => {
    setPresentationMode(new URLSearchParams(location.search).get("present") === "1");
  }, [location.search]);

  const togglePresentationMode = () => {
    const next = !presentationMode;
    setPresentationMode(next);
    if (slug) {
      navigate(next ? `/crm/clientes/${slug}?present=1` : `/crm/clientes/${slug}`, { replace: true });
    }
  };

  const summary = useMemo(() => {
    if (!bundle) return null;
    return buildClientComparisonSummary(
      bundle.snapshots,
      bundle.checklist,
      bundle.client.services_scope,
      selectedPeriodKey || undefined,
    );
  }, [bundle, selectedPeriodKey]);

  const handleToggleChecklist = async (item: ClientChecklistItem, nextStatus: ChecklistCurrentStatus) => {
    if (!bundle) return;
    const updated = await crmClientService.updateChecklistStatus(
      bundle.client.id,
      bundle.client.slug,
      item,
      nextStatus,
    );
    setBundle((prev) =>
      prev
        ? {
            ...prev,
            checklist: prev.checklist.map((c) => (c.id === updated.id ? updated : c)),
          }
        : prev,
    );
    toast.success("Status atualizado no checklist.");
  };

  const handleDeleteEvidence = async (ev: ClientEvidence) => {
    if (!bundle) return;
    try {
      await crmClientService.deleteEvidence(bundle.client.id, ev);
      setBundle((prev) =>
        prev ? { ...prev, evidences: prev.evidences.filter((item) => item.id !== ev.id) } : prev,
      );
      toast.success("Print removido.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover print.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center text-xs text-[#94a3b8]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-amber-400 rounded-full animate-spin mb-3" />
        Carregando ficha e histórico completo do cliente...
      </div>
    );
  }

  if (!bundle || !summary) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-xl font-extrabold">Cliente não encontrado ({slug})</h1>
        <p className="text-xs text-[#94a3b8] max-w-md">
          Verifique se o cliente já foi sincronizado no Supabase e se você está conectado com login real na nuvem.
        </p>
        <Link
          to="/crm/clientes"
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Carteira de Clientes
        </Link>
      </div>
    );
  }

  const { client, checklist, snapshots, changeLogs, evidences } = bundle;
  const latest = summary.latestSnapshot;
  const baseline = summary.baselineSnapshot;
  const visibleLogs = presentationMode ? changeLogs.filter((l) => l.visible_to_client) : changeLogs;

  const pillarTabs: Array<{ id: "todos" | ClientPillar; label: string }> = [
    { id: "todos", label: "Visão Geral" },
    ...(client.services_scope.gbp ? [{ id: "gbp" as const, label: "Google Meu Negócio" }] : []),
    ...(client.services_scope.google_ads ? [{ id: "google_ads" as const, label: "Google Ads" }] : []),
    ...(client.services_scope.website ? [{ id: "website" as const, label: "Site" }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f1f5f9] flex flex-col overflow-x-hidden">
      <SeoHead
        title={`${client.name} — Evolução & Histórico | CRM Leonardo Brasil`}
        description="Acompanhamento de evolução mensal e registro Antes × Depois."
        canonicalUrl={`https://leonardobrasil.com.br/crm/clientes/${client.slug}`}
        robots="noindex, nofollow"
      />

      {/* Cabeçalho Superior (Modo Apresentação oculta navegação CRM) */}
      <header className="border-b border-[#1a2030] bg-[#0a0d14]/95 backdrop-blur-xl sticky top-0 z-30">
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-emerald-500" />
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
              {!presentationMode && (
                <Link
                  to="/crm/clientes"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#94a3b8] hover:text-white shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" /> Carteira
                </Link>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {presentationMode && <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />}
                  <h1 className="text-lg sm:text-xl font-extrabold text-white truncate">{client.name}</h1>
                  {renderTrendBadge(summary.latestComputedStatus)}
                </div>
                <p className="text-xs text-[#94a3b8] flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    {client.segment} · {[client.neighborhood, client.city].filter(Boolean).join(", ")}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {!presentationMode && <CrmNavBar />}

              <button
                type="button"
                onClick={togglePresentationMode}
                className={`min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  presentationMode
                    ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/45 hover:bg-amber-500/30"
                }`}
              >
                {presentationMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{presentationMode ? "Sair da Apresentação" : "Modo Apresentação"}</span>
              </button>
            </div>
          </div>

          {/* Barra de Filtros de Frente + Botões de Gestão */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[#1a2030]">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {pillarTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePillar(tab.id)}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                    activePillar === tab.id
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-[#0e1320] text-[#94a3b8] border-[#1a2030] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {!presentationMode && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSnapshotModalOpen(true)}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/35 text-blue-300 text-xs font-bold whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5" /> + Registrar Mês
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalMode("log")}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" /> + Entrega / Versão
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalMode("checklist")}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e1320] border border-[#1a2030] text-slate-200 text-xs font-bold whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" /> + Item Checklist
                </button>
                <button
                  type="button"
                  onClick={() => setEvidenceModalOpen(true)}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-bold whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" /> + Print
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {!presentationMode && <CloudSyncBanner visible={!cloudSynced} />}

        {/* BLOCO 1: Placar Executivo Antes x Agora (Mobile grid-cols-2) */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              Placar Executivo ({latest ? latest.period_label : "Marco Zero"})
            </h2>
            {baseline && latest && baseline.id !== latest.id && (
              <span className="text-xs text-amber-300 font-semibold">
                Referência Baseline: {baseline.period_label}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 tabular-nums">
            {client.services_scope.gbp && (
              <>
                <div className="rounded-xl border border-[#1a2030] bg-[#0e1320] p-3.5">
                  <span className="text-[11px] font-semibold text-[#94a3b8] block">Visualizações GMN</span>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">
                    {fmtNumber(latest?.gbp_metrics?.viewsTotal)}
                  </p>
                  <span className={`text-[11px] font-semibold block mt-1 ${deltaToneClass(summary.deltasVsPrevious.gbp_views)}`}>
                    {fmtDeltaLine(summary.deltasVsPrevious.gbp_views)}
                  </span>
                </div>

                <div className="rounded-xl border border-[#1a2030] bg-[#0e1320] p-3.5">
                  <span className="text-[11px] font-semibold text-[#94a3b8] block">Interações Totais</span>
                  <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                    {fmtNumber(latest?.gbp_metrics?.interactionsTotal)}
                  </p>
                  <span className={`text-[11px] font-semibold block mt-1 ${deltaToneClass(summary.deltasVsPrevious.gbp_interactions)}`}>
                    {fmtDeltaLine(summary.deltasVsPrevious.gbp_interactions)}
                  </span>
                </div>

                <div className="rounded-xl border border-[#1a2030] bg-[#0e1320] p-3.5">
                  <span className="text-[11px] font-semibold text-[#94a3b8] block">Ligações & Rotas</span>
                  <p className="text-xl sm:text-2xl font-black text-blue-300 mt-1">
                    {fmtNumber(latest?.gbp_metrics?.calls)} / {fmtNumber(latest?.gbp_metrics?.routes)}
                  </p>
                  <span className="text-[11px] text-[#94a3b8] block mt-1">
                    Site: {fmtNumber(latest?.gbp_metrics?.siteClicks)} · Chat: {fmtNumber(latest?.gbp_metrics?.chatClicks)}
                  </span>
                </div>

                <div className="rounded-xl border border-[#1a2030] bg-[#0e1320] p-3.5">
                  <span className="text-[11px] font-semibold text-[#94a3b8] block">Reputação Google</span>
                  <p className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
                    {latest?.gbp_metrics?.rating ? `${latest.gbp_metrics.rating.toFixed(1)}★` : "—"}
                  </p>
                  <span className="text-[11px] text-[#94a3b8] block mt-1">
                    {fmtNumber(latest?.gbp_metrics?.reviewCount)} avaliações
                  </span>
                </div>
              </>
            )}

            <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/15 p-3.5">
              <span className="text-[11px] font-semibold text-emerald-300 block">Checklist Antes → Depois</span>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">
                {summary.checklistProgress.completionPct}%
              </p>
              <span className="text-[11px] text-emerald-300/90 block mt-1">
                {summary.checklistProgress.optimized} de {summary.checklistProgress.applicable} itens otimizados
              </span>
            </div>

            {client.services_scope.google_ads && (
              <div className="rounded-xl border border-[#1a2030] bg-[#0e1320] p-3.5">
                <span className="text-[11px] font-semibold text-[#94a3b8] block">Google Ads (Cliques / Conv.)</span>
                <p className="text-lg sm:text-xl font-black text-blue-300 mt-1">
                  {fmtNumber(latest?.ads_metrics?.clicks)} / {fmtNumber(latest?.ads_metrics?.conversions)}
                </p>
                <span className="text-[11px] text-[#94a3b8] block mt-1">
                  {latest?.ads_metrics?.statusLabel || "Acompanhamento mensal Ads"}
                </span>
              </div>
            )}

            {client.services_scope.website && (
              <div className="rounded-xl border border-[#1a2030] bg-[#0e1320] p-3.5">
                <span className="text-[11px] font-semibold text-[#94a3b8] block">
                  Site ({latest?.site_metrics?.versionLabel || client.external_ids?.websiteVersionLabel || "Web"})
                </span>
                <p className="text-lg sm:text-xl font-black text-white mt-1">
                  {latest?.site_metrics?.brokenUrlsCount === 0
                    ? "100% Online"
                    : `${latest?.site_metrics?.brokenUrlsCount ?? "—"} erro(s) 404`}
                </p>
                <span className="text-[11px] text-[#94a3b8] block mt-1">
                  {latest?.site_metrics?.pagespeedMobile !== undefined
                    ? `PageSpeed Mobile: ${latest.site_metrics.pagespeedMobile}/100`
                    : "Auditoria de URLs monitorada"}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* BLOCO 2: Evolução Mês a Mês */}
        <ClientEvolutionChart
          orderedSnapshots={snapshots}
          selectedPeriodKey={selectedPeriodKey || latest?.period_key || ""}
          onSelectPeriod={setSelectedPeriodKey}
          scope={client.services_scope}
          activePillar={activePillar}
        />

        {/* BLOCO 3: Checklist Antes x Depois & Galeria Pareada */}
        <ClientBeforeAfterSection
          checklist={checklist}
          evidences={evidences}
          scope={client.services_scope}
          activePillar={activePillar}
          presentationMode={presentationMode}
          onChangeChecklistStatus={presentationMode ? undefined : handleToggleChecklist}
          onDeleteEvidence={presentationMode ? undefined : handleDeleteEvidence}
        />

        {/* BLOCO 4: Linha do Tempo de Entregas & Versões */}
        <section className="rounded-2xl border border-[#1a2030] bg-[#0e1320] p-4 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
            <span>Linha do Tempo de Otimizações e Versões</span>
          </h2>

          {visibleLogs.length === 0 ? (
            <p className="text-xs text-[#94a3b8]">Nenhuma entrega registrada até o momento.</p>
          ) : (
            <div className="space-y-3">
              {visibleLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-[#1a2030] bg-[#080b12] p-3.5 space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold uppercase">
                        {log.pillar}
                      </span>
                      <span className="text-[#94a3b8] font-mono">
                        {new Date(log.occurred_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    {!presentationMode && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {log.automation_source} {!log.visible_to_client ? "· 🔒 Privado" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-white">{log.title}</p>
                  {(log.before_state || log.after_state) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      {log.before_state && (
                        <div className="rounded-lg bg-rose-950/20 border border-rose-500/20 px-2.5 py-1.5 text-rose-200">
                          <strong>Antes:</strong> {log.before_state}
                        </div>
                      )}
                      {log.after_state && (
                        <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-1.5 text-emerald-200">
                          <strong>Depois:</strong> {log.after_state}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* BLOCO EXCLUSIVO MODO GESTÃO: Contrato Privado & Relatório WhatsApp */}
        {!presentationMode && (
          <>
            {(client.contract_meta?.planLabel ||
              client.contract_meta?.monthlyFeeBrl ||
              client.contract_meta?.setupFeeBrl ||
              client.contract_meta?.privateNotes) && (
              <section className="rounded-2xl border border-amber-500/30 bg-[#0e1320] p-4 sm:p-5 space-y-2 text-xs">
                <h2 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Notas Privadas & Acordo Comercial (Oculto no Modo Apresentação)</span>
                </h2>
                {client.contract_meta?.planLabel && (
                  <p className="text-slate-200">
                    <strong>Escopo / Plano:</strong> {client.contract_meta.planLabel}
                  </p>
                )}
                {typeof client.contract_meta?.monthlyFeeBrl === "number" && (
                  <p className="text-slate-200">
                    <strong>Mensalidade:</strong> R$ {client.contract_meta.monthlyFeeBrl.toLocaleString("pt-BR")}
                  </p>
                )}
                {client.contract_meta?.privateNotes && (
                  <p className="text-[#94a3b8] leading-relaxed">{client.contract_meta.privateNotes}</p>
                )}
              </section>
            )}

            <ClientWhatsAppReportPanel
              client={client}
              snapshots={snapshots}
              checklist={checklist}
              changeLogs={changeLogs}
              selectedPeriodKey={selectedPeriodKey || latest?.period_key}
            />
          </>
        )}
      </main>

      {!presentationMode && (
        <>
          <RecordSnapshotModal
            isOpen={snapshotModalOpen}
            client={client}
            existingSnapshots={snapshots}
            onClose={() => setSnapshotModalOpen(false)}
            onSaved={(saved) => {
              setSelectedPeriodKey(saved.period_key);
              setSnapshotModalOpen(false);
              loadBundle();
            }}
          />

          <AddChecklistOrLogModal
            mode={addModalMode}
            client={client}
            nextSortOrder={checklist.length + 1}
            onClose={() => setAddModalMode(null)}
            onChecklistAdded={() => loadBundle()}
            onLogAdded={() => loadBundle()}
          />

          <UploadEvidenceModal
            isOpen={evidenceModalOpen}
            client={client}
            onClose={() => setEvidenceModalOpen(false)}
            onUploaded={() => loadBundle()}
          />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Registrar as novas rotas `/crm/clientes` e `/crm/clientes/:slug` em `src/main.tsx`**

Em `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\main.tsx`:
1. Após a linha 42 (`const CrmKeywordPlanner = ...`), adicionar os dois imports lazy:

```typescript
const CrmClientPortfolio = lazy(() => import("./pages/crm/ClientPortfolio"));
const CrmClientDetail = lazy(() => import("./pages/crm/ClientDetail"));
```

2. Após a rota `/crm/keywords` (linha 141), adicionar as duas rotas protegidas:

```tsx
            <Route
              path="/crm/clientes"
              element={
                <CrmProtectedRoute>
                  <CrmClientPortfolio />
                </CrmProtectedRoute>
              }
            />
            <Route
              path="/crm/clientes/:slug"
              element={
                <CrmProtectedRoute>
                  <CrmClientDetail />
                </CrmProtectedRoute>
              }
            />
```

- [ ] **Step 4: Validar `typecheck`, `build` (SSR + prerender + bundles) e `npm test`**

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run verify`
Expected: `typecheck` 0 erros, `build` completo (rotas `/crm/clientes*` continuam fora do prerender), e todos os testes unitários em `server/*.test.mjs` 100% aprovados.

- [ ] **Step 5: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add src/pages/crm/ClientPortfolio.tsx src/pages/crm/ClientDetail.tsx src/main.tsx
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add ClientPortfolio and mobile-first ClientDetail pages with Presentation Mode"
```


---

### Task 10: Seed Real da Ângelo Car (`O-005`), Verificação Automatizada & Inspeção Visual Desktop/Mobile

**Files:**
- Modify: `.gitignore` (adicionar `scripts/data/evidences/` para não versionar PNGs grandes no Git)
- Create: `scripts/data/angelo-car-baseline.json`
- Copy: `scripts/data/evidences/angelo-car/evidencia-fotos-capa-logo.png`, `evidencia-maps-publico.png`, `evidencia-streetview-fachada.png` (a partir de `C:\Users\leona\.gemini\antigravity\brain\34893dff-d3cd-473f-bde0-e96299a5f367\`)

**Interfaces:**
- Consumes: `scripts/crm-client-sync.mjs` (Task 5), `supabase/migrations/20261110_crm_clients_history.sql` (Task 1), rotas `/crm/clientes` e `/crm/clientes/angelo-car` (Task 9).
- Produces: Ficha completa da **Ângelo Car (`slug: 'angelo-car'`, `lead_id: 'O-005'`)** com o **"Antes"** pré-otimização completo gravado no Supabase + prints no bucket privado `client-evidences` + validação visual em `1440×900` e `390×844`.

- [ ] **Step 1: Ignorar pasta local de binários de evidência no `.gitignore` e copiar os 3 prints auditados**

Adicionar no final de `D:\LEONARDO\Drive\Projetos\leonardo-brasil\.gitignore`:

```gitignore
scripts/data/evidences/
```

Copiar os 3 arquivos de evidência da auditoria:

```powershell
$dest = "D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\data\evidences\angelo-car"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item "C:\Users\leona\.gemini\antigravity\brain\34893dff-d3cd-473f-bde0-e96299a5f367\evidencia-fotos-capa-logo.png" "$dest\evidencia-fotos-capa-logo.png" -Force
Copy-Item "C:\Users\leona\.gemini\antigravity\brain\34893dff-d3cd-473f-bde0-e96299a5f367\evidencia-maps-publico.png" "$dest\evidencia-maps-publico.png" -Force
Copy-Item "C:\Users\leona\.gemini\antigravity\brain\34893dff-d3cd-473f-bde0-e96299a5f367\evidencia-streetview-fachada.png" "$dest\evidencia-streetview-fachada.png" -Force
```

- [ ] **Step 2: Criar `scripts/data/angelo-car-baseline.json` com todos os números reais auditados**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\data\angelo-car-baseline.json`:

```json
{
  "client": {
    "slug": "angelo-car",
    "lead_id": "O-005",
    "name": "Ângelo Car",
    "segment": "Oficina Mecânica",
    "city": "Porto Alegre",
    "neighborhood": "Cavalhada",
    "address": "Av. Vicente Monteggia, 333 - Cavalhada, Porto Alegre - RS",
    "whatsapp": "5551984281009",
    "owner_name": "Ângelo Pereira",
    "owner_email": "mangelopereira73@gmail.com",
    "status": "onboarding",
    "services_scope": {
      "gbp": true,
      "google_ads": true,
      "website": true,
      "website_mode": "redesign"
    },
    "external_ids": {
      "gbpMapsUrl": "https://www.google.com/maps/search/?api=1&query=Angelo+Car+Mecanica+Vicente+Monteggia+Cavalhada+Porto+Alegre",
      "gbpReviewUrl": "https://g.page/r/CftB11Iuk1hzEBM/review",
      "websiteDomain": "https://angelocarmecanica.com.br",
      "websiteVersionLabel": "v1 (Atual legado)",
      "monitoredPaths": ["/", "/socorro-mecanico-24h", "/bateria/24horas"],
      "adsAccountIds": ["623-199-6692", "219-234-5984", "521-209-8291", "323-951-6460"]
    },
    "contract_meta": {
      "planLabel": "Piloto Completo — Otimização GMN + Novo Site v2 + Higiene Google Ads",
      "privateNotes": "Acesso GBP como Gerente em angelocarapp@gmail.com e leonardoferrazbrasil@gmail.com. Ex-agência Clientes IS7 ainda mantém acesso Gerente (remoção pendente pelo Proprietário Principal mangelopereira73@gmail.com). Zero edições aplicadas antes das confirmações operacionais da Fase 1."
    },
    "started_at": "2026-11-10"
  },
  "checklistItems": [
    {
      "pillar": "gbp",
      "item_key": "gbp_profile_strength",
      "category_label": "Completude",
      "title": "Força do perfil & Confirmação das informações comerciais",
      "impact_level": "alta",
      "before_status": "incompleto",
      "before_value": "Força do perfil em 20% com alerta 'Confirme suas informações comerciais'",
      "current_status": "pendente",
      "current_value": "Aguardando execução da Fase 2",
      "sort_order": 1
    },
    {
      "pillar": "gbp",
      "item_key": "gbp_categories",
      "category_label": "SEO Local & Categorias",
      "title": "Categoria 'Mecânica para carros', 'Mecânico' e especialidades",
      "impact_level": "alta",
      "before_status": "incompleto",
      "before_value": "Principal: Oficina mecânica; Secundárias: Serviço de reboque, Regulagem automotiva, Autoelétrico (sem Mecânica para carros)",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 2
    },
    {
      "pillar": "gbp",
      "item_key": "gbp_native_services",
      "category_label": "SEO Local & Serviços",
      "title": "Serviços nativos marcados (Elétrico, Bateria, Freios) + descrições",
      "impact_level": "alta",
      "before_status": "incompleto",
      "before_value": "Serviço 'Elétrico' e 'Bateria' desmarcados; 28 serviços sem descrição (0/300 chars) e sem preço",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 3
    },
    {
      "pillar": "gbp",
      "item_key": "gbp_description_seo",
      "category_label": "SEO Local",
      "title": "Descrição comercial SEO (Cavalhada, Zona Sul, 14 anos, especialidades)",
      "impact_level": "alta",
      "before_status": "incompleto",
      "before_value": "Texto desatualizado ('mais de 10 anos'), sem 'Cavalhada'/'Zona Sul' e com CTA promocional",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 4
    },
    {
      "pillar": "gbp",
      "item_key": "gbp_social_profiles",
      "category_label": "Cadastro & Redes",
      "title": "Vincular perfis oficiais de Instagram (@angelo_rcar) e Facebook",
      "impact_level": "media",
      "before_status": "ausente",
      "before_value": "0 perfis de redes sociais vinculados no GBP",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 5
    },
    {
      "pillar": "gbp",
      "item_key": "gbp_links_utm_booking",
      "category_label": "Conversão & Links",
      "title": "Link do Site com UTM + Link de Serviços + Agendamentos",
      "impact_level": "alta",
      "before_status": "incompleto",
      "before_value": "Site sem UTM; links de Serviços e Agendamentos vazios (0 agendamentos)",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 6
    },
    {
      "pillar": "gbp",
      "item_key": "gbp_hours_holiday",
      "category_label": "Conformidade",
      "title": "Alinhamento horário real 24h vs comercial + Feriado 15/11/2026",
      "impact_level": "alta",
      "before_status": "incorreto",
      "before_value": "Aberto 24h todos os dias gerando reclamações 1★ e alerta de feriado vazio",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 7
    },
    {
      "pillar": "gbp",
      "item_key": "gbp_photos_facade_logo",
      "category_label": "Mídia & Fachada",
      "title": "Nova capa, logo limpa sem fixo 3241-7954 e foto externa da rampa",
      "impact_level": "alta",
      "before_status": "incorreto",
      "before_value": "Capa com bloco de motor cortado, 4 cópias de logo antiga e alerta 'Inclua foto externa'",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 8
    },
    {
      "pillar": "gbp",
      "item_key": "gbp_products_posts_qa",
      "category_label": "Vitrine & Atividade",
      "title": "Catálogo de Produtos âncora, Google Posts recentes e Q&A",
      "impact_level": "media",
      "before_status": "ausente",
      "before_value": "0 produtos, 0 Q&A, últimos 5 posts de 2018 (há 8 anos)",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 9
    },
    {
      "pillar": "gbp",
      "item_key": "gbp_reviews_reputation",
      "category_label": "Reputação",
      "title": "Responder backlog 1★ + personalizar 5★ + campanha rumo a 4,5★",
      "impact_level": "alta",
      "before_status": "incompleto",
      "before_value": "4,1★ (267 av.: 198×5★ e 57×1★); backlog 1★ sem resposta e respostas genéricas 'Obrigado'",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 10
    },
    {
      "pillar": "gbp",
      "item_key": "gbp_access_security",
      "category_label": "Governança",
      "title": "Revogar acesso da ex-agência 'Clientes IS7' pelo Proprietário",
      "impact_level": "alta",
      "before_status": "incorreto",
      "before_value": "Ex-agência 'Clientes IS7' ativa como Gerente na ficha",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 11
    },
    {
      "pillar": "website",
      "item_key": "site_404_architecture",
      "category_label": "Estrutura Site",
      "title": "Novo site v2: corrigir 404 /socorro-mecanico-24h e criar páginas de serviço",
      "impact_level": "alta",
      "before_status": "incorreto",
      "before_value": "Site one-page v1 com URL /socorro-mecanico-24h retornando HTTP 404 no Google",
      "current_status": "pendente",
      "current_value": "Em planejamento de redesign v2",
      "sort_order": 12
    },
    {
      "pillar": "website",
      "item_key": "site_schema_tracking",
      "category_label": "SEO & Tracking",
      "title": "Schema AutoRepair completo, mapa da rampa e GTM/GA4 (WhatsApp/Ligar)",
      "impact_level": "alta",
      "before_status": "incompleto",
      "before_value": "Schema sem geo/CEP/hasMap; links WhatsApp sem eventos segmentados e aviso de scanner ausente",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 13
    },
    {
      "pillar": "google_ads",
      "item_key": "ads_waste_negative_keywords",
      "category_label": "Higiene Ads",
      "title": "Desligar aplicação automática e negativar termos sem aderência",
      "impact_level": "alta",
      "before_status": "incorreto",
      "before_value": "Conta 623-199-6692 comprando 'borracharia 24h', 'autozone', 'Viamão' e concorrentes",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 14
    },
    {
      "pillar": "google_ads",
      "item_key": "ads_accounts_linking",
      "category_label": "Estrutura Ads",
      "title": "Alinhar vínculo GBP ↔ conta ativa (623) e encerrar contas lixo 521/323",
      "impact_level": "alta",
      "before_status": "incorreto",
      "before_value": "GBP ligado à conta antiga 219-234-5984 + 2 contas duplicadas (521/323) com keywords de software",
      "current_status": "pendente",
      "current_value": null,
      "sort_order": 15
    }
  ],
  "snapshots": [
    {
      "period_key": "2026-06",
      "period_label": "Jun/2026",
      "snapshot_type": "baseline_historico",
      "is_baseline": false,
      "source": "agente_browser",
      "gbp_metrics": {
        "interactionsTotal": 152,
        "calls": 67,
        "routes": 67,
        "siteClicks": 16,
        "chatClicks": 2,
        "bookings": 0,
        "periodNotes": "Mês pré-gestão extraído do Painel Google Meu Negócio."
      },
      "overall_status": "baseline",
      "collection_warnings": [],
      "recorded_at": "2026-11-10T12:00:00Z"
    },
    {
      "period_key": "2026-07",
      "period_label": "Jul/2026",
      "snapshot_type": "baseline_historico",
      "is_baseline": false,
      "source": "agente_browser",
      "gbp_metrics": {
        "interactionsTotal": 159,
        "calls": 56,
        "routes": 86,
        "siteClicks": 15,
        "chatClicks": 2,
        "bookings": 0,
        "periodNotes": "Mês pré-gestão extraído do Painel Google Meu Negócio."
      },
      "overall_status": "baseline",
      "collection_warnings": [],
      "recorded_at": "2026-11-10T12:00:00Z"
    },
    {
      "period_key": "2026-08",
      "period_label": "Ago/2026",
      "snapshot_type": "baseline_historico",
      "is_baseline": false,
      "source": "agente_browser",
      "gbp_metrics": {
        "interactionsTotal": 211,
        "calls": 98,
        "routes": 90,
        "siteClicks": 19,
        "chatClicks": 4,
        "bookings": 0,
        "periodNotes": "Mês pré-gestão extraído do Painel Google Meu Negócio."
      },
      "overall_status": "baseline",
      "collection_warnings": [],
      "recorded_at": "2026-11-10T12:00:00Z"
    },
    {
      "period_key": "2026-09",
      "period_label": "Set/2026",
      "snapshot_type": "baseline_historico",
      "is_baseline": false,
      "source": "agente_browser",
      "gbp_metrics": {
        "interactionsTotal": 152,
        "calls": 68,
        "routes": 59,
        "siteClicks": 22,
        "chatClicks": 3,
        "bookings": 0,
        "periodNotes": "Mês pré-gestão extraído do Painel Google Meu Negócio."
      },
      "overall_status": "baseline",
      "collection_warnings": [],
      "recorded_at": "2026-11-10T12:00:00Z"
    },
    {
      "period_key": "2026-10",
      "period_label": "Out/2026",
      "snapshot_type": "baseline_historico",
      "is_baseline": false,
      "source": "agente_browser",
      "gbp_metrics": {
        "interactionsTotal": 249,
        "calls": 107,
        "routes": 112,
        "siteClicks": 22,
        "chatClicks": 8,
        "bookings": 0,
        "periodNotes": "Último mês fechado antes da gestão (249 interações)."
      },
      "overall_status": "baseline",
      "collection_warnings": [],
      "recorded_at": "2026-11-10T12:00:00Z"
    },
    {
      "period_key": "2026-11",
      "period_label": "Nov/2026 (Antes 10/11)",
      "snapshot_type": "baseline_historico",
      "is_baseline": true,
      "source": "hibrido",
      "gbp_metrics": {
        "viewsTotal": 1906,
        "viewsSearch": 4821,
        "viewsMaps": 2146,
        "interactionsTotal": 82,
        "calls": 17,
        "routes": 56,
        "siteClicks": 7,
        "chatClicks": 2,
        "bookings": 0,
        "rating": 4.1,
        "reviewCount": 267,
        "profileStrengthPct": 20,
        "targetKeyword": "oficina mecânica cavalhada porto alegre",
        "targetKeywordRank": 6,
        "periodNotes": "Marco Zero pré-otimização em 10/11/2026: 82 interações parciais (01-10/11), 1.906 views na Pesquisa (30d) e acumulado jun-nov de 6.967 visualizações (84% mobile) / 1.005 interações."
      },
      "ads_metrics": {
        "activeAccountId": "623-199-6692",
        "legacyAccountsCount": 3,
        "spendBrl": 42484.6,
        "statusLabel": "Auditoria Inicial: gasto histórico R$ 42.484,60 + Pix R$ 150 em 10/11; 3 contas antigas/duplicadas"
      },
      "site_metrics": {
        "versionLabel": "v1 (Atual legado)",
        "targetUrl": "https://angelocarmecanica.com.br/",
        "httpOkCount": 1,
        "brokenUrlsCount": 1,
        "brokenPaths": ["/socorro-mecanico-24h"],
        "hasSsl": true,
        "hasWhatsappCta": true
      },
      "overall_status": "baseline",
      "executive_summary": "Marco Zero registrado em 10/11/2026 antes de qualquer alteração: força do perfil em 20%, nota 4,1★ (267 av.), fora do Top 3 no Local Pack, URL /socorro-mecanico-24h em erro 404 e 4 IDs de Google Ads fragmentados.",
      "collection_warnings": [],
      "recorded_at": "2026-11-10T16:54:00Z"
    }
  ],
  "changeLogs": [
    {
      "occurred_at": "2026-11-10T16:54:00Z",
      "pillar": "gbp",
      "action_type": "auditoria_inicial",
      "title": "Auditoria Completa 8 Pilares + Registro Oficial do 'Antes' (Zero Edições Aplicadas)",
      "before_state": "Força do perfil 20%, #6 no Maps Cavalhada, 4,1★ (267 av.), redes sociais ausentes, site v1 com 404 e 4 contas Ads",
      "after_state": "Marco Zero completo documentado e checklist de 15 frentes estruturado para execução da Fase 2",
      "automation_source": "antigravity",
      "visible_to_client": true,
      "external_ref": "angelo-car-auditoria-2026-11-10"
    }
  ],
  "evidences": [
    {
      "pillar": "gbp",
      "phase": "antes",
      "period_key": "2026-11",
      "pair_key": "perfil-capa-logo",
      "title": "Galeria, Capa e Logo Obsoleto (Antes)",
      "caption": "Capa atual mostra bloco de motor cortado e 4 duplicatas do logo com telefone fixo antigo (51) 3241-7954.",
      "localPath": "evidences/angelo-car/evidencia-fotos-capa-logo.png"
    },
    {
      "pillar": "gbp",
      "phase": "antes",
      "period_key": "2026-11",
      "pair_key": "maps-publico",
      "title": "Visão Pública no Google Maps (Antes)",
      "caption": "Perfil público em 10/11/2026: 4,1★ (267 avaliações), aberto 24h sem vínculo de redes sociais ou produtos.",
      "localPath": "evidences/angelo-car/evidencia-maps-publico.png"
    },
    {
      "pillar": "gbp",
      "phase": "antes",
      "period_key": "2026-11",
      "pair_key": "fachada-streetview",
      "title": "Entrada no Street View Sem Placa (Antes)",
      "caption": "Rampa descendente na Av. Vicente Monteggia, 333 sem identificação visual externa para quem chega via GPS (470 rotas).",
      "localPath": "evidences/angelo-car/evidencia-streetview-fachada.png"
    }
  ]
}
```

- [ ] **Step 3: Executar validação completa de qualidade do projeto (`npm run verify`) e `--dry-run` do sync**

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run verify`
Expected: `typecheck` PASS, `build` PASS (prerender/sitemap intactos), `npm test` 100% PASS (todos os testes existentes + 5 novos arquivos de teste CRM).

Run: `node "D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\crm-client-sync.mjs" --file "D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\data\angelo-car-baseline.json" --audit-site --dry-run`
Expected: `[DRY-RUN] Validação concluída para: angelo-car` com `checklistCount: 15`, `snapshotsCount: 6`, `evidencesCount: 3`, mais status real das rotas de `angelocarmecanica.com.br` (`brokenUrlsCount: 1` em `/socorro-mecanico-24h`).

- [ ] **Step 4: Aplicar migration no Supabase & rodar carga inicial real na nuvem**

1. Garantir que `supabase/migrations/20261110_crm_clients_history.sql` tenha sido executada no SQL Editor do projeto Supabase `juvwfxnlusrnvcarkrmc.supabase.co`.
2. Garantir no `.env` local `SUPABASE_SERVICE_ROLE_KEY` ou `CRM_ADMIN_EMAIL` + `CRM_ADMIN_PASSWORD`.
3. Executar carga real do Baseline da Ângelo Car:

Run: `node "D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\crm-client-sync.mjs" --file "D:\LEONARDO\Drive\Projetos\leonardo-brasil\scripts\data\angelo-car-baseline.json" --audit-site`
Expected: `Sync concluído com sucesso para cliente "Ângelo Car" (angelo-car).`

- [ ] **Step 5: Verificação Visual & Responsiva no Browser Real (Desktop `1440×900` e Mobile `390×844`)**

1. Subir dev server local (`npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run dev`) e autenticar no CRM (`/crm/login`).
2. Abrir `http://localhost:5173/crm/clientes` e `http://localhost:5173/crm/clientes/angelo-car`:
   - Verificar em `1440×900` que todos os KPIs, gráfico SVG, tabela mensal, matriz Antes × Depois e os 3 prints carregam via signed URL.
   - Emular viewport celular `390×844` via Chrome DevTools (`emulate` / `resize_page`) e confirmar `document.documentElement.scrollWidth <= window.innerWidth` (zero scroll horizontal acidental).
   - Ativar **Modo Apresentação** (`?present=1`) e validar que `CrmNavBar`, `contract_meta` (notas internas de acesso `Clientes IS7` / valores) e botões de edição desaparecem completamente.
   - Testar alternador `[ Antes | Depois | Lado a Lado ]`, toque em mês no gráfico e geração de relatório WhatsApp (`Marco Zero` e `Mensal` + link `https://wa.me/5551984281009?text=...`).

- [ ] **Step 6: Commit final da configuração de seed (sem os binários ignorados)**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add .gitignore scripts/data/angelo-car-baseline.json
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add Angelo Car (O-005) baseline seed payload and ignore local evidence binaries"
```
