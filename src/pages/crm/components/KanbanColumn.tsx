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
      className={`flex flex-col rounded-2xl bg-[#090c13]/80 border transition-all min-w-[280px] max-w-[340px] flex-1 ${
        isOver
          ? "border-emerald-500/80 bg-emerald-950/10 shadow-lg shadow-emerald-500/10"
          : "border-slate-800/80"
      }`}
    >
      {/* Cabeçalho da Coluna */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${stage.badgeColor}`} />
          <h3 className="text-xs font-bold text-white tracking-wide">
            {stage.title}
          </h3>
        </div>
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
          {leads.length}
        </span>
      </div>

      <div className="px-3.5 py-1.5 bg-[#06080d]/60 border-b border-slate-800/40">
        <p className="text-[10px] text-slate-500 font-medium truncate">{stage.description}</p>
      </div>

      {/* Lista de Cards com scroll suave */}
      <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5 min-h-[480px] max-h-[calc(100vh-270px)]">
        {leads.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-center p-4">
            <p className="text-xs text-slate-600">Nenhuma empresa nesta etapa</p>
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
