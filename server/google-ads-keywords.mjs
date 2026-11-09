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

export function getNicheBenchmark(seedKeywords = []) {
  const text = (Array.isArray(seedKeywords) ? seedKeywords.join(' ') : String(seedKeywords)).toLowerCase();

  if (/\b(odonto|dentist|implant|clareament|aparelho|ortodont|protese|invisalign|faceta|canal)\b/i.test(text)) {
    return {
      niche: 'odontologia',
      volumeMultiplier: 2.2,
      cpcMin: 4.8,
      cpcMax: 16.5,
      compBase: 'HIGH',
      compIdx: 86,
      specificTerms: [
        'implante dentário valor',
        'dentista 24 horas emergência',
        'aparelho invisível preço',
        'clareamento dental a laser',
        'prótese protocolo dentária',
        'consulta avaliação dentista'
      ]
    };
  }

  if (/\b(advoga|juridic|direito|processo|oab|trabalhista|previdenciar|divorcio|pensao|criminal)\b/i.test(text)) {
    return {
      niche: 'advocacia',
      volumeMultiplier: 1.15,
      cpcMin: 9.8,
      cpcMax: 34.5,
      compBase: 'HIGH',
      compIdx: 93,
      specificTerms: [
        'advogado trabalhista urgente',
        'advogado divórcio e pensão',
        'aposentadoria inss especialista',
        'escritório de advocacia consulta',
        'dar entrada processo trabalhista',
        'advogado online whatsapp'
      ]
    };
  }

  if (/\b(medic|clinica medica|consulta|dermatolog|psiquiatr|pediatr|cardiolog|ortoped|oftalmo|cirurgi|exame)\b/i.test(text)) {
    return {
      niche: 'medicina',
      volumeMultiplier: 1.7,
      cpcMin: 3.9,
      cpcMax: 12.8,
      compBase: 'HIGH',
      compIdx: 82,
      specificTerms: [
        'consulta médica particular hoje',
        'clínica médica agendamento rápido',
        'médico especialista consulta',
        'checkup médico exames',
        'consulta particular valor'
      ]
    };
  }

  if (/\b(veterin|pet|cachorro|gato|castra|vacina|clinica pet)\b/i.test(text)) {
    return {
      niche: 'veterinaria',
      volumeMultiplier: 1.3,
      cpcMin: 2.15,
      cpcMax: 5.95,
      compBase: 'HIGH',
      compIdx: 77,
      specificTerms: [
        'veterinário 24 horas emergência',
        'hospital veterinário pronto socorro',
        'consulta cão e gato particular',
        'vacina v10 filhote preço',
        'castração segura veterinária'
      ]
    };
  }

  if (/\b(oficina|mecanic|carro|auto|motor|pneu|freio|suspens|troca de oleo|eletrica auto)\b/i.test(text)) {
    return {
      niche: 'mecanica',
      volumeMultiplier: 1.25,
      cpcMin: 1.95,
      cpcMax: 5.4,
      compBase: 'MEDIUM',
      compIdx: 68,
      specificTerms: [
        'mecânica automotiva revisão geral',
        'socorro auto elétrico rápido',
        'troca de freio e suspensão carro',
        'oficina mecânica de confiança',
        'revisão motor e injeção'
      ]
    };
  }

  if (/\b(restaurant|comida|almoco|jantar|pizz|hamburg|buffet|rodizio|gastronom|lanche|bar)\b/i.test(text)) {
    return {
      niche: 'restaurante',
      volumeMultiplier: 3.6,
      cpcMin: 0.95,
      cpcMax: 2.65,
      compBase: 'MEDIUM',
      compIdx: 58,
      specificTerms: [
        'melhor restaurante para almoçar',
        'restaurante almoço executivo buffet',
        'reserva mesa jantar a dois',
        'rodízio completo promoção',
        'restaurante perto de mim agora'
      ]
    };
  }

  // Cálculo determinístico para termos personalizados
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);
  const volMulti = 0.85 + ((posHash % 100) / 100) * 1.3;
  const cpcMin = Number((1.6 + ((posHash % 50) / 20)).toFixed(2));
  const cpcMax = Number((cpcMin + 2.4 + ((posHash % 80) / 12)).toFixed(2));

  return {
    niche: 'personalizado',
    volumeMultiplier: volMulti,
    cpcMin,
    cpcMax,
    compBase: 'MEDIUM',
    compIdx: 55 + (posHash % 25),
    specificTerms: []
  };
}

