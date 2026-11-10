import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = await readFile(new URL('../src/pages/crm/utils/clientAnalytics.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext }
}).outputText;
const analytics = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('computeMetricDelta respects direction (up vs down) and tolerance threshold', () => {
  const upGain = analytics.computeMetricDelta(260, 200, 'up');
  assert.equal(upGain.absoluteDiff, 60);
  assert.equal(upGain.percentDiff, 30);
  assert.equal(upGain.outcome, 'melhora');

  // Ranking improvement: 5th -> 2nd position is a positive improvement when direction='down'
  const rankGain = analytics.computeMetricDelta(2, 5, 'down');
  assert.equal(rankGain.absoluteDiff, -3);
  assert.equal(rankGain.outcome, 'melhora');

  // Regression in broken links: 0 -> 2 is worse when direction='down'
  const brokenRegression = analytics.computeMetricDelta(2, 0, 'down');
  assert.equal(brokenRegression.outcome, 'piora');

  // Minor fluctuation within +-4% stays neutral
  const noise = analytics.computeMetricDelta(102, 100, 'up');
  assert.equal(noise.outcome, 'neutro');
});

test('sortSnapshotsChronological places baseline_historico before mensal in same period', () => {
  const sorted = analytics.sortSnapshotsChronological([
    { id: '2', period_key: '2026-11', snapshot_type: 'mensal', is_baseline: false },
    { id: '1', period_key: '2026-11', snapshot_type: 'baseline_historico', is_baseline: true },
    { id: '0', period_key: '2026-10', snapshot_type: 'baseline_historico', is_baseline: false }
  ]);
  assert.deepEqual(sorted.map((s) => s.id), ['0', '1', '2']);
});

test('classifySnapshotStatus detects avanco, retrocesso and baseline cleanly', () => {
  const scope = { gbp: true, google_ads: true, website: true, website_mode: 'redesign' };
  const base = {
    id: 'b',
    period_key: '2026-11',
    snapshot_type: 'baseline_historico',
    is_baseline: true,
    gbp_metrics: { viewsTotal: 1900, interactionsTotal: 220, rating: 4.1, reviewCount: 267, targetKeywordRank: 6 },
    ads_metrics: { clicks: 100, conversions: 10, costPerConversionBrl: 40 },
    site_metrics: { brokenUrlsCount: 1, pagespeedMobile: 62 }
  };
  assert.equal(analytics.classifySnapshotStatus(base, null, scope), 'baseline');

  const improved = {
    id: 'm1',
    period_key: '2026-12',
    snapshot_type: 'mensal',
    is_baseline: false,
    gbp_metrics: { viewsTotal: 2500, interactionsTotal: 310, rating: 4.3, reviewCount: 295, targetKeywordRank: 2 },
    ads_metrics: { clicks: 140, conversions: 16, costPerConversionBrl: 31 },
    site_metrics: { brokenUrlsCount: 0, pagespeedMobile: 92 }
  };
  assert.equal(analytics.classifySnapshotStatus(improved, base, scope), 'avanco');

  const regressed = {
    id: 'm2',
    period_key: '2026-12',
    snapshot_type: 'mensal',
    is_baseline: false,
    gbp_metrics: { viewsTotal: 1200, interactionsTotal: 140, rating: 4.0, reviewCount: 267, targetKeywordRank: 9 },
    ads_metrics: { clicks: 80, conversions: 4, costPerConversionBrl: 65 },
    site_metrics: { brokenUrlsCount: 3, pagespeedMobile: 48 }
  };
  assert.equal(analytics.classifySnapshotStatus(regressed, base, scope), 'retrocesso');
});

test('computeChecklistProgress excludes nao_aplicavel from denominator', () => {
  const progress = analytics.computeChecklistProgress([
    { current_status: 'otimizado' },
    { current_status: 'otimizado' },
    { current_status: 'em_andamento' },
    { current_status: 'pendente' },
    { current_status: 'nao_aplicavel' }
  ]);
  assert.deepEqual(progress, {
    total: 5,
    applicable: 4,
    optimized: 2,
    inProgress: 1,
    pending: 1,
    completionPct: 50
  });
});

