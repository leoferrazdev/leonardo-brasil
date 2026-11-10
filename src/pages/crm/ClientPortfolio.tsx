import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "../../lib/local-router";
import { Eye, Globe, LogOut, MapPin, Megaphone, Plus, Search, Sparkles, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { SeoHead } from "../../components/SeoHead";
import { supabase } from "../../lib/supabase";
import { CrmNavBar } from "./components/CrmNavBar";
import { CloudSyncBanner } from "./components/CloudSyncBanner";
import { NewClientModal } from "./components/ClientEditPanels";
import type { ClientAccount, ClientStatus } from "./clientTypes";
import { crmClientService } from "./services/crmClientService";
import { crmProspectService } from "./services/crmProspectService";
import { buildPrefillFromLead, type ClientFormPrefill } from "./utils/clientDefaults";

const STATUS_BADGE: Record<ClientStatus, { label: string; cls: string }> = {
  onboarding: { label: "Onboarding (Marco Zero)", cls: "bg-amber-500/15 text-amber-300 border-amber-500/35" },
  ativo: { label: "Ativo", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/35" },
  pausado: { label: "Pausado", cls: "bg-slate-800 text-slate-300 border-slate-700" },
  encerrado: { label: "Encerrado", cls: "bg-rose-500/15 text-rose-300 border-rose-500/35" },
};

export default function ClientPortfolio() {
  const location = useLocation();
  const navigate = useNavigate();

  const [clients, setClients] = useState<ClientAccount[]>([]);
  const [cloudSynced, setCloudSynced] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | ClientStatus>("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [prefill, setPrefill] = useState<ClientFormPrefill | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await crmClientService.listClients();
        if (!mounted) return;
        setClients(res.clients);
        setCloudSynced(res.cloudSynced);

        const params = new URLSearchParams(location.search);
        const fromLead = params.get("fromLead");
        if (fromLead) {
          const existing = res.clients.find((c) => c.lead_id === fromLead);
          if (existing) {
            navigate(`/crm/clientes/${existing.slug}`, { replace: true });
            return;
          }
          const leads = await crmProspectService.getLeads();
          const matchedLead = leads.find((l) => l.id === fromLead);
          if (matchedLead && mounted) {
            setPrefill(buildPrefillFromLead(matchedLead));
            setModalOpen(true);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [location.search, navigate]);

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      const matchStatus = statusFilter === "todos" || c.status === statusFilter;
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.segment.toLowerCase().includes(q) ||
        (c.neighborhood || "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [clients, search, statusFilter]);

  const handleLogout = async () => {
    localStorage.removeItem("crm_offline_session");
    localStorage.removeItem("crm_user_email");
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    toast.success("Sessão encerrada");
    navigate("/crm/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f1f5f9] flex flex-col overflow-x-hidden">
      <SeoHead
        title="Clientes & Histórico Antes × Depois | CRM Leonardo Brasil"
        description="Acompanhamento mensal de clientes, registro imutável do Antes, Modo Apresentação e Relatórios WhatsApp."
        canonicalUrl="https://leonardobrasil.com.br/crm/clientes"
        robots="noindex, nofollow"
      />

      <header className="border-b border-[#1a2030] bg-[#0a0d14]/95 backdrop-blur-xl sticky top-0 z-30">
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-emerald-500" />
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-400 p-[1.5px]">
                <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-white">Leonardo Brasil</span>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Clientes Ativos
                  </span>
                </div>
                <p className="text-[11px] text-[#94a3b8]">Histórico Antes × Depois · Apresentação · WhatsApp</p>
              </div>
            </Link>

            <CrmNavBar />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setPrefill(null);
                setModalOpen(true);
              }}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cliente</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#1a2030] bg-[#0f1420] text-[#94a3b8] hover:text-white text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        <CloudSyncBanner visible={!cloudSynced} />

        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente, segmento ou bairro..."
              className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-xl bg-[#0e1320] border border-[#1a2030] text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "todos" as const, label: `Todos (${clients.length})` },
              { id: "onboarding" as const, label: "Onboarding" },
              { id: "ativo" as const, label: "Ativos" },
              { id: "pausado" as const, label: "Pausados" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  statusFilter === tab.id
                    ? "bg-blue-600 text-white border-blue-400"
                    : "bg-[#0e1320] text-[#94a3b8] border-[#1a2030] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-xs text-[#94a3b8]">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-amber-400 rounded-full animate-spin mb-3" />
            Carregando carteira de clientes...
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1a2030] bg-[#0e1320] p-10 text-center space-y-3">
            <Users className="w-8 h-8 text-amber-400 mx-auto" />
            <h2 className="text-base font-extrabold text-white">Nenhum cliente cadastrado ainda</h2>
            <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
              Cadastre manualmente no botão acima, converta um lead fechado no Kanban ou execute a sincronização automática via CLI.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClients.map((c) => {
              const badge = STATUS_BADGE[c.status];
              return (
                <article
                  key={c.id}
                  className="rounded-2xl border border-[#1a2030] bg-gradient-to-b from-[#111726] to-[#0c101b] p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-lg"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                          {c.segment}
                        </span>
                        <h2 className="text-lg font-extrabold text-white leading-tight mt-0.5">{c.name}</h2>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-xs text-[#94a3b8] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{[c.neighborhood, c.city].filter(Boolean).join(", ")}</span>
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {c.services_scope.gbp && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-bold">
                          <MapPin className="w-3 h-3" /> GMN
                        </span>
                      )}
                      {c.services_scope.google_ads && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                          <Megaphone className="w-3 h-3" /> Google Ads
                        </span>
                      )}
                      {c.services_scope.website && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                          <Globe className="w-3 h-3" /> Site ({c.external_ids?.websiteVersionLabel || c.services_scope.website_mode})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1a2030]">
                    <Link
                      to={`/crm/clientes/${c.slug}`}
                      className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/35 text-blue-200 text-xs font-bold text-center"
                    >
                      Abrir Gestão
                    </Link>
                    <Link
                      to={`/crm/clientes/${c.slug}?present=1`}
                      className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-bold text-center"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Apresentar</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <NewClientModal
        isOpen={modalOpen}
        prefill={prefill}
        onClose={() => setModalOpen(false)}
        onCreated={(created) => {
          setModalOpen(false);
          navigate(`/crm/clientes/${created.slug}`);
        }}
      />
    </div>
  );
}
