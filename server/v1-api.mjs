import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { CITIES_COUNT, NICHES_CATALOG } from './routes-manifest.mjs';

export const BASE_URL = 'https://leonardobrasil.com.br';
export const API_VERSION = '1.0.0';
export const LEGACY_SUNSET_HTTP_DATE = 'Fri, 31 Dec 2027 23:59:59 GMT';

export const SUPPORTED_SCOPES = Object.freeze({
  'health:read': 'Consultar status operacional e metadados de versão da API v1.',
  'catalog:read': 'Consultar catálogo de serviços, nichos atendidos e matriz de auditoria.',
  'audit:write': 'Executar cálculo diagnóstico do perfil no Google Meu Negócio (0 a 100).'
});

export const ALL_SCOPE_NAMES = Object.keys(SUPPORTED_SCOPES);

export const AUDIT_PILLARS = [
  {
    id: 'category',
    title: 'Categoria Primária Exata',
    weight: 20,
    recommendation: 'Defina a categoria primária que corresponde exatamente ao serviço principal mais buscado na cidade.'
  },
  {
    id: 'nap',
    title: 'Consistência de Dados (NAP)',
    weight: 15,
    recommendation: 'Padronize Nome, Endereço e Telefone de forma idêntica entre Google Maps, site oficial e diretórios.'
  },
  {
    id: 'description',
    title: 'Descrição com SEO Local',
    weight: 15,
    recommendation: 'Preencha os 750 caracteres com serviços prioritários, diferenciais e bairros atendidos.'
  },
  {
    id: 'catalog',
    title: 'Catálogo de Serviços e Produtos',
    weight: 15,
    recommendation: 'Cadastre serviços individuais com descrição objetiva, fotos reais e link direto de contato.'
  },
  {
    id: 'reviews',
    title: 'Avaliações 5 Estrelas Ativas',
    weight: 20,
    recommendation: 'Implante rotina de pedido de avaliações após atendimentos e responda com contexto do serviço.'
  },
  {
    id: 'photos',
    title: 'Fotos Recentes e Fachada',
    weight: 15,
    recommendation: 'Publique fotos reais da equipe, estrutura física e fachada a cada 15 a 30 dias.'
  }
];

export const PUBLIC_SERVICES = [
  {
    id: 'google-meu-negocio',
    name: 'Otimização e Gestão de Google Meu Negócio',
    summary: 'Reestruturação técnica de perfil no Google Maps com foco nos 6 pilares de relevância local.',
    url: `${BASE_URL}/google-meu-negocio`,
    pricingModel: 'one-time-project'
  },
  {
    id: 'auditoria-perfil-google',
    name: 'Raio-X do Perfil no Google Maps',
    summary: 'Diagnóstico interativo de 0 a 100 baseado em 6 critérios técnicos do Perfil da Empresa no Google.',
    url: `${BASE_URL}/auditoria-perfil-google`,
    pricingModel: 'free'
  },
  {
    id: 'recuperar-perfil-suspenso-google',
    name: 'Recuperação de Perfil Suspenso no Google',
    summary: 'Auditoria de conformidade documental e preparação de recurso técnico para reativação.',
    url: `${BASE_URL}/recuperar-perfil-suspenso-google`,
    pricingModel: 'project'
  },
  {
    id: 'otimizacao-google-meu-negocio',
    name: 'Consultoria Especializada em SEO Local',
    summary: 'Posicionamento orgânico geolocalizado para profissionais liberais e serviços locais no Brasil.',
    url: `${BASE_URL}/otimizacao-google-meu-negocio`,
    pricingModel: 'project'
  }
];

export function sendProblem(
  response,
  { status, code, title, detail, hint, instance = '/', headers = {}, extra = {} }
) {
  for (const [key, value] of Object.entries(headers)) {
    response.setHeader(key, value);
  }
  response.setHeader('Content-Type', 'application/problem+json; charset=utf-8');
  response.status(status).json({
    type: `${BASE_URL}/docs#error-${encodeURIComponent(code)}`,
    title: title || 'Erro na requisição',
    status,
    detail,
    instance,
    code,
    message: detail,
    hint: hint || `Consulte a documentação em ${BASE_URL}/docs ou ${BASE_URL}/openapi.json.`,
    error: detail,
    ...extra
  });
}