async function generateFallbackIdeas({ fetchImpl, seedKeywords, geo, neighborhood }) {
  const seeds = (seedKeywords.length ? seedKeywords : ['serviço local'])
    .map((s) => String(s || '').trim().toLowerCase())
    .filter(Boolean);
  const primary = seeds[0] || 'serviço local';
  const cityShort = geo.name.split(',')[0].trim().toLowerCase();
  const neighborhoodClean = (neighborhood || '').trim().toLowerCase();
  const benchmark = getNicheBenchmark(seeds);

  let autocompleteSuggestions = [];
  try {
    const suggestPromises = seeds.slice(0, 3).map(async (seed) => {
      const suggestUrl = `https://suggestqueries.google.com/complete/search?client=firefox&hl=pt-BR&gl=br&q=${encodeURIComponent(`${seed} ${cityShort}`)}`;
      const res = await fetchImpl(suggestUrl);
      if (res.ok) {
        const json = await res.json();
        return Array.isArray(json?.[1]) ? json[1].slice(0, 4) : [];
      }
      return [];
    });
    const results = await Promise.all(suggestPromises);
    autocompleteSuggestions = results.flat();
  } catch {
    // Segue com os templates determinísticos locais se offline
  }

  const seen = new Set();
  const ideas = [];

  // 1. Processa cada uma das sementes informadas pelo usuário
  for (const seed of seeds.slice(0, 4)) {
    const seedTemplates = [
      { suffix: '', baseVol: 2200, comp: benchmark.compBase, compIdx: benchmark.compIdx, lowMod: 1.0, highMod: 1.0 },
      { suffix: cityShort, baseVol: 1700, comp: benchmark.compBase, compIdx: benchmark.compIdx + 3, lowMod: 1.1, highMod: 1.15 },
      ...(neighborhoodClean
        ? [
            { suffix: `${neighborhoodClean} ${cityShort}`, baseVol: 520, comp: 'MEDIUM', compIdx: 58, lowMod: 0.95, highMod: 0.9 },
            { suffix: `no bairro ${neighborhoodClean}`, baseVol: 340, comp: 'LOW', compIdx: 42, lowMod: 0.85, highMod: 0.8 }
          ]
        : []),
      { suffix: 'perto de mim', baseVol: 1450, comp: benchmark.compBase, compIdx: benchmark.compIdx + 4, lowMod: 1.15, highMod: 1.2 },
      { suffix: 'preço consulta', baseVol: 780, comp: 'MEDIUM', compIdx: 68, lowMod: 0.9, highMod: 0.95 },
      { suffix: 'quanto custa', baseVol: 650, comp: 'MEDIUM', compIdx: 62, lowMod: 0.85, highMod: 0.88 },
      { suffix: 'telefone whatsapp', baseVol: 490, comp: 'MEDIUM', compIdx: 65, lowMod: 1.05, highMod: 1.05 },
      { suffix: 'urgente 24 horas', baseVol: 620, comp: benchmark.compBase, compIdx: benchmark.compIdx + 6, lowMod: 1.35, highMod: 1.4 }
    ];

    for (const tpl of seedTemplates) {
      const keyword = `${seed} ${tpl.suffix}`.trim().replace(/\s+/g, ' ');
      if (seen.has(keyword)) continue;
      seen.add(keyword);

      const avgMonthlySearches = Math.max(
        30,
        Math.round((tpl.baseVol * benchmark.volumeMultiplier * geo.populationFactor) / 10) * 10
      );
      const lowBid = Number((benchmark.cpcMin * tpl.lowMod).toFixed(2));
      const highBid = Number((benchmark.cpcMax * tpl.highMod).toFixed(2));
      const classification = classifyKeyword(keyword, geo.name, neighborhood);

      ideas.push({
        keyword,
        avgMonthlySearches,
        competition: tpl.comp,
        competitionIndex: Math.min(100, Math.max(10, tpl.compIdx)),
        lowTopOfPageBidBrl: lowBid,
        highTopOfPageBidBrl: highBid,
        intent: classification.intent,
        adGroupCluster: classification.adGroupCluster,
        monthlySearchVolumes: MONTHS_PT.map((m) => ({
          month: m.label,
          year: 2026,
          searches: Math.max(10, Math.round(avgMonthlySearches * m.factor))
        }))
      });
    }
  }

  // 2. Termos específicos do nicho calibrados
  for (const term of benchmark.specificTerms) {
    const termWithGeo = `${term} ${cityShort}`;
    if (!seen.has(termWithGeo)) {
      seen.add(termWithGeo);
      const avgMonthlySearches = Math.max(
        40,
        Math.round((950 * benchmark.volumeMultiplier * geo.populationFactor) / 10) * 10
      );
      const classification = classifyKeyword(termWithGeo, geo.name, neighborhood);
      ideas.push({
        keyword: termWithGeo,
        avgMonthlySearches,
        competition: benchmark.compBase,
        competitionIndex: benchmark.compIdx,
        lowTopOfPageBidBrl: benchmark.cpcMin,
        highTopOfPageBidBrl: benchmark.cpcMax,
        intent: classification.intent,
        adGroupCluster: classification.adGroupCluster,
        monthlySearchVolumes: MONTHS_PT.map((m) => ({
          month: m.label,
          year: 2026,
          searches: Math.max(10, Math.round(avgMonthlySearches * m.factor))
        }))
      });
    }
  }

  // 3. Sugestões de autocomplete em tempo real do Google
  for (const suggestion of autocompleteSuggestions) {
    const clean = String(suggestion || '').trim().toLowerCase();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);

    const avgMonthlySearches = Math.max(
      40,
      Math.round((480 * benchmark.volumeMultiplier * geo.populationFactor) / 10) * 10
    );
    const classification = classifyKeyword(clean, geo.name, neighborhood);
    ideas.push({
      keyword: clean,
      avgMonthlySearches,
      competition: 'MEDIUM',
      competitionIndex: 60,
      lowTopOfPageBidBrl: Number((benchmark.cpcMin * 0.9).toFixed(2)),
      highTopOfPageBidBrl: Number((benchmark.cpcMax * 0.95).toFixed(2)),
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
