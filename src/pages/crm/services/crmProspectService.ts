import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import type { ProspectLead, PipelineStageId } from "../types";
import { INITIAL_PROSPECTS } from "../data/initialProspects";

const STORAGE_KEY = "crm_prospect_leads_v1";

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
            // Mapeia leads da tabela para ProspectLead se houver dados customizados
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
              opportunityClass: "Classe B (20 pts)",
              opportunityIssue: d.proxima_acao || "",
              stage: (d.status === "novo" ? "a_abordar" : d.status === "em_atendimento" ? "contatado" : d.status === "qualificado" ? "em_conversa" : d.status === "convertido" ? "proposta_enviada" : "fechado_arquivado") as PipelineStageId,
              bloco1: `Olá! Tudo bem? Falo com a equipe da *${d.nome}*?`,
              bloco2: `Gostaria de apresentar oportunidades observadas no perfil do Google.`,
              bloco3: `Nossa solução de Otimização e Implantação do Google Meu Negócio.`,
              bloco4: `Investimento único R$ 650 ou gestão mensal R$ 380.`,
              notes: "",
              updatedAt: d.created_at || new Date().toISOString()
            }));
            
            // Mescla com a base dos 40 prospects para garantir diagnósticos ricos
            return this.mergeWithInitial(mapped);
          }
        }
      } catch (e) {
        console.warn("Aviso ao carregar do Supabase; usando armazenamento local:", e);
      }
    }

    // 2. Fallback para LocalStorage
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Erro ao ler do localStorage:", e);
      }
    }

    // 3. Carga padrão inicial com os 40 perfis auditados
    this.saveLocal(INITIAL_PROSPECTS);
    return INITIAL_PROSPECTS;
  },

  mergeWithInitial(remoteLeads: ProspectLead[]): ProspectLead[] {
    const map = new Map<string, ProspectLead>();
    INITIAL_PROSPECTS.forEach(p => map.set(p.id, p));
    remoteLeads.forEach(r => map.set(r.id, { ...(map.get(r.id) || r), ...r }));
    const merged = Array.from(map.values());
    this.saveLocal(merged);
    return merged;
  },

  async updateLeadStage(leadId: string, stage: PipelineStageId): Promise<void> {
    // 1. Atualizar no LocalStorage imediatamente para resposta instantânea
    const currentLeads = await this.getLeads();
    const updated = currentLeads.map(l => 
      l.id === leadId ? { ...l, stage, updatedAt: new Date().toISOString() } : l
    );
    this.saveLocal(updated);

    // 2. Se logado no Supabase, tenta sincronizar
    if (isSupabaseConfigured) {
      try {
        const statusMap: Record<PipelineStageId, string> = {
          a_abordar: "novo",
          contatado: "em_atendimento",
          em_conversa: "qualificado",
          proposta_enviada: "convertido",
          fechado_arquivado: "perdido"
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
    this.saveLocal(INITIAL_PROSPECTS);
    return INITIAL_PROSPECTS;
  }
};
