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
