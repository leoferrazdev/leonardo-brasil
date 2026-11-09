import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export const GEO_TARGETS = {
  'porto-alegre': { id: '1001706', name: 'Porto Alegre, RS', state: 'RS', populationFactor: 1.0 },
  'sao-paulo': { id: '1001773', name: 'São Paulo, SP', state: 'SP', populationFactor: 4.8 },
  'rio-de-janeiro': { id: '1001634', name: 'Rio de Janeiro, RJ', state: 'RJ', populationFactor: 2.9 },
  'curitiba': { id: '1001686', name: 'Curitiba, PR', state: 'PR', populationFactor: 1.25 },
  'florianopolis': { id: '1001729', name: 'Florianópolis, SC', state: 'SC', populationFactor: 0.65 },
  'belo-horizonte': { id: '1001566', name: 'Belo Horizonte, MG', state: 'MG', populationFactor: 1.55 },
  'campinas': { id: '1001741', name: 'Campinas, SP', state: 'SP', populationFactor: 0.85 },
  'balneario-camboriu': { id: '1001722', name: 'Balneário Camboriú, SC', state: 'SC', populationFactor: 0.45 },
  'brasil': { id: '2076', name: 'Brasil (Nacional)', state: 'BR', populationFactor: 14.0 }
};

const MONTHS_PT = [
  { key: 'JANUARY', label: 'Jan', factor: 0.94 },
  { key: 'FEBRUARY', label: 'Fev', factor: 0.91 },
  { key: 'MARCH', label: 'Mar', factor: 1.04 },
  { key: 'APRIL', label: 'Abr', factor: 1.02 },
  { key: 'MAY', label: 'Mai', factor: 1.05 },
  { key: 'JUNE', label: 'Jun', factor: 0.98 },
  { key: 'JULY', label: 'Jul', factor: 0.96 },
  { key: 'AUGUST', label: 'Ago', factor: 1.06 },
  { key: 'SEPTEMBER', label: 'Set', factor: 1.08 },
  { key: 'OCTOBER', label: 'Out', factor: 1.07 },
  { key: 'NOVEMBER', label: 'Nov', factor: 1.03 },
  { key: 'DECEMBER', label: 'Dez', factor: 0.88 }
];

export function sanitizeCustomerId(raw = '') {
  return String(raw || '').replace(/\D+/g, '');
}

export function getAdsIntegrationStatus(env = process.env) {
  const developerToken = Boolean(env.GOOGLE_ADS_DEVELOPER_TOKEN?.trim());
  const clientId = Boolean(env.GOOGLE_ADS_CLIENT_ID?.trim());
  const clientSecret = Boolean(env.GOOGLE_ADS_CLIENT_SECRET?.trim());
  const refreshToken = Boolean(env.GOOGLE_ADS_REFRESH_TOKEN?.trim());
  const loginCustomerId = Boolean(sanitizeCustomerId(env.GOOGLE_ADS_LOGIN_CUSTOMER_ID));
  const customerId = Boolean(sanitizeCustomerId(env.GOOGLE_ADS_CUSTOMER_ID || env.GOOGLE_ADS_LOGIN_CUSTOMER_ID));

  const ready = developerToken && clientId && clientSecret && refreshToken && customerId;

  return {
    ready,
    mode: ready ? 'google-ads-api' : 'local-intelligence-fallback',
    configured: {
      developerToken,
      clientId,
      clientSecret,
      refreshToken,
      loginCustomerId,
      customerId
    },
    masked: {
      loginCustomerId: sanitizeCustomerId(env.GOOGLE_ADS_LOGIN_CUSTOMER_ID) || null,
      customerId: sanitizeCustomerId(env.GOOGLE_ADS_CUSTOMER_ID || env.GOOGLE_ADS_LOGIN_CUSTOMER_ID) || null,
      hasClientId: clientId,
      hasDeveloperToken: developerToken,
      hasRefreshToken: refreshToken
    }
  };
}

