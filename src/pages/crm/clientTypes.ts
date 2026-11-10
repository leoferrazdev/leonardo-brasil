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