function encodeBase64Url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input), 'utf8');
  return buf.toString('base64url');
}

function decodeBase64Url(encoded) {
  return Buffer.from(encoded, 'base64url').toString('utf8');
}

function signHmac(secret, data) {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

function safeEqualStrings(left, right) {
  const leftBuf = Buffer.from(String(left || ''), 'utf8');
  const rightBuf = Buffer.from(String(right || ''), 'utf8');
  if (leftBuf.length === 0 || leftBuf.length !== rightBuf.length) {
    return false;
  }
  return timingSafeEqual(leftBuf, rightBuf);
}

function parseScopesInput(rawScopes) {
  if (rawScopes === undefined || rawScopes === null || rawScopes === '') {
    return [...ALL_SCOPE_NAMES];
  }
  const tokens = Array.isArray(rawScopes)
    ? rawScopes.flatMap((entry) => String(entry).trim().split(/\s+/))
    : String(rawScopes).trim().split(/\s+/);
  const unique = [...new Set(tokens.filter(Boolean))];
  if (unique.length === 0) {
    return null;
  }
  for (const scope of unique) {
    if (!Object.hasOwn(SUPPORTED_SCOPES, scope)) {
      return { invalidScope: scope };
    }
  }
  return unique;
}

function createSignedJwt(secret, payload) {
  const headerPart = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadPart = encodeBase64Url(JSON.stringify(payload));
  const signature = signHmac(secret, `${headerPart}.${payloadPart}`);
  return `${headerPart}.${payloadPart}.${signature}`;
}

function verifySignedJwt(secret, token) {
  if (!token || typeof token !== 'string') {
    return null;
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }
  const [headerPart, payloadPart, signature] = parts;
  const expectedSig = signHmac(secret, `${headerPart}.${payloadPart}`);
  if (!safeEqualStrings(signature, expectedSig)) {
    return null;
  }
  try {
    const payload = JSON.parse(decodeBase64Url(payloadPart));
    if (!payload || typeof payload !== 'object') {
      return null;
    }
    const nowSec = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp <= nowSec) {
      return { expired: true };
    }
    return { valid: true, payload };
  } catch {
    return null;
  }
}

export function createRateLimiter({ windowMs = 60_000, max = 60, nowFn = Date.now } = {}) {
  const buckets = new Map();

  return function rateLimitMiddleware(request, response, next) {
    const forwardedFor = request.headers['x-forwarded-for'];
    const clientIp =
      request.headers['cf-connecting-ip'] ||
      (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : '') ||
      request.ip ||
      '127.0.0.1';

    const now = nowFn();
    let entry = buckets.get(clientIp);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      buckets.set(clientIp, entry);
      if (buckets.size > 2000) {
        for (const [key, item] of buckets.entries()) {
          if (item.resetAt <= now) {
            buckets.delete(key);
          }
        }
      }
    }

    entry.count += 1;
    const remaining = Math.max(0, max - entry.count);
    const resetSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

    response.setHeader('RateLimit-Limit', String(max));
    response.setHeader('RateLimit-Remaining', String(remaining));
    response.setHeader('RateLimit-Reset', String(resetSeconds));
    response.setHeader('RateLimit-Policy', `${max};w=${Math.ceil(windowMs / 1000)}`);

    if (entry.count > max) {
      sendProblem(response, {
        status: 429,
        code: 'rate_limit_exceeded',
        title: 'Limite de requisições excedido',
        detail: `O limite de ${max} requisições por janela de ${Math.ceil(windowMs / 1000)}s foi excedido.`,
        hint: `Aguarde ${resetSeconds} segundo(s) (cabeçalho Retry-After) antes de tentar novamente.`,
        instance: request.originalUrl,
        headers: { 'Retry-After': String(resetSeconds) },
        extra: { retryAfter: resetSeconds }
      });
      return;
    }

    next();
  };
}

