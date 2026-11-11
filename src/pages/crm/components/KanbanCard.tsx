import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { useNavigate } from "../../../lib/local-router";
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
  RotateCcw,
  Users
} from "lucide-react";
import { toast } from "react-hot-toast";
import { resolveLeadScore } from "../utils/deterministicScoring";
import { resolveFollowUpMessage } from "../utils/followUpGenerator";
import type { ProspectLead, PipelineStageId, DrawerBlockTab } from "../types";

interface KanbanCardProps {
  lead: ProspectLead;
  onOpenDrawer: (lead: ProspectLead, initialTab?: DrawerBlockTab) => void;
  onAdvanceStage: (leadId: string, nextStage: PipelineStageId) => void;
  onPreviousStage?: (leadId: string, prevStage: PipelineStageId) => void;
  linkedClientSlug?: string | null;
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
  onPreviousStage,
  linkedClientSlug,
}) => {
  const navigate = useNavigate();
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
  const nextStage = currentIdx >= 0 && currentIdx < STAGES_ORDER.length - 1 ? STAGES_ORDER[currentIdx + 1] : null;
  const prevStage = currentIdx > 0 ? STAGES_ORDER[currentIdx - 1] : null;

  const activeBlockText =
    lead.stage === "a_abordar"
      ? lead.bloco1
      : lead.stage === "contatado"
      ? lead.bloco2
      : lead.stage === "em_conversa"
      ? resolveFollowUpMessage(lead)
      : lead.bloco4;

  const whatsappWebUrl = lead.formattedPhone && lead.whatsappConfirmed
    ? `https://web.whatsapp.com/send?phone=${lead.formattedPhone}&text=${encodeURIComponent(activeBlockText)}`
    : "";

  const handleCopyQuick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeBlockText);
    setCopied(true);
    toast.success("Mensagem copiada para o WhatsApp!");
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreResult = resolveLeadScore(lead);

  const badgeColor =
    scoreResult.tier === "A"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
      : scoreResult.tier === "B"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/35"
      : scoreResult.tier === "C"
      ? "bg-blue-500/15 text-blue-300 border-blue-500/35"
      : "bg-slate-800/80 text-slate-400 border-slate-700";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gradient-to-b from-[#111726] to-[#0c101b] border rounded-2xl p-3.5 shadow-lg transition-all select-none group w-full max-w-full box-border ${
        isDragging
          ? "border-blue-500 shadow-2xl shadow-blue-500/25 opacity-90 scale-[1.02]"
          : lead.stage === "perdido_invalido"
          ? "border-rose-950/40 opacity-80 hover:opacity-100 hover:border-rose-500/40"
          : scoreResult.tier === "A"
          ? "border-emerald-500/25 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-black/50"
          : "border-[#1a2030] hover:border-[#2d3748] hover:shadow-xl hover:shadow-black/50"
      }`}
    >
      {/* Topo do Card: ID, Badges e Ações Utilitárias (100% contidas no cabeçalho) */}
      <div className="flex items-start justify-between gap-1.5 min-w-0">
        <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#080b12] text-[#94a3b8] border border-[#1a2030] shrink-0">
              {lead.sampleId}
            </span>
            {lead.round && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/25 shrink-0">
                {lead.round.replace("Rodada ", "R")}
              </span>
            )}
            {lead.observedPosition && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                📍 {lead.observedPosition}º Maps
              </span>
            )}
            {lead.stage === "perdido_invalido" ? (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/35 shrink-0">
                ✕ Descartado
              </span>
            ) : (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeColor}`}>
                {scoreResult.classLabel}
              </span>
            )}
            {lead.claimStatus === "nao_reivindicado" && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/35 shrink-0">
                Não reivindicado
              </span>
            )}
          </div>
          <h4 className="text-[14px] font-extrabold text-[#f1f5f9] mt-1.5 leading-snug group-hover:text-blue-400 transition-colors line-clamp-1 break-words">
            {lead.name}
          </h4>
        </div>

        {/* Ações de Topo: Descartar / Restaurar + Ver Maps */}
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {lead.stage !== "perdido_invalido" ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAdvanceStage(lead.id, "perdido_invalido");
                toast.error("Lead descartado (Contato inválido)");
              }}
              title="Descartar número: Inexistente ou contato errado"
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg bg-[#080b12] hover:bg-rose-500/15 border border-[#1a2030] hover:border-rose-500/30 transition-all flex items-center justify-center w-7 h-7"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAdvanceStage(lead.id, "a_abordar");
                toast.success("Lead restaurado para A Abordar");
              }}
              title="Restaurar contato para A Abordar"
              className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all flex items-center justify-center w-7 h-7"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {lead.mapsUrl && (
            <a
              href={lead.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Ver ficha oficial no Google Maps"
              className="text-[#94a3b8] hover:text-amber-400 p-1.5 rounded-lg bg-[#080b12] hover:bg-slate-800/80 border border-[#1a2030] transition-all flex items-center justify-center w-7 h-7"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Segmento, Nota e Bairro */}
      <div className="mt-1.5 text-[11px] text-[#94a3b8] flex items-center gap-1.5 min-w-0">
        <span className="text-blue-300 font-semibold truncate shrink-0 max-w-[130px]">{lead.segment}</span>
        <span className="text-slate-600 shrink-0">•</span>
        <span className="inline-flex items-center gap-1 font-medium truncate min-w-0">
          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">{lead.neighborhood}</span>
        </span>
        {lead.ratingText && (
          <>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="text-amber-300 font-semibold shrink-0">{lead.ratingText}</span>
          </>
        )}
      </div>

      {/* Pílula de Volume de Demanda Mensal */}
      {lead.searchKeyword && (
        <div className="mt-2 flex items-center justify-between text-[11px] bg-blue-950/25 px-2.5 py-1 rounded-lg border border-blue-500/20 min-w-0">
          <span className="truncate text-slate-300 font-medium pr-1.5 min-w-0">
            "{lead.searchKeyword}"
          </span>
          <span className="text-blue-300 font-bold shrink-0 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            ~{lead.monthlySearches}/mês
          </span>
        </div>
      )}

      {/* Oportunidade / Falha Observada */}
      <div className="mt-2 p-2 rounded-lg bg-[#080b12] border border-[#1a2030] text-[11px] text-slate-300 flex items-start gap-1.5 min-w-0">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span className="line-clamp-2 leading-relaxed break-words min-w-0">{lead.opportunityIssue}</span>
      </div>

      {/* Linha de Telefone e Status do Canal */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] border-t border-[#1a2030] pt-2 min-w-0">
        <div className="flex items-center gap-1.5 text-[#f1f5f9] font-mono font-semibold truncate min-w-0">
          <Phone className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="truncate">{lead.phone || "Sem telefone"}</span>
        </div>
        {lead.whatsappConfirmed ? (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
            WhatsApp ✓
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
            Apenas Fixo
          </span>
        )}
      </div>

      {/* Botões Principais: WhatsApp e Roteiro */}
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {whatsappWebUrl ? (
          <a
            href={whatsappWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-md shadow-emerald-600/20 transition-all text-center active:scale-[0.98] min-w-0"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">WhatsApp</span>
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-[#080b12] border border-[#1a2030] text-slate-600 text-[11px] font-bold cursor-not-allowed min-w-0"
          >
            Sem Whats
          </button>
        )}

        <button
          onClick={() => onOpenDrawer(lead)}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 hover:text-white text-[11px] font-bold transition-all active:scale-[0.98] min-w-0"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate">Ver Roteiro</span>
        </button>
      </div>

      {lead.stage === "em_conversa" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDrawer(lead, "followup");
          }}
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 text-[11px] font-bold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>Follow-up Conversão (Pix CNPJ)</span>
        </button>
      )}

      {(lead.stage === "fechado_ganho" || linkedClientSlug) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (linkedClientSlug) {
              navigate(`/crm/clientes/${linkedClientSlug}`);
            } else {
              navigate(`/crm/clientes?fromLead=${encodeURIComponent(lead.id)}`);
            }
          }}
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-[11px] font-bold transition-all"
        >
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>{linkedClientSlug ? "Abrir Ficha & Histórico do Cliente" : "Criar Ficha de Cliente"}</span>
        </button>
      )}

      {/* Rodapé do Card: Copiar e Navegação de Etapa (Sem aperto e com mais de 100px livres) */}
      <div className="mt-2.5 pt-2 border-t border-[#1a2030]/70 flex items-center justify-between text-xs min-w-0">
        <button
          onClick={handleCopyQuick}
          className="text-[#94a3b8] hover:text-white inline-flex items-center gap-1 font-semibold py-1 px-1.5 rounded hover:bg-[#161d2e] transition-colors text-[11px] shrink-0"
          title="Copiar mensagem pronta para colar no WhatsApp"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-blue-400" />
              <span>Copiar</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {lead.stage === "perdido_invalido" ? (
            <button
              onClick={() => onAdvanceStage(lead.id, "a_abordar")}
              title="Restaurar contato para A Abordar"
              className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 font-bold text-[10px] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar</span>
            </button>
          ) : (
            <>
              {prevStage && onPreviousStage && (
                <button
                  onClick={() => onPreviousStage(lead.id, prevStage)}
                  title="Voltar etapa anterior"
                  className="p-1 rounded text-[#94a3b8] hover:text-white hover:bg-[#161d2e] transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              {nextStage && (
                <button
                  onClick={() => onAdvanceStage(lead.id, nextStage)}
                  title="Avançar para próxima etapa"
                  className="inline-flex items-center gap-0.5 py-1 px-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-[10px] transition-colors"
                >
                  <span>Avançar</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
