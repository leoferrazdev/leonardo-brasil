import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { 
  Phone, 
  MapPin, 
  ExternalLink, 
  MessageCircle, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft,
  Copy,
  Check
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { ProspectLead, PipelineStageId } from "../types";

interface KanbanCardProps {
  lead: ProspectLead;
  onOpenDrawer: (lead: ProspectLead) => void;
  onAdvanceStage: (leadId: string, nextStage: PipelineStageId) => void;
  onPreviousStage?: (leadId: string, prevStage: PipelineStageId) => void;
}

const STAGES_ORDER: PipelineStageId[] = [
  "a_abordar",
  "contatado",
  "em_conversa",
  "proposta_enviada",
  "fechado_arquivado"
];

export const KanbanCard: React.FC<KanbanCardProps> = ({
  lead,
  onOpenDrawer,
  onAdvanceStage,
  onPreviousStage
}) => {
  const [copied, setCopied] = React.useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: lead
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const currentIdx = STAGES_ORDER.indexOf(lead.stage);
  const nextStage = currentIdx < STAGES_ORDER.length - 1 ? STAGES_ORDER[currentIdx + 1] : null;
  const prevStage = currentIdx > 0 ? STAGES_ORDER[currentIdx - 1] : null;

  // Decide qual bloco é prioritário com base na etapa atual
  const activeBlockText = 
    lead.stage === "a_abordar" ? lead.bloco1 :
    lead.stage === "contatado" ? lead.bloco2 :
    lead.stage === "em_conversa" ? lead.bloco3 :
    lead.bloco4;

  const whatsappWebUrl = lead.formattedPhone
    ? `https://web.whatsapp.com/send?phone=${lead.formattedPhone}&text=${encodeURIComponent(activeBlockText)}`
    : "";

  const handleCopyQuick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeBlockText);
    setCopied(true);
    toast.success("Mensagem do WhatsApp copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeColor = 
    lead.opportunityClass.includes("Classe B") ? "bg-amber-500/10 text-amber-300 border-amber-500/30" :
    lead.opportunityClass.includes("Classe C") ? "bg-blue-500/10 text-blue-300 border-blue-500/30" :
    "bg-slate-800 text-slate-400 border-slate-700";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#0f1422] border rounded-xl p-3.5 shadow-md transition-all select-none ${
        isDragging
          ? "border-emerald-500 shadow-xl shadow-emerald-500/20 opacity-80 rotate-1"
          : "border-slate-800/80 hover:border-slate-700 hover:shadow-lg hover:shadow-black/40"
      }`}
    >
      {/* Barra de título e arrastar */}
      <div className="flex items-start justify-between gap-2">
        <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {lead.sampleId}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {lead.opportunityClass}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mt-1.5 line-clamp-1 group-hover:text-emerald-400">
            {lead.name}
          </h4>
        </div>

        {lead.mapsUrl && (
          <a
            href={lead.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir no Google Maps"
            className="text-slate-500 hover:text-emerald-400 p-1 rounded-md hover:bg-slate-800/80 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Localização e Segmento */}
      <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
        <span className="text-slate-300 font-medium">{lead.segment}</span>
        <span className="text-slate-600">•</span>
        <span className="inline-flex items-center gap-1 text-slate-400">
          <MapPin className="w-3 h-3 text-slate-500" />
          {lead.neighborhood}
        </span>
      </div>

      {/* Oportunidade observada */}
      <div className="mt-2.5 p-2 rounded-lg bg-[#090c13] border border-slate-800/60 text-[11px] text-slate-300 flex items-start gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span className="line-clamp-2 leading-relaxed">{lead.opportunityIssue}</span>
      </div>

      {/* Telefone e WhatsApp */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-2.5">
        <div className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
          <Phone className="w-3 h-3 text-slate-500" />
          {lead.phone || "Sem telefone"}
        </div>
        {lead.whatsappConfirmed && (
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            WhatsApp ✓
          </span>
        )}
      </div>

      {/* Botões de Ação Imediata */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {whatsappWebUrl ? (
          <a
            href={whatsappWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all text-center"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chamar</span>
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed"
          >
            Sem WhatsApp
          </button>
        )}

        <button
          onClick={() => onOpenDrawer(lead)}
          className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-all"
        >
          <span>Ver Blocos</span>
        </button>
      </div>

      {/* Barra de Navegação de Etapa e Cópia Rápida */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px]">
        <button
          onClick={handleCopyQuick}
          className="text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 font-medium py-1 px-1.5 rounded hover:bg-slate-800/60 transition-colors"
          title="Copiar mensagem do WhatsApp para a área de transferência"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copiado!" : "Copiar"}</span>
        </button>

        <div className="flex items-center gap-1">
          {prevStage && onPreviousStage && (
            <button
              onClick={() => onPreviousStage(lead.id, prevStage)}
              className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              title="Voltar etapa"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {nextStage && (
            <button
              onClick={() => onAdvanceStage(lead.id, nextStage)}
              className="inline-flex items-center gap-0.5 py-0.5 px-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] transition-colors"
              title="Avançar para próxima etapa"
            >
              <span>Avançar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
