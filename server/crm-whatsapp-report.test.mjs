import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import test from 'node:test';
import assert from 'node:assert/strict';

const analyticsSrc = await readFile(new URL('../src/pages/crm/utils/clientAnalytics.ts', import.meta.url), 'utf8');
const formatterSrc = await readFile(new URL('../src/pages/crm/utils/whatsappReportFormatter.ts', import.meta.url), 'utf8');

// Replace local relative TS import with injected module in test sandbox
const combinedSrc = `${analyticsSrc}\n${formatterSrc.replace(/import\s+\{[^}]+\}\s+from\s+["']\.\/clientAnalytics["'];/, '')}`;
const compiled = ts.transpileModule(combinedSrc, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext }
}).outputText;
const mod = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

const baseClient = {
  id: 'c1',
  slug: 'angelo-car',
  name: 'Ângelo Car',
  segment: 'Oficina Mecânica',
  city: 'Porto Alegre',
  neighborhood: 'Cavalhada',
  whatsapp: '(51) 98428-1009',
  owner_name: 'Ângelo',
  status: 'ativo',
  services_scope: { gbp: true, google_ads: false, website: true, website_mode: 'redesign' },
  external_ids: { websiteDomain: 'https://angelocarmecanica.com.br/' },
  contract_meta: {},
  created_at: '2026-11-10T00:00:00Z',
  updated_at: '2026-11-10T00:00:00Z'
};

test('sanitizeWhatsAppPhone adds DDI 55 and builds universal wa.me URL', () => {
  assert.equal(mod.sanitizeWhatsAppPhone('(51) 98428-1009'), '5551984281009');
  assert.equal(mod.sanitizeWhatsAppPhone('5551984281009'), '5551984281009');
  const url = mod.buildWhatsAppUniversalUrl('(51) 98428-1009', 'Olá Ângelo');
  assert.equal(url, 'https://wa.me/5551984281009?text=Ol%C3%A1%20%C3%82ngelo');
});

test('formatClientWhatsAppReport marco_zero summarizes Antes vs Depois and hides inactive services', () => {
  const report = mod.formatClientWhatsAppReport({
    client: baseClient,
    snapshots: [
      {
        id: 's1',
        client_id: 'c1',
        period_key: '2026-11',
        period_label: 'Nov/2026 (Antes)',
        snapshot_type: 'baseline_historico',
        is_baseline: true,
        source: 'agente_browser',
        gbp_metrics: { viewsTotal: 1906, interactionsTotal: 249, rating: 4.1, reviewCount: 267, profileStrengthPct: 20 },
        ads_metrics: {},
        site_metrics: { versionLabel: 'v1', brokenUrlsCount: 1 },
        overall_status: 'baseline',
        collection_warnings: [],
        recorded_at: '2026-11-10T10:00:00Z'
      }
    ],
    checklist: [
      {
        id: 'k1',
        client_id: 'c1',
        pillar: 'gbp',
        item_key: 'gbp_social_profiles',
        category_label: 'Cadastro',
        title: 'Redes sociais vinculadas no perfil',
        impact_level: 'alta',
        before_status: 'ausente',
        before_value: 'Nenhuma rede vinculada',
        current_status: 'otimizado',
        current_value: 'Instagram e Facebook vinculados',
        sort_order: 1,
        updated_at: '2026-11-10T12:00:00Z'
      },
      {
        id: 'k2',
        client_id: 'c1',
        pillar: 'website',
        item_key: 'site_404',
        category_label: 'Site',
        title: 'Correção de URL 404 /socorro-mecanico-24h',
        impact_level: 'alta',
        before_status: 'incorreto',
        before_value: 'Erro 404 ativo',
        current_status: 'pendente',
        current_value: 'Aguardando publicação do novo site',
        sort_order: 2,
        updated_at: '2026-11-10T12:00:00Z'
      }
    ],
    changeLogs: [
      {
        id: 'l1',
        client_id: 'c1',
        occurred_at: '2026-11-10T12:00:00Z',
        pillar: 'gbp',
        action_type: 'implementacao',
        title: 'Vinculados Instagram e Facebook oficiais no GBP',
        automation_source: 'antigravity',
        visible_to_client: true
      },
      {
        id: 'l2',
        client_id: 'c1',
        occurred_at: '2026-11-10T12:05:00Z',
        pillar: 'gbp',
        action_type: 'monitoramento',
        title: 'Nota interna privada da agência',
        automation_source: 'manual',
        visible_to_client: false
      }
    ],
    style: 'marco_zero'
  });

  assert.match(report, /\*Marco Zero & Evolução — Ângelo Car\*/);
  assert.match(report, /Redes sociais vinculadas no perfil/);
  assert.match(report, /Vinculados Instagram e Facebook/);
  assert.doesNotMatch(report, /Nota interna privada/);
  assert.doesNotMatch(report, /Google Ads/); // inactive service omitted
  assert.doesNotMatch(report, /\|/); // no desktop pipe tables
});

test('formatClientWhatsAppReport mensal includes MoM comparison without rank guarantees', () => {
  const report = mod.formatClientWhatsAppReport({
    client: {
      ...baseClient,
      services_scope: { gbp: true, google_ads: true, website: true, website_mode: 'redesign' }
    },
    snapshots: [
      {
        id: 's0',
        client_id: 'c1',
        period_key: '2026-10',
        period_label: 'Out/2026',
        snapshot_type: 'baseline_historico',
        is_baseline: true,
        source: 'agente_browser',
        gbp_metrics: { viewsTotal: 1900, interactionsTotal: 200, calls: 90, routes: 80, siteClicks: 30, rating: 4.1, reviewCount: 267 },
        ads_metrics: { clicks: 100, conversions: 12, spendBrl: 450 },
        site_metrics: { versionLabel: 'v1', brokenUrlsCount: 1, pagespeedMobile: 58 },
        overall_status: 'baseline',
        collection_warnings: [],
        recorded_at: '2026-11-01T10:00:00Z'
      },
      {
        id: 's1',
        client_id: 'c1',
        period_key: '2026-11',
        period_label: 'Nov/2026',
        snapshot_type: 'mensal',
        is_baseline: false,
        source: 'hibrido',
        gbp_metrics: { viewsTotal: 2470, interactionsTotal: 260, calls: 118, routes: 98, siteClicks: 44, rating: 4.3, reviewCount: 285 },
        ads_metrics: { clicks: 145, conversions: 21, spendBrl: 500 },
        site_metrics: { versionLabel: 'v2 Nova', brokenUrlsCount: 0, pagespeedMobile: 94 },
        overall_status: 'avanco',
        executive_summary: 'Novo site no ar e aumento consistente nas interações no Maps.',
        collection_warnings: [],
        recorded_at: '2026-12-01T10:00:00Z'
      }
    ],
    checklist: [],
    changeLogs: [],
    style: 'mensal',
    targetPeriodKey: '2026-11'
  });

  assert.match(report, /\*Relatório Mensal — Ângelo Car \(Nov\/2026\)\*/);
  assert.match(report, /Visualizações: \*2\.470\*/);
  assert.match(report, /\(\+30%/);
  assert.match(report, /Google Ads/);
  assert.match(report, /Site \(v2 Nova\)/);
  assert.doesNotMatch(report, /garantimos 1º lugar/i);
});
