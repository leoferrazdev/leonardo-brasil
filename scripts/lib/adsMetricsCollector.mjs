import { getAdsIntegrationStatus, sanitizeCustomerId } from '../../server/google-ads-keywords.mjs';

function buildMonthDateRange(periodKey) {
  const match = /^(\d{4})-(\d{2})$/.exec(String(periodKey || '').trim());
  if (!match) {
    throw new Error(`periodKey inválido para consulta Ads: ${periodKey}`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const startDate = `${match[1]}-${match[2]}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${match[1]}-${match[2]}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
}

async function fetchAdsAccessToken({ env, fetchImpl }) {
  const response = await fetchImpl('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_ADS_CLIENT_ID?.trim() || '',
      client_secret: env.GOOGLE_ADS_CLIENT_SECRET?.trim() || '',
      refresh_token: env.GOOGLE_ADS_REFRESH_TOKEN?.trim() || '',
      grant_type: 'refresh_token'
    }).toString()
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Falha OAuth2 Google Ads.');
  }
  return data.access_token;
}

export async function collectMonthlyAdsMetrics({
  customerId,
  periodKey,
  env = process.env,
  fetchImpl = fetch
}) {
  const cleanId = sanitizeCustomerId(customerId);
  if (!cleanId) {
    return { ok: false, metrics: null, warning: 'Customer ID Google Ads não informado para o cliente.' };
  }

  const status = getAdsIntegrationStatus({ ...env, GOOGLE_ADS_CUSTOMER_ID: cleanId });
  if (!status.ready) {
    return {
      ok: false,
      metrics: null,
      warning: 'Credenciais Google Ads API (OAuth/Developer Token) ainda não completas no .env; usando métricas do agente/manual.'
    };
  }

  try {
    const { startDate, endDate } = buildMonthDateRange(periodKey);
    const accessToken = await fetchAdsAccessToken({ env, fetchImpl });
    const loginCustomerId = sanitizeCustomerId(env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || cleanId);

    const query = `
      SELECT
        campaign.id,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    `;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'developer-token': env.GOOGLE_ADS_DEVELOPER_TOKEN?.trim() || '',
      'Content-Type': 'application/json'
    };
    if (loginCustomerId) headers['login-customer-id'] = loginCustomerId;

    const res = await fetchImpl(
      `https://googleads.googleapis.com/v18/customers/${cleanId}/googleAds:search`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ query })
      }
    );

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error?.message || `Google Ads HTTP ${res.status}`);
    }

    const rows = Array.isArray(json.results) ? json.results : [];
    let impressions = 0;
    let clicks = 0;
    let costMicros = 0;
    let conversions = 0;
    const activeCampaignIds = new Set();

    for (const row of rows) {
      const m = row.metrics || {};
      impressions += Number(m.impressions || 0);
      clicks += Number(m.clicks || 0);
      costMicros += Number(m.costMicros || m.cost_micros || 0);
      conversions += Number(m.conversions || 0);
      if (
        (row.campaign?.status === 'ENABLED' || row.campaign?.status === 'enabled') &&
        row.campaign?.id
      ) {
        activeCampaignIds.add(String(row.campaign.id));
      }
    }

    const spendBrl = Number((costMicros / 1_000_000).toFixed(2));
    const ctrPct = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
    const cpcAvgBrl = clicks > 0 ? Number((spendBrl / clicks).toFixed(2)) : 0;
    const costPerConversionBrl = conversions > 0 ? Number((spendBrl / conversions).toFixed(2)) : 0;

    return {
      ok: true,
      metrics: {
        activeAccountId: cleanId,
        impressions,
        clicks,
        ctrPct,
        cpcAvgBrl,
        spendBrl,
        conversions: Number(conversions.toFixed(1)),
        costPerConversionBrl,
        activeCampaignsCount: activeCampaignIds.size,
        statusLabel: 'Sincronizado via Google Ads API'
      }
    };
  } catch (error) {
    return {
      ok: false,
      metrics: null,
      warning: `Google Ads API fallback (${error.message})`
    };
  }
}

export const collectMonthlyGoogleAdsMetrics = collectMonthlyAdsMetrics;
