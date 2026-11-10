import React from "react";
import { ArrowDownRight, ArrowUpRight, Minus, TrendingUp } from "lucide-react";
import type {
  ClientPillar,
  ClientServicesScope,
  ClientSnapshot,
  ClientTrendStatus,
} from "../clientTypes";

interface ClientEvolutionChartProps {
  orderedSnapshots: ClientSnapshot[];
  selectedPeriodKey: string;
  onSelectPeriod: (periodKey: string) => void;
  scope: ClientServicesScope;
  activePillar: "todos" | ClientPillar;
}

function fmtNum(v?: number | null): string {
  if (typeof v !== "number" || !Number.isFinite(v)) return "—";
  return Math.round(v).toLocaleString("pt-BR");
}

function fmtBrl(v?: number | null): string {
  if (typeof v !== "number" || !Number.isFinite(v)) return "—";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function renderTrendBadge(status: ClientTrendStatus) {
  if (status === "baseline") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35">
        ◆ Baseline
      </span>
    );
  }
  if (status === "avanco") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35">
        <ArrowUpRight className="w-3.5 h-3.5" /> Avanço
      </span>
    );
  }
  if (status === "retrocesso") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/35">
        <ArrowDownRight className="w-3.5 h-3.5" /> Retrocesso
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
      <Minus className="w-3.5 h-3.5" /> Estável
    </span>
  );
}

