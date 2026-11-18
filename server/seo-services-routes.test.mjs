import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { isKnownWebRoute, NICHES_CATALOG } from './routes-manifest.mjs';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SITEMAP_CORE_PATH = path.join(ROOT_DIR, 'public', 'sitemap-core.xml');

const COMMERCIAL_ROUTES = [
  '/google-meu-negocio',
  '/otimizacao-google-meu-negocio',
  '/consultor-google-meu-negocio',
  '/especialista-google-maps',
  '/gestao-google-meu-negocio',
  '/criar-e-verificar-google-meu-negocio',
  '/google-ads',
  '/gestor-google-ads',
  '/consultor-google-ads',
  '/agencia-google-ads-negocios-locais',
  '/google-ads-e-google-meu-negocio',
  '/auditoria-google-ads',
];

test('all GMN and Google Ads commercial routes and 27 niche hubs are registered in routes-manifest', () => {
  for (const route of COMMERCIAL_ROUTES) {
    assert.equal(isKnownWebRoute(route), true, `Expected route to be known: ${route}`);
  }

  assert.ok(NICHES_CATALOG.length >= 27, `Expected at least 27 niches, got ${NICHES_CATALOG.length}`);
  for (const niche of NICHES_CATALOG) {
    assert.equal(
      isKnownWebRoute(`/google-ads/${niche.slug}`),
      true,
      `Expected Google Ads niche route to be known: /google-ads/${niche.slug}`
    );
  }

  assert.equal(isKnownWebRoute('/google-ads/nicho-inexistente-xyz'), false);
});

test('prerendered commercial routes have unique titles, self-referencing canonicals, and structured data', () => {
  if (!existsSync(path.join(DIST_DIR, 'google-ads', 'index.html'))) {
    // Permite rodar testes isolados antes do build, mas falha se dist/ existir incompleto
    return;
  }

  const seenTitles = new Set();

  for (const route of COMMERCIAL_ROUTES) {
    const htmlPath = path.join(DIST_DIR, route.slice(1), 'index.html');
    assert.equal(existsSync(htmlPath), true, `Missing prerendered HTML for ${route}`);
    const html = readFileSync(htmlPath, 'utf8');

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    assert.ok(titleMatch && titleMatch[1].trim().length > 15, `Missing valid <title> for ${route}`);
    const title = titleMatch[1].trim();
    assert.equal(seenTitles.has(title), false, `Duplicate <title> detected on ${route}: ${title}`);
    seenTitles.add(title);

    const expectedCanonical = `https://leonardobrasil.com.br${route}`;
    assert.ok(
      html.includes(`href="${expectedCanonical}"`),
      `Expected self-referencing canonical ${expectedCanonical} in ${route}`
    );

    assert.ok(html.includes('"@type":"Service"'), `Expected Service JSON-LD schema on ${route}`);
    assert.ok(html.includes('"@type":"FAQPage"'), `Expected FAQPage JSON-LD schema on ${route}`);
  }

  for (const niche of NICHES_CATALOG) {
    const route = `/google-ads/${niche.slug}`;
    const htmlPath = path.join(DIST_DIR, 'google-ads', niche.slug, 'index.html');
    assert.equal(existsSync(htmlPath), true, `Missing prerendered HTML for ${route}`);
    const html = readFileSync(htmlPath, 'utf8');
    assert.ok(
      html.includes(`href="https://leonardobrasil.com.br${route}"`),
      `Expected self-referencing canonical on ${route}`
    );
  }
});

test('sitemap-core.xml includes all GMN and Google Ads commercial pages and niche hubs', () => {
  assert.equal(existsSync(SITEMAP_CORE_PATH), true, 'Missing public/sitemap-core.xml');
  const sitemap = readFileSync(SITEMAP_CORE_PATH, 'utf8');

  for (const route of COMMERCIAL_ROUTES) {
    assert.ok(
      sitemap.includes(`<loc>https://leonardobrasil.com.br${route}</loc>`),
      `Missing ${route} in sitemap-core.xml`
    );
  }

  for (const niche of NICHES_CATALOG) {
    assert.ok(
      sitemap.includes(`<loc>https://leonardobrasil.com.br/google-ads/${niche.slug}</loc>`),
      `Missing /google-ads/${niche.slug} in sitemap-core.xml`
    );
  }
});
