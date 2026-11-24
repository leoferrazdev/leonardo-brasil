import type { PipelineStageId, ProspectLead } from "../types";
import { INITIAL_PROSPECTS_PORTUGAL } from "../data/initialProspectsPortugal";

const STORAGE_KEY_PORTUGAL = "crm_portugal_prospects_v1";

function loadStoredLeads(): ProspectLead[] {
  if (typeof window === "undefined") return INITIAL_PROSPECTS_PORTUGAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PORTUGAL);
    if (!raw) return INITIAL_PROSPECTS_PORTUGAL;
    const saved = JSON.parse(raw) as ProspectLead[];
    const savedMap = new Map(saved.map((l) => [l.id, l]));
    return INITIAL_PROSPECTS_PORTUGAL.map((initLead) => {
      const existing = savedMap.get(initLead.id);
      return existing ? { ...initLead, stage: existing.stage, notes: existing.notes } : initLead;
    });
  } catch {
    return INITIAL_PROSPECTS_PORTUGAL;
  }
}

function saveLeads(leads: ProspectLead[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PORTUGAL, JSON.stringify(leads));
  } catch {
    // Ignore storage quota errors
  }
}

export const crmPortugalService = {
  async getLeads(): Promise<ProspectLead[]> {
    return loadStoredLeads();
  },

  async updateLeadStage(leadId: string, newStage: PipelineStageId): Promise<void> {
    const leads = loadStoredLeads().map((l) =>
      l.id === leadId ? { ...l, stage: newStage, updatedAt: new Date().toISOString() } : l
    );
    saveLeads(leads);
  },

  async updateLeadNotes(leadId: string, notes: string): Promise<void> {
    const leads = loadStoredLeads().map((l) =>
      l.id === leadId ? { ...l, notes, updatedAt: new Date().toISOString() } : l
    );
    saveLeads(leads);
  },
};