export const ClientEvolutionChart: React.FC<ClientEvolutionChartProps> = ({
  orderedSnapshots,
  selectedPeriodKey,
  onSelectPeriod,
  scope,
  activePillar,
}) => {
  if (orderedSnapshots.length === 0) {
    return (
      <div className="rounded-2xl border border-[#1a2030] bg-[#0e1320] p-6 text-center text-xs text-[#94a3b8]">
        Ainda não há meses registrados neste histórico.
      </div>
    );
  }

  const chartFocus: ClientPillar =
    activePillar !== "todos"
      ? activePillar
      : scope.gbp
        ? "gbp"
        : scope.google_ads
          ? "google_ads"
          : "website";

  const chartSeries = orderedSnapshots.map((s) => {
    if (chartFocus === "google_ads") {
      return {
        snapshot: s,
        primary: s.ads_metrics?.clicks ?? 0,
        secondary: s.ads_metrics?.conversions ?? 0,
      };
    }
    if (chartFocus === "website") {
      return {
        snapshot: s,
        primary: s.site_metrics?.pagespeedMobile ?? 0,
        secondary: s.site_metrics?.whatsappClicks ?? 0,
      };
    }
    return {
      snapshot: s,
      primary: s.gbp_metrics?.viewsTotal ?? 0,
      secondary: s.gbp_metrics?.interactionsTotal ?? 0,
    };
  });

  const primaryLabel =
    chartFocus === "google_ads"
      ? "Cliques Ads"
      : chartFocus === "website"
        ? "PageSpeed Mobile"
        : "Visualizações GMN";
  const secondaryLabel =
    chartFocus === "google_ads"
      ? "Conversões Ads"
      : chartFocus === "website"
        ? "Cliques WhatsApp Site"
        : "Interações GMN";

  const maxPrimary = Math.max(10, ...chartSeries.map((d) => d.primary));
  const maxSecondary = Math.max(10, ...chartSeries.map((d) => d.secondary));

  const W = 680;
  const H = 210;
  const padX = 38;
  const padY = 26;
  const plotW = W - padX * 2;
  const plotH = H - padY * 2;

  const getX = (idx: number) => {
    if (chartSeries.length === 1) return W / 2;
    return padX + (idx / (chartSeries.length - 1)) * plotW;
  };
  const getPrimaryY = (val: number) => padY + plotH - (val / maxPrimary) * plotH;
  const getSecondaryY = (val: number) => padY + plotH - (val / maxSecondary) * plotH;

  const primaryPath = chartSeries
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getPrimaryY(d.primary).toFixed(1)}`)
    .join(" ");
  const secondaryPath = chartSeries
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getSecondaryY(d.secondary).toFixed(1)}`)
    .join(" ");

  const activePoint =
    orderedSnapshots.find((s) => s.period_key === selectedPeriodKey) ??
    orderedSnapshots[orderedSnapshots.length - 1];

  const showGbpCols = scope.gbp && (activePillar === "todos" || activePillar === "gbp");
  const showAdsCols = scope.google_ads && (activePillar === "todos" || activePillar === "google_ads");
  const showSiteCols = scope.website && (activePillar === "todos" || activePillar === "website");

  return (
    <section className="rounded-2xl border border-[#1a2030] bg-[#0e1320] p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400 shrink-0" />
            <span>Evolução Mês a Mês</span>
          </h2>
          <p className="text-xs text-[#94a3b8]">
            Toque ou clique em qualquer mês para inspecionar as métricas e comparar avanço ou retrocesso.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1.5 text-blue-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            {primaryLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            {secondaryLabel}
          </span>
        </div>
      </div>

      {/* Gráfico SVG Responsivo & Tocável */}
      <div className="rounded-xl bg-[#080b12] border border-[#1a2030] p-2 sm:p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44 sm:h-52 overflow-visible select-none">
          {[0.25, 0.5, 0.75, 1].map((step) => {
            const y = padY + plotH * (1 - step);
            return (
              <line
                key={step}
                x1={padX}
                y1={y}
                x2={W - padX}
                y2={y}
                stroke="#1a2030"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {chartSeries.length > 1 && (
            <>
              <path d={primaryPath} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
              <path d={secondaryPath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {chartSeries.map((d, i) => {
            const cx = getX(i);
            const cy1 = getPrimaryY(d.primary);
            const cy2 = getSecondaryY(d.secondary);
            const isSelected = d.snapshot.period_key === activePoint.period_key;

            return (
              <g
                key={`${d.snapshot.period_key}-${d.snapshot.snapshot_type}`}
                onClick={() => onSelectPeriod(d.snapshot.period_key)}
                className="cursor-pointer"
              >
                {isSelected && (
                  <line
                    x1={cx}
                    y1={padY - 8}
                    x2={cx}
                    y2={H - padY + 4}
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy1}
                  r={isSelected ? 6.5 : 4.5}
                  fill={d.snapshot.is_baseline ? "#F59E0B" : "#3B82F6"}
                  stroke="#080b12"
                  strokeWidth="2"
                />
                <circle
                  cx={cx}
                  cy={cy2}
                  r={isSelected ? 6 : 4}
                  fill="#10B981"
                  stroke="#080b12"
                  strokeWidth="2"
                />
                <text
                  x={cx}
                  y={H - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isSelected ? "700" : "500"}
                  fill={isSelected ? "#F59E0B" : "#94a3b8"}
                >
                  {d.snapshot.period_label.replace(/\s*\(.+\)/, "")}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Seletor Horizontal Confortável ao Toque */}
        <div className="mt-2 pt-2 border-t border-[#1a2030] flex items-center gap-1.5 overflow-x-auto pb-1">
          {orderedSnapshots.map((snap) => {
            const isSelected = snap.period_key === activePoint.period_key;
            return (
              <button
                key={`${snap.id}-pill`}
                type="button"
                onClick={() => onSelectPeriod(snap.period_key)}
                className={`min-h-[44px] sm:min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/45"
                    : "bg-[#0e1320] text-[#94a3b8] border-[#1a2030] hover:text-white"
                }`}
              >
                {snap.is_baseline ? "◆ " : ""}
                {snap.period_label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resumo Compacto do Mês Selecionado */}
      <div className="rounded-xl border border-blue-500/25 bg-[#0a0f1c] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-white text-sm">{activePoint.period_label}</span>
            {renderTrendBadge(activePoint.overall_status)}
          </div>
          {activePoint.executive_summary && (
            <p className="text-[#94a3b8] leading-relaxed">{activePoint.executive_summary}</p>
          )}
          {activePoint.gbp_metrics?.periodNotes && (
            <p className="text-[11px] text-slate-400">{activePoint.gbp_metrics.periodNotes}</p>
          )}
        </div>
      </div>

      {/* Mobile Cards (< md) */}
      <div className="grid grid-cols-1 gap-2.5 md:hidden">
        {[...orderedSnapshots].reverse().map((snap) => {
          const isSelected = snap.period_key === activePoint.period_key;
          return (
            <button
              key={`${snap.id}-card`}
              type="button"
              onClick={() => onSelectPeriod(snap.period_key)}
              className={`w-full text-left rounded-xl border p-3.5 space-y-2 transition-all ${
                isSelected
                  ? "border-amber-500/50 bg-[#12192b]"
                  : "border-[#1a2030] bg-[#0a0d14]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-extrabold text-white">{snap.period_label}</span>
                {renderTrendBadge(snap.overall_status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs tabular-nums">
                {showGbpCols && (
                  <>
                    <div className="rounded-lg bg-[#080b12] p-2 border border-[#1a2030]">
                      <span className="text-[10px] text-[#94a3b8] block">Views GMN</span>
                      <strong className="text-white">{fmtNum(snap.gbp_metrics?.viewsTotal)}</strong>
                    </div>
                    <div className="rounded-lg bg-[#080b12] p-2 border border-[#1a2030]">
                      <span className="text-[10px] text-[#94a3b8] block">Interações (Lig/Rotas)</span>
                      <strong className="text-emerald-300">
                        {fmtNum(snap.gbp_metrics?.interactionsTotal)} ({fmtNum(snap.gbp_metrics?.calls)}/{fmtNum(snap.gbp_metrics?.routes)})
                      </strong>
                    </div>
                  </>
                )}
                {showAdsCols && (
                  <div className="rounded-lg bg-[#080b12] p-2 border border-[#1a2030]">
                    <span className="text-[10px] text-[#94a3b8] block">Ads (Cliques / Conv.)</span>
                    <strong className="text-blue-300">
                      {fmtNum(snap.ads_metrics?.clicks)} / {fmtNum(snap.ads_metrics?.conversions)}
                    </strong>
                  </div>
                )}
                {showSiteCols && (
                  <div className="rounded-lg bg-[#080b12] p-2 border border-[#1a2030]">
                    <span className="text-[10px] text-[#94a3b8] block">Site ({snap.site_metrics?.versionLabel || "Web"})</span>
                    <strong className="text-slate-200">
                      {snap.site_metrics?.brokenUrlsCount === 0
                        ? "URLs 100% OK"
                        : typeof snap.site_metrics?.brokenUrlsCount === "number"
                          ? `${snap.site_metrics.brokenUrlsCount} erro(s) 404`
                          : "Monitoramento web"}
                    </strong>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Desktop Table (md+) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#1a2030]">
        <table className="w-full text-left border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-[#080b12] border-b border-[#1a2030] text-[#94a3b8] uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3">Período</th>
              <th className="py-3 px-3">Status</th>
              {showGbpCols && (
                <>
                  <th className="py-3 px-3 text-right">Visualizações</th>
                  <th className="py-3 px-3 text-right">Interações</th>
                  <th className="py-3 px-3 text-right">Ligações</th>
                  <th className="py-3 px-3 text-right">Rotas</th>
                  <th className="py-3 px-3 text-right">Site/Chat</th>
                  <th className="py-3 px-3 text-right">Nota</th>
                </>
              )}
              {showAdsCols && (
                <>
                  <th className="py-3 px-3 text-right">Cliques Ads</th>
                  <th className="py-3 px-3 text-right">Conversões</th>
                  <th className="py-3 px-3 text-right">Investimento</th>
                </>
              )}
              {showSiteCols && (
                <>
                  <th className="py-3 px-3">Site</th>
                  <th className="py-3 px-3 text-right">PageSpeed M.</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a2030]">
            {[...orderedSnapshots].reverse().map((snap) => {
              const isSelected = snap.period_key === activePoint.period_key;
              const siteAndChat =
                (snap.gbp_metrics?.siteClicks ?? 0) + (snap.gbp_metrics?.chatClicks ?? 0);
              return (
                <tr
                  key={`${snap.id}-row`}
                  onClick={() => onSelectPeriod(snap.period_key)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-950/30" : "hover:bg-[#111726]"
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap">{snap.period_label}</td>
                  <td className="py-3 px-3 whitespace-nowrap">{renderTrendBadge(snap.overall_status)}</td>
                  {showGbpCols && (
                    <>
                      <td className="py-3 px-3 text-right font-semibold text-white">{fmtNum(snap.gbp_metrics?.viewsTotal)}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-300">{fmtNum(snap.gbp_metrics?.interactionsTotal)}</td>
                      <td className="py-3 px-3 text-right text-slate-300">{fmtNum(snap.gbp_metrics?.calls)}</td>
                      <td className="py-3 px-3 text-right text-slate-300">{fmtNum(snap.gbp_metrics?.routes)}</td>
                      <td className="py-3 px-3 text-right text-slate-300">
                        {snap.gbp_metrics?.siteClicks !== undefined || snap.gbp_metrics?.chatClicks !== undefined
                          ? fmtNum(siteAndChat)
                          : "—"}
                      </td>
                      <td className="py-3 px-3 text-right text-amber-300 font-semibold">
                        {snap.gbp_metrics?.rating ? `${snap.gbp_metrics.rating.toFixed(1)}★ (${snap.gbp_metrics.reviewCount ?? 0})` : "—"}
                      </td>
                    </>
                  )}
                  {showAdsCols && (
                    <>
                      <td className="py-3 px-3 text-right text-blue-300">{fmtNum(snap.ads_metrics?.clicks)}</td>
                      <td className="py-3 px-3 text-right text-emerald-300 font-bold">{fmtNum(snap.ads_metrics?.conversions)}</td>
                      <td className="py-3 px-3 text-right text-slate-300">{fmtBrl(snap.ads_metrics?.spendBrl)}</td>
                    </>
                  )}
                  {showSiteCols && (
                    <>
                      <td className="py-3 px-3 text-slate-200 whitespace-nowrap">
                        {snap.site_metrics?.versionLabel || "—"}
                        {typeof snap.site_metrics?.brokenUrlsCount === "number" && (
                          <span
                            className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              snap.site_metrics.brokenUrlsCount === 0
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-rose-500/15 text-rose-300"
                            }`}
                          >
                            {snap.site_metrics.brokenUrlsCount === 0 ? "0 404" : `${snap.site_metrics.brokenUrlsCount} 404`}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-200">
                        {snap.site_metrics?.pagespeedMobile !== undefined ? `${snap.site_metrics.pagespeedMobile}/100` : "—"}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