export function versionHeaderMiddleware(request, response, next) {
  const requestedVersion = request.headers['x-api-version'];
  if (requestedVersion !== undefined) {
    const normalized = String(requestedVersion).trim().toLowerCase();
    if (!['1', '1.0', '1.0.0', 'v1'].includes(normalized)) {
      sendProblem(response, {
        status: 400,
        code: 'unsupported_api_version',
        title: 'Versão de API não suportada',
        detail: `A versão '${requestedVersion}' informada em X-API-Version não é suportada.`,
        hint: 'Use rotas sob /api/v1/ com X-API-Version: 1 ou omita o cabeçalho.',
        instance: request.originalUrl
      });
      return;
    }
  }

  response.setHeader('API-Version', API_VERSION);
  response.setHeader('X-API-Version', 'v1');
  response.setHeader('X-API-Deprecation-Policy', `${BASE_URL}/docs#versioning`);
  next();
}

function parseClientCredentials(request) {
  const authHeader = request.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Basic ')) {
    const encoded = authHeader.slice(6).trim();
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const separator = decoded.indexOf(':');
    if (separator > 0) {
      return {
        clientId: decoded.slice(0, separator),
        clientSecret: decoded.slice(separator + 1)
      };
    }
  }

  return {
    clientId: String(request.body?.client_id || '').trim(),
    clientSecret: String(request.body?.client_secret || '').trim()
  };
}

