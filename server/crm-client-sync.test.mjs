import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  buildStorageObjectPath,
  prepareChecklistUpsertRows,
  mergeChecklistPreservingBefore,
  mergeSnapshotsPreservingBaseline,
  guessContentType
} from '../scripts/lib/crmSyncCore.mjs';
import { parseArgs, runSync } from '../scripts/crm-client-sync.mjs';

test('prepareChecklistUpsertRows NEVER overwrites before_status or before_value without forceBaseline', () => {
  const existing = [
    {
      client_id: 'uuid-1',
      item_key: 'gbp_social_profiles',
      pillar: 'gbp',
      category_label: 'Cadastro',
      title: 'Perfis de redes sociais',
      before_status: 'ausente',
      before_value: '0 redes vinculadas',
      current_status: 'pendente',
      current_value: null,
      sort_order: 1
    }
  ];

  const incoming = [
    {
      item_key: 'gbp_social_profiles',
      pillar: 'gbp',
      category_label: 'Cadastro',
      title: 'Perfis de redes sociais',
      before_status: 'ok', // must be ignored unless forceBaseline = true
      before_value: 'Tentativa indevida',
      current_status: 'otimizado',
      current_value: 'Instagram + Facebook vinculados',
      sort_order: 1
    }
  ];

  const merged = prepareChecklistUpsertRows('uuid-1', existing, incoming, false, '2026-11-10T15:00:00.000Z');
  assert.equal(merged.length, 1);
  assert.equal(merged[0].before_status, 'ausente');
  assert.equal(merged[0].before_value, '0 redes vinculadas');
  assert.equal(merged[0].current_status, 'otimizado');
  assert.equal(merged[0].current_value, 'Instagram + Facebook vinculados');
  assert.equal(merged[0].completed_at, '2026-11-10T15:00:00.000Z');
});

test('prepareChecklistUpsertRows allows before_* override only with forceBaseline = true', () => {
  const existing = [
    {
      client_id: 'uuid-1',
      item_key: 'site_404',
      pillar: 'website',
      before_status: 'incompleto',
      before_value: 'Antigo',
      current_status: 'pendente'
    }
  ];
  const incoming = [
    {
      item_key: 'site_404',
      pillar: 'website',
      category_label: 'Site',
      title: 'Corrigir 404',
      before_status: 'incorreto',
      before_value: 'URL /socorro-mecanico-24h 404',
      current_status: 'pendente'
    }
  ];

  const forced = prepareChecklistUpsertRows('uuid-1', existing, incoming, true, '2026-11-10T15:00:00.000Z');
  assert.equal(forced[0].before_status, 'incorreto');
  assert.equal(forced[0].before_value, 'URL /socorro-mecanico-24h 404');
});

test('buildStorageObjectPath normalizes filenames deterministically for idempotent upload', () => {
  const p = buildStorageObjectPath('angelo-car', 'antes', 'C:\\tmp\\evidencia-fotos-capa-logo.png');
  assert.equal(p, 'angelo-car/antes-evidencia-fotos-capa-logo.png');
});

test('mergeChecklistPreservingBefore alias preserves before_* and updates completed_at when status changes to otimizado', () => {
  const existing = [
    {
      client_id: 'uuid-2',
      item_key: 'gbp_hours',
      pillar: 'gbp',
      category_label: 'Cadastro',
      title: 'Horário de atendimento',
      before_status: 'incorreto',
      before_value: 'Horário desatualizado',
      current_status: 'pendente',
      completed_at: null
    }
  ];
  const incoming = [
    {
      item_key: 'gbp_hours',
      current_status: 'otimizado',
      current_value: 'Horário 24h ajustado'
    }
  ];

  const merged = mergeChecklistPreservingBefore('uuid-2', existing, incoming, false, '2026-11-10T18:00:00.000Z');
  assert.equal(merged[0].before_status, 'incorreto');
  assert.equal(merged[0].before_value, 'Horário desatualizado');
  assert.equal(merged[0].current_status, 'otimizado');
  assert.equal(merged[0].current_value, 'Horário 24h ajustado');
  assert.equal(merged[0].completed_at, '2026-11-10T18:00:00.000Z');
});

