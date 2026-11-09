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
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  leads,
  onOpenDrawer,
  onAdvanceStage,
  onPreviousStage,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl bg-[#0b0f19]/90 border transition-all min-w-[270px] max-w-[325px] flex-1 shadow-xl ${
        isOver
          ? "border-blue-500/80 bg-blue-950/15 shadow-2xl shadow-blue-500/15"
          : stage.id === "perdido_invalido"
          ? "border-rose-950/40 bg-[#0c0910]/80"
          : "border-[#1a2030]"
      }`}
    >
      {/* Cabeçalho da Coluna */}
      <div className="p-4 border-b border-[#1a2030] flex items-center justify-between bg-[#0e1320]/70 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full shadow-sm ${stage.badgeColor}`} />
          <h3 className="text-sm font-extrabold text-[#f1f5f9] tracking-tight">
            {stage.title}
          </h3>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#161d2e] text-blue-300 border border-[#2d3748]">
          {leads.length}
        </span>
      </div>

      <div className="px-4 py-2 bg-[#080b12]/80 border-b border-[#1a2030]/60">
        <p className="text-[11px] text-[#94a3b8] font-medium truncate">{stage.description}</p>
      </div>

      {/* Lista de Cards com scroll suave */}
      <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[520px] max-h-[calc(100vh-310px)]">
        {leads.length === 0 ? (
          <div className="h-36 border-2 border-dashed border-[#1a2030] rounded-2xl flex items-center justify-center text-center p-5">
            <p className="text-xs text-slate-500 font-medium">Nenhuma empresa nesta etapa</p>
          </div>
        ) : (
          leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              onOpenDrawer={onOpenDrawer}
              onAdvanceStage={onAdvanceStage}
              onPreviousStage={onPreviousStage}
            />
          ))
        )}
      </div>
    </div>
  );
};
