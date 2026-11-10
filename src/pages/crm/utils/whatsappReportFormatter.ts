import type {
  ClientAccount,
  ClientChangeLog,
  ClientChecklistItem,
  ClientSnapshot,
  MetricDelta,
  WhatsAppReportStyle,
} from "../clientTypes";
import { buildClientComparisonSummary } from "./clientAnalytics";

export function sanitizeWhatsAppPhone(phone?: string | null): string {
  const digits = String(phone || "").replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  return `55${digits}`;
}

export function buildWhatsAppUniversalUrl(phone: string | null | undefined, text: string): string {
  const clean = sanitizeWhatsAppPhone(phone);
  const encoded = encodeURIComponent(text);
  return clean ? `https://wa.me/${clean}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

function fmtInt(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return Math.round(value).toLocaleString("pt-BR");
}

function fmtCurrency(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDeltaTag(delta?: MetricDelta): string {
  if (!delta || delta.percentDiff === null) return "";
  const sign = delta.percentDiff > 0 ? "+" : "";
  return ` (${sign}${delta.percentDiff.toLocaleString("pt-BR")}%)`;
}

export interface FormatClientWhatsAppReportInput {
  client: ClientAccount;
  snapshots: ClientSnapshot[];
  checklist: ClientChecklistItem[];
  changeLogs: ClientChangeLog[];
  style: WhatsAppReportStyle;
  targetPeriodKey?: string;
}

export function formatClientWhatsAppReport({
  client,
  snapshots,
  checklist,
  changeLogs,
  style,
  targetPeriodKey,
}: FormatClientWhatsAppReportInput): string {
  const greetingName = client.owner_name?.trim() || client.name;
  const summary = buildClientComparisonSummary(snapshots, checklist, client.services_scope, targetPeriodKey);
  const latest = summary.latestSnapshot;
  const visibleLogs = changeLogs
    .filter((log) => log.visible_to_client)
    .slice(0, 6);

  if (style === "marco_zero") {
    const completedItems = checklist.filter((item) => item.current_status === "otimizado");
    const pendingItems = checklist.filter(
      (item) => item.current_status === "pendente" || item.current_status === "em_andamento",
    );

    const lines: string[] = [
      `Olá, *${greetingName}*! Segue o resumo transparente do trabalho na conta da *${client.name}*.`,
      "",
      `*Marco Zero & Evolução — ${client.name}*`,
      `📍 Progresso técnico: *${summary.checklistProgress.optimized} de ${summary.checklistProgress.applicable} ajustes concluídos* (${summary.checklistProgress.completionPct}%)`,
    ];

    if (latest && client.services_scope.gbp) {
      const g = latest.gbp_metrics;
      lines.push(
        "",
        "*Perfil no Google (Cenário registrado):*",
        `• Visualizações no período: *${fmtInt(g.viewsTotal)}*`,
        `• Interações (ligações, rotas, site, Whats): *${fmtInt(g.interactionsTotal)}*`,
        `• Reputação atual: *${g.rating ? g.rating.toFixed(1).replace(".", ",") : "—"}★* (${fmtInt(g.reviewCount)} avaliações)`,
      );
    }

    if (completedItems.length > 0) {
      lines.push("", "*✅ O que já ajustamos (Antes → Depois):*");
      for (const item of completedItems.slice(0, 8)) {
        lines.push(
          `• *${item.title}:* ${item.before_value || item.before_status} → ${item.current_value || "Otimizado"}`,
        );
      }
    }

    if (visibleLogs.length > 0) {
      lines.push("", "*🛠️ Últimas entregas registradas:*");
      for (const log of visibleLogs.slice(0, 4)) {
        lines.push(`• ${log.title}`);
      }
    }

    if (pendingItems.length > 0) {
      lines.push("", "*⏭️ Próximos passos em andamento:*");
      for (const item of pendingItems.slice(0, 4)) {
        lines.push(`• ${item.title}`);
      }
    }

    lines.push(
      "",
      "Seguimos acompanhando os números reais mês a mês para atrair cada vez mais motoristas/clientes qualificados da região.",
    );

    return lines.join("\n");
  }

  // Estilo mensal
  const periodTitle = latest ? `${client.name} (${latest.period_label})` : client.name;
  const statusLabel =
    summary.latestComputedStatus === "avanco"
      ? "📈 Tendência do mês: *Avanço*"
      : summary.latestComputedStatus === "retrocesso"
        ? "⚠️ Ponto de atenção: *Oscilação / Retrocesso observado*"
        : summary.latestComputedStatus === "baseline"
          ? "📌 Registro inicial (*Baseline*)"
          : "⚖️ Tendência do mês: *Estável*";

  const lines: string[] = [
    `Olá, *${greetingName}*! Segue o acompanhamento mensal de desempenho da *${client.name}*.`,
    "",
    `*Relatório Mensal — ${periodTitle}*`,
    statusLabel,
  ];

  if (latest?.executive_summary) {
    lines.push(`_${latest.executive_summary}_`);
  }

  if (latest && client.services_scope.gbp) {
    const g = latest.gbp_metrics;
    const d = summary.deltasVsPrevious;
    lines.push(
      "",
      "*📍 Google Meu Negócio (Perfil da Empresa):*",
      `• Visualizações: *${fmtInt(g.viewsTotal)}*${fmtDeltaTag(d.gbp_views)}`,
      `• Interações totais: *${fmtInt(g.interactionsTotal)}*${fmtDeltaTag(d.gbp_interactions)}`,
      `• Ligações: *${fmtInt(g.calls)}*${fmtDeltaTag(d.gbp_calls)} | Rotas: *${fmtInt(g.routes)}*${fmtDeltaTag(d.gbp_routes)}`,
      `• Nota no Google: *${g.rating ? g.rating.toFixed(1).replace(".", ",") : "—"}★* (${fmtInt(g.reviewCount)} avaliações)`,
    );
  }

  if (latest && client.services_scope.google_ads) {
    const a = latest.ads_metrics;
    const d = summary.deltasVsPrevious;
    lines.push(
      "",
      "*🎯 Google Ads:*",
      `• Impressões: *${fmtInt(a.impressions)}* | Cliques: *${fmtInt(a.clicks)}*${fmtDeltaTag(d.ads_clicks)}`,
      `• Conversões registradas: *${fmtInt(a.conversions)}*${fmtDeltaTag(d.ads_conversions)}`,
      `• Investimento: *${fmtCurrency(a.spendBrl)}*`,
    );
  }

  if (latest && client.services_scope.website) {
    const s = latest.site_metrics;
    const vLabel = s.versionLabel ? ` (${s.versionLabel})` : "";
    const urlHealthLabel =
      s.brokenUrlsCount === 0
        ? "100% no ar (sem erros 404)"
        : typeof s.brokenUrlsCount === "number"
          ? `${s.brokenUrlsCount} URL(s) com atenção`
          : "Monitoramento ativo (auditoria de URLs pendente)";
    lines.push(
      "",
      `*🌐 Site${vLabel}:*`,
      `• Saúde das URLs: *${urlHealthLabel}*`,
    );
    if (typeof s.pagespeedMobile === "number") {
      lines.push(`• Desempenho Mobile (PageSpeed): *${s.pagespeedMobile}/100*`);
    }
    if (typeof s.whatsappClicks === "number") {
      lines.push(`• Cliques diretos para WhatsApp no site: *${fmtInt(s.whatsappClicks)}*`);
    }
  }

  if (visibleLogs.length > 0) {
    lines.push("", "*🛠️ Melhorias e ações registradas:*");
    for (const log of visibleLogs.slice(0, 5)) {
      lines.push(`• ${log.title}`);
    }
  }

  lines.push(
    "",
    `Checklist técnico geral: *${summary.checklistProgress.optimized}/${summary.checklistProgress.applicable} itens otimizados*. Qualquer dúvida para nossa próxima revisão, me chame por aqui!`,
  );

  return lines.join("\n");
}