test('findBaselineSnapshot handles empty list, explicit non-first baseline, and earliest fallback', () => {
  assert.equal(analytics.findBaselineSnapshot([]), null);

  const octHistorical = {
    id: 's-oct',
    period_key: '2026-10',
    snapshot_type: 'baseline_historico',
    is_baseline: false
  };
  const novBaseline = {
    id: 's-nov',
    period_key: '2026-11',
    snapshot_type: 'baseline_historico',
    is_baseline: true
  };
  const decMensal = {
    id: 's-dec',
    period_key: '2026-12',
    snapshot_type: 'mensal',
    is_baseline: false
  };

  assert.equal(analytics.findBaselineSnapshot([decMensal, octHistorical, novBaseline]).id, 's-nov');
  assert.equal(
    analytics.findBaselineSnapshot([decMensal, { ...novBaseline, is_baseline: false }, octHistorical]).id,
    's-oct'
  );
});

test('buildClientComparisonSummary computes deltas, progress and status for latest and historical targetPeriodKey', () => {
  const scope = { gbp: true, google_ads: true, website: true, website_mode: 'redesign' };
  const snapshots = [
    {
      id: 's-oct',
      period_key: '2026-10',
      period_label: 'Out/2026',
      snapshot_type: 'baseline_historico',
      is_baseline: false,
      gbp_metrics: { viewsTotal: 1800, interactionsTotal: 190, rating: 4.1, reviewCount: 260 },
      ads_metrics: { clicks: 90, conversions: 8 },
      site_metrics: { brokenUrlsCount: 2, pagespeedMobile: 55 }
    },
    {
      id: 's-nov',
      period_key: '2026-11',
      period_label: 'Nov/2026 (Marco Zero)',
      snapshot_type: 'baseline_historico',
      is_baseline: true,
      gbp_metrics: { viewsTotal: 2000, interactionsTotal: 200, rating: 4.1, reviewCount: 267 },
      ads_metrics: { clicks: 100, conversions: 10 },
      site_metrics: { brokenUrlsCount: 2, pagespeedMobile: 60 }
    },
    {
      id: 's-dec',
      period_key: '2026-12',
      period_label: 'Dez/2026',
      snapshot_type: 'mensal',
      is_baseline: false,
      gbp_metrics: { viewsTotal: 2400, interactionsTotal: 260, rating: 4.3, reviewCount: 280 },
      ads_metrics: { clicks: 130, conversions: 15 },
      site_metrics: { brokenUrlsCount: 0, pagespeedMobile: 90 }
    },
    {
      id: 's-jan',
      period_key: '2027-01',
      period_label: 'Jan/2027',
      snapshot_type: 'mensal',
      is_baseline: false,
      gbp_metrics: { viewsTotal: 3000, interactionsTotal: 312, rating: 4.5, reviewCount: 300 },
      ads_metrics: { clicks: 156, conversions: 18 },
      site_metrics: { brokenUrlsCount: 0, pagespeedMobile: 94 }
    }
  ];
  const checklist = [
    { current_status: 'otimizado' },
    { current_status: 'otimizado' },
    { current_status: 'em_andamento' },
    { current_status: 'nao_aplicavel' }
  ];

  // Latest month (default)
  const latestSummary = analytics.buildClientComparisonSummary(snapshots, checklist, scope);
  assert.equal(latestSummary.baselineSnapshot.id, 's-nov');
  assert.equal(latestSummary.previousSnapshot.id, 's-dec');
  assert.equal(latestSummary.latestSnapshot.id, 's-jan');
  assert.equal(latestSummary.deltasVsPrevious.gbp_views.absoluteDiff, 600);
  assert.equal(latestSummary.deltasVsPrevious.gbp_views.percentDiff, 25);
  assert.equal(latestSummary.deltasVsBaseline.gbp_views.absoluteDiff, 1000);
  assert.equal(latestSummary.deltasVsBaseline.gbp_views.percentDiff, 50);
  assert.equal(latestSummary.latestComputedStatus, 'avanco');
  assert.deepEqual(latestSummary.checklistProgress, {
    total: 4,
    applicable: 3,
    optimized: 2,
    inProgress: 1,
    pending: 0,
    completionPct: 67
  });

  // Historical targetPeriodKey
  const decSummary = analytics.buildClientComparisonSummary(snapshots, checklist, scope, '2026-12');
  assert.equal(decSummary.baselineSnapshot.id, 's-nov');
  assert.equal(decSummary.previousSnapshot.id, 's-nov');
  assert.equal(decSummary.latestSnapshot.id, 's-dec');
  assert.equal(decSummary.deltasVsPrevious.gbp_views.absoluteDiff, 400);
  assert.equal(decSummary.deltasVsPrevious.gbp_views.percentDiff, 20);
  assert.equal(decSummary.deltasVsBaseline.site_broken_urls.absoluteDiff, -2);
  assert.equal(decSummary.deltasVsBaseline.site_broken_urls.outcome, 'melhora');
  assert.equal(decSummary.latestComputedStatus, 'avanco');
});
