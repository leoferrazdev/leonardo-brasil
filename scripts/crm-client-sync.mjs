import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { loadEnvFile } from './lib/envLoader.mjs';
import { auditClientWebsite } from './lib/siteAuditor.mjs';
import { collectMonthlyAdsMetrics } from './lib/adsMetricsCollector.mjs';
import {
  buildDeterministicLogRef,
  buildStorageObjectPath,
  guessContentType,
  mergeSnapshotsPreservingBaseline,
  prepareChecklistUpsertRows
} from './lib/crmSyncCore.mjs';

loadEnvFile();

export function parseArgs(argv) {
  const flags = {
    file: '',
    auditSite: false,
    syncAds: false,
    forceBaseline: false,
    dryRun: false
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--file' && argv[i + 1]) {
      flags.file = argv[++i];
    } else if (arg.startsWith('--file=')) {
      flags.file = arg.slice('--file='.length);
    } else if (arg === '--audit-site') {
      flags.auditSite = true;
    } else if (arg === '--sync-ads') {
      flags.syncAds = true;
    } else if (arg === '--force-baseline') {
      flags.forceBaseline = true;
    } else if (arg === '--dry-run') {
      flags.dryRun = true;
    }
  }
  return flags;
}

export async function createAuthenticatedSupabase() {
  const url = process.env.VITE_SUPABASE_URL || 'https://juvwfxnlusrnvcarkrmc.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yHgMqSz5KFAAPpWUht81vA_Rrjy36VF';

  if (serviceKey) {
    return createClient(url, serviceKey, { auth: { persistSession: false } });
  }

  const supabase = createClient(url, anonKey, { auth: { persistSession: false } });
  const email = process.env.CRM_ADMIN_EMAIL?.trim();
  const password = process.env.CRM_ADMIN_PASSWORD?.trim();
  if (!email || !password) {
    throw new Error(
      'Defina SUPABASE_SERVICE_ROLE_KEY (recomendado) ou CRM_ADMIN_EMAIL + CRM_ADMIN_PASSWORD no .env para sincronizar com o Supabase.'
    );
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(`Falha ao autenticar script no Supabase: ${error.message}`);
  }
  return supabase;
}