export function buildGoogleAdsOAuthUrl({ env = process.env, redirectUri }) {
  const clientId = env.GOOGLE_ADS_CLIENT_ID?.trim();
  if (!clientId) {
    throw new Error('GOOGLE_ADS_CLIENT_ID não configurado.');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/adwords',
    access_type: 'offline',
    prompt: 'consent'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleAdsOAuthCode({ env = process.env, fetchImpl = fetch, code, redirectUri }) {
  const clientId = env.GOOGLE_ADS_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_ADS_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_ADS_CLIENT_ID e GOOGLE_ADS_CLIENT_SECRET são obrigatórios para trocar o código OAuth.');
  }

  const response = await fetchImpl('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }).toString()
  });

  const data = await response.json();
  if (!response.ok || !data.refresh_token) {
    throw new Error(data.error_description || data.error || 'Não foi possível obter o refresh_token do Google.');
  }

  return data;
}

export function persistEnvVariables(envFilePath, updates = {}, runtimeEnv = process.env) {
  let content = existsSync(envFilePath) ? readFileSync(envFilePath, 'utf8') : '';
  const lines = content.split(/\r?\n/);

  for (const [key, rawValue] of Object.entries(updates)) {
    if (rawValue === undefined || rawValue === null) continue;
    const value = String(rawValue).trim();
    if (!value) continue;

    runtimeEnv[key] = value;
    const lineIndex = lines.findIndex((line) => line.startsWith(`${key}=`));
    if (lineIndex >= 0) {
      lines[lineIndex] = `${key}=${value}`;
    } else {
      lines.push(`${key}=${value}`);
    }
  }

  const normalized = lines.filter((line, idx, arr) => !(line === '' && idx === arr.length - 1)).join('\n') + '\n';
  writeFileSync(envFilePath, normalized, 'utf8');
}

export function classifyKeyword(keyword, cityLabel = '', neighborhood = '') {
  const lower = keyword.toLowerCase();
  const cityToken = cityLabel.split(',')[0].trim().toLowerCase();
  const neighborhoodToken = neighborhood.trim().toLowerCase();

  const isUrgent = /\b(24h|24 horas|urgente|emerg[eê]ncia|plant[aã]o|agora|hoje|telefone|whatsapp|agendar|contato)\b/i.test(lower);
  const isPrice = /\b(pre[cç]o|valor|quanto custa|or[cç]amento|consulta|barato|particular|tabela|plano)\b/i.test(lower);
  const isGeo =
    (cityToken && lower.includes(cityToken)) ||
    (neighborhoodToken && lower.includes(neighborhoodToken)) ||
    /\b(perto de mim|pr[oó]ximo|zona sul|zona norte|zona leste|zona oeste|centro|bairro)\b/i.test(lower);
  const isInformational = /\b(como|o que [eé]|d[uú]vida|sintomas|pode|caseiro|curso|faculdade|vaga)\b/i.test(lower);

  if (isUrgent) {
    return {
      intent: 'transacional',
      adGroupCluster: '01. Urgência & Atendimento Imediato'
    };
  }

  if (isPrice) {
    return {
      intent: 'comercial',
      adGroupCluster: '02. Preço, Valor & Consulta'
    };
  }

  if (isGeo) {
    return {
      intent: 'local',
      adGroupCluster: '03. Localização & Proximidade'
    };
  }

  if (isInformational) {
    return {
      intent: 'informacional',
      adGroupCluster: '05. Pesquisa Institucional & Dúvidas'
    };
  }

  return {
    intent: 'transacional',
    adGroupCluster: '04. Especialidade & Procedimentos'
  };
}

export function generateNegativeKeywords(seedKeywords = []) {
  const joined = seedKeywords.join(' ').toLowerCase();
  const baseNegatives = [
    'grátis',
    'gratuito',
    'sus',
    'prefeitura',
    'público',
    'popular gratuito',
    'curso',
    'faculdade',
    'pós graduação',
    'salário',
    'vaga',
    'vagas',
    'emprego',
    'trabalhe conosco',
    'estágio',
    'concurso',
    'como fazer',
    'caseiro',
    'pdf',
    'livro',
    'artigo',
    'wikipedia',
    'reclame aqui',
    'procon'
  ];

  if (joined.includes('veterin') || joined.includes('pet')) {
    baseNegatives.push('adoção', 'doação', 'ong', 'resgate', 'hospital veterinário público', 'ufgrs');
  } else if (joined.includes('odonto') || joined.includes('dentista') || joined.includes('implante')) {
    baseNegatives.push('faculdade de odontologia', 'atendimento gratuito', ' posto de saúde');
  } else if (joined.includes('advoga') || joined.includes('jurídic')) {
    baseNegatives.push('defensoria pública', 'oab prova', 'modelo de petição', 'jusbrasil');
  } else if (joined.includes('oficina') || joined.includes('mecânic')) {
    baseNegatives.push('peças usadas', 'ferro velho', 'desmanche', 'manual pdf', 'curso de mecânica');
  }

  return Array.from(new Set(baseNegatives.map((item) => item.trim())));
}

