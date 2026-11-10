import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = await readFile(new URL('../src/pages/crm/utils/clientDefaults.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext }
}).outputText;
const defaults = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('slugifyClientName strips accents, symbols and spaces cleanly', () => {
  assert.equal(defaults.slugifyClientName('Ângelo Car — Oficina Mecânica!'), 'angelo-car-oficina-mecanica');
  assert.equal(defaults.slugifyClientName('Clínica Saúde & Vida'), 'clinica-saude-vida');
});

test('slugifyClientName never leaves a trailing hyphen after 64-char truncation and ignores leading symbols', () => {
  assert.equal(defaults.slugifyClientName('a'.repeat(63) + ' Extra'), 'a'.repeat(63));
  assert.equal(defaults.slugifyClientName('!'.repeat(70) + 'abc'), 'abc');
});

test('buildDefaultChecklistForScope includes only items for enabled services', () => {
  const gbpOnly = defaults.buildDefaultChecklistForScope('c1', {
    gbp: true,
    google_ads: false,
    website: false,
    website_mode: 'nenhum'
  });
  assert.ok(gbpOnly.length >= 6);
  assert.ok(gbpOnly.every((item) => item.pillar === 'gbp'));
  assert.ok(gbpOnly.every((item) => item.client_id === 'c1'));

  const multi = defaults.buildDefaultChecklistForScope('c2', {
    gbp: true,
    google_ads: true,
    website: true,
    website_mode: 'redesign'
  });
  assert.ok(multi.some((item) => item.pillar === 'gbp'));
  assert.ok(multi.some((item) => item.pillar === 'google_ads'));
  assert.ok(multi.some((item) => item.pillar === 'website'));
});

test('buildPrefillFromLead maps Kanban ProspectLead into client form defaults', () => {
  const prefill = defaults.buildPrefillFromLead({
    id: 'O-005',
    sampleId: 'O-005',
    name: 'Angelo Car Oficina Mecânica',
    segment: 'Oficina Mecânica',
    neighborhood: 'Cavalhada',
    city: 'Porto Alegre',
    address: 'Av. Vicente Monteggia, 333',
    phone: '(51) 98428-1009',
    formattedPhone: '5551984281009',
    whatsappConfirmed: true,
    mapsUrl: 'https://maps.google.com/?q=Angelo+Car',
    siteUrl: 'https://angelocarmecanica.com.br/',
    opportunityClass: 'Classe A',
    opportunityIssue: 'Fora do Top 3',
    searchKeyword: 'oficina mecânica',
    monthlySearches: '1.900',
    stage: 'fechado_ganho',
    bloco1: '',
    bloco1Volume: '',
    bloco1Falha: '',
    bloco2: '',
    bloco3: '',
    bloco4: '',
    updatedAt: '2026-11-10T00:00:00Z'
  });

  assert.equal(prefill.lead_id, 'O-005');
  assert.equal(prefill.slug, 'angelo-car-oficina-mecanica');
  assert.equal(prefill.whatsapp, '5551984281009');
  assert.equal(prefill.website, true);
  assert.equal(prefill.websiteDomain, 'https://angelocarmecanica.com.br/');
});