export function createV1ApiContext({ env = process.env } = {}) {
  const signingSecret = env.OAUTH_SIGNING_SECRET || randomBytes(32).toString('hex');

  function getOAuthAuthorizationServerMetadata() {
    return {
      issuer: BASE_URL,
      token_endpoint: `${BASE_URL}/api/v1/oauth/token`,
      registration_endpoint: `${BASE_URL}/api/v1/oauth/sandbox-clients`,
      grant_types_supported: ['client_credentials'],
      token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
      scopes_supported: ALL_SCOPE_NAMES,
      response_types_supported: ['token'],
      service_documentation: `${BASE_URL}/docs`
    };
  }

  function getOAuthProtectedResourceMetadata() {
    return {
      resource: `${BASE_URL}/api/v1`,
      authorization_servers: [BASE_URL],
      bearer_methods_supported: ['header'],
      scopes_supported: ALL_SCOPE_NAMES,
      resource_documentation: `${BASE_URL}/docs`
    };
  }

  function requireScope(requiredScope) {
    return function scopeMiddleware(request, response, next) {
      const authHeader = request.headers.authorization;
      if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        sendProblem(response, {
          status: 401,
          code: 'unauthorized',
          title: 'Autenticação OAuth 2.0 obrigatória',
          detail: 'Cabeçalho Authorization Bearer ausente ou inválido.',
          hint: `Gere credenciais sandbox gratuitas em POST /api/v1/oauth/sandbox-clients e obtenha um token em POST /api/v1/oauth/token com escopo '${requiredScope}'.`,
          instance: request.originalUrl,
          headers: {
            'WWW-Authenticate': `Bearer realm="${BASE_URL}/api/v1", scope="${requiredScope}"`
          }
        });
        return;
      }

      const token = authHeader.slice(7).trim();
      const verified = verifySignedJwt(signingSecret, token);
      if (!verified || verified.expired || !verified.valid) {
        sendProblem(response, {
          status: 401,
          code: verified?.expired ? 'token_expired' : 'invalid_token',
          title: 'Token Bearer inválido ou expirado',
          detail: verified?.expired ? 'O access_token informado expirou.' : 'Não foi possível validar a assinatura do access_token.',
          hint: 'Solicite um novo access_token em POST /api/v1/oauth/token com suas credenciais client_credentials.',
          instance: request.originalUrl,
          headers: {
            'WWW-Authenticate': `Bearer realm="${BASE_URL}/api/v1", error="invalid_token", scope="${requiredScope}"`
          }
        });
        return;
      }

      const tokenScopes = String(verified.payload.scope || '').split(/\s+/).filter(Boolean);
      if (!tokenScopes.includes(requiredScope)) {
        sendProblem(response, {
          status: 403,
          code: 'insufficient_scope',
          title: 'Permissão insuficiente (least privilege)',
          detail: `O token autenticado possui escopos [${tokenScopes.join(', ')}], mas esta operação exige '${requiredScope}'.`,
          hint: `Solicite um token incluindo '${requiredScope}' em POST /api/v1/oauth/token.`,
          instance: request.originalUrl,
          headers: {
            'WWW-Authenticate': `Bearer realm="${BASE_URL}/api/v1", error="insufficient_scope", scope="${requiredScope}"`
          }
        });
        return;
      }

      request.oauth = {
        clientId: verified.payload.sub,
        scopes: tokenScopes
      };
      next();
    };
  }

  function registerSandboxClient(request, response) {
    const body = request.body || {};
    const clientName = String(body.clientName || 'Agent Sandbox Client').trim().slice(0, 80) || 'Agent Sandbox Client';
    const parsedScopes = parseScopesInput(body.requestedScopes);

    if (parsedScopes === null || (typeof parsedScopes === 'object' && !Array.isArray(parsedScopes) && parsedScopes.invalidScope)) {
      const invalid = parsedScopes?.invalidScope || '(vazio)';
      sendProblem(response, {
        status: 400,
        code: 'invalid_scope',
        title: 'Escopo OAuth inválido',
        detail: `O escopo solicitado '${invalid}' não é reconhecido pela API.`,
        hint: `Use apenas escopos válidos: ${ALL_SCOPE_NAMES.join(', ')}.`,
        instance: request.originalUrl
      });
      return;
    }

    const expiresInSeconds = 30 * 24 * 60 * 60;
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const compactPayload = {
      id: randomBytes(6).toString('hex'),
      s: parsedScopes,
      exp
    };
    const clientId = `sbx_${encodeBase64Url(JSON.stringify(compactPayload))}`;
    const clientSecret = signHmac(signingSecret, clientId);

    response.status(201).json({
      client_id: clientId,
      client_secret: clientSecret,
      client_name: clientName,
      tier: 'free-sandbox',
      grant_type: 'client_credentials',
      token_endpoint: `${BASE_URL}/api/v1/oauth/token`,
      scopes: parsedScopes,
      expires_in: expiresInSeconds,
      expires_at: new Date(exp * 1000).toISOString()
    });
  }

  function issueOAuthToken(request, response) {
    const grantType = String(request.body?.grant_type || '').trim();
    if (grantType !== 'client_credentials') {
      sendProblem(response, {
        status: 400,
        code: 'unsupported_grant_type',
        title: 'grant_type não suportado',
        detail: `O endpoint suporta exclusivamente grant_type='client_credentials'. Recebido: '${grantType || '(vazio)'}'.`,
        hint: 'Envie grant_type=client_credentials com client_id e client_secret em form-urlencoded, JSON ou HTTP Basic Auth.',
        instance: request.originalUrl,
        extra: { error: 'unsupported_grant_type', error_description: 'Use grant_type=client_credentials.' }
      });
      return;
    }

    const { clientId, clientSecret } = parseClientCredentials(request);
    if (!clientId || !clientSecret || !clientId.startsWith('sbx_')) {
      sendProblem(response, {
        status: 401,
        code: 'invalid_client',
        title: 'Credenciais OAuth inválidas',
        detail: 'client_id ou client_secret ausentes ou malformados.',
        hint: 'Provisione uma credencial sandbox gratuita em POST /api/v1/oauth/sandbox-clients.',
        instance: request.originalUrl,
        headers: { 'WWW-Authenticate': `Basic realm="${BASE_URL}/api/v1"` },
        extra: { error: 'invalid_client', error_description: 'Client authentication failed.' }
      });
      return;
    }

    const expectedSecret = signHmac(signingSecret, clientId);
    if (!safeEqualStrings(clientSecret, expectedSecret)) {
      sendProblem(response, {
        status: 401,
        code: 'invalid_client',
        title: 'Credenciais OAuth inválidas',
        detail: 'client_secret inválido para o client_id informado.',
        hint: 'Verifique as credenciais emitidas por POST /api/v1/oauth/sandbox-clients.',
        instance: request.originalUrl,
        headers: { 'WWW-Authenticate': `Basic realm="${BASE_URL}/api/v1"` },
        extra: { error: 'invalid_client', error_description: 'Invalid client secret.' }
      });
      return;
    }

    let clientMeta;
    try {
      clientMeta = JSON.parse(decodeBase64Url(clientId.slice(4)));
    } catch {
      clientMeta = null;
    }

    const nowSec = Math.floor(Date.now() / 1000);
    if (!clientMeta || !Array.isArray(clientMeta.s) || typeof clientMeta.exp !== 'number' || clientMeta.exp <= nowSec) {
      sendProblem(response, {
        status: 401,
        code: 'invalid_client',
        title: 'Credencial sandbox expirada',
        detail: 'O client_id sandbox expirou ou é inválido.',
        hint: 'Gere novas credenciais gratuitas em POST /api/v1/oauth/sandbox-clients.',
        instance: request.originalUrl
      });
      return;
    }

    const requestedScopeRaw = request.body?.scope;
    const requestedScopes = requestedScopeRaw ? parseScopesInput(requestedScopeRaw) : clientMeta.s;
    if (requestedScopes === null || (typeof requestedScopes === 'object' && !Array.isArray(requestedScopes) && requestedScopes.invalidScope)) {
      sendProblem(response, {
        status: 400,
        code: 'invalid_scope',
        title: 'Escopo OAuth inválido',
        detail: `Escopo solicitado inválido. Escopos permitidos para este cliente: ${clientMeta.s.join(' ')}.`,
        hint: `Solicite um subconjunto de: ${clientMeta.s.join(' ')}.`,
        instance: request.originalUrl,
        extra: { error: 'invalid_scope' }
      });
      return;
    }

    const disallowed = requestedScopes.filter((scope) => !clientMeta.s.includes(scope));
    if (disallowed.length > 0) {
      sendProblem(response, {
        status: 403,
        code: 'invalid_scope',
        title: 'Escopo excede as permissões do cliente',
        detail: `Escopos não autorizados para esta credencial: ${disallowed.join(', ')}.`,
        hint: `Solicite apenas escopos concedidos ao cliente (${clientMeta.s.join(', ')}) ou registre outro cliente sandbox.`,
        instance: request.originalUrl,
        extra: { error: 'invalid_scope' }
      });
      return;
    }

    const tokenTtl = 3600;
    const accessToken = createSignedJwt(signingSecret, {
      iss: BASE_URL,
      sub: clientId,
      aud: `${BASE_URL}/api/v1`,
      scope: requestedScopes.join(' '),
      iat: nowSec,
      exp: nowSec + tokenTtl
    });

    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Pragma', 'no-cache');
    response.status(200).json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: tokenTtl,
      scope: requestedScopes.join(' ')
    });
  }

  function listServices(_request, response) {
    response.status(200).json({
      apiVersion: API_VERSION,
      provider: 'Leonardo Brasil — Especialista em Google Meu Negócio e SEO Local',
      citiesCovered: CITIES_COUNT,
      onboarding: {
        tier: 'free-sandbox',
        registrationEndpoint: `${BASE_URL}/api/v1/oauth/sandbox-clients`,
        tokenEndpoint: `${BASE_URL}/api/v1/oauth/token`,
        docsUrl: `${BASE_URL}/docs`
      },
      services: PUBLIC_SERVICES
    });
  }

  function listNiches(request, response) {
    const query = String(request.query?.q || '').trim().toLowerCase();
    const limitParam = request.query?.limit;
    let limit = NICHES_CATALOG.length;

    if (limitParam !== undefined) {
      const parsedLimit = Number(limitParam);
      if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
        sendProblem(response, {
          status: 400,
          code: 'validation_error',
          title: 'Parâmetro limit inválido',
          detail: 'O parâmetro query limit deve ser um número inteiro entre 1 e 50.',
          hint: 'Exemplo: GET /api/v1/niches?limit=10',
          instance: request.originalUrl
        });
        return;
      }
      limit = parsedLimit;
    }

    const filtered = NICHES_CATALOG.filter((niche) => {
      if (!query) return true;
      return niche.slug.toLowerCase().includes(query) || niche.nome.toLowerCase().includes(query);
    });

    const sliced = filtered.slice(0, limit).map((niche) => ({
      slug: niche.slug,
      name: niche.nome,
      url: `${BASE_URL}/google-meu-negocio/${niche.slug}`
    }));

    response.status(200).json({
      apiVersion: API_VERSION,
      total: filtered.length,
      returned: sliced.length,
      items: sliced
    });
  }

  function getAuditChecklist(_request, response) {
    response.status(200).json({
      apiVersion: API_VERSION,
      totalWeight: 100,
      pillars: AUDIT_PILLARS,
      tiers: [
        { maxScore: 40, tier: 'critico', label: 'Risco Crítico de Invisibilidade' },
        { maxScore: 70, tier: 'vulneravel', label: 'Perfil Vulnerável / Abaixo do Top 3' },
        { maxScore: 100, tier: 'competitivo', label: 'Perfil Competitivo com Oportunidades' }
      ]
    });
  }

  function scoreAudit(request, response) {
    const body = request.body;
    if (!body || typeof body !== 'object' || !body.answers || typeof body.answers !== 'object' || Array.isArray(body.answers)) {
      sendProblem(response, {
        status: 400,
        code: 'validation_error',
        title: 'Payload de auditoria inválido',
        detail: 'O corpo JSON deve conter o objeto answers com valores booleanos para os 6 pilares.',
        hint: 'Consulte GET /api/v1/audit/checklist ou /openapi.json para o schema completo.',
        instance: request.originalUrl
      });
      return;
    }

    const answers = body.answers;
    const missingOrInvalid = [];
    for (const pillar of AUDIT_PILLARS) {
      if (typeof answers[pillar.id] !== 'boolean') {
        missingOrInvalid.push(pillar.id);
      }
    }

    if (missingOrInvalid.length > 0) {
      sendProblem(response, {
        status: 400,
        code: 'validation_error',
        title: 'Campos obrigatórios inválidos em answers',
        detail: `Os seguintes pilares exigem valor booleano (true/false): ${missingOrInvalid.join(', ')}.`,
        hint: 'Envie true ou false para todos os pilares: category, nap, description, catalog, reviews, photos.',
        instance: request.originalUrl,
        extra: { invalidFields: missingOrInvalid }
      });
      return;
    }

    const score = AUDIT_PILLARS.reduce((total, pillar) => (answers[pillar.id] ? total + pillar.weight : total), 0);
    const failedPillars = AUDIT_PILLARS.filter((pillar) => !answers[pillar.id]).map((pillar) => ({
      id: pillar.id,
      title: pillar.title,
      lostWeight: pillar.weight,
      recommendation: pillar.recommendation
    }));

    let tier = 'competitivo';
    let label = 'Perfil Competitivo com Oportunidades';
    let summary =
      'A empresa tem boas bases no Google Meu Negócio; ajustes finos em consistência NAP e avaliações consolidam o posicionamento.';

    if (score <= 40) {
      tier = 'critico';
      label = 'Risco Crítico de Invisibilidade';
      summary =
        'O perfil apresenta lacunas técnicas críticas que reduzem drasticamente sua visibilidade nas buscas locais do Google Maps.';
    } else if (score <= 70) {
      tier = 'vulneravel';
      label = 'Perfil Vulnerável / Abaixo do Top 3';
      summary =
        'O perfil atende ao básico, mas perde posições decisivas no pacote local para concorrentes mais completos.';
    }

    response.status(200).json({
      apiVersion: API_VERSION,
      companyName: body.companyName ? String(body.companyName).trim().slice(0, 120) : null,
      cityState: body.cityState ? String(body.cityState).trim().slice(0, 80) : null,
      score,
      maxScore: 100,
      tier,
      label,
      summary,
      failedPillars,
      evaluatedAt: new Date().toISOString()
    });
  }

  return {
    getOAuthAuthorizationServerMetadata,
    getOAuthProtectedResourceMetadata,
    requireScope,
    registerSandboxClient,
    issueOAuthToken,
    listServices,
    listNiches,
    getAuditChecklist,
    scoreAudit
  };
}
