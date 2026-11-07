import React, { useEffect, useState, useMemo } from "react";
import { 
  DndContext, 
  DragEndEvent, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { CrmHeader } from "./components/CrmHeader";
import { KanbanColumn } from "./components/KanbanColumn";
import { MessageBlocksDrawer } from "./components/MessageBlocksDrawer";
import { crmProspectService } from "./services/crmProspectService";
import type { ProspectLead, PipelineStage, PipelineStageId } from "./types";

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "a_abordar",
    title: "1. A Abordar (Novo)",
    badgeColor: "bg-amber-400",
    description: "Leads pesquisados com falhas observadas e blocos prontos",
  },
  {
    id: "contatado",
    title: "2. Contatado",
    badgeColor: "bg-sky-400",
    description: "Bloco 1 (Gancho de abertura) enviado pelo WhatsApp",
  },
  {
    id: "em_conversa",
    title: "3. Em Conversa",
    badgeColor: "bg-purple-400",
    description: "Prospect respondeu; apresentação dos Blocos 2 e 3",
  },
  {
    id: "proposta_enviada",
    title: "4. Proposta Enviada",
    badgeColor: "bg-emerald-400",
    description: "Bloco 4 (Condições R$ 650 / R$ 380) apresentado",
  },
  {
    id: "fechado_arquivado",
    title: "5. Fechado / Arquivado",
    badgeColor: "bg-slate-400",
    description: "Contrato fechado ou lead sem interesse registrado",
  },
];

export default function CrmDashboard() {
  const [leads, setLeads] = useState<ProspectLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<ProspectLead | null>(null);

  // Filtros
  const [selectedSegment, setSelectedSegment] = useState("todos");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // evita arrasto acidental ao clicar em botões
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
    return () => { isMounted = false; };
  }, []);

  // Filtragem dos cards
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSegment = selectedSegment === "todos" || lead.segment === selectedSegment;
      const matchNeighborhood = selectedNeighborhood === "todos" || lead.neighborhood === selectedNeighborhood;
      const matchQuery =
        !searchQuery ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.sampleId.toLowerCase().includes(searchQuery.toLowerCase());

      return matchSegment && matchNeighborhood && matchQuery;
    });
  }, [leads, selectedSegment, selectedNeighborhood, searchQuery]);

  // Ação de arrastar e soltar
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStage = over.id as PipelineStageId;

    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead || currentLead.stage === newStage) return;

    // Atualização otimista imediata
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
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-400">Carregando CRM de Prospecção Local...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Helmet>
        <title>Dashboard | CRM Prospecção Local - Leonardo Brasil</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header com Filtros e Métricas */}
      <CrmHeader
        leads={leads}
        selectedSegment={selectedSegment}
        setSelectedSegment={setSelectedSegment}
        selectedNeighborhood={selectedNeighborhood}
        setSelectedNeighborhood={setSelectedNeighborhood}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Área Principal do Kanban com scroll horizontal se necessário */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto">
        <div className="max-w-[1700px] mx-auto min-w-[1200px]">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 items-start justify-between">
              {PIPELINE_STAGES.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  leads={filteredLeads.filter((lead) => lead.stage === stage.id)}
                  onOpenDrawer={(lead) => setSelectedLead(lead)}
                  onAdvanceStage={handleAdvanceStage}
                  onPreviousStage={handlePreviousStage}
                />
              ))}
            </div>
          </DndContext>
        </div>
      </main>

      {/* Gaveta de Blocos e Atendimento */}
      <MessageBlocksDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onAdvanceStage={handleAdvanceStage}
        onSaveNotes={handleSaveNotes}
      />
    </div>
  );
}
