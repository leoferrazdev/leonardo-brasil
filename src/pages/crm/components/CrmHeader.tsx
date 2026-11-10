import React from "react";
import { Link, useNavigate } from "../../../lib/local-router";
import { supabase } from "../../../lib/supabase";
import { 
  Sparkles, 
  LogOut, 
  Search, 
  Building2, 
  MapPin, 
  Send, 
  MessageSquare, 
  FileText, 
  Trophy,
  TrendingUp,
  Target,
  MessageCircle,
  Filter
} from "lucide-react";
import { toast } from "react-hot-toast";
import { resolveLeadScore } from "../utils/deterministicScoring";
import type { ProspectLead, PipelineStageId } from "../types";
import { CrmNavBar } from "./CrmNavBar";

interface CrmHeaderProps {
  leads: ProspectLead[];
  filteredCount: number;
  selectedSegment: string;
  setSelectedSegment: (seg: string) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (n: string) => void;
  whatsappOnly: boolean;
  setWhatsappOnly: (val: boolean) => void;
  scoreTierFilter: "todos" | "A" | "AB";
  setScoreTierFilter: (tier: "todos" | "A" | "AB") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const CrmHeader: React.FC<CrmHeaderProps> = ({
  leads,
  filteredCount,
  selectedSegment,
  setSelectedSegment,
  selectedNeighborhood,
  setSelectedNeighborhood,
  whatsappOnly,
  setWhatsappOnly,
  scoreTierFilter,
  setScoreTierFilter,
  searchQuery,
  setSearchQuery,
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("crm_offline_session");
      localStorage.removeItem("crm_user_email");
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignora erro se não conectado ao Supabase
    }
    toast.success("Sessão encerrada");
    navigate("/crm/login");
  };

  const countByStage = (stage: PipelineStageId) => leads.filter(l => l.stage === stage).length;

  // Cálculos de KPIs e Metas Financeiras (Prospecção inicial focada em implantação pontual R$ 497 ou 2x de R$ 250)
  const TICKET_PONTUAL = 497;
  const META_DIARIA_CONTATOS = 5;

  // Apenas leads válidos e não descartados compõem a base ativa de prospecção
  const activeWhatsappLeads = leads.filter(l => l.whatsappConfirmed && l.stage !== "perdido_invalido");
  const whatsappLeadsCount = activeWhatsappLeads.length;
  const tierACount = activeWhatsappLeads.filter(
    l => l.stage === "a_abordar" && resolveLeadScore(l).tier === "A"
  ).length;

  const actionedCount = 
    countByStage("contatado") + 
    countByStage("em_conversa") + 
    countByStage("proposta_enviada") + 
    countByStage("fechado_ganho") + 
    countByStage("perdido_invalido");
  const inNegotiationCount = countByStage("proposta_enviada");
  const closedCount = countByStage("fechado_ganho");
  const lostCount = countByStage("perdido_invalido");

  const potentialPipelineValue = whatsappLeadsCount * TICKET_PONTUAL;
  const negotiationValue = inNegotiationCount * TICKET_PONTUAL;
  const closedRevenue = closedCount * TICKET_PONTUAL;
  const dailyGoalPercent = Math.min(100, Math.round((actionedCount / META_DIARIA_CONTATOS) * 100));

  const formatBRL = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  const segments = [
    { label: "Todos", val: "todos" },
    { label: "Veterinárias", val: "Clínica Veterinária" },
    { label: "Oficinas Mecânicas", val: "Oficina Mecânica" },
    { label: "Urgência 24h", val: "URGENCIA_24H" },
    { label: "Odontologia", val: "Clínica Odontológica" },
    { label: "Climatização", val: "Climatização / Ar-Condicionado" },
    { label: "Restaurantes", val: "Restaurante" },
  ];