export async function runSync(options = {}) {
  const flags = {
    file: options.file || '',
    auditSite: Boolean(options.auditSite),
    syncAds: Boolean(options.syncAds),
    forceBaseline: Boolean(options.forceBaseline),
    dryRun: Boolean(options.dryRun)
  };

  if (!flags.file) {
    throw new Error('Uso: node scripts/crm-client-sync.mjs --file <payload.json> [--audit-site] [--sync-ads] [--force-baseline] [--dry-run]');
  }

  const absPayloadPath = path.resolve(process.cwd(), flags.file);
  if (!existsSync(absPayloadPath)) {
    throw new Error(`Arquivo JSON não encontrado: ${absPayloadPath}`);
  }

  const payload = JSON.parse(readFileSync(absPayloadPath, 'utf8'));
  if (!payload?.client?.slug || !payload?.client?.name) {
    throw new Error('Payload precisa conter client.slug e client.name.');
  }

  const clientData = payload.client;
  const snapshots = Array.isArray(payload.snapshots) ? structuredClone(payload.snapshots) : [];
  const checklistItems = Array.isArray(payload.checklistItems) ? payload.checklistItems : [];
  const changeLogs = Array.isArray(payload.changeLogs) ? payload.changeLogs : [];
  const evidences = Array.isArray(payload.evidences) ? payload.evidences : [];

  // Coleta automática opcional de Site / Ads no último snapshot
  const latestSnapshot = snapshots[snapshots.length - 1];
  if (latestSnapshot && flags.auditSite && clientData.services_scope?.website && clientData.external_ids?.websiteDomain) {
    const siteAudit = await auditClientWebsite({
      baseUrl: clientData.external_ids.websiteDomain,
      monitoredPaths: clientData.external_ids.monitoredPaths || ['/'],
      versionLabel: clientData.external_ids.websiteVersionLabel || latestSnapshot.site_metrics?.versionLabel || '',
      env: process.env
    });
    latestSnapshot.site_metrics = { ...(latestSnapshot.site_metrics || {}), ...siteAudit.metrics };
    latestSnapshot.collection_warnings = [
      ...(latestSnapshot.collection_warnings || []),
      ...siteAudit.warnings
    ];
  }

  if (latestSnapshot && flags.syncAds && clientData.services_scope?.google_ads && clientData.external_ids?.adsAccountIds?.[0]) {
    const adsRes = await collectMonthlyAdsMetrics({
      customerId: clientData.external_ids.adsAccountIds[0],
      periodKey: latestSnapshot.period_key,
      env: process.env
    });
    if (adsRes.ok && adsRes.metrics) {
      latestSnapshot.ads_metrics = { ...(latestSnapshot.ads_metrics || {}), ...adsRes.metrics };
    } else if (adsRes.warning) {
      latestSnapshot.collection_warnings = [
        ...(latestSnapshot.collection_warnings || []),
        adsRes.warning
      ];
    }
  }

  if (flags.dryRun) {
    const summary = {
      slug: clientData.slug,
      checklistCount: checklistItems.length,
      snapshotsCount: snapshots.length,
      changeLogsCount: changeLogs.length,
      evidencesCount: evidences.length,
      evidencesStoragePaths: evidences.map((e) =>
        buildStorageObjectPath(clientData.slug, e.phase, e.localPath || e.storage_path)
      )
    };
    console.log('[DRY-RUN] Validação concluída para:', clientData.slug);
    console.log(JSON.stringify(summary, null, 2));
    return summary;
  }

  const supabase = await createAuthenticatedSupabase();

  // 1. Upsert cliente
  const { data: upsertedClient, error: clientErr } = await supabase
    .from('clients')
    .upsert(
      {
        slug: clientData.slug,
        lead_id: clientData.lead_id ?? null,
        name: clientData.name,
        segment: clientData.segment || 'Negócio Local',
        city: clientData.city || 'Porto Alegre',
        neighborhood: clientData.neighborhood ?? null,
        address: clientData.address ?? null,
        whatsapp: clientData.whatsapp ?? null,
        owner_name: clientData.owner_name ?? null,
        owner_email: clientData.owner_email ?? null,
        status: clientData.status || 'onboarding',
        services_scope: clientData.services_scope || { gbp: true, google_ads: false, website: false, website_mode: 'nenhum' },
        external_ids: clientData.external_ids || {},
        contract_meta: clientData.contract_meta || {},
        started_at: clientData.started_at ?? null
      },
      { onConflict: 'slug' }
    )
    .select()
    .single();

  if (clientErr || !upsertedClient) {
    throw new Error(`Erro ao salvar client: ${clientErr?.message || 'desconhecido'}`);
  }

  const clientId = upsertedClient.id;

  // 2. Checklist preservando before_* existente
  if (checklistItems.length > 0) {
    const { data: existingChecklist, error: fetchCheckErr } = await supabase
      .from('client_checklists')
      .select('*')
      .eq('client_id', clientId);
    if (fetchCheckErr) throw new Error(`Erro ao ler checklist existente: ${fetchCheckErr.message}`);

    const mergedRows = prepareChecklistUpsertRows(clientId, existingChecklist || [], checklistItems, flags.forceBaseline);
    const { error: upsertCheckErr } = await supabase
      .from('client_checklists')
      .upsert(mergedRows, { onConflict: 'client_id,item_key' });
    if (upsertCheckErr) throw new Error(`Erro ao salvar checklist: ${upsertCheckErr.message}`);
  }

  // 3. Snapshots históricos / mensais
  if (snapshots.length > 0) {
    const { data: existingSnapshots, error: fetchSnapErr } = await supabase
      .from('client_snapshots')
      .select('id, period_key, snapshot_type, is_baseline')
      .eq('client_id', clientId);
    if (fetchSnapErr) throw new Error(`Erro ao ler snapshots existentes: ${fetchSnapErr.message}`);

    const rows = mergeSnapshotsPreservingBaseline(
      clientId,
      existingSnapshots || [],
      snapshots,
      flags.forceBaseline
    );

    const { error: snapErr } = await supabase
      .from('client_snapshots')
      .upsert(rows, { onConflict: 'client_id,period_key,snapshot_type' });
    if (snapErr) throw new Error(`Erro ao salvar snapshots: ${snapErr.message}`);
  }

  // 4. Logs de entregas (sempre idempotentes via external_ref determinístico)
  for (const log of changeLogs) {
    const row = {
      client_id: clientId,
      occurred_at: log.occurred_at || new Date().toISOString(),
      pillar: log.pillar || 'gbp',
      action_type: log.action_type || 'implementacao',
      title: log.title,
      before_state: log.before_state ?? null,
      after_state: log.after_state ?? null,
      automation_source: log.automation_source || 'antigravity',
      visible_to_client: log.visible_to_client !== false,
      external_ref: buildDeterministicLogRef(log)
    };
    const { error: logErr } = await supabase
      .from('client_change_logs')
      .upsert(row, { onConflict: 'client_id,external_ref' });
    if (logErr) throw new Error(`Erro ao salvar log "${log.title}": ${logErr.message}`);
  }

  // 5. Upload de evidências visuais para bucket privado + metadados
  for (const ev of evidences) {
    let storagePath = ev.storage_path || buildStorageObjectPath(clientData.slug, ev.phase, ev.localPath);
    if (ev.localPath) {
      const absImg = path.isAbsolute(ev.localPath)
        ? ev.localPath
        : path.resolve(path.dirname(absPayloadPath), ev.localPath);
      if (existsSync(absImg)) {
        const buffer = readFileSync(absImg);
        const { error: uploadErr } = await supabase.storage
          .from('client-evidences')
          .upload(storagePath, buffer, {
            contentType: guessContentType(absImg),
            upsert: true
          });
        if (uploadErr) throw new Error(`Erro no upload de ${storagePath}: ${uploadErr.message}`);
      } else {
        console.warn(`[sync] Imagem não encontrada localmente, pulando upload: ${absImg}`);
        continue;
      }
    }

    const { error: evErr } = await supabase
      .from('client_evidences')
      .upsert(
        {
          client_id: clientId,
          pillar: ev.pillar || 'gbp',
          phase: ev.phase || 'antes',
          period_key: ev.period_key ?? null,
          pair_key: ev.pair_key ?? null,
          title: ev.title,
          caption: ev.caption ?? null,
          storage_path: storagePath
        },
        { onConflict: 'client_id,storage_path' }
      );
    if (evErr) throw new Error(`Erro ao registrar evidência "${ev.title}": ${evErr.message}`);
  }

  console.log(`Sync concluído com sucesso para cliente "${upsertedClient.name}" (${upsertedClient.slug}).`);
  return { ok: true, client: upsertedClient };
}

async function main() {
  const flags = parseArgs(process.argv);
  if (!flags.file) {
    console.error('Uso: node scripts/crm-client-sync.mjs --file <payload.json> [--audit-site] [--sync-ads] [--force-baseline] [--dry-run]');
    process.exit(1);
  }
  await runSync(flags);
}

// Executar apenas se invocado diretamente pela CLI
const isDirectCli = process.argv[1] && (
  process.argv[1].endsWith('crm-client-sync.mjs') ||
  process.argv[1].replace(/\\/g, '/').endsWith('scripts/crm-client-sync.mjs')
);

if (isDirectCli) {
  main().catch((err) => {
    console.error('[crm-client-sync] ERRO:', err.message);
    process.exit(1);
  });
}
