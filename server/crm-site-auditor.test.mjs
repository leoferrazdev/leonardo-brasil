import test from 'node:test';
import assert from 'node:assert/strict';
import { auditClientWebsite } from '../scripts/lib/siteAuditor.mjs';

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