  const neighborhoodCounts = leads.reduce<Record<string, number>>((acc, l) => {
    if (l.neighborhood) acc[l.neighborhood] = (acc[l.neighborhood] || 0) + 1;
    return acc;
  }, {});
  const dynamicNeighborhoods = Object.keys(neighborhoodCounts).sort(
    (a, b) => neighborhoodCounts[b] - neighborhoodCounts[a] || a.localeCompare(b)
  );
  const neighborhoods = [
    { label: "Todos", val: "todos" },
    ...dynamicNeighborhoods.map((n) => ({ label: n, val: n })),
  ];

  return (
    <header className="border-b border-[#1a2030] bg-[#0a0d14]/95 backdrop-blur-xl sticky top-0 z-30 shadow-2xl shadow-black/50">
      {/* Barra Finíssima Dourada/Azul Royal de Destaque no Topo */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Linha 1: Identidade Executiva, Barra de Meta Diária, Busca e Logout */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto min-w-0">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-400 p-[1.5px] shadow-lg shadow-blue-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-extrabold text-[#f1f5f9] tracking-tight">
                    Leonardo Brasil
                  </span>
                  <span className="px-2.5 py-0.5 text-[11px] uppercase font-bold tracking-wider rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    CRM Executivo
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] font-medium">
                  Máquina de Vendas • Posicionamento Google Maps & SEO Local
                </p>
              </div>
            </Link>
            <CrmNavBar />
          </div>

          {/* Barra Central de Meta Diária de Prospecção */}
          <div className="w-full lg:w-auto flex-1 max-w-md bg-[#0f1420] border border-[#1a2030] rounded-xl px-4 py-2.5 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#f1f5f9]">Meta Diária de Abordagens</span>
                <span className="font-mono font-bold text-amber-400">
                  {actionedCount} / {META_DIARIA_CONTATOS} leads ({dailyGoalPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#06080d] rounded-full overflow-hidden border border-[#1a2030]">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${dailyGoalPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Busca Rápida + Botão Filtro WhatsApp + Logout */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end flex-wrap">
            {/* Botão Destaque: Apenas WhatsApp Confirmado */}
            <button
              type="button"
              onClick={() => setWhatsappOnly(!whatsappOnly)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                whatsappOnly
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-md shadow-emerald-500/10"
                  : "bg-[#0f1420] text-[#94a3b8] border-[#1a2030] hover:text-white hover:border-[#2d3748]"
              }`}
              title="Ocultar números apenas de telefone fixo"
            >
              <MessageCircle className={`w-4 h-4 ${whatsappOnly ? "text-emerald-400" : "text-slate-500"}`} />
              <span>{whatsappOnly ? "Só WhatsApp Ativo ✓" : "Mostrando Todos (Com Fixos)"}</span>
            </button>

            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Buscar empresa, bairro ou fone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#0f1420] border border-[#1a2030] rounded-xl text-xs text-[#f1f5f9] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#1a2030] bg-[#0f1420] hover:bg-slate-800 text-[#94a3b8] hover:text-white text-xs font-semibold transition-colors"
              title="Sair do CRM"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Linha 2: Painel de KPIs de Conversão e Potencial Financeiro (R$) */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* KPI 1: Potencial na Mesa */}
          <div className="bg-gradient-to-br from-[#0f1523] to-[#0b0f19] border border-blue-500/25 rounded-xl p-3 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-300/90">
                Potencial (WhatsApp)
              </p>
              <p className="text-lg font-black text-white mt-0.5">{formatBRL(potentialPipelineValue)}</p>
              <p className="text-[10px] text-[#94a3b8] mt-0.5">
                {whatsappLeadsCount} leads aptos × R$ 497
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          {/* KPI 2: 1. A Abordar */}
          <div className="bg-[#0e131f] border border-[#1a2030] rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#94a3b8]">1. A Abordar</p>
              <p className="text-xl font-black text-amber-400 mt-0.5">{countByStage("a_abordar")}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Na fila de disparo</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
          </div>

          {/* KPI 3: 2. Contatados */}
          <div className="bg-[#0e131f] border border-[#1a2030] rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#94a3b8]">2. Contatados</p>
              <p className="text-xl font-black text-blue-400 mt-0.5">{countByStage("contatado")}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Bloco 1 enviado</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/25 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>

          {/* KPI 4: 3. Em Conversa */}
          <div className="bg-[#0e131f] border border-[#1a2030] rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#94a3b8]">3. Em Conversa</p>
              <p className="text-xl font-black text-indigo-400 mt-0.5">{countByStage("em_conversa")}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Análise em andamento</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          {/* KPI 5: 4. Em Proposta (R$) */}
          <div className="bg-[#0e131f] border border-amber-500/25 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-amber-300/90">4. Em Proposta (R$)</p>
              <p className="text-lg font-black text-amber-400 mt-0.5">{formatBRL(negotiationValue)}</p>
              <p className="text-[10px] text-[#94a3b8] mt-0.5">
                {inNegotiationCount} proposta(s) enviada(s)
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* KPI 6: Receita Fechada */}
          <div className="bg-gradient-to-br from-emerald-950/30 to-[#0e131f] border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-emerald-300">Receita Fechada</p>
              <p className="text-lg font-black text-emerald-400 mt-0.5">{formatBRL(closedRevenue)}</p>
              <p className="text-[10px] text-emerald-400/80 mt-0.5">
                {closedCount} implantação(ões) pontual(is) × R$ {TICKET_PONTUAL}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Linha 3: Filtros Rápidos de Segmento e Bairro */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1a2030]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-[#94a3b8] flex items-center gap-1 mr-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Segmento:
            </span>
            {segments.map((seg) => (
              <button
                key={seg.val}
                onClick={() => setSelectedSegment(seg.val)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedSegment === seg.val
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 border border-blue-400/40"
                    : "bg-[#0f1420] text-[#94a3b8] hover:bg-[#161d2e] hover:text-white border border-[#1a2030]"
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-[#94a3b8] flex items-center gap-1 mr-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Bairro:
            </span>
            {neighborhoods.map((nb) => (
              <button
                key={nb.val}
                onClick={() => setSelectedNeighborhood(nb.val)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedNeighborhood === nb.val
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 border border-amber-400"
                    : "bg-[#0f1420] text-[#94a3b8] hover:bg-[#161d2e] hover:text-white border border-[#1a2030]"
                }`}
              >
                {nb.label}
              </button>
            ))}

            <span className="ml-2 text-[11px] font-mono text-[#94a3b8] bg-[#0f1420] px-2.5 py-1 rounded-lg border border-[#1a2030] flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-blue-400" />
              <span>
                Exibindo <strong className="text-white">{filteredCount}</strong> de {leads.length}
              </span>
              {lostCount > 0 && (
                <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  {lostCount} inválido(s)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Linha 4: Filtro Determinístico de Prioridade de Ataque */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#1a2030]/70">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-[#94a3b8] flex items-center gap-1 mr-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Score Determinístico:
            </span>
            {[
              { label: "Todas Classes (Ordenado ↓)", val: "todos" as const },
              { label: `Só Classe A ≥75 (${tierACount} na fila)`, val: "A" as const },
              { label: "Classe A + B (≥60)", val: "AB" as const },
            ].map((tierOpt) => (
              <button
                key={tierOpt.val}
                type="button"
                onClick={() => setScoreTierFilter(tierOpt.val)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  scoreTierFilter === tierOpt.val
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/45 shadow-sm"
                    : "bg-[#0f1420] text-[#94a3b8] hover:bg-[#161d2e] hover:text-white border border-[#1a2030]"
                }`}
              >
                {tierOpt.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Ordenação automática por Score (0–100 pts) • Posição ≥ 4º Maps
          </span>
        </div>
      </div>
    </header>
  );
};
