export type PipelineStageId =
  | "a_abordar"
  | "contatado"
  | "em_conversa"
  | "proposta_enviada"
  | "fechado_arquivado";

export interface PipelineStage {
  id: PipelineStageId;
  title: string;
  badgeColor: string;
  description: string;
}

export interface ProspectLead {
  id: string;
  sampleId: string;
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
  opportunityClass: "Classe B (20 pts)" | "Classe C (15 pts)" | "Classe C (5 pts)" | "Classe D (0 pts)" | string;
  opportunityIssue: string;
  searchKeyword: string;
  monthlySearches: string;
  observedPosition?: number; // Posição real no Google Maps (ex: 4, 5, 6...)
  rankingContext?: string; // Contexto visual (ex: "4º no Maps (Fora do Top 3)")
  competitorsObserved?: string;
  stage: PipelineStageId;
  bloco1: string; // Mensagem ativa (padrão)
  bloco1Volume: string; // Variação 1: Modelo de Volume de Buscas & Top 3
  bloco1Falha: string; // Variação 2: Modelo de Falha / Inconsistência Factual
  bloco2: string; // Diagnóstico gratuito quando o lead aceita
  bloco3: string; // Escopo dos 4 pilares de serviço
  bloco4: string; // Proposta comercial (R$ 650 / R$ 380)
  notes?: string;
  updatedAt: string;
}
