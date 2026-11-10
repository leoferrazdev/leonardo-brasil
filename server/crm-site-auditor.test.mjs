import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { auditClientWebsite } from '../scripts/lib/siteAuditor.mjs';
import { collectMonthlyAdsMetrics } from '../scripts/lib/adsMetricsCollector.mjs';
import { loadEnvFile } from '../scripts/lib/envLoader.mjs';

test('auditClientWebsite detects 200 vs 404 routes, title, SSL, WhatsApp CTA and handles PageSpeed failure gracefully', async () => {
  const mockFetch = async (url) => {
    const u = String(url);
    if (u === 'https://angelocarmecanica.com.br/') {
      return new Response(
        '<html><head><title>Angelo Car</title><link rel="canonical" href="https://angelocarmecanica.com.br/" /></head><body><a href="https://wa.me/5551984281009">WhatsApp</a></body></html>',
        { status: 200, headers: { 'content-type': 'text/html' } }
      );
    }
    if (u.includes('/socorro-mecanico-24h')) {
      return new Response('Not Found', { status: 404 });
    }
    if (u.includes('pagespeedonline.googleapis.com')) {
      return new Response(JSON.stringify({ error: { message: 'Quota exceeded' } }), { status: 429 });
    }
    return new Response('OK', { status: 200 });
  };

  const result = await auditClientWebsite({
    baseUrl: 'https://angelocarmecanica.com.br',
    monitoredPaths: ['/', '/socorro-mecanico-24h'],
    versionLabel: 'v1 legado',
    fetchImpl: mockFetch,
    env: {}
  });

  assert.equal(result.metrics.versionLabel, 'v1 legado');
  assert.equal(result.metrics.hasSsl, true);
  assert.equal(result.metrics.hasWhatsappCta, true);
  assert.equal(result.metrics.httpOkCount, 1);
  assert.equal(result.metrics.brokenUrlsCount, 1);
  assert.deepEqual(result.metrics.brokenPaths, ['/socorro-mecanico-24h']);
  assert.equal(result.metrics.pagespeedMobile, undefined);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /PageSpeed/i);
});

test('auditClientWebsite extracts PageSpeed Mobile and Desktop scores when API responds 200', async () => {
  const mockFetch = async (url) => {
    const u = String(url);
    if (u.includes('strategy=mobile')) {
      return new Response(
        JSON.stringify({ lighthouseResult: { categories: { performance: { score: 0.91 } } } }),
        { status: 200 }
      );
    }
    if (u.includes('strategy=desktop')) {
      return new Response(
        JSON.stringify({ lighthouseResult: { categories: { performance: { score: 0.98 } } } }),
        { status: 200 }
      );
    }
    return new Response('<title>Site OK</title><a href="tel:51984281009">Ligar</a>', { status: 200 });
  };

  const result = await auditClientWebsite({
    baseUrl: 'https://angelocarmecanica.com.br/',
    monitoredPaths: ['/'],
    versionLabel: 'v2 novo',
    fetchImpl: mockFetch,
    env: {}
  });

  assert.equal(result.metrics.brokenUrlsCount, 0);
  assert.equal(result.metrics.pagespeedMobile, 91);
  assert.equal(result.metrics.pagespeedDesktop, 98);
  assert.equal(result.warnings.length, 0);
});

test('collectMonthlyAdsMetrics aggregates GAQL campaign metrics and falls back gracefully on timeout / abort', async () => {
  const env = {
    GOOGLE_ADS_DEVELOPER_TOKEN: 'dev-token',
    GOOGLE_ADS_CLIENT_ID: 'client-id',
    GOOGLE_ADS_CLIENT_SECRET: 'client-secret',
    GOOGLE_ADS_REFRESH_TOKEN: 'refresh-token',
    GOOGLE_ADS_CUSTOMER_ID: '123-456-7890'
  };

  const happyFetch = async (url) => {
    const u = String(url);
    if (u.includes('oauth2.googleapis.com')) {
      return new Response(JSON.stringify({ access_token: 'fake-ads-token' }), { status: 200 });
    }
    return new Response(
      JSON.stringify({
        results: [
          {
            campaign: { id: 'c1', status: 'ENABLED' },
            metrics: { impressions: 1200, clicks: 60, costMicros: 180000000, conversions: 6 }
          },
          {
            campaign: { id: 'c2', status: 'PAUSED' },
            metrics: { impressions: 300, clicks: 10, cost_micros: 20000000, conversions: 1 }
          }
        ]
      }),
      { status: 200 }
    );
  };

  const success = await collectMonthlyAdsMetrics({
    customerId: '123-456-7890',
    periodKey: '2026-10',
    env,
    fetchImpl: happyFetch
  });

  assert.equal(success.ok, true);
  assert.equal(success.metrics.activeAccountId, '1234567890');
  assert.equal(success.metrics.impressions, 1500);
  assert.equal(success.metrics.clicks, 70);
  assert.equal(success.metrics.spendBrl, 200.0);
  assert.equal(success.metrics.conversions, 7.0);
  assert.equal(success.metrics.activeCampaignsCount, 1);

  // Abort / timeout test
  const abortFetch = async () => {
    const err = new Error('The operation was aborted');
    err.name = 'AbortError';
    throw err;
  };

  const aborted = await collectMonthlyAdsMetrics({
    customerId: '123-456-7890',
    periodKey: '2026-10',
    env,
    fetchImpl: abortFetch
  });

  assert.equal(aborted.ok, false);
  assert.equal(aborted.metrics, null);
  assert.match(aborted.warning, /Google Ads API fallback/i);
});

test('loadEnvFile parses CRLF/LF .env without overwriting existing environment keys', () => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'env-test-'));
  const testEnvPath = path.join(tmpDir, '.env');
  try {
    writeFileSync(
      testEnvPath,
      '# Comment line\r\nEXISTING_KEY=new_val\r\nNEW_KEY="quoted_val"\r\nANOTHER_KEY=simple_val\n'
    );
    const targetEnv = { EXISTING_KEY: 'preserve_me' };
    loadEnvFile(testEnvPath, targetEnv);

    assert.equal(targetEnv.EXISTING_KEY, 'preserve_me');
    assert.equal(targetEnv.NEW_KEY, 'quoted_val');
    assert.equal(targetEnv.ANOTHER_KEY, 'simple_val');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});