async function fetchGoogleAccessToken({ env, fetchImpl }) {
  const response = await fetchImpl('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_ADS_CLIENT_ID.trim(),
      client_secret: env.GOOGLE_ADS_CLIENT_SECRET.trim(),
      refresh_token: env.GOOGLE_ADS_REFRESH_TOKEN.trim(),
      grant_type: 'refresh_token'
    }).toString()
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Falha ao renovar access_token do Google Ads.');
  }

  return data.access_token;
}

function buildSummary(ideas = []) {
  const totalMonthlySearches = ideas.reduce((acc, item) => acc + (item.avgMonthlySearches || 0), 0);
  const highIntentSearches = ideas
    .filter((item) => item.intent === 'transacional' || item.intent === 'local')
    .reduce((acc, item) => acc + (item.avgMonthlySearches || 0), 0);

  const validBids = ideas.filter((item) => item.lowTopOfPageBidBrl > 0);
  const avgLowCpcBrl = validBids.length
    ? Number((validBids.reduce((acc, i) => acc + i.lowTopOfPageBidBrl, 0) / validBids.length).toFixed(2))
    : 1.85;
  const avgHighCpcBrl = validBids.length
    ? Number((validBids.reduce((acc, i) => acc + i.highTopOfPageBidBrl, 0) / validBids.length).toFixed(2))
    : 4.9;

  return {
    totalKeywords: ideas.length,
    totalMonthlySearches,
    highIntentSearches,
    avgLowCpcBrl,
    avgHighCpcBrl,
    recommendedDailyBudgetBrl: Math.max(25, Math.round(avgHighCpcBrl * 8))
  };
}

