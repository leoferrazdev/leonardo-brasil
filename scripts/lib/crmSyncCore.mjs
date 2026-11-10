import path from 'node:path';

export function guessContentType(filePath) {
  const ext = path.extname(String(filePath || '')).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return 'application/octet-stream';
}

export function buildStorageObjectPath(slug, phase, filePath) {
  const rawPath = String(filePath || 'evidencia.png').replace(/\\/g, '/');
  const baseName = path.posix.basename(rawPath)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-');
  const cleanSlug = String(slug || 'cliente').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  const cleanPhase = String(phase || 'antes').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  return `${cleanSlug}/${cleanPhase}-${baseName}`;
}

export function prepareChecklistUpsertRows(
  clientId,
  existingRows = [],
  incomingItems = [],
  forceBaseline = false,
  nowIso = new Date().toISOString()
) {
  const existingMap = new Map(existingRows.map((row) => [row.item_key, row]));

  return incomingItems.map((item, idx) => {
    const existing = existingMap.get(item.item_key);
    const keepBefore = Boolean(existing) && !forceBaseline;

    const currentStatus = item.current_status || (existing ? existing.current_status : 'pendente');
    let completedAt = existing?.completed_at || null;
    if (currentStatus === 'otimizado' && !completedAt) {
      completedAt = item.completed_at || nowIso;
    } else if (currentStatus !== 'otimizado') {
      completedAt = null;
    }

    return {
      client_id: clientId,
      pillar: item.pillar || existing?.pillar || 'gbp',
      item_key: item.item_key,
      category_label: item.category_label || existing?.category_label || 'Geral',
      title: item.title || existing?.title || item.item_key,
      impact_level: item.impact_level || existing?.impact_level || 'alta',
      before_status: keepBefore ? existing.before_status : (item.before_status || 'ausente'),
      before_value: keepBefore ? existing.before_value : (item.before_value ?? null),
      current_status: currentStatus,
      current_value: item.current_value !== undefined ? item.current_value : (existing?.current_value ?? null),
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : (existing?.sort_order ?? idx + 1),
      completed_at: completedAt
    };
  });
}

export const mergeChecklistPreservingBefore = prepareChecklistUpsertRows;

export function normalizeSnapshotPayload(clientId, snapshot, baseDir = '') {
  return {
    client_id: clientId,
    period_key: snapshot.period_key,
    period_label: snapshot.period_label,
    snapshot_type: snapshot.snapshot_type || 'mensal',
    is_baseline: Boolean(snapshot.is_baseline),
    source: snapshot.source || 'agente_browser',
    gbp_metrics: snapshot.gbp_metrics || {},
    ads_metrics: snapshot.ads_metrics || {},
    site_metrics: snapshot.site_metrics || {},
    overall_status: snapshot.overall_status || (snapshot.is_baseline ? 'baseline' : 'estavel'),
    executive_summary: snapshot.executive_summary ?? null,
    collection_warnings: Array.isArray(snapshot.collection_warnings) ? snapshot.collection_warnings : [],
    recorded_at: snapshot.recorded_at || new Date().toISOString()
  };
}

export function mergeSnapshotsPreservingBaseline(
  clientId,
  existingSnapshots = [],
  incomingSnapshots = [],
  forceBaseline = false
) {
  const existingList = Array.isArray(existingSnapshots)
    ? existingSnapshots
    : (existingSnapshots ? [existingSnapshots] : []);
  const existingBaseline = existingList.find((s) => s && s.is_baseline);
  let baselineKey =
    existingBaseline && !forceBaseline
      ? `${existingBaseline.period_key}::${existingBaseline.snapshot_type}`
      : null;

  return incomingSnapshots.map((s) => {
    const normalized = normalizeSnapshotPayload(clientId, s);
    if (normalized.is_baseline) {
      const key = `${normalized.period_key}::${normalized.snapshot_type}`;
      if (baselineKey === null) {
        baselineKey = key;
      } else if (baselineKey !== key) {
        normalized.is_baseline = false;
      }
    }
    return normalized;
  });
}

export function buildDeterministicLogRef(
  log,
  fallbackDate = new Date().toISOString().slice(0, 10)
) {
  if (typeof log?.external_ref === 'string' && log.external_ref.trim().length > 0) {
    return log.external_ref.trim();
  }
  const datePart =
    typeof log?.occurred_at === 'string' && /^\d{4}-\d{2}-\d{2}/.test(log.occurred_at)
      ? log.occurred_at.slice(0, 10)
      : fallbackDate;
  const pillarPart =
    String(log?.pillar || 'gbp')
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'gbp';
  const titleSlug = String(log?.title || 'log')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '');
  return `auto-${datePart}-${pillarPart}-${titleSlug || 'log'}`;
}
