import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, Image as ImageIcon, Trash2, X, ZoomIn } from "lucide-react";
import type {
  ChecklistCurrentStatus,
  ClientChecklistItem,
  ClientEvidence,
  ClientPillar,
  ClientServicesScope,
} from "../clientTypes";
import { computeChecklistProgress } from "../utils/clientAnalytics";

interface ClientBeforeAfterSectionProps {
  checklist: ClientChecklistItem[];
  evidences: ClientEvidence[];
  scope: ClientServicesScope;
  activePillar: "todos" | ClientPillar;
  presentationMode: boolean;
  onChangeChecklistStatus?: (item: ClientChecklistItem, nextStatus: ChecklistCurrentStatus) => Promise<void>;
  onDeleteEvidence?: (evidence: ClientEvidence) => Promise<void>;
}

const PILLAR_LABEL: Record<ClientPillar, string> = {
  gbp: "Google Meu Negócio",
  website: "Site",
  google_ads: "Google Ads",
};

const CURRENT_STATUS_STYLE: Record<ChecklistCurrentStatus, { label: string; cls: string }> = {
  otimizado: {
    label: "Otimizado ✓",
    cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/35",
  },
  em_andamento: {
    label: "Em andamento",
    cls: "bg-amber-500/15 text-amber-300 border-amber-500/35",
  },
  pendente: {
    label: "Pendente",
    cls: "bg-slate-800 text-slate-300 border-slate-700",
  },
  nao_aplicavel: {
    label: "N/A",
    cls: "bg-slate-900 text-slate-500 border-slate-800",
  },
};