async function requestOfficialGoogleAdsIdeas({ env, fetchImpl, seedKeywords, pageUrl, geo, neighborhood }) {
  const accessToken = await fetchGoogleAccessToken({ env, fetchImpl });
  const customerId = sanitizeCustomerId(env.GOOGLE_ADS_CUSTOMER_ID || env.GOOGLE_ADS_LOGIN_CUSTOMER_ID);
  const loginCustomerId = sanitizeCustomerId(env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || customerId);

  const expandedSeeds = [...seedKeywords];
  if (neighborhood && seedKeywords[0]) {
    expandedSeeds.push(`${seedKeywords[0]} ${neighborhood.trim()}`);
  }

  const payload = {
    language: 'languageConstants/1014',
    geoTargetConstants: [`geoTargetConstants/${geo.id}`],
    includeAdultKeywords: false,
    keywordPlanNetwork: 'GOOGLE_SEARCH_AND_PARTNERS'
  };

  if (expandedSeeds.length > 0 && pageUrl) {
    payload.keywordAndUrlSeed = { keywords: expandedSeeds.slice(0, 10), url: pageUrl };
  } else if (expandedSeeds.length > 0) {
    payload.keywordSeed = { keywords: expandedSeeds.slice(0, 10) };
  } else if (pageUrl) {
    payload.urlSeed = { url: pageUrl };
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': env.GOOGLE_ADS_DEVELOPER_TOKEN.trim(),
    'Content-Type': 'application/json'
  };

  if (loginCustomerId) {
    headers['login-customer-id'] = loginCustomerId;
  }

  const response = await fetchImpl(
    `https://googleads.googleapis.com/v18/customers/${customerId}:generateKeywordIdeas`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();
  if (!response.ok) {
    const apiMessage = data?.error?.message || 'Erro retornado pela API do Google Ads.';
    const error = new Error(apiMessage);
    error.status = response.status;
    error.details = data?.error;
    throw error;
  }

  const results = Array.isArray(data.results) ? data.results : [];
  return results.map((entry) => {
    const keyword = entry.text || '';
    const metrics = entry.keywordIdeaMetrics || {};
    const avgMonthlySearches = Number(metrics.avgMonthlySearches || 0);
    const competition = metrics.competition || 'MEDIUM';
    const competitionIndex = Number(metrics.competitionIndex || 50);
    const lowTopOfPageBidBrl = Number(((Number(metrics.lowTopOfPageBidMicros || 0)) / 1_000_000).toFixed(2));
    const highTopOfPageBidBrl = Number(((Number(metrics.highTopOfPageBidMicros || 0)) / 1_000_000).toFixed(2));
    const classification = classifyKeyword(keyword, geo.name, neighborhood);

    const rawVolumes = Array.isArray(metrics.monthlySearchVolumes) ? metrics.monthlySearchVolumes : [];
    const monthlySearchVolumes =
      rawVolumes.length > 0
        ? rawVolumes.slice(-12).map((m) => ({
            month: String(m.month || '').slice(0, 3),
            year: Number(m.year || 2026),
            searches: Number(m.monthlySearches || 0)
          }))
        : MONTHS_PT.map((m) => ({
            month: m.label,
            year: 2026,
            searches: Math.max(10, Math.round(avgMonthlySearches * m.factor))
          }));

    return {
      keyword,
      avgMonthlySearches,
      competition,
      competitionIndex,
      lowTopOfPageBidBrl: lowTopOfPageBidBrl || 1.5,
      highTopOfPageBidBrl: highTopOfPageBidBrl || 4.2,
      intent: classification.intent,
      adGroupCluster: classification.adGroupCluster,
      monthlySearchVolumes
    };
  });
}

async function generateFallbackIdeas({ fetchImpl, seedKeywords, geo, neighborhood }) {
  const primary = (seedKeywords[0] || 'serviço local').trim().toLowerCase();
  const cityShort = geo.name.split(',')[0].trim().toLowerCase();
  const neighborhoodClean = (neighborhood || '').trim().toLowerCase();

  let autocompleteSuggestions = [];
  try {
    const suggestUrl = `https://suggestqueries.google.com/complete/search?client=firefox&hl=pt-BR&gl=br&q=${encodeURIComponent(`${primary} ${cityShort}`)}`;
    const res = await fetchImpl(suggestUrl);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.[1])) {
        autocompleteSuggestions = json[1].slice(0, 6);
      }
    }
  } catch {
    // Segue com os templates determinísticos locais se offline
  }

  const baseTemplates = [
    { suffix: '', baseVol: 2400, comp: 'HIGH', compIdx: 78, lowBid: 2.1, highBid: 5.4 },
    { suffix: cityShort, baseVol: 1600, comp: 'HIGH', compIdx: 81, lowBid: 2.35, highBid: 6.1 },
    ...(neighborhoodClean
      ? [
          { suffix: `${neighborhoodClean} ${cityShort}`, baseVol: 480, comp: 'MEDIUM', compIdx: 54, lowBid: 1.9, highBid: 4.5 },
          { suffix: `no bairro ${neighborhoodClean}`, baseVol: 320, comp: 'LOW', compIdx: 38, lowBid: 1.65, highBid: 3.8 }
        ]
      : []),
    { suffix: 'perto de mim', baseVol: 1350, comp: 'HIGH', compIdx: 84, lowBid: 2.5, highBid: 6.4 },
    { suffix: '24 horas', baseVol: 890, comp: 'HIGH', compIdx: 88, lowBid: 3.1, highBid: 7.9 },
    { suffix: 'urgente agora', baseVol: 540, comp: 'HIGH', compIdx: 79, lowBid: 2.9, highBid: 7.2 },
    { suffix: 'preço consulta', baseVol: 720, comp: 'MEDIUM', compIdx: 64, lowBid: 1.8, highBid: 4.4 },
    { suffix: 'quanto custa', baseVol: 610, comp: 'MEDIUM', compIdx: 58, lowBid: 1.6, highBid: 3.9 },
    { suffix: 'telefone whatsapp', baseVol: 460, comp: 'MEDIUM', compIdx: 62, lowBid: 2.2, highBid: 5.3 },
    { suffix: 'especialista particular', baseVol: 390, comp: 'MEDIUM', compIdx: 60, lowBid: 2.4, highBid: 5.9 },
    { suffix: `zona sul ${cityShort}`, baseVol: 510, comp: 'MEDIUM', compIdx: 57, lowBid: 1.95, highBid: 4.8 },
    { suffix: 'avaliações e indicação', baseVol: 290, comp: 'LOW', compIdx: 34, lowBid: 1.3, highBid: 3.1 }
  ];

  const seen = new Set();
  const ideas = [];

  for (const tpl of baseTemplates) {
    const keyword = `${primary} ${tpl.suffix}`.trim().replace(/\s+/g, ' ');
    if (seen.has(keyword)) continue;
    seen.add(keyword);

    const avgMonthlySearches = Math.max(
      30,
      Math.round((tpl.baseVol * geo.populationFactor) / 10) * 10
    );
    const classification = classifyKeyword(keyword, geo.name, neighborhood);

    ideas.push({
      keyword,
      avgMonthlySearches,
      competition: tpl.comp,
      competitionIndex: tpl.compIdx,
      lowTopOfPageBidBrl: tpl.lowBid,
      highTopOfPageBidBrl: tpl.highBid,
      intent: classification.intent,
      adGroupCluster: classification.adGroupCluster,
      monthlySearchVolumes: MONTHS_PT.map((m) => ({
        month: m.label,
        year: 2026,
        searches: Math.max(10, Math.round(avgMonthlySearches * m.factor))
      }))
    });
  }

  for (const suggestion of autocompleteSuggestions) {
    const clean = String(suggestion || '').trim().toLowerCase();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);

    const avgMonthlySearches = Math.max(40, Math.round(420 * geo.populationFactor));
    const classification = classifyKeyword(clean, geo.name, neighborhood);
    ideas.push({
      keyword: clean,
      avgMonthlySearches,
      competition: 'MEDIUM',
      competitionIndex: 55,
      lowTopOfPageBidBrl: 1.85,
      highTopOfPageBidBrl: 4.6,
      intent: classification.intent,
      adGroupCluster: classification.adGroupCluster,
      monthlySearchVolumes: MONTHS_PT.map((m) => ({
        month: m.label,
        year: 2026,
        searches: Math.max(10, Math.round(avgMonthlySearches * m.factor))
      }))
    });
  }

  return ideas.sort((a, b) => b.avgMonthlySearches - a.avgMonthlySearches);
}

