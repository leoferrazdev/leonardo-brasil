export type PipelineStageId =
  | "a_abordar"
  | "contatado"
  | "em_conversa"
  | "proposta_enviada"
  | "fechado_ganho"
  | "perdido_invalido";

export type DrawerBlockTab = 1 | 2 | 3 | 4 | "followup";

export interface PipelineStage {
  id: PipelineStageId;
  title: string;
  badgeColor: string;
  description: string;
}

export interface DeterministicAuditSignals {
  observedPosition: number;
  archetypeTier: 1 | 2 | 3 | 4;
  divergenciaD: boolean;
  falhaCanalWhatsApp: boolean;
  semCatalogoOuNaoReivindicado: boolean;
  horarioOuReviewsSemResposta: boolean;
  linkQuebradoL: boolean;
  whatsappConfirmed: boolean;
  monthlySearchVolume: number;
}

export interface DeterministicScoreResult {
  score: number;
  tier: "A" | "B" | "C" | "D";
  classLabel: string;
  priorityTag: string;
  eligible: boolean;
  breakdown: {
    positionPts: number;
    archetypePts: number;
    technicalPts: number;
    channelDemandPts: number;
    signalsTriggered: string[];
  };
}

export interface ProspectLead {
  id: string;
  sampleId: string;
  round?: string; // Ex: "Rodada 02", "Rodada 03", "Rodada 04"
  name: string;
  segment: string;
  neighborhood: string;
  city: string;
  address?: string;
  phone: string;
  formattedPhone: string;
  whatsappConfirmed: boolean;
  canalStatus?: string;
  mapsUrl: string;
  siteUrl?: string;
  ratingText?: string; // Ex: "4.6 ★ (142)"
  claimStatus?: "reivindicado" | "nao_reivindicado" | "desconhecido";
  opportunityClass: string;
  opportunityIssue: string;
  searchKeyword: string;
  monthlySearches: string;
  observedPosition?: number; // Posição real no Google Maps (ex: 4, 5, 6...)
  rankingContext?: string; // Contexto visual (ex: "4º no Maps (Fora do Top 3)")
  competitorsObserved?: string;
  deterministicSignals?: DeterministicAuditSignals;
  deterministicScore?: number; // Score puro 0-100
  deterministicBreakdown?: string[]; // Ex: ["P4 (+20)", "Arq1 (+20)", "WA (+15)", "U/C (+10)"]
  auditTimestamp?: string;
  stage: PipelineStageId;
  bloco1: string; // Mensagem ativa (padrão)
  bloco1Volume: string; // Variação 1: Modelo de Volume de Buscas & Top 3
  bloco1Falha: string; // Variação 2: Modelo de Falha / Inconsistência Factual
  bloco2: string; // Diagnóstico gratuito quando o lead aceita
  bloco3: string; // Escopo dos 4 pilares de serviço
  bloco4: string; // Proposta comercial pontual (R$ 497 à vista ou 2x de R$ 250 — sem mensalidade)
  blocoFollowUp?: string; // Follow-up de conversão para coluna 3. Em Conversa (Pix CNPJ, vídeo, visita presencial)
  notes?: string;
  updatedAt: string;
}
