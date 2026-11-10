import type {
  ChecklistProgressSummary,
  ClientChecklistItem,
  ClientComparisonSummary,
  ClientServicesScope,
  ClientSnapshot,
  ClientTrendStatus,
  MetricDelta,
  MetricDirection,
  MetricOutcome,
} from "../clientTypes";

const NEUTRAL_PERCENT_TOLERANCE = 5;

function toFiniteNumber(val: unknown): number | null {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  return null;
}

export function sortSnapshotsChronological<
  T extends Pick<ClientSnapshot, "period_key" | "snapshot_type" | "is_baseline">,
>(snapshots: T[]): T[] {
  return [...snapshots].sort((a, b) => {
    const keyCmp = a.period_key.localeCompare(b.period_key);
    if (keyCmp !== 0) return keyCmp;
    if (a.snapshot_type !== b.snapshot_type) {
      return a.snapshot_type === "baseline_historico" ? -1 : 1;
    }
    if (a.is_baseline !== b.is_baseline) {
      return a.is_baseline ? -1 : 1;
    }
    return 0;
  });
}

export function findBaselineSnapshot(snapshots: ClientSnapshot[]): ClientSnapshot | null {
  const ordered = sortSnapshotsChronological(snapshots);
  const explicit = ordered.find((s) => s.is_baseline);
  if (explicit) return explicit;
  return ordered[0] ?? null;
}

export function computeMetricDelta(
  currentRaw: number | null | undefined,
  referenceRaw: number | null | undefined,
  direction: MetricDirection = "up",
): MetricDelta {
  const current = toFiniteNumber(currentRaw);
  const reference = toFiniteNumber(referenceRaw);

  if (current === null || reference === null) {
    return {
      current,
      reference,
      absoluteDiff: null,
      percentDiff: null,
      direction,
      outcome: "neutro",
    };
  }

  const absoluteDiff = Number((current - reference).toFixed(2));
  const percentDiff =
    reference === 0
      ? current === 0
        ? 0
        : null
      : Number((((current - reference) / Math.abs(reference)) * 100).toFixed(1));

  let outcome: MetricOutcome = "neutro";

  if (direction === "up") {
    if (percentDiff !== null) {
      if (percentDiff >= NEUTRAL_PERCENT_TOLERANCE) outcome = "melhora";
      else if (percentDiff <= -NEUTRAL_PERCENT_TOLERANCE) outcome = "piora";
    } else if (absoluteDiff > 0) {
      outcome = "melhora";
    } else if (absoluteDiff < 0) {
      outcome = "piora";
    }
  } else {
    // Lower is better (e.g. Maps rank #5 -> #2, broken URLs 2 -> 0, CPA 50 -> 30)
    if (absoluteDiff === 0) {
      outcome = "neutro";
    } else if (percentDiff !== null) {
      if (percentDiff <= -NEUTRAL_PERCENT_TOLERANCE || (reference <= 10 && absoluteDiff <= -1)) {
        outcome = "melhora";
      } else if (percentDiff >= NEUTRAL_PERCENT_TOLERANCE || (reference <= 10 && absoluteDiff >= 1)) {
        outcome = "piora";
      }
    } else if (reference === 0 && current > 0) {
      outcome = "piora";
    }
  }

  return {
    current,
    reference,
    absoluteDiff,
    percentDiff,
    direction,
    outcome,
  };
}

export function extractSnapshotMetricMap(
  current: ClientSnapshot,
  reference: ClientSnapshot | null,
  scope: ClientServicesScope,
): Record<string, MetricDelta> {
  const map: Record<string, MetricDelta> = {};

  if (scope.gbp) {
    const cG = current.gbp_metrics || {};
    const rG = reference?.gbp_metrics || {};
    map.gbp_views = computeMetricDelta(cG.viewsTotal, rG.viewsTotal, "up");
    map.gbp_interactions = computeMetricDelta(cG.interactionsTotal, rG.interactionsTotal, "up");
    map.gbp_calls = computeMetricDelta(cG.calls, rG.calls, "up");
    map.gbp_routes = computeMetricDelta(cG.routes, rG.routes, "up");
    map.gbp_site_clicks = computeMetricDelta(cG.siteClicks, rG.siteClicks, "up");
    map.gbp_rating = computeMetricDelta(cG.rating, rG.rating, "up");
    map.gbp_reviews = computeMetricDelta(cG.reviewCount, rG.reviewCount, "up");
    map.gbp_profile_strength = computeMetricDelta(cG.profileStrengthPct, rG.profileStrengthPct, "up");
    map.gbp_rank = computeMetricDelta(cG.targetKeywordRank, rG.targetKeywordRank, "down");
  }

  if (scope.google_ads) {
    const cA = current.ads_metrics || {};
    const rA = reference?.ads_metrics || {};
    map.ads_impressions = computeMetricDelta(cA.impressions, rA.impressions, "up");
    map.ads_clicks = computeMetricDelta(cA.clicks, rA.clicks, "up");
    map.ads_conversions = computeMetricDelta(cA.conversions, rA.conversions, "up");
    map.ads_spend = computeMetricDelta(cA.spendBrl, rA.spendBrl, "up");
    map.ads_cpa = computeMetricDelta(cA.costPerConversionBrl, rA.costPerConversionBrl, "down");
  }

  if (scope.website) {
    const cS = current.site_metrics || {};
    const rS = reference?.site_metrics || {};
    map.site_broken_urls = computeMetricDelta(cS.brokenUrlsCount, rS.brokenUrlsCount, "down");
    map.site_pagespeed_mobile = computeMetricDelta(cS.pagespeedMobile, rS.pagespeedMobile, "up");
    map.site_whatsapp_clicks = computeMetricDelta(cS.whatsappClicks, rS.whatsappClicks, "up");
  }

  return map;
}

