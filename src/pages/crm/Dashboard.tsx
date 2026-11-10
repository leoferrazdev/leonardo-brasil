import React, { useEffect, useState, useMemo } from "react";
import { 
  DndContext, 
  DragEndEvent, 
  MouseSensor,
  TouchSensor,
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { CrmHeader } from "./components/CrmHeader";
import { KanbanColumn } from "./components/KanbanColumn";
import { MessageBlocksDrawer } from "./components/MessageBlocksDrawer";
import { crmProspectService } from "./services/crmProspectService";
import { crmClientService } from "./services/crmClientService";
import { resolveLeadScore, parseMonthlySearchVolume } from "./utils/deterministicScoring";
import type { ProspectLead, PipelineStage, PipelineStageId } from "./types";

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "a_abordar",
    title: "1. A Abordar (Novo)",
    badgeColor: "bg-amber-400",
    description: "Leads auditados prontos para disparo do Bloco 1",
  },
  {
    id: "contatado",
    title: "2. Contatado",
    badgeColor: "bg-blue-400",
    description: "Bloco 1 (Gancho de abertura) enviado pelo WhatsApp",
  },
  {
    id: "em_conversa",
    title: "3. Em Conversa",
    badgeColor: "bg-indigo-400",
    description: "Prospect respondeu; apresentação dos Blocos 2 e 3",
  },
  {
    id: "proposta_enviada",
    title: "4. Proposta Enviada",
    badgeColor: "bg-amber-500",
    description: "Bloco 4 (R$ 497 à vista ou 2x R$ 250 / R$ 380) apresentado",
  },
  {
    id: "fechado_ganho",
    title: "5. Fechado (Ganho)",
    badgeColor: "bg-emerald-400",
    description: "Venda concluída e receita confirmada (+R$ 497)",
  },
  {
    id: "perdido_invalido",
    title: "6. Perdido / Contato Inválido",
    badgeColor: "bg-rose-500",
    description: "Número inexistente, contato errado ou sem interesse",
  },
];

