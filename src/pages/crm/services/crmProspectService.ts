import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import type { ProspectLead, PipelineStageId } from "../types";
import { INITIAL_PROSPECTS } from "../data/initialProspects";
import { resolveLeadScore } from "../utils/deterministicScoring";

const STORAGE_KEY = "crm_prospect_leads_v8";

function hydrateDeterministicFields(lead: ProspectLead): ProspectLead {
  const computed = resolveLeadScore(lead);
  return {
    ...lead,
    opportunityClass: computed.classLabel,
    deterministicScore: computed.score,
    deterministicBreakdown: computed.breakdown.signalsTriggered,
  };
}

export const crmProspectService = {
  async getLeads(): Promise<ProspectLead[]> {
    // 1. Tentar ler do Supabase se configurado e houver sessão ativa
    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            const mapped: ProspectLead[] = data.map((d: any) => ({
              id: d.id,
              sampleId: d.proxima_acao?.includes("sample:") ? d.proxima_acao.split("sample:")[1] : d.id,
              name: d.nome,
              segment: (d.interesse || "Negócio Local") as any,
              neighborhood: "Porto Alegre" as any,
              city: "Porto Alegre",
              phone: d.telefone,
              formattedPhone: d.telefone.replace(/\D/g, ""),
              whatsappConfirmed: true,
              mapsUrl: "",
              opportunityClass: "Classe B (65 pts)",
              opportunityIssue: d.proxima_acao || "",
              searchKeyword: d.interesse || "Google Meu Negócio",
              monthlySearches: "1.000+",
              bloco1Volume: `Olá! Tudo bem? Falo com a equipe da *${d.nome}*?`,
              bloco1Falha: `Olá! Tudo bem? Falo com a equipe da *${d.nome}*?`,
              stage: (d.status === "novo" ? "a_abordar" : d.status === "em_atendimento" ? "contatado" : d.status === "qualificado" ? "em_conversa" : d.status === "convertido" ? "proposta_enviada" : "fechado_ganho") as PipelineStageId,
              bloco1: `Olá! Tudo bem? Falo com a equipe da *${d.nome}*?`,
              bloco2: `Gostaria de apresentar oportunidades observadas no perfil do Google.`,
              bloco3: `O meu trabalho de Otimização e Implantação do Perfil da Empresa no Google.`,
              bloco4: `Investimento único R$ 497 (ou 2x de R$ 250) ou gestão mensal R$ 380.`,
              notes: "",
              updatedAt: d.created_at || new Date().toISOString()
            }));

            return this.mergeWithInitial(mapped);
          }
        }
      } catch (e) {
        console.warn("Aviso ao carregar do Supabase; usando armazenamento local:", e);
      }
    }

    // 2. Fallback para LocalStorage (preserva stage e notes manuais + injeta novos leads + hidrata score determinístico)
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const initialMap = new Map(INITIAL_PROSPECTS.map(p => [p.id, p]));
            const hydratedExisting = parsed.map((cachedLead: any) => {
              const fresh = initialMap.get(cachedLead.id);
              const base: ProspectLead = fresh
                ? {
                    ...fresh,
                    stage: cachedLead.stage ?? fresh.stage,
                    notes:
                      cachedLead.notes !== undefined && cachedLead.notes !== ""
                        ? cachedLead.notes
                        : fresh.notes,
                    updatedAt: cachedLead.updatedAt || fresh.updatedAt,
                  }
                : cachedLead;
              return hydrateDeterministicFields(base);
            });

            const existingIds = new Set(parsed.map((p: any) => p.id));
            const newLeadsToAdd = INITIAL_PROSPECTS
              .filter(p => !existingIds.has(p.id))
              .map(hydrateDeterministicFields);

            const merged = [...hydratedExisting, ...newLeadsToAdd];
            this.saveLocal(merged);
            return merged;
          }
        }
      } catch (e) {
        console.warn("Erro ao ler do localStorage:", e);
      }
    }

    // 3. Carga padrão inicial com os perfis auditados e pontuados deterministicamente
    const hydratedInitial = INITIAL_PROSPECTS.map(hydrateDeterministicFields);
    this.saveLocal(hydratedInitial);
    return hydratedInitial;
  },

  mergeWithInitial(remoteLeads: ProspectLead[]): ProspectLead[] {
    const map = new Map<string, ProspectLead>();
    INITIAL_PROSPECTS.forEach(p => map.set(p.id, hydrateDeterministicFields(p)));
    remoteLeads.forEach(r => map.set(r.id, hydrateDeterministicFields({ ...(map.get(r.id) || r), ...r })));
    const merged = Array.from(map.values());
    this.saveLocal(merged);
    return merged;
  },

  async updateLeadStage(leadId: string, stage: PipelineStageId): Promise<void> {
    const currentLeads = await this.getLeads();
    const updated = currentLeads.map(l =>
      l.id === leadId ? hydrateDeterministicFields({ ...l, stage, updatedAt: new Date().toISOString() }) : l
    );
    this.saveLocal(updated);

    if (isSupabaseConfigured) {
      try {
        const statusMap: Record<PipelineStageId, string> = {
          a_abordar: "novo",
          contatado: "em_atendimento",
          em_conversa: "qualificado",
          proposta_enviada: "em_atendimento",
          fechado_ganho: "convertido",
          perdido_invalido: "perdido"
        };
        await supabase
          .from("leads")
          .update({ status: statusMap[stage] })
          .eq("id", leadId);
      } catch (e) {
        console.warn("Não foi possível sincronizar estágio com Supabase:", e);
      }
    }
  },

  async updateLeadNotes(leadId: string, notes: string): Promise<void> {
    const currentLeads = await this.getLeads();
    const updated = currentLeads.map(l =>
      l.id === leadId ? { ...l, notes, updatedAt: new Date().toISOString() } : l
    );
    this.saveLocal(updated);
  },

  saveLocal(leads: ProspectLead[]) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      } catch (e) {
        console.warn("Erro ao salvar no localStorage:", e);
      }
    }
  },

  async resetToInitial(): Promise<ProspectLead[]> {
    const hydratedInitial = INITIAL_PROSPECTS.map(hydrateDeterministicFields);
    this.saveLocal(hydratedInitial);
    return hydratedInitial;
  }
};
