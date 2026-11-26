import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "../../lib/local-router";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Euro,
  Filter,
  Globe,
  MapPin,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Trophy,
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { ProspectLead, PipelineStage, PipelineStageId, DrawerBlockTab } from "./types";
import { crmPortugalService } from "./services/crmPortugalService";
import { resolveLeadScore } from "./utils/deterministicScoring";
import { CrmNavBar } from "./components/CrmNavBar";
import { KanbanColumn } from "./components/KanbanColumn";
import { MessageBlocksDrawer } from "./components/MessageBlocksDrawer";

const PIPELINE_STAGES: PipelineStage[] = [
  { id: "a_abordar", title: "1. A Abordar (Portugal)", badgeColor: "bg-amber-400", description: "Leads de oficinas mecânicas em Portugal auditados para Bloco 1" },
  { id: "contatado", title: "2. Contatado", badgeColor: "bg-blue-400", description: "Bloco 1 enviado pelo WhatsApp em português" },
  { id: "em_conversa", title: "3. Em Conversa", badgeColor: "bg-indigo-400", description: "Diagnóstico e negociação em andamento" },
  { id: "proposta_enviada", title: "4. Em Proposta (€)", badgeColor: "bg-purple-400", description: "Oferta € 497 apresentada" },
  { id: "fechado_ganho", title: "5. Fechado Ganho (€)", badgeColor: "bg-emerald-400", description: "Venda concluída (+€ 497)" },
  { id: "perdido_invalido", title: "6. Perdido / Inválido", badgeColor: "bg-rose-400", description: "Sem retorno ou telemóvel inválido" },
];

const TICKET_EUR = 497;

