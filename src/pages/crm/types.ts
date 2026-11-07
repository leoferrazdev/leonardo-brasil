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
  segment: "Clínica Veterinária" | "Clínica Odontológica" | "Oficina Mecânica" | "Restaurante";
  neighborhood: "Tristeza" | "Ipanema" | "Vila Assunção" | "Cristal";
  city: string;
  address?: string;
  phone: string;
  formattedPhone: string;
  whatsappConfirmed: boolean;
  mapsUrl: string;
  siteUrl?: string;
  opportunityClass: "Classe B (20 pts)" | "Classe C (15 pts)" | "Classe C (5 pts)" | "Classe D (0 pts)";
  opportunityIssue: string;
  stage: PipelineStageId;
  bloco1: string;
  bloco2: string;
  bloco3: string;
  bloco4: string;
  notes?: string;
  updatedAt: string;
}
