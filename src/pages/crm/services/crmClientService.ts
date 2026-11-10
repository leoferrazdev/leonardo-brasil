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

          const childError = checkRes.error || snapRes.error || logRes.error || evRes.error;
          if (childError) {
            throw new Error(childError.message || "Falha ao carregar dados relacionados do cliente.");
          }

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
        const { error: checklistErr } = await supabase
          .from("client_checklists")
          .insert(starterChecklist);
        if (checklistErr) {
          console.warn("Aviso ao inicializar checklist padrão do cliente:", checklistErr.message);
        }
      }

      const { error: logErr } = await supabase.from("client_change_logs").insert({
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
      if (logErr) {
        console.warn("Aviso ao registrar log inicial de onboarding:", logErr.message);
      }

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

    if (dbErr || !row) {
      try {
        await supabase.storage.from("client-evidences").remove([storagePath]);
      } catch {
        // best-effort orphan cleanup
      }
      throw new Error(dbErr?.message || "Erro ao registrar metadados da evidência.");
    }

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