export async function generateKeywordIdeas({
  env = process.env,
  fetchImpl = fetch,
  keywords = [],
  pageUrl = '',
  citySlug = 'porto-alegre',
  neighborhood = ''
}) {
  const seedKeywords = (Array.isArray(keywords) ? keywords : [keywords])
    .map((k) => String(k || '').trim())
    .filter(Boolean);

  if (seedKeywords.length === 0 && !pageUrl) {
    const err = new Error('Informe ao menos uma palavra-chave ou URL para pesquisa.');
    err.status = 400;
    throw err;
  }

  const geo = GEO_TARGETS[citySlug] || GEO_TARGETS['porto-alegre'];
  const status = getAdsIntegrationStatus(env);
  const negativeKeywords = generateNegativeKeywords(seedKeywords);

  if (status.ready) {
    try {
      const ideas = await requestOfficialGoogleAdsIdeas({
        env,
        fetchImpl,
        seedKeywords,
        pageUrl,
        geo,
        neighborhood
      });
      return {
        source: 'google-ads-api',
        location: { slug: citySlug, ...geo, neighborhood: neighborhood || null },
        ideas,
        summary: buildSummary(ideas),
        negativeKeywords
      };
    } catch (error) {
      const fallbackIdeas = await generateFallbackIdeas({ fetchImpl, seedKeywords, geo, neighborhood });
      return {
        source: 'local-intelligence-fallback',
        apiWarning: error.message || 'Falha ao consultar API oficial do Google Ads; exibindo estimativa local.',
        location: { slug: citySlug, ...geo, neighborhood: neighborhood || null },
        ideas: fallbackIdeas,
        summary: buildSummary(fallbackIdeas),
        negativeKeywords
      };
    }
  }

  const ideas = await generateFallbackIdeas({ fetchImpl, seedKeywords, geo, neighborhood });
  return {
    source: 'local-intelligence-fallback',
    location: { slug: citySlug, ...geo, neighborhood: neighborhood || null },
    ideas,
    summary: buildSummary(ideas),
    negativeKeywords
  };
}
