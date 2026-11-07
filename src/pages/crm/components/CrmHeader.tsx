import React from "react";
import { Link, useNavigate } from "../../../lib/local-router";
import { supabase } from "../../../lib/supabase";
import { 
  Sparkles, 
  LogOut, 
  Search, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  FileText, 
  Trophy 
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { ProspectLead, PipelineStageId } from "../types";

interface CrmHeaderProps {
  leads: ProspectLead[];
  selectedSegment: string;
  setSelectedSegment: (seg: string) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (n: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const CrmHeader: React.FC<CrmHeaderProps> = ({
  leads,
  selectedSegment,
  setSelectedSegment,
  selectedNeighborhood,
  setSelectedNeighborhood,
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

  const segments = [
    { label: "Todos os Segmentos", val: "todos" },
    { label: "Veterinárias", val: "Clínica Veterinária" },
    { label: "Odontologia", val: "Clínica Odontológica" },
    { label: "Oficinas Mecânicas", val: "Oficina Mecânica" },
    { label: "Restaurantes", val: "Restaurante" },
  ];

  const neighborhoods = [
    { label: "Todos os Bairros", val: "todos" },
    { label: "Tristeza", val: "Tristeza" },
    { label: "Ipanema", val: "Ipanema" },
    { label: "Vila Assunção", val: "Vila Assunção" },
    { label: "Cristal", val: "Cristal" },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-[#0a0d14]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Linha superior: Marca, busca e logout */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Leonardo Brasil
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    CRM Prospecção
                  </span>
                </span>
                <p className="text-[11px] text-slate-400">Rotina Diária • Google Meu Negócio</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Campo de Busca Rápida */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar empresa ou telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
              title="Sair do CRM"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Linha intermediária: Filtros rápidos */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/40">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
              <Building2 className="w-3.5 h-3.5" />
              Segmento:
            </span>
            {segments.map((seg) => (
              <button
                key={seg.val}
                onClick={() => setSelectedSegment(seg.val)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedSegment === seg.val
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                    : "bg-slate-900/40 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-slate-800/50"
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5" />
              Bairro:
            </span>
            {neighborhoods.map((nb) => (
              <button
                key={nb.val}
                onClick={() => setSelectedNeighborhood(nb.val)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedNeighborhood === nb.val
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/10"
                    : "bg-slate-900/40 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-slate-800/50"
                }`}
              >
                {nb.label}
              </button>
            ))}
          </div>
        </div>

        {/* Linha inferior: Cards de métricas da rotina diária */}
        <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="bg-[#0e131d] border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Total na Base</p>
              <p className="text-lg font-bold text-white mt-0.5">{leads.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#0e131d] border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400">1. A Abordar</p>
              <p className="text-lg font-bold text-amber-400 mt-0.5">{countByStage("a_abordar")}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#0e131d] border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400">2. Contatados</p>
              <p className="text-lg font-bold text-sky-400 mt-0.5">{countByStage("contatado")}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#0e131d] border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400">3. Em Conversa</p>
              <p className="text-lg font-bold text-purple-400 mt-0.5">{countByStage("em_conversa")}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#0e131d] border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between col-span-2 sm:col-span-1">
            <div>
              <p className="text-[11px] font-medium text-slate-400">4. Proposta / Fechado</p>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">
                {countByStage("proposta_enviada") + countByStage("fechado_arquivado")}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