export const DashboardPortugal: React.FC = () => {
  const [leads, setLeads] = useState<ProspectLead[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSegment, setSelectedSegment] = useState("todos");
  const [selectedCity, setSelectedCity] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStageView, setActiveStageView] = useState<PipelineStageId | "todas">("todas");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [selectedLead, setSelectedLead] = useState<ProspectLead | null>(null);
  const [drawerInitialTab, setDrawerInitialTab] = useState<DrawerBlockTab | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  useEffect(() => {
    let isMounted = true;
    crmPortugalService.getLeads().then((data) => {
      if (isMounted) {
        setLeads(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const cities = useMemo(() => {
    const counts = leads.reduce<Record<string, number>>((acc, l) => {
      if (l.neighborhood) acc[l.neighborhood] = (acc[l.neighborhood] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))
      .map((c) => ({ label: c, count: counts[c] }));
  }, [leads]);

  const segments = useMemo(() => {
    const counts = leads.reduce<Record<string, number>>((acc, l) => {
      if (l.segment) acc[l.segment] = (acc[l.segment] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))
      .map((s) => ({ label: s, count: counts[s] }));
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const filtered = leads.filter((lead) => {
      const matchSegment = selectedSegment === "todos" || lead.segment === selectedSegment;
      const matchCity = selectedCity === "todos" || lead.neighborhood === selectedCity;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.sampleId.toLowerCase().includes(q) ||
        lead.neighborhood.toLowerCase().includes(q);
      return matchSegment && matchCity && matchQuery;
    });

    return filtered.sort((a, b) => {
      const sA = resolveLeadScore(a).score;
      const sB = resolveLeadScore(b).score;
      if (sB !== sA) return sB - sA;
      return (a.observedPosition ?? 99) - (b.observedPosition ?? 99);
    });
  }, [leads, selectedSegment, selectedCity, searchQuery]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const leadId = active.id as string;
    const newStage = over.id as PipelineStageId;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === newStage) return;

    setLeads((prev) => prev.map((l) => {
        if (l.id !== leadId) return l;
        const nowIso = new Date().toISOString();
        const contactedAt = newStage === 'contatado' ? (l.contactedAt || nowIso) : newStage === 'a_abordar' ? undefined : l.contactedAt;
        return { ...l, stage: newStage, contactedAt, updatedAt: nowIso };
      }));
    toast.success(`${lead.name} movido!`);
    await crmPortugalService.updateLeadStage(leadId, newStage);
  };

  const handleAdvanceStage = async (leadId: string, nextStage: PipelineStageId) => {
    setLeads((prev) => prev.map((l) => {
        if (l.id !== leadId) return l;
        const nowIso = new Date().toISOString();
        const contactedAt = nextStage === 'contatado' ? (l.contactedAt || nowIso) : nextStage === 'a_abordar' ? undefined : l.contactedAt;
        return { ...l, stage: nextStage, contactedAt, updatedAt: nowIso };
      }));
    await crmPortugalService.updateLeadStage(leadId, nextStage);
  };

  const handlePreviousStage = async (leadId: string, prevStage: PipelineStageId) => {
    setLeads((prev) => prev.map((l) => {
        if (l.id !== leadId) return l;
        const nowIso = new Date().toISOString();
        const contactedAt = prevStage === 'contatado' ? (l.contactedAt || nowIso) : prevStage === 'a_abordar' ? undefined : l.contactedAt;
        return { ...l, stage: prevStage, contactedAt, updatedAt: nowIso };
      }));
    await crmPortugalService.updateLeadStage(leadId, prevStage);
  };

  const handleSaveNotes = async (leadId: string, notes: string) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, notes } : l)));
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, notes } : null));
    }
    await crmPortugalService.updateLeadNotes(leadId, notes);
  };

  const handleOpenDrawer = (lead: ProspectLead, initialTab?: DrawerBlockTab) => {
    setDrawerInitialTab(initialTab);
    setSelectedLead(lead);
  };

  const countByStage = (stage: PipelineStageId) => leads.filter((l) => l.stage === stage).length;
  const activeCount = leads.filter((l) => l.stage !== "perdido_invalido").length;
  const formatEUR = (val: number) =>
    `€ ${val.toLocaleString("pt-PT", { maximumFractionDigits: 0 })}`;

  if (loading) {
    return (
      <div data-crm-page="" className="min-h-screen bg-white flex flex-col items-center justify-center text-[#111111]">
        <div className="w-11 h-11 border-4 border-blue-500 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#65686D]">Carregando Kanban Portugal (EUR)...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col selection:bg-blue-600 selection:text-white">
      <Helmet>
        <title>CRM Portugal (EUR) | Prospecção Oficinas Mecânicas - Leonardo Brasil</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header Executivo Portugal (EUR) */}
      <header className="border-b border-[#E5E7EB] bg-white relative z-30 shadow-sm">
        <div className="h-1 w-full bg-emerald-600" />
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto min-w-0">
              <Link to="/crm/dashboard" className="flex items-center gap-3 group shrink-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 p-[1.5px] shadow-sm flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                    <Globe className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-[#111111] tracking-tight">
                      Estratégia Portugal
                    </span>
                    <span className="px-2.5 py-0.5 text-[11px] uppercase font-bold tracking-wider rounded-full bg-emerald-500/15 text-[#1E7E34] border border-emerald-500/30">
                      EUR • Oficinas Mecânicas & Bate-Chapas
                    </span>
                  </div>
                  <p className="text-xs text-[#65686D] font-medium">
                    Perfil no Google • Implantação e Otimização € {TICKET_EUR}
                  </p>
                </div>
              </Link>
              <CrmNavBar />
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#65686D]" />
              <input
                type="text"
                placeholder="Buscar oficina, cidade ou telemóvel +351..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111111] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setShowMobileFilters((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border bg-[#F8F9FA] text-[#111111] border-[#E5E7EB]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showMobileFilters ? "Ocultar Filtros & KPIs" : "Filtros & KPIs (EUR)"}</span>
              {showMobileFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[11px] font-mono text-[#65686D] bg-white px-2.5 py-1 rounded-lg border border-[#E5E7EB] flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-emerald-600" />
              <strong>{filteredLeads.length}</strong>/{leads.length}
            </span>
          </div>

          <div className={showMobileFilters ? "block" : "hidden lg:block"}>
            {/* KPIs em Euro */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-emerald-500/25 rounded-xl p-3 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase text-emerald-700">Pipeline Portugal (€)</p>
                  <p className="text-lg font-black text-[#111111] mt-0.5">
                    {formatEUR(activeCount * TICKET_EUR)}
                  </p>
                  <p className="text-[10px] text-[#65686D]">{activeCount} leads × € {TICKET_EUR}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center">
                  <Euro className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-[#65686D]">1. A Abordar</p>
                  <p className="text-xl font-black text-[#8A6400] mt-0.5">{countByStage("a_abordar")}</p>
                  <p className="text-[10px] text-[#65686D]">Fila de disparo</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-[#8A6400] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white border border-amber-500/25 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-[#8A6400]">4. Em Proposta (€)</p>
                  <p className="text-lg font-black text-[#8A6400] mt-0.5">
                    {formatEUR(countByStage("proposta_enviada") * TICKET_EUR)}
                  </p>
                  <p className="text-[10px] text-[#65686D]">{countByStage("proposta_enviada")} proposta(s)</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-[#8A6400] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-emerald-50/30 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-[#1E7E34]">Receita Fechada (€)</p>
                  <p className="text-lg font-black text-[#1E7E34] mt-0.5">
                    {formatEUR(countByStage("fechado_ganho") * TICKET_EUR)}
                  </p>
                  <p className="text-[10px] text-[#1E7E34]/80">{countByStage("fechado_ganho")} fechado(s)</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-[#1E7E34] flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Filtros Nicho & Cidade */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5E7EB]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-[#65686D] flex items-center gap-1 mr-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  Nicho:
                </span>
                <button
                  onClick={() => setSelectedSegment("todos")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    selectedSegment === "todos"
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-white text-[#65686D] border-[#E5E7EB] hover:bg-[#F8F9FA]"
                  }`}
                >
                  Todos ({leads.length})
                </button>
                {segments.map((seg) => (
                  <button
                    key={seg.label}
                    onClick={() => setSelectedSegment(seg.label)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      selectedSegment === seg.label
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : "bg-white text-[#65686D] border-[#E5E7EB] hover:bg-[#F8F9FA]"
                    }`}
                  >
                    {seg.label} ({seg.count})
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="pt-city-filter" className="text-xs font-semibold text-[#65686D] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8A6400]" />
                  Concelho/Região:
                </label>
                <select
                  id="pt-city-filter"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E5E7EB] bg-white text-[#111111]"
                >
                  <option value="todos">Todas as Regiões ({cities.length})</option>
                  {cities.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label} ({c.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Barra de Etapas */}
      <div className="border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-2.5 sticky top-0 z-20 shadow-xs">
        <div className="max-w-[1760px] mx-auto flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveStageView("todas")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border ${
              activeStageView === "todas"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-white text-[#65686D] border-[#E5E7EB]"
            }`}
          >
            Todas as 6 Colunas ({filteredLeads.length})
          </button>
          {PIPELINE_STAGES.map((stage) => {
            const count = filteredLeads.filter((l) => l.stage === stage.id).length;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageView(stage.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 border ${
                  activeStageView === stage.id
                    ? "bg-[#F8F9FA] text-[#111111] border-amber-400"
                    : "bg-white text-[#65686D] border-[#E5E7EB]"
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${stage.badgeColor}`} />
                <span>{stage.title.split(". ")[1] || stage.title}</span>
                <span className="text-[10px] px-1.5 rounded-full font-mono font-bold bg-[#F8F9FA]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kanban Board */}
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
                      onOpenDrawer={handleOpenDrawer}
                      onAdvanceStage={handleAdvanceStage}
                      onPreviousStage={handlePreviousStage}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto">
              {PIPELINE_STAGES.filter((s) => s.id === activeStageView).map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  leads={filteredLeads.filter((lead) => lead.stage === stage.id)}
                  onOpenDrawer={handleOpenDrawer}
                  onAdvanceStage={handleAdvanceStage}
                  onPreviousStage={handlePreviousStage}
                />
              ))}
            </div>
          )}
        </DndContext>
      </main>

      <MessageBlocksDrawer
        lead={selectedLead}
        initialTab={drawerInitialTab}
        onClose={() => setSelectedLead(null)}
        onAdvanceStage={handleAdvanceStage}
        onSaveNotes={handleSaveNotes}
      />
    </div>
  );
};

export default DashboardPortugal;
