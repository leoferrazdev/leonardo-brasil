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
  Check,
  Sparkles,
  FileText,
  PhoneOff,
  RotateCcw
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
  "fechado_ganho"
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

  const activeBlockText = 
    lead.stage === "a_abordar" ? lead.bloco1 :
    lead.stage === "contatado" ? lead.bloco2 :
    lead.stage === "em_conversa" ? lead.bloco3 :
    lead.bloco4;

  const whatsappWebUrl = lead.formattedPhone && lead.whatsappConfirmed
    ? `https://web.whatsapp.com/send?phone=${lead.formattedPhone}&text=${encodeURIComponent(activeBlockText)}`
    : "";

  const handleCopyQuick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeBlockText);
    setCopied(true);
    toast.success("Mensagem copiada para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeColor = 
    lead.opportunityClass.includes("Classe B")
      ? "bg-amber-500/15 text-amber-300 border-amber-500/35"
      : lead.opportunityClass.includes("Classe C")
      ? "bg-blue-500/15 text-blue-300 border-blue-500/35"
      : "bg-slate-800/80 text-slate-400 border-slate-700";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gradient-to-b from-[#111726] to-[#0c101b] border rounded-2xl p-4 shadow-lg transition-all select-none group ${
        isDragging
          ? "border-blue-500 shadow-2xl shadow-blue-500/25 opacity-90 scale-[1.02]"
          : "border-[#1a2030] hover:border-[#2d3748] hover:shadow-xl hover:shadow-black/50"
      }`}
    >
      {/* Topo do Card: ID, Classe de Oportunidade e Link Maps */}
      <div className="flex items-start justify-between gap-2">
        <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#080b12] text-[#94a3b8] border border-[#1a2030]">
              {lead.sampleId}
            </span>
            {lead.observedPosition && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                📍 {lead.observedPosition}º no Maps
              </span>
            )}
            {lead.stage === "perdido_invalido" ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/35">
                ✕ Descartado
              </span>
            ) : (
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                {lead.opportunityClass}
              </span>
            )}
          </div>
          <h4 className="text-[15px] font-extrabold text-[#f1f5f9] mt-2 leading-snug group-hover:text-blue-400 transition-colors">
            {lead.name}
          </h4>
        </div>

        {lead.mapsUrl && (
          <a
            href={lead.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver ficha no Google Maps"
            className="text-[#94a3b8] hover:text-amber-400 p-1.5 rounded-lg bg-[#080b12] hover:bg-slate-800/80 border border-[#1a2030] transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Segmento e Bairro */}
      <div className="mt-2 text-xs text-[#94a3b8] flex items-center gap-2 flex-wrap">
        <span className="text-blue-300 font-semibold">{lead.segment}</span>
        <span className="text-slate-600">•</span>
        <span className="inline-flex items-center gap-1 text-[#94a3b8] font-medium">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          {lead.neighborhood}
        </span>
      </div>

      {/* Pílula de Volume de Demanda Mensal (Destaque Azul Royal) */}
      {lead.searchKeyword && (
        <div className="mt-3 flex items-center justify-between text-xs bg-blue-950/25 px-3 py-1.5 rounded-xl border border-blue-500/20">
          <span className="truncate text-slate-300 font-medium pr-2">
            "{lead.searchKeyword}"
          </span>
          <span className="text-blue-300 font-bold shrink-0 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            ~{lead.monthlySearches}/mês
          </span>
        </div>
      )}

      {/* Oportunidade / Falha Observada (Destaque Dourado) */}
      <div className="mt-2.5 p-2.5 rounded-xl bg-[#080b12] border border-[#1a2030] text-xs text-slate-300 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span className="line-clamp-2 leading-relaxed">{lead.opportunityIssue}</span>
      </div>

      {/* Linha de Telefone e Status do Canal */}
      <div className="mt-3 flex items-center justify-between text-xs border-t border-[#1a2030] pt-2.5">
        <div className="flex items-center gap-1.5 text-[#f1f5f9] font-mono text-xs font-semibold">
          <Phone className="w-3.5 h-3.5 text-blue-400" />
          {lead.phone || "Sem telefone"}
        </div>
        {lead.whatsappConfirmed ? (
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
            WhatsApp ✓
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
            Apenas Fixo
          </span>
        )}
      </div>

      {/* Botões Principais Mais Visíveis e Maiores */}
      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
        {whatsappWebUrl ? (
          <a
            href={whatsappWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all text-center active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Abrir WhatsApp</span>
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#080b12] border border-[#1a2030] text-slate-600 text-xs font-bold cursor-not-allowed"
          >
            Sem WhatsApp
          </button>
        )}

        <button
          onClick={() => onOpenDrawer(lead)}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-bold transition-all active:scale-[0.98]"
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Ver Roteiro</span>
        </button>
      </div>

      {/* Rodapé do Card: Copiar Rápido e Mover Etapa */}
      <div className="mt-3 pt-2.5 border-t border-[#1a2030]/70 flex items-center justify-between text-xs">
        <button
          onClick={handleCopyQuick}
          className="text-[#94a3b8] hover:text-white inline-flex items-center gap-1.5 font-semibold py-1 px-2 rounded-lg hover:bg-[#161d2e] transition-colors"
          title="Copiar mensagem da etapa atual"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              <span>Copiar Mensagem</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1">
          {lead.stage === "perdido_invalido" ? (
            <button
              onClick={() => onAdvanceStage(lead.id, "a_abordar")}
              title="Restaurar contato para A Abordar"
              className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 font-bold text-[11px] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar</span>
            </button>
          ) : (
            <>
              {prevStage && onPreviousStage && (
                <button
                  onClick={() => onPreviousStage(lead.id, prevStage)}
                  title="Voltar etapa anterior"
                  className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#161d2e] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {nextStage && (
                <button
                  onClick={() => onAdvanceStage(lead.id, nextStage)}
                  title="Avançar para próxima etapa"
                  className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-[11px] transition-colors"
                >
                  <span>Avançar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => onAdvanceStage(lead.id, "perdido_invalido")}
                title="Descartar (Número inexistente ou contato errado)"
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-colors ml-0.5"
              >
                <PhoneOff className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
