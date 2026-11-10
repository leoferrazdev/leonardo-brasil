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