export default function CrmDashboard() {
  const [leads, setLeads] = useState<ProspectLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<ProspectLead | null>(null);
  const [clientSlugByLeadId, setClientSlugByLeadId] = useState<Record<string, string>>({});

  // Filtros (WhatsApp Confirmado ativo por padrão para focar na conversão imediata)
  const [selectedSegment, setSelectedSegment] = useState("todos");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("todos");
  const [whatsappOnly, setWhatsappOnly] = useState(true);
  const [scoreTierFilter, setScoreTierFilter] = useState<"todos" | "A" | "AB">("todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Foco de Etapa (Mobile & Desktop): "todas" para panorâmico ou id da etapa para coluna única
  const [activeStageView, setActiveStageView] = useState<PipelineStageId | "todas">("todas");

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    })
  );

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await crmProspectService.getLeads();
        if (isMounted) {
          setLeads(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao carregar leads:", err);
        if (isMounted) setLoading(false);
      }
    }
    loadData();

    crmClientService
      .listClients()
      .then(({ clients }) => {
        if (!isMounted) return;
        const nextMap: Record<string, string> = {};
        for (const c of clients) {
          if (c.lead_id) nextMap[c.lead_id] = c.slug;
        }
        setClientSlugByLeadId(nextMap);
      })
      .catch(() => {
        // Silencioso: Kanban continua operacional mesmo antes da migração
      });

    return () => { isMounted = false; };
  }, []);

  // Filtragem e ordenação 100% determinística (Maior Pontuação -> Melhor Posição -> Maior Demanda)
  const filteredLeads = useMemo(() => {
    const filtered = leads.filter((lead) => {
      const matchWhatsapp = !whatsappOnly || lead.whatsappConfirmed;
      const segLow = lead.segment.toLowerCase();
      const matchSegment =
        selectedSegment === "todos" ||
        (selectedSegment === "URGENCIA_24H"
          ? segLow.includes("chaveiro") ||
            segLow.includes("desentupidora") ||
            segLow.includes("elétrica") ||
            segLow.includes("eletrica") ||
            segLow.includes("bateria") ||
            segLow.includes("guincho") ||
            (segLow.includes("veterin") &&
              (lead.name.toLowerCase().includes("24") ||
                (lead.canalStatus || "").toLowerCase().includes("24h") ||
                (lead.opportunityIssue || "").toLowerCase().includes("24h")))
          : selectedSegment === "Oficina Mecânica"
            ? lead.segment === "Oficina Mecânica" ||
              segLow.includes("elétrica") ||
              segLow.includes("eletrica") ||
              segLow.includes("bateria") ||
              segLow.includes("automot")
            : lead.segment === selectedSegment);
      const matchNeighborhood =
        selectedNeighborhood === "todos" || lead.neighborhood === selectedNeighborhood;
      const scoreObj = resolveLeadScore(lead);
      const matchScoreTier =
        scoreTierFilter === "todos" ||
        (scoreTierFilter === "A" ? scoreObj.tier === "A" : scoreObj.tier === "A" || scoreObj.tier === "B");
      const matchQuery =
        !searchQuery ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());

      return matchWhatsapp && matchSegment && matchNeighborhood && matchScoreTier && matchQuery;
    });

    return filtered.sort((a, b) => {
      const scoreA = resolveLeadScore(a).score;
      const scoreB = resolveLeadScore(b).score;
      if (scoreB !== scoreA) return scoreB - scoreA;

      const posA = a.observedPosition ?? 99;
      const posB = b.observedPosition ?? 99;
      if (posA !== posB) return posA - posB;

      const volA = parseMonthlySearchVolume(a.monthlySearches);
      const volB = parseMonthlySearchVolume(b.monthlySearches);
      if (volB !== volA) return volB - volA;

      return a.id.localeCompare(b.id);
    });
  }, [leads, whatsappOnly, selectedSegment, selectedNeighborhood, scoreTierFilter, searchQuery]);

  // Ação de arrastar e soltar
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStage = over.id as PipelineStageId;

    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead || currentLead.stage === newStage) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    );

    const stageTitle = PIPELINE_STAGES.find((s) => s.id === newStage)?.title || newStage;
    toast.success(`Movido para "${stageTitle}"`);

    await crmProspectService.updateLeadStage(leadId, newStage);
  };

  // Avanço rápido com botão
  const handleAdvanceStage = async (leadId: string, nextStage: PipelineStageId) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: nextStage } : l))
    );

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, stage: nextStage } : null));
    }

    const stageTitle = PIPELINE_STAGES.find((s) => s.id === nextStage)?.title || nextStage;
    toast.success(`Avançado para "${stageTitle}"`);

    await crmProspectService.updateLeadStage(leadId, nextStage);
  };

  const handlePreviousStage = async (leadId: string, prevStage: PipelineStageId) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: prevStage } : l))
    );

    await crmProspectService.updateLeadStage(leadId, prevStage);
  };

  const handleSaveNotes = async (leadId: string, notes: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, notes } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, notes } : null));
    }
    await crmProspectService.updateLeadNotes(leadId, notes);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center text-[#f1f5f9]">
        <div className="w-11 h-11 border-4 border-blue-500 border-t-amber-400 rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#94a3b8]">Carregando CRM Executivo de Prospecção...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0a0d14] text-[#f1f5f9] flex flex-col selection:bg-blue-600 selection:text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(59, 130, 246, 0.08), transparent 40%), radial-gradient(circle at 85% 10%, rgba(245, 158, 11, 0.05), transparent 35%)",
      }}
    >
      <Helmet>
        <title>Dashboard Executivo | CRM Prospecção Local - Leonardo Brasil</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header Executivo com KPIs, Meta Diária e Filtros */}
      <CrmHeader
        leads={leads}
        filteredCount={filteredLeads.length}
        selectedSegment={selectedSegment}
        setSelectedSegment={setSelectedSegment}
        selectedNeighborhood={selectedNeighborhood}
        setSelectedNeighborhood={setSelectedNeighborhood}
        whatsappOnly={whatsappOnly}
        setWhatsappOnly={setWhatsappOnly}
        scoreTierFilter={scoreTierFilter}
        setScoreTierFilter={setScoreTierFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Barra de Foco e Navegação de Etapas (Mobile & Desktop) */}
      <div className="border-b border-[#1a2030] bg-[#0c101b]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-2.5 sticky top-[73px] z-20">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none flex-nowrap w-full sm:w-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1.5 hidden md:inline-flex items-center gap-1">
              Etapas:
            </span>
            <button
              onClick={() => setActiveStageView("todas")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeStageView === "todas"
                  ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/25"
                  : "bg-[#080b12] text-[#94a3b8] border-[#1a2030] hover:text-white hover:border-[#2d3748]"
              }`}
            >
              Todas as 6 Colunas ({filteredLeads.length})
            </button>
            {PIPELINE_STAGES.map((stage) => {
              const count = filteredLeads.filter((l) => l.stage === stage.id).length;
              const isSelected = activeStageView === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageView(stage.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-slate-800 text-white border-amber-400/80 shadow-md shadow-black/40"
                      : "bg-[#080b12] text-[#94a3b8] border-[#1a2030] hover:text-white hover:border-[#2d3748]"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${stage.badgeColor}`} />
                  <span>{stage.title.split(". ")[1] || stage.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isSelected
                        ? "bg-amber-400/20 text-amber-300"
                        : "bg-[#161d2e] text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeStageView !== "todas" && (
            <button
              onClick={() => setActiveStageView("todas")}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 decoration-blue-500/40 hidden sm:inline-block"
            >
              ← Voltar para Visão Panorâmica
            </button>
          )}
        </div>
      </div>

      {/* Área Principal do Kanban (6 Etapas Panorâmicas ou Foco em Etapa Única) */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {activeStageView === "todas" ? (
            <div className="overflow-x-auto pb-4">
              <div className="max-w-[1920px] mx-auto min-w-[1740px]">
                <div className="flex gap-4 items-start justify-between">
                  {PIPELINE_STAGES.map((stage) => (
                    <KanbanColumn
                      key={stage.id}
                      stage={stage}
                      leads={filteredLeads.filter((lead) => lead.stage === stage.id)}
                      onOpenDrawer={(lead) => setSelectedLead(lead)}
                      onAdvanceStage={handleAdvanceStage}
                      onPreviousStage={handlePreviousStage}
                      clientSlugByLeadId={clientSlugByLeadId}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto py-2">
              {(() => {
                const stage = PIPELINE_STAGES.find((s) => s.id === activeStageView);
                if (!stage) return null;
                return (
                  <KanbanColumn
                    stage={stage}
                    leads={filteredLeads.filter((lead) => lead.stage === stage.id)}
                    onOpenDrawer={(lead) => setSelectedLead(lead)}
                    onAdvanceStage={handleAdvanceStage}
                    onPreviousStage={handlePreviousStage}
                    isSingleView={true}
                    clientSlugByLeadId={clientSlugByLeadId}
                  />
                );
              })()}
            </div>
          )}
        </DndContext>
      </main>

      {/* Gaveta de Roteiros de Mensagens para WhatsApp */}
      <MessageBlocksDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onAdvanceStage={handleAdvanceStage}
        onSaveNotes={handleSaveNotes}
        linkedClientSlug={selectedLead ? clientSlugByLeadId[selectedLead.id] ?? null : null}
      />
    </div>
  );
}