export const ClientBeforeAfterSection: React.FC<ClientBeforeAfterSectionProps> = ({
  checklist,
  evidences,
  scope,
  activePillar,
  presentationMode,
  onChangeChecklistStatus,
  onDeleteEvidence,
}) => {
  const [evidenceViewMode, setEvidenceViewMode] = useState<"antes" | "depois" | "lado_a_lado">("lado_a_lado");
  const [zoomedEvidence, setZoomedEvidence] = useState<ClientEvidence | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!zoomedEvidence) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomedEvidence(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomedEvidence]);

  const visibleChecklist = useMemo(() => {
    const allowedPillars = new Set<ClientPillar>([
      ...(scope.gbp ? (["gbp"] as const) : []),
      ...(scope.website ? (["website"] as const) : []),
      ...(scope.google_ads ? (["google_ads"] as const) : []),
    ]);

    return checklist
      .filter((item) => allowedPillars.has(item.pillar))
      .filter((item) => activePillar === "todos" || item.pillar === activePillar);
  }, [checklist, scope, activePillar]);

  const visibleEvidences = useMemo(() => {
    return evidences.filter((ev) => activePillar === "todos" || ev.pillar === activePillar);
  }, [evidences, activePillar]);

  const evidencePairs = useMemo(() => {
    const groups = new Map<string, { key: string; title: string; antes: ClientEvidence[]; depois: ClientEvidence[] }>();
    for (const ev of visibleEvidences) {
      const key = ev.pair_key || ev.id;
      const existing = groups.get(key) || { key, title: ev.title, antes: [], depois: [] };
      if (ev.phase === "antes") existing.antes.push(ev);
      else existing.depois.push(ev);
      groups.set(key, existing);
    }
    return Array.from(groups.values());
  }, [visibleEvidences]);

  const progress = useMemo(() => computeChecklistProgress(visibleChecklist), [visibleChecklist]);

  const handleStatusClick = async (item: ClientChecklistItem, nextStatus: ChecklistCurrentStatus) => {
    if (!onChangeChecklistStatus || updatingId) return;
    setUpdatingId(item.id);
    try {
      await onChangeChecklistStatus(item, nextStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Matriz Técnica Antes x Depois */}
      <section className="rounded-2xl border border-[#1a2030] bg-[#0e1320] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Checklist Antes × Depois</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              O estado encontrado na auditoria inicial permanece preservado mesmo após cada implementação.
            </p>
          </div>

          <div className="min-w-[200px] bg-[#080b12] border border-[#1a2030] rounded-xl px-3.5 py-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-[#94a3b8]">Execução Técnica</span>
              <span className="font-mono font-bold text-emerald-400">
                {progress.optimized}/{progress.applicable} ({progress.completionPct}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#161d2e] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progress.completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {visibleChecklist.length === 0 ? (
          <p className="text-xs text-[#94a3b8] py-4 text-center">Nenhum item de checklist para este filtro.</p>
        ) : (
          <>
            {/* Mobile Cards (< md) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {visibleChecklist.map((item) => {
                const st = CURRENT_STATUS_STYLE[item.current_status];
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#1a2030] bg-[#080b12] p-3.5 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                          {PILLAR_LABEL[item.pillar]} • {item.category_label}
                        </span>
                        <h3 className="text-sm font-bold text-white leading-snug mt-0.5">{item.title}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="rounded-lg bg-rose-950/20 border border-rose-500/20 p-2.5">
                        <span className="text-[10px] uppercase font-bold text-rose-300 block mb-0.5">
                          Antes ({item.before_status})
                        </span>
                        <p className="text-slate-200">{item.before_value || "Sem observação inicial"}</p>
                      </div>
                      <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-2.5">
                        <span className="text-[10px] uppercase font-bold text-emerald-300 block mb-0.5">
                          Depois / Atual
                        </span>
                        <p className="text-slate-200">
                          {item.current_value ||
                            (item.current_status === "otimizado"
                              ? "Ajuste implementado"
                              : "Aguardando execução")}
                        </p>
                      </div>
                    </div>

                    {!presentationMode && onChangeChecklistStatus && (
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        {(["pendente", "em_andamento", "otimizado"] as ChecklistCurrentStatus[]).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            disabled={updatingId === item.id}
                            onClick={() => handleStatusClick(item, opt)}
                            className={`min-h-[44px] rounded-lg text-[11px] font-bold border transition-all ${
                              item.current_status === opt
                                ? "bg-blue-600 text-white border-blue-400"
                                : "bg-[#0e1320] text-[#94a3b8] border-[#1a2030]"
                            }`}
                          >
                            {opt === "pendente" ? "Pendente" : opt === "em_andamento" ? "Em curso" : "Otimizado ✓"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table (md+) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-[#1a2030]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#080b12] border-b border-[#1a2030] text-[#94a3b8] uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Frente / Item</th>
                    <th className="py-3 px-3">Antes (Pré-gestão)</th>
                    <th className="py-3 px-3">Depois / Atual</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a2030]">
                  {visibleChecklist.map((item) => {
                    const st = CURRENT_STATUS_STYLE[item.current_status];
                    return (
                      <tr key={item.id} className="hover:bg-[#111726]/80 align-top">
                        <td className="py-3 px-3 max-w-xs">
                          <span className="text-[10px] font-bold uppercase text-blue-300 block">
                            {PILLAR_LABEL[item.pillar]} · {item.category_label}
                          </span>
                          <span className="font-bold text-white block mt-0.5">{item.title}</span>
                        </td>
                        <td className="py-3 px-3 text-rose-200/90 max-w-xs">
                          <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/25 mr-1.5">
                            {item.before_status}
                          </span>
                          <span>{item.before_value || "—"}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-200 max-w-xs">
                          {item.current_value ||
                            (item.current_status === "otimizado" ? "Ajuste concluído" : "Aguardando execução")}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {presentationMode || !onChangeChecklistStatus ? (
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.cls}`}>
                              {st.label}
                            </span>
                          ) : (
                            <select
                              aria-label={`Status de ${item.title}`}
                              disabled={updatingId === item.id}
                              value={item.current_status}
                              onChange={(e) =>
                                handleStatusClick(item, e.target.value as ChecklistCurrentStatus)
                              }
                              className="bg-[#080b12] border border-[#2d3748] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
                            >
                              <option value="pendente">Pendente</option>
                              <option value="em_andamento">Em andamento</option>
                              <option value="otimizado">Otimizado ✓</option>
                              <option value="nao_aplicavel">Não aplicável</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* Galeria Pareada de Evidências Visuais (Antes x Depois) */}
      <section className="rounded-2xl border border-[#1a2030] bg-[#0e1320] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Evidências Visuais (Prints Antes × Depois)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Toque em qualquer print para ampliar em tela cheia na frente do cliente.
            </p>
          </div>

          <div className="inline-flex items-center p-1 rounded-xl bg-[#080b12] border border-[#1a2030] self-start">
            {[
              { id: "antes" as const, label: "Antes" },
              { id: "depois" as const, label: "Depois" },
              { id: "lado_a_lado" as const, label: "Lado a Lado" },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setEvidenceViewMode(mode.id)}
                className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  evidenceViewMode === mode.id
                    ? "bg-blue-600 text-white"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {evidencePairs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#1a2030] bg-[#080b12] p-6 text-center text-xs text-[#94a3b8]">
            Nenhuma evidência visual enviada para este filtro ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {evidencePairs.map((pair) => {
              const showBefore = evidenceViewMode !== "depois";
              const showAfter = evidenceViewMode !== "antes";

              return (
                <div
                  key={pair.key}
                  className="rounded-xl border border-[#1a2030] bg-[#080b12] p-3.5 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {showBefore && (
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          Antes (Auditoria Inicial)
                        </span>
                        {pair.antes.length === 0 ? (
                          <div className="h-40 rounded-lg border border-dashed border-[#1a2030] flex items-center justify-center text-xs text-slate-500">
                            Sem print inicial neste par
                          </div>
                        ) : (
                          pair.antes.map((ev) => (
                            <div key={ev.id} className="rounded-lg border border-[#1a2030] bg-[#0e1320] overflow-hidden">
                              {ev.signedUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setZoomedEvidence(ev)}
                                  className="relative group block w-full text-left"
                                >
                                  <img
                                    src={ev.signedUrl}
                                    alt={ev.title}
                                    loading="lazy"
                                    className="w-full h-52 object-cover bg-black"
                                  />
                                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/75 text-white text-[11px] font-semibold inline-flex items-center gap-1">
                                    <ZoomIn className="w-3.5 h-3.5" /> Ampliar
                                  </span>
                                </button>
                              ) : (
                                <div className="h-40 flex items-center justify-center p-4 text-center text-xs text-amber-300">
                                  Conecte-se à nuvem para visualizar o print seguro ({ev.storage_path})
                                </div>
                              )}
                              <div className="p-2.5 flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-xs font-bold text-white">{ev.title}</p>
                                  {ev.caption && <p className="text-[11px] text-[#94a3b8] mt-0.5">{ev.caption}</p>}
                                </div>
                                {!presentationMode && onDeleteEvidence && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteEvidence(ev)}
                                    title="Remover print"
                                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-rose-400 rounded-lg"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {showAfter && (
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Depois / Evolução
                        </span>
                        {pair.depois.length === 0 ? (
                          <div className="h-52 rounded-lg border border-dashed border-[#1a2030] flex flex-col items-center justify-center p-4 text-center text-xs text-slate-400 gap-1.5">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span>O print do &quot;Depois&quot; será anexado automaticamente após a execução das otimizações.</span>
                          </div>
                        ) : (
                          pair.depois.map((ev) => (
                            <div key={ev.id} className="rounded-lg border border-[#1a2030] bg-[#0e1320] overflow-hidden">
                              {ev.signedUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setZoomedEvidence(ev)}
                                  className="relative group block w-full text-left"
                                >
                                  <img
                                    src={ev.signedUrl}
                                    alt={ev.title}
                                    loading="lazy"
                                    className="w-full h-52 object-cover bg-black"
                                  />
                                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/75 text-white text-[11px] font-semibold inline-flex items-center gap-1">
                                    <ZoomIn className="w-3.5 h-3.5" /> Ampliar
                                  </span>
                                </button>
                              ) : (
                                <div className="h-40 flex items-center justify-center p-4 text-center text-xs text-amber-300">
                                  Conecte-se à nuvem para visualizar o print seguro ({ev.storage_path})
                                </div>
                              )}
                              <div className="p-2.5 flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-xs font-bold text-white">{ev.title}</p>
                                  {ev.caption && <p className="text-[11px] text-[#94a3b8] mt-0.5">{ev.caption}</p>}
                                </div>
                                {!presentationMode && onDeleteEvidence && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteEvidence(ev)}
                                    title="Remover print"
                                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-rose-400 rounded-lg"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal Lightbox para Ampliar Evidência */}
      {zoomedEvidence && zoomedEvidence.signedUrl && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomedEvidence(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm p-3 sm:p-6 flex flex-col items-center justify-center gap-3"
        >
          <div className="w-full max-w-5xl flex items-center justify-between text-white">
            <div className="min-w-0 pr-3">
              <p className="text-sm font-bold truncate">{zoomedEvidence.title}</p>
              {zoomedEvidence.caption && (
                <p className="text-xs text-slate-300 truncate">{zoomedEvidence.caption}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setZoomedEvidence(null)}
              className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white shrink-0"
              aria-label="Fechar ampliação"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <img
            src={zoomedEvidence.signedUrl}
            alt={zoomedEvidence.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] max-w-full rounded-xl border border-slate-700 object-contain"
          />
        </div>
      )}
    </div>
  );
};
