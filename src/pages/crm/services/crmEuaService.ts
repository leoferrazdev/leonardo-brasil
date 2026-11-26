import type { PipelineStageId, ProspectLead } from "../types";
import { INITIAL_PROSPECTS_EUA } from "../data/initialProspectsEua";

const STORAGE_KEY_EUA = "crm_eua_prospects_v6";
const STORAGE_KEY_EUA_OLD = "crm_eua_prospects_v5";

function loadStoredLeads(): ProspectLead[] {
  if (typeof window === "undefined") return INITIAL_PROSPECTS_EUA;
  try {
    let raw = localStorage.getItem(STORAGE_KEY_EUA);
    if (!raw) {
      raw = localStorage.getItem(STORAGE_KEY_EUA_OLD);
    }
    if (!raw) return INITIAL_PROSPECTS_EUA;
    const saved = JSON.parse(raw) as ProspectLead[];
    const savedMap = new Map(saved.map((l) => [l.id, l]));
    return INITIAL_PROSPECTS_EUA.map((initLead) => {
      const existing = savedMap.get(initLead.id);
      return existing
        ? { ...initLead, stage: existing.stage, notes: existing.notes, contactedAt: existing.contactedAt }
        : initLead;
    });
  } catch {
    return INITIAL_PROSPECTS_EUA;
  }
}

function saveLeads(leads: ProspectLead[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_EUA, JSON.stringify(leads));
  } catch {
    // Ignore storage quota errors
  }
}

export const crmEuaService = {
  async getLeads(): Promise<ProspectLead[]> {
    return loadStoredLeads();
  },

  async updateLeadStage(leadId: string, newStage: PipelineStageId): Promise<void> {
    const nowIso = new Date().toISOString();
    const leads = loadStoredLeads().map((l) => {
      if (l.id !== leadId) return l;
      const contactedAt =
        newStage === "contatado"
          ? l.contactedAt || nowIso
          : newStage === "a_abordar"
          ? undefined
          : l.contactedAt;
      return { ...l, stage: newStage, contactedAt, updatedAt: nowIso };
    });
    saveLeads(leads);
  },

  async updateLeadNotes(leadId: string, notes: string): Promise<void> {
    const leads = loadStoredLeads().map((l) =>
      l.id === leadId ? { ...l, notes, updatedAt: new Date().toISOString() } : l
    );
    saveLeads(leads);
  },
};
