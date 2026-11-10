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
