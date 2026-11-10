const DEFAULT_TIMEOUT_MS = 8000;

export const DEFAULT_AUDITED_PATHS = ['/'];

async function fetchWithTimeout(fetchImpl, url, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'LeonardoBrasil-SiteAuditor/1.0 (+https://leonardobrasil.com.br)'
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchPageSpeedScore({ fetchImpl, targetUrl, strategy, apiKey }) {
  const params = new URLSearchParams({
    url: targetUrl,
    strategy,
    category: 'performance'
  });
  if (apiKey) params.set('key', apiKey);

  const response = await fetchWithTimeout(
    fetchImpl,
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
    15000
  );
  if (!response.ok) {
    try { await response.body?.cancel?.(); } catch {}
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  const rawScore = data?.lighthouseResult?.categories?.performance?.score;
  if (typeof rawScore !== 'number') {
    throw new Error('Score ausente na resposta');
  }
  return Math.round(rawScore * 100);
}

export function summarizeSiteMetricsFromAudit(auditResult) {
  return auditResult?.metrics || null;
}

export async function auditClientWebsite({
  baseUrl,
  monitoredPaths = ['/'],
  versionLabel = '',
  env = process.env,
  fetchImpl = fetch,
  skipPageSpeed = false
}) {
  const normalizedBase = String(baseUrl || '').trim().replace(/\/+$/, '');
  if (!normalizedBase) {
    return {
      metrics: { versionLabel, brokenUrlsCount: 0, httpOkCount: 0 },
      warnings: ['URL do site não configurada para auditoria automática.'],
      checkedUrls: []
    };
  }

  const paths = Array.from(
    new Set(
      (monitoredPaths.length ? monitoredPaths : ['/']).map((p) =>
        p.startsWith('/') ? p : `/${p}`
      )
    )
  );

  const checkedUrls = [];
  const brokenPaths = [];
  let httpOkCount = 0;
  let hasWhatsappCta = false;
  let homeTitleFound = false;

  for (const routePath of paths) {
    const fullUrl = routePath === '/' ? `${normalizedBase}/` : `${normalizedBase}${routePath}`;
    try {
      const res = await fetchWithTimeout(fetchImpl, fullUrl);
      const ok = res.status >= 200 && res.status < 400;
      checkedUrls.push({ url: fullUrl, path: routePath, status: res.status, ok });
      if (ok) {
        httpOkCount += 1;
        if (routePath === '/') {
          const html = await res.text();
          homeTitleFound = /<title>[^<]+<\/title>/i.test(html);
          hasWhatsappCta = /(wa\.me\/|api\.whatsapp\.com|whatsapp)/i.test(html);
        } else {
          try { await res.body?.cancel?.(); } catch {}
        }
      } else {
        try { await res.body?.cancel?.(); } catch {}
        brokenPaths.push(routePath);
      }
    } catch (error) {
      checkedUrls.push({ url: fullUrl, path: routePath, status: 0, ok: false, error: error.message });
      brokenPaths.push(routePath);
    }
  }

  const warnings = [];
  if (!homeTitleFound && httpOkCount > 0) {
    warnings.push('Home sem tag <title> detectada na resposta HTML.');
  }

  let pagespeedMobile;
  let pagespeedDesktop;

  if (!skipPageSpeed) {
    const apiKey = env?.PAGESPEED_API_KEY?.trim() || '';
    const pageSpeedErrors = [];
    try {
      pagespeedMobile = await fetchPageSpeedScore({
        fetchImpl,
        targetUrl: `${normalizedBase}/`,
        strategy: 'mobile',
        apiKey
      });
    } catch (err) {
      pageSpeedErrors.push(`Mobile (${err.message})`);
    }

    try {
      pagespeedDesktop = await fetchPageSpeedScore({
        fetchImpl,
        targetUrl: `${normalizedBase}/`,
        strategy: 'desktop',
        apiKey
      });
    } catch (err) {
      pageSpeedErrors.push(`Desktop (${err.message})`);
    }

    if (pageSpeedErrors.length > 0) {
      warnings.push(`PageSpeed indisponível (${pageSpeedErrors.join('; ')}).`);
    }
  }

  const metrics = {
    ...(versionLabel ? { versionLabel } : {}),
    targetUrl: `${normalizedBase}/`,
    httpOkCount,
    brokenUrlsCount: brokenPaths.length,
    brokenPaths,
    hasSsl: normalizedBase.startsWith('https://'),
    hasWhatsappCta,
    ...(typeof pagespeedMobile === 'number' ? { pagespeedMobile } : {}),
    ...(typeof pagespeedDesktop === 'number' ? { pagespeedDesktop } : {})
  };

  return { metrics, warnings, checkedUrls };
}

export const auditWebsite = auditClientWebsite;