test('mergeSnapshotsPreservingBaseline NEVER overwrites existing is_baseline snapshot without forceBaseline', () => {
  const existingSnapshots = [
    {
      id: 'snap-1',
      client_id: 'uuid-1',
      period_key: '2026-03',
      snapshot_type: 'baseline_historico',
      is_baseline: true
    }
  ];

  const incomingSnapshots = [
    {
      period_key: '2026-11',
      period_label: 'Novembro 2026',
      snapshot_type: 'mensal',
      is_baseline: true // attempt to overwrite baseline
    }
  ];

  const result = mergeSnapshotsPreservingBaseline('uuid-1', existingSnapshots, incomingSnapshots, false);
  assert.equal(result.length, 1);
  assert.equal(result[0].is_baseline, false);
  assert.equal(result[0].period_key, '2026-11');
});

test('mergeSnapshotsPreservingBaseline allows baseline override when forceBaseline = true', () => {
  const existingSnapshots = [
    {
      id: 'snap-1',
      client_id: 'uuid-1',
      period_key: '2026-03',
      snapshot_type: 'baseline_historico',
      is_baseline: true
    }
  ];

  const incomingSnapshots = [
    {
      period_key: '2026-11',
      period_label: 'Novembro 2026',
      snapshot_type: 'mensal',
      is_baseline: true
    }
  ];

  const result = mergeSnapshotsPreservingBaseline('uuid-1', existingSnapshots, incomingSnapshots, true);
  assert.equal(result[0].is_baseline, true);
});

test('guessContentType detects png, webp, jpeg and octet-stream', () => {
  assert.equal(guessContentType('test.png'), 'image/png');
  assert.equal(guessContentType('img/photo.webp'), 'image/webp');
  assert.equal(guessContentType('C:\\images\\photo.jpg'), 'image/jpeg');
  assert.equal(guessContentType('photo.jpeg'), 'image/jpeg');
  assert.equal(guessContentType('file.pdf'), 'application/octet-stream');
});

test('parseArgs parses all CLI flags correctly', () => {
  const argv = [
    'node',
    'crm-client-sync.mjs',
    '--file',
    'angelo-car.json',
    '--audit-site',
    '--sync-ads',
    '--force-baseline',
    '--dry-run'
  ];
  const parsed = parseArgs(argv);
  assert.equal(parsed.file, 'angelo-car.json');
  assert.equal(parsed.auditSite, true);
  assert.equal(parsed.syncAds, true);
  assert.equal(parsed.forceBaseline, true);
  assert.equal(parsed.dryRun, true);
});

test('runSync with --dry-run parses and validates payload without calling Supabase', async () => {
  const tempFile = path.join(os.tmpdir(), `crm-sync-test-${Date.now()}.json`);
  const samplePayload = {
    client: {
      slug: 'angelo-car',
      name: 'Ângelo Car Centro Automotivo',
      segment: 'Oficina Mecânica',
      city: 'Porto Alegre'
    },
    snapshots: [
      {
        period_key: '2026-03',
        period_label: 'Março 2026',
        snapshot_type: 'baseline_historico',
        is_baseline: true
      }
    ],
    checklistItems: [
      {
        item_key: 'gbp_hours',
        pillar: 'gbp',
        before_status: 'incorreto',
        current_status: 'otimizado'
      }
    ],
    changeLogs: [
      {
        title: 'Ajuste de horário',
        pillar: 'gbp',
        action_type: 'implementacao'
      }
    ],
    evidences: [
      {
        phase: 'antes',
        title: 'Foto da fachada antiga',
        localPath: 'evidencias/fachada.png'
      }
    ]
  };

  fs.writeFileSync(tempFile, JSON.stringify(samplePayload), 'utf8');

  try {
    const summary = await runSync({
      file: tempFile,
      dryRun: true
    });
    assert.equal(summary.slug, 'angelo-car');
    assert.equal(summary.checklistCount, 1);
    assert.equal(summary.snapshotsCount, 1);
    assert.equal(summary.changeLogsCount, 1);
    assert.equal(summary.evidencesCount, 1);
    assert.equal(summary.evidencesStoragePaths[0], 'angelo-car/antes-fachada.png');
  } finally {
    try {
      fs.unlinkSync(tempFile);
    } catch {}
  }
});
