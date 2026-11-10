import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./KanbanCard";
import type { ProspectLead, PipelineStage, PipelineStageId } from "../types";

interface KanbanColumnProps {
  stage: PipelineStage;
  leads: ProspectLead[];
  onOpenDrawer: (lead: ProspectLead) => void;
  onAdvanceStage: (leadId: string, nextStage: PipelineStageId) => void;
  onPreviousStage?: (leadId: string, prevStage: PipelineStageId) => void;
  isSingleView?: boolean;
  clientSlugByLeadId?: Record<string, string>;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  leads,
  onOpenDrawer,
  onAdvanceStage,
  onPreviousStage,
  isSingleView = false,
  clientSlugByLeadId,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl bg-[#0b0f19]/90 border transition-all box-border overflow-hidden shadow-xl ${
        isSingleView ? "w-full max-w-2xl mx-auto" : "w-[290px] xl:w-[305px] shrink-0"
      } ${
        isOver
          ? "border-blue-500/80 bg-blue-950/20 shadow-2xl shadow-blue-500/20"
          : stage.id === "perdido_invalido"
          ? "border-rose-950/40 bg-[#0c0910]/80"
          : "border-[#1a2030]"
      }`}
    >
      {/* Cabeçalho da Coluna */}
      <div className="p-3.5 border-b border-[#1a2030] flex items-center justify-between bg-[#0e1320]/80 rounded-t-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full shadow-sm shrink-0 ${stage.badgeColor}`} />
          <h3 className="text-sm font-extrabold text-[#f1f5f9] tracking-tight truncate">
            {stage.title}
          </h3>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#161d2e] text-blue-300 border border-[#2d3748] shrink-0 ml-1.5">
          {leads.length}
        </span>
      </div>

      <div className="px-3.5 py-2 bg-[#080b12]/80 border-b border-[#1a2030]/60">
        <p className="text-[11px] text-[#94a3b8] font-medium truncate">{stage.description}</p>
      </div>

      {/* Lista de Cards com scroll vertical e ZERO scroll lateral */}
      <div className="p-2.5 sm:p-3 flex-1 crm-card-scroll space-y-3 min-h-[480px] max-h-[calc(100vh-270px)]">
        {leads.length === 0 ? (
          <div className="h-36 border-2 border-dashed border-[#1a2030] rounded-xl flex flex-col items-center justify-center text-center p-4">
            <span className="w-8 h-8 rounded-full bg-[#161d2e] flex items-center justify-center text-slate-500 mb-2">
              ✓
            </span>
            <p className="text-xs text-slate-400 font-semibold">Nenhuma empresa nesta etapa</p>
            <p className="text-[11px] text-slate-600 mt-1">Cards avançados aparecem aqui</p>
          </div>
        ) : (
          leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              onOpenDrawer={onOpenDrawer}
              onAdvanceStage={onAdvanceStage}
              onPreviousStage={onPreviousStage}
              linkedClientSlug={clientSlugByLeadId?.[lead.id] ?? null}
            />
          ))
        )}
      </div>
    </div>
  );
};