export function classifySnapshotStatus(
  current: ClientSnapshot,
  previous: ClientSnapshot | null,
  scope: ClientServicesScope,
): ClientTrendStatus {
  if (current.is_baseline || !previous) {
    return current.is_baseline ? "baseline" : "estavel";
  }

  const deltas = extractSnapshotMetricMap(current, previous, scope);
  const keySignals = [
    deltas.gbp_views,
    deltas.gbp_interactions,
    deltas.gbp_rating,
    deltas.gbp_rank,
    deltas.ads_conversions,
    deltas.ads_clicks,
    deltas.site_broken_urls,
    deltas.site_pagespeed_mobile,
  ].filter((d): d is MetricDelta => Boolean(d && d.current !== null && d.reference !== null));

  if (keySignals.length === 0) return "estavel";

  let improvements = 0;
  let regressions = 0;
  let criticalRegression = false;

  for (const delta of keySignals) {
    if (delta.outcome === "melhora") improvements += 1;
    if (delta.outcome === "piora") {
      regressions += 1;
      if (delta.percentDiff !== null && Math.abs(delta.percentDiff) >= 10) {
        criticalRegression = true;
      }
    }
  }

  if (deltas.site_broken_urls?.outcome === "piora") {
    criticalRegression = true;
  }

  if (regressions > improvements || (criticalRegression && improvements === 0)) {
    return "retrocesso";
  }
  if (improvements > regressions && improvements >= 1) {
    return "avanco";
  }
  return "estavel";
}

export function computeChecklistProgress(
  items: Pick<ClientChecklistItem, "current_status">[],
): ChecklistProgressSummary {
  const total = items.length;
  const applicableItems = items.filter((item) => item.current_status !== "nao_aplicavel");
  const applicable = applicableItems.length;
  const optimized = applicableItems.filter((item) => item.current_status === "otimizado").length;
  const inProgress = applicableItems.filter((item) => item.current_status === "em_andamento").length;
  const pending = applicableItems.filter((item) => item.current_status === "pendente").length;
  const completionPct = applicable > 0 ? Math.round((optimized / applicable) * 100) : 0;

  return { total, applicable, optimized, inProgress, pending, completionPct };
}

export function buildClientComparisonSummary(
  snapshots: ClientSnapshot[],
  checklistItems: ClientChecklistItem[],
  scope: ClientServicesScope,
  selectedPeriodKey?: string,
): ClientComparisonSummary {
  const orderedSnapshots = sortSnapshotsChronological(snapshots);
  const baselineSnapshot = findBaselineSnapshot(orderedSnapshots);

  let latestIdx = orderedSnapshots.length - 1;
  if (selectedPeriodKey && orderedSnapshots.length > 0) {
    const matchedIdx = [...orderedSnapshots]
      .reverse()
      .findIndex((s) => s.period_key === selectedPeriodKey);
    if (matchedIdx >= 0) {
      latestIdx = orderedSnapshots.length - 1 - matchedIdx;
    }
  }

  const latestSnapshot = latestIdx >= 0 ? orderedSnapshots[latestIdx] : null;
  const previousSnapshot = latestIdx >= 1 ? orderedSnapshots[latestIdx - 1] : null;
  const checklistProgress = computeChecklistProgress(checklistItems);

  const latestComputedStatus = latestSnapshot
    ? classifySnapshotStatus(latestSnapshot, previousSnapshot, scope)
    : "estavel";

  const deltasVsPrevious = latestSnapshot
    ? extractSnapshotMetricMap(latestSnapshot, previousSnapshot, scope)
    : {};

  const deltasVsBaseline = latestSnapshot
    ? extractSnapshotMetricMap(
        latestSnapshot,
        baselineSnapshot && baselineSnapshot.id !== latestSnapshot.id ? baselineSnapshot : null,
        scope,
      )
    : {};

  return {
    orderedSnapshots,
    baselineSnapshot,
    previousSnapshot,
    latestSnapshot,
    checklistProgress,
    latestComputedStatus,
    deltasVsPrevious,
    deltasVsBaseline,
  };
}
