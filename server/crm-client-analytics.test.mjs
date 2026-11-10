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
