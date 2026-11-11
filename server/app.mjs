import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GEO_TARGETS,
  buildGoogleAdsOAuthUrl,
  exchangeGoogleAdsOAuthCode,
  generateKeywordIdeas,
  getAdsIntegrationStatus,
  persistEnvVariables,
  sanitizeCustomerId
} from './google-ads-keywords.mjs';
import {
  isKnownWebRoute,
  normalizeWebPath,
  resolveLegacyRedirectPath
} from './routes-manifest.mjs';
import {
  API_VERSION,
  BASE_URL,
  LEGACY_SUNSET_HTTP_DATE,
  createRateLimiter,
  createV1ApiContext,
  sendProblem,
  versionHeaderMiddleware
} from './v1-api.mjs';
import {
  buildNotFoundHtml,
  buildNotFoundMarkdown,
  getMarkdownForKnownRoute,
  prefersJsonOverHtml,
  prefersMarkdown
} from './content-negotiation.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDistDir = path.resolve(__dirname, '..', 'dist');
const defaultBrainTimeoutMs = 15000;
const defaultTtsTimeoutMs = 9000;
const defaultTtsCircuitOpenMs = 300000;

const ttsCircuit = {
  openUntil: 0,
  status: 0,
  reason: ''
};

const allowedOrigins = new Set([
  'https://brasa.leonardobrasil.com.br',
  'https://leonardobrasil.com.br',
  'https://www.leonardobrasil.com.br',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]);

function defaultCodeForStatus(status) {
  if (status === 400) return 'bad_request';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 429) return 'rate_limit_exceeded';
  if (status === 503) return 'service_unavailable';
  if (status === 504) return 'gateway_timeout';
  if (status >= 500) return 'upstream_or_server_error';
  return 'api_error';
}

function defaultTitleForStatus(status) {
  if (status === 400) return 'Requisição inválida';
  if (status === 401) return 'Não autorizado';
  if (status === 403) return 'Acesso negado';
  if (status === 404) return 'Recurso não encontrado';
  if (status === 429) return 'Limite de taxa excedido';
  if (status === 503) return 'Serviço temporariamente indisponível';
  if (status === 504) return 'Tempo limite excedido no provedor';
  return 'Erro ao processar requisição';
}

function jsonError(response, status, error, options = {}) {
  sendProblem(response, {
    status,
    code: options.code || defaultCodeForStatus(status),
    title: options.title || defaultTitleForStatus(status),
    detail: error,
    hint: options.hint,
    instance: response.req?.originalUrl || '/',
    headers: options.headers
  });
}

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
    this.status = 504;
  }
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return fallback;
}

function getTtsCircuitSnapshot(now = Date.now()) {
  if (ttsCircuit.openUntil <= now) {
    return { open: false, openUntil: null, status: 0, reason: '' };
  }

  return {
    open: true,
    openUntil: new Date(ttsCircuit.openUntil).toISOString(),
    status: ttsCircuit.status || 503,
    reason: ttsCircuit.reason
  };
}

export function resetTtsCircuitForTests() {
  ttsCircuit.openUntil = 0;
  ttsCircuit.status = 0;
  ttsCircuit.reason = '';
}

function getIntegrationStatus(env = process.env) {
  return {
    anthropic: Boolean(env.ANTHROPIC_API_KEY && env.ANTHROPIC_MODEL),
    geminiBrain: Boolean(env.GEMINI_API_KEY),
    geminiTts: Boolean(env.GEMINI_API_KEY),
    elevenLabs: Boolean(env.ELEVENLABS_API_KEY && env.ELEVENLABS_VOICE_ID),
    stt: Boolean(env.STT_API_KEY),
    automationWebhook: Boolean(env.BRASA_AUTOMATION_WEBHOOK_URL)
  };
}

function getRuntimeStatus() {
  const circuit = getTtsCircuitSnapshot();
  return {
    ttsCircuitOpen: circuit.open,
    ttsCircuitOpenUntil: circuit.openUntil
  };
}

function logTelemetry(event, fields = {}) {
  console.info('[Brasa telemetry]', JSON.stringify({ event, at: new Date().toISOString(), ...fields }));
}

async function fetchWithTimeout(fetchImpl, url, init, timeoutMs, timeoutMessage) {
  const controller = new AbortController();
  const timeoutError = new TimeoutError(timeoutMessage);
  let timeoutId;

  try {
    return await Promise.race([
      fetchImpl(url, { ...init, signal: controller.signal }),
      new Promise((_resolve, reject) => {
        timeoutId = setTimeout(() => {
          controller.abort();
          reject(timeoutError);
        }, timeoutMs);
      })
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

function shouldOpenTtsCircuit(status) {
  return status === 403 || status === 429 || status === 504 || status >= 500;
}

function openTtsCircuit(env, error) {
  const openMs = parsePositiveInteger(env.BRASA_TTS_CIRCUIT_OPEN_MS, defaultTtsCircuitOpenMs);
  ttsCircuit.openUntil = Date.now() + openMs;
  ttsCircuit.status = error.status || 503;
  ttsCircuit.reason = error.message || 'TTS indisponivel.';
}

function sanitizeClaudeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => message?.role === 'user' || message?.role === 'assistant')
    .map((message) => ({ role: message.role, content: String(message.content || '').trim() }))
    .filter((message) => message.content.length > 0);
}

function readRawBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => resolve(Buffer.concat(chunks)));
    request.on('error', reject);
  });
}

function extractAnthropicText(data) {
  return data?.content?.map((part) => part.text).filter(Boolean).join('\n') || '';
}

function buildGeminiBrainContents(messages, userText) {
  const contents = sanitizeClaudeMessages(messages).map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }]
  }));
  const command = String(userText || '').trim();
  if (command) {
    contents.push({ role: 'user', parts: [{ text: command }] });
  }

  return contents;
}

function extractGeminiText(data) {
  return (
    data?.output_text ||
    data?.outputText ||
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('\n') ||
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    ''
  );
}

function extractGeminiAudioBase64(data) {
  const directAudio =
    data?.output_audio?.data ||
    data?.outputAudio?.data ||
    data?.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data)?.inlineData?.data;
  if (directAudio) {
    return directAudio;
  }

  const stack = [data];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== 'object') {
      continue;
    }

    const type = String(current.type || current.mime_type || current.mimeType || '').toLowerCase();
    if (type.includes('audio') && typeof current.data === 'string') {
      return current.data;
    }

    for (const value of Object.values(current)) {
      if (value && typeof value === 'object') {
        stack.push(value);
      }
    }
  }

  return '';
}

function createWavFromPcm(pcm, { channels = 1, sampleRate = 24000, bitsPerSample = 16 } = {}) {
  const header = Buffer.alloc(44);
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

async function requestGeminiBrain({ env, fetchImpl, systemPrompt, messages, userText }) {
  const model = env.GEMINI_MODEL || 'gemini-3.5-flash';
  const geminiResponse = await fetchWithTimeout(
    fetchImpl,
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: buildGeminiBrainContents(messages, userText),
        generationConfig: {
          maxOutputTokens: 900,
          temperature: 0.7
        }
      })
    },
    parsePositiveInteger(env.BRASA_BRAIN_TIMEOUT_MS, defaultBrainTimeoutMs),
    'Gemini demorou demais.'
  );

  const data = await geminiResponse.json();
  if (!geminiResponse.ok) {
    const error = new Error(data?.error?.message || 'Falha ao chamar Gemini.');
    error.status = geminiResponse.status;
    throw error;
  }

  const text = extractGeminiText(data);
  if (!text) {
    throw new Error('Gemini nao retornou texto.');
  }

  return text;
}

async function requestGeminiTts({ env, fetchImpl, text }) {
  const promptPrefix =
    env.GEMINI_TTS_PROMPT_PREFIX || 'Say in Portuguese with a formal, strategic and warm executive tone:';
  const configuredModel = env.GEMINI_TTS_MODEL || 'gemini-3.1-flash-tts-preview';
  const model =
    configuredModel === 'gemini-2.5-flash-preview-tts' ? 'gemini-3.1-flash-tts-preview' : configuredModel;
  const geminiResponse = await fetchWithTimeout(
    fetchImpl,
    'https://generativelanguage.googleapis.com/v1beta/interactions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        model,
        input: `${promptPrefix} ${text}`,
        response_format: { type: 'audio' },
        generation_config: {
          speech_config: [{ voice: env.GEMINI_TTS_VOICE || 'Charon' }]
        }
      })
    },
    parsePositiveInteger(env.BRASA_TTS_TIMEOUT_MS, defaultTtsTimeoutMs),
    'Gemini TTS demorou demais.'
  );

  const data = await geminiResponse.json().catch(() => ({}));
  if (!geminiResponse.ok) {
    const error = new Error(data?.error?.message || 'Falha ao chamar Gemini TTS.');
    error.status = geminiResponse.status;
    throw error;
  }

  const audioBase64 = extractGeminiAudioBase64(data);
  if (!audioBase64) {
    throw new Error('Gemini TTS nao retornou audio.');
  }

  return createWavFromPcm(Buffer.from(audioBase64, 'base64'));
}

async function requestElevenLabsTts({ env, fetchImpl, text }) {
  const ttsResponse = await fetchImpl(`https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVENLABS_VOICE_ID}/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': env.ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text,
      model_id: env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
      voice_settings: { stability: 0.48, similarity_boost: 0.78, style: 0.18, use_speaker_boost: true }
    })
  });

  if (!ttsResponse.ok) {
    throw new Error('Falha ao chamar ElevenLabs.');
  }

  return {
    audio: Buffer.from(await ttsResponse.arrayBuffer()),
    contentType: ttsResponse.headers.get('Content-Type') || 'audio/mpeg'
  };
}

function applyCors(request, response, next) {
  const origin = request.headers.origin;
  const isPublicAgentEndpoint =
    request.path.startsWith('/api/v1') || request.path.startsWith('/.well-known');

  if (allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  } else if (isPublicAgentEndpoint) {
    response.setHeader('Access-Control-Allow-Origin', '*');
  }

  if (allowedOrigins.has(origin) || isPublicAgentEndpoint) {
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Version');
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    response.setHeader(
      'Access-Control-Expose-Headers',
      'RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, RateLimit-Policy, Retry-After, API-Version, X-API-Version, X-API-Deprecation-Policy, Deprecation, Sunset, WWW-Authenticate'
    );
  }

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  next();
}

export function createMainApp(options = {}) {
  const env = options.env || process.env;
  const fetchImpl = options.fetchImpl || fetch;
  const distDir = options.distDir || defaultDistDir;
  const app = express();
  const v1Api = createV1ApiContext({ env });
  const rateLimiter = createRateLimiter({
    max: parsePositiveInteger(options.rateLimitMax ?? env.API_RATE_LIMIT_MAX, 60),
    windowMs: parsePositiveInteger(options.rateLimitWindowMs ?? env.API_RATE_LIMIT_WINDOW_MS, 60_000),
    nowFn: options.nowFn
  });

  app.disable('x-powered-by');
  app.use(applyCors);
  app.use(/^\/api\/.+/, rateLimiter, versionHeaderMiddleware);
  app.use('/api/stt/transcribe', express.raw({ type: '*/*', limit: '15mb' }));
  app.use('/api/v1/oauth/token', express.urlencoded({ extended: false }));
  app.use(express.json({ limit: '1mb' }));

  app.use((err, request, response, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      sendProblem(response, {
        status: 400,
        code: 'invalid_json',
        title: 'JSON inválido no corpo da requisição',
        detail: 'Não foi possível interpretar o payload JSON enviado.',
        hint: 'Envie um objeto JSON válido com cabeçalho Content-Type: application/json.',
        instance: request.originalUrl
      });
      return;
    }
    next(err);
  });

  // Metadados OAuth 2.0 (RFC 8414 e RFC 9728) sempre ativos para descoberta de agentes.
  app.get('/.well-known/oauth-authorization-server', (_request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.status(200).json(v1Api.getOAuthAuthorizationServerMetadata());
  });

  app.get('/.well-known/oauth-protected-resource', (_request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.status(200).json(v1Api.getOAuthProtectedResourceMetadata());
  });

  // Endpoints públicos versionados (/api/v1/*) com onboarding self-serve e escopos OAuth 2.0 reais.
  app.get('/api/v1/health', (_request, response) => {
    response.status(200).json({
      ok: true,
      apiVersion: API_VERSION,
      status: 'operational',
      integrations: getIntegrationStatus(env),
      runtime: getRuntimeStatus(),
      docsUrl: `${BASE_URL}/docs`
    });
  });

  app.get('/api/v1/services', v1Api.listServices);
  app.get('/api/v1/niches', v1Api.listNiches);
  app.post('/api/v1/oauth/sandbox-clients', v1Api.registerSandboxClient);
  app.post('/api/v1/oauth/token', v1Api.issueOAuthToken);
  app.get('/api/v1/audit/checklist', v1Api.requireScope('catalog:read'), v1Api.getAuditChecklist);
  app.post('/api/v1/audit/score', v1Api.requireScope('audit:write'), v1Api.scoreAudit);

  app.get('/api/health', (_request, response) => {
    response.setHeader('Deprecation', 'true');
    response.setHeader('Sunset', LEGACY_SUNSET_HTTP_DATE);
    response.setHeader('Link', `<${BASE_URL}/api/v1/health>; rel="successor-version"`);
    response.json({
      ok: true,
      version: env.npm_package_version || '1.0.0',
      integrations: getIntegrationStatus(env),
      runtime: getRuntimeStatus()
    });
  });

  app.post('/api/anthropic/messages', async (request, response) => {
    const userText = String(request.body?.userText || '').trim();
    const messages = sanitizeClaudeMessages(request.body?.messages);
    if (userText) {
      messages.push({ role: 'user', content: userText });
    }
    const systemPrompt = String(request.body?.systemPrompt || '');

    if (env.GEMINI_API_KEY) {
      const startedAt = Date.now();
      try {
        const text = await requestGeminiBrain({
          env,
          fetchImpl,
          systemPrompt,
          messages: request.body?.messages,
          userText
        });
        logTelemetry('brain_success', {
          provider: 'gemini',
          durationMs: Date.now() - startedAt,
          inputChars: userText.length,
          outputChars: text.length
        });
        response.json({ text });
        return;
      } catch (error) {
        logTelemetry('brain_failure', {
          provider: 'gemini',
          durationMs: Date.now() - startedAt,
          status: error.status || 502,
          error: error.message || 'Falha ao chamar Gemini.'
        });
        jsonError(response, error.status || 502, error.message || 'Falha ao chamar Gemini.');
        return;
      }
    }

    if (!env.ANTHROPIC_API_KEY || !env.ANTHROPIC_MODEL) {
      jsonError(response, 503, 'IA nao configurada.');
      return;
    }

    const anthropicResponse = await fetchImpl('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: env.ANTHROPIC_MODEL,
        max_tokens: 900,
        system: systemPrompt,
        messages
      })
    });

    const data = await anthropicResponse.json();
    if (!anthropicResponse.ok) {
      jsonError(response, anthropicResponse.status, data?.error?.message || 'Falha ao chamar Anthropic.');
      return;
    }

    response.json({ text: extractAnthropicText(data) });
  });

  app.post('/api/elevenlabs/tts', async (request, response) => {
    const text = String(request.body?.text || '').trim();
    if (!text) {
      jsonError(response, 400, 'Texto vazio para TTS.');
      return;
    }

    if (env.GEMINI_API_KEY) {
      const circuit = getTtsCircuitSnapshot();
      if (circuit.open) {
        logTelemetry('tts_circuit_skip', {
          provider: 'gemini',
          status: circuit.status,
          openUntil: circuit.openUntil,
          reason: circuit.reason
        });
        jsonError(response, circuit.status, `Circuito de voz temporariamente aberto ate ${circuit.openUntil}.`);
        return;
      }

      const startedAt = Date.now();
      try {
        const audio = await requestGeminiTts({ env, fetchImpl, text });
        logTelemetry('tts_success', {
          provider: 'gemini',
          durationMs: Date.now() - startedAt,
          textChars: text.length,
          bytes: audio.length
        });
        response.status(200).type('audio/wav').send(audio);
        return;
      } catch (error) {
        if (shouldOpenTtsCircuit(error.status || 502)) {
          openTtsCircuit(env, error);
          const openedCircuit = getTtsCircuitSnapshot();
          logTelemetry('tts_circuit_open', {
            provider: 'gemini',
            status: openedCircuit.status,
            openUntil: openedCircuit.openUntil,
            reason: openedCircuit.reason
          });
        }

        logTelemetry('tts_failure', {
          provider: 'gemini',
          durationMs: Date.now() - startedAt,
          status: error.status || 502,
          error: error.message || 'Falha ao chamar Gemini TTS.'
        });
        jsonError(response, error.status || 502, error.message || 'Falha ao chamar Gemini TTS.');
        return;
      }
    }

    if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_VOICE_ID) {
      jsonError(response, 503, 'TTS nao configurado.');
      return;
    }

    try {
      const { audio, contentType } = await requestElevenLabsTts({ env, fetchImpl, text });
      response.status(200).type(contentType).send(audio);
    } catch {
      jsonError(response, 502, 'Falha ao chamar ElevenLabs.');
    }
  });

  app.post('/api/stt/transcribe', async (request, response) => {
    if (!env.STT_API_KEY) {
      jsonError(response, 503, 'STT nao configurado.');
      return;
    }

    const audio = Buffer.isBuffer(request.body) ? request.body : await readRawBody(request);
    const sttResponse = await fetchImpl('https://api.deepgram.com/v1/listen?model=nova-2&language=pt-BR&smart_format=true', {
      method: 'POST',
      headers: {
        Authorization: `Token ${env.STT_API_KEY}`,
        'Content-Type': request.headers['content-type'] || 'audio/webm'
      },
      body: audio
    });

    const data = await sttResponse.json();
    if (!sttResponse.ok) {
      jsonError(response, sttResponse.status, 'Falha ao chamar STT.');
      return;
    }

    response.json({ text: data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '' });
  });

  app.post('/api/webhooks/automation', async (request, response) => {
    if (!env.BRASA_AUTOMATION_WEBHOOK_URL) {
      response.json({ ok: true, skipped: true });
      return;
    }

    try {
      await fetchImpl(env.BRASA_AUTOMATION_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.body || {})
      });
      response.json({ ok: true, skipped: false });
    } catch {
      response.status(202).json({ ok: false, skipped: false });
    }
  });

  app.get('/api/ads/status', (_request, response) => {
    response.json({
      ...getAdsIntegrationStatus(env),
      locations: Object.entries(GEO_TARGETS).map(([slug, meta]) => ({
        slug,
        name: meta.name,
        geoId: meta.id
      }))
    });
  });

  app.post('/api/ads/credentials', (request, response) => {
    const body = request.body || {};
    const updates = {};

    if (body.developerToken !== undefined) updates.GOOGLE_ADS_DEVELOPER_TOKEN = String(body.developerToken).trim();
    if (body.clientId !== undefined) updates.GOOGLE_ADS_CLIENT_ID = String(body.clientId).trim();
    if (body.clientSecret !== undefined) updates.GOOGLE_ADS_CLIENT_SECRET = String(body.clientSecret).trim();
    if (body.refreshToken !== undefined) updates.GOOGLE_ADS_REFRESH_TOKEN = String(body.refreshToken).trim();
    if (body.loginCustomerId !== undefined) {
      updates.GOOGLE_ADS_LOGIN_CUSTOMER_ID = sanitizeCustomerId(body.loginCustomerId);
    }
    if (body.customerId !== undefined) {
      updates.GOOGLE_ADS_CUSTOMER_ID = sanitizeCustomerId(body.customerId);
    }

    try {
      const envPath = path.resolve(__dirname, '..', '.env');
      persistEnvVariables(envPath, updates, env);
      response.json({
        ok: true,
        ...getAdsIntegrationStatus(env)
      });
    } catch (error) {
      jsonError(response, 500, error.message || 'Falha ao salvar credenciais do Google Ads.');
    }
  });

  app.get('/api/ads/oauth/url', (request, response) => {
    try {
      const host = request.headers.host || 'localhost:3000';
      const protocol = request.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
      const redirectUri = `${protocol}://${host}/api/ads/oauth/callback`;
      const authUrl = buildGoogleAdsOAuthUrl({ env, redirectUri });
      response.json({ url: authUrl, redirectUri });
    } catch (error) {
      jsonError(response, 400, error.message || 'Falha ao gerar URL OAuth2.');
    }
  });

  app.get('/api/ads/oauth/callback', async (request, response) => {
    const code = String(request.query.code || '').trim();
    if (!code) {
      jsonError(response, 400, 'Código de autorização OAuth ausente.');
      return;
    }

    try {
      const host = request.headers.host || 'localhost:3000';
      const protocol = request.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
      const redirectUri = `${protocol}://${host}/api/ads/oauth/callback`;
      const tokens = await exchangeGoogleAdsOAuthCode({ env, fetchImpl, code, redirectUri });

      const envPath = path.resolve(__dirname, '..', '.env');
      persistEnvVariables(envPath, { GOOGLE_ADS_REFRESH_TOKEN: tokens.refresh_token }, env);

      response.redirect('/crm/planejador?oauth=success');
    } catch (error) {
      response.redirect(`/crm/planejador?oauth=error&reason=${encodeURIComponent(error.message || 'oauth_failed')}`);
    }
  });

  app.post('/api/ads/keyword-ideas', async (request, response) => {
    const body = request.body || {};
    try {
      const result = await generateKeywordIdeas({
        env,
        fetchImpl,
        keywords: body.keywords || [],
        pageUrl: body.pageUrl || '',
        citySlug: body.citySlug || 'porto-alegre',
        neighborhood: body.neighborhood || ''
      });
      response.json(result);
    } catch (error) {
      jsonError(response, error.status || 500, error.message || 'Falha ao gerar ideias de palavras-chave.');
    }
  });

  // Qualquer endpoint /api/* não mapeado retorna erro JSON estruturado (RFC 9457), nunca HTML da SPA.
  app.use(/^\/api\/.+/, (request, response) => {
    sendProblem(response, {
      status: 404,
      code: 'endpoint_not_found',
      title: 'Endpoint da API não encontrado',
      detail: `A rota '${request.method} ${request.path}' não existe na API de Leonardo Brasil.`,
      hint: `Consulte os endpoints disponíveis em ${BASE_URL}/openapi.json ou ${BASE_URL}/docs.`,
      instance: request.originalUrl
    });
  });

  if (existsSync(distDir)) {
    // Documentos públicos de descoberta podem ser consultados por outros origins.
    app.use('/.well-known', (_request, response, next) => {
      response.setHeader('Access-Control-Allow-Origin', '*');
      next();
    });

    app.get('/.well-known/poppy.json', (_request, response) => {
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.sendFile(path.join(distDir, '.well-known', 'poppy.json'), { dotfiles: 'allow' });
    });

    app.get('/.well-known/ai-catalog.json', (_request, response) => {
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.sendFile(path.join(distDir, '.well-known', 'ai-catalog.json'), { dotfiles: 'allow' });
    });

    // Serve apenas o diretório público de skills; não expõe outros dotfiles.
    app.use('/.well-known/agent-skills', express.static(path.join(distDir, '.well-known', 'agent-skills'), {
      dotfiles: 'allow', index: false, redirect: false, fallthrough: true, maxAge: 0
    }));

    // Agent Readiness: API Catalog Endpoint
    app.get('/.well-known/api-catalog', (_request, response) => {
      const catalogPath = path.join(distDir, '.well-known', 'api-catalog');
      if (existsSync(catalogPath)) {
        response.setHeader('Content-Type', 'application/linkset+json');
        response.sendFile(catalogPath, { dotfiles: 'allow' });
        return;
      }
      response.status(404).end();
    });

    // A ausência de um protocolo não deve parecer sucesso com o HTML da SPA.
    app.use('/.well-known', (_request, response) => {
      response.status(404).json({ error: 'Discovery resource not found' });
    });

    app.use('/assets', express.static(path.join(distDir, 'assets'), { immutable: true, maxAge: '1y' }));
    // index:false e redirect:false para não servir index.html automaticamente nem
    // redirecionar para URLs com barra final. As rotas HTML são resolvidas abaixo,
    // servindo a página pré-renderizada correspondente quando ela existe.
    app.use(express.static(distDir, {
      maxAge: '1h',
      index: false,
      redirect: false,
      setHeaders: (response, filePath) => {
        if (/\.(json|txt|md)$/i.test(filePath)) {
          response.setHeader('Access-Control-Allow-Origin', '*');
        }
      }
    }));

    app.get(/.*/, (request, response) => {
      const cleanPath = normalizeWebPath(request.path);

      // Redirecionamento 301 apenas para rotas legadas cujo nicho é válido.
      const legacyTarget = resolveLegacyRedirectPath(cleanPath);
      if (legacyTarget) {
        response.redirect(301, legacyTarget);
        return;
      }

      // Anuncia somente os documentos e capacidades realmente publicados.
      if (cleanPath === '/') {
        response.vary('Accept');
        response.setHeader(
          'Link',
          '</.well-known/api-catalog>; rel="api-catalog", </.well-known/ai-catalog.json>; rel="ai-catalog", </.well-known/agent-skills/index.json>; rel="agent-skills", </.well-known/oauth-authorization-server>; rel="oauth-authorization-server", </docs>; rel="service-doc", </llms.txt>; rel="alternate"; type="text/markdown"'
        );
      }

      // Entrada /api aceita negociação JSON além de Markdown e HTML.
      if (cleanPath === '/api' && prefersJsonOverHtml(request.headers.accept)) {
        response.vary('Accept');
        response.status(200).json({
          name: 'Leonardo Brasil API',
          apiVersion: API_VERSION,
          docsUrl: `${BASE_URL}/docs`,
          openapiUrl: `${BASE_URL}/openapi.json`,
          apiCatalogUrl: `${BASE_URL}/.well-known/api-catalog`,
          oauthAuthorizationServerUrl: `${BASE_URL}/.well-known/oauth-authorization-server`,
          oauthProtectedResourceUrl: `${BASE_URL}/.well-known/oauth-protected-resource`,
          sandboxRegistrationUrl: `${BASE_URL}/api/v1/oauth/sandbox-clients`,
          tokenUrl: `${BASE_URL}/api/v1/oauth/token`
        });
        return;
      }

      // Rotas inexistentes retornam HTTP 404 real (Markdown, JSON ProblemDetails ou HTML) em vez de soft-404.
      if (!isKnownWebRoute(cleanPath)) {
        response.status(404);
        response.vary('Accept');
        if (prefersMarkdown(request.headers.accept)) {
          response.setHeader('Content-Type', 'text/markdown; charset=utf-8');
          response.send(buildNotFoundMarkdown(cleanPath));
          return;
        }
        if (prefersJsonOverHtml(request.headers.accept)) {
          sendProblem(response, {
            status: 404,
            code: 'resource_not_found',
            title: 'Recurso não encontrado',
            detail: `O caminho '${cleanPath}' não existe em leonardobrasil.com.br.`,
            hint: `Consulte ${BASE_URL}/docs, ${BASE_URL}/llms.txt ou ${BASE_URL}/sitemap.xml.`,
            instance: request.originalUrl
          });
          return;
        }
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(buildNotFoundHtml(cleanPath));
        return;
      }

      // Negociação de conteúdo Markdown para a página inicial, documentação e páginas institucionais.
      if (prefersMarkdown(request.headers.accept)) {
        const markdown = getMarkdownForKnownRoute(cleanPath, distDir);
        if (markdown) {
          response.vary('Accept');
          response.setHeader('Content-Type', 'text/markdown; charset=utf-8');
          response.send(markdown);
          return;
        }
      }

      // Serve a página pré-renderizada da rota (dist/<rota>/index.html), quando existir.
      if (cleanPath !== '/') {
        const prerendered = path.join(distDir, cleanPath.slice(1), 'index.html');
        if (prerendered.startsWith(distDir) && existsSync(prerendered)) {
          response.sendFile(prerendered);
          return;
        }
      }

      const rootIndex = path.join(distDir, 'index.html');
      if (existsSync(rootIndex)) {
        response.sendFile(rootIndex);
        return;
      }

      // Ambiente de testes usando distDir parcial (ex.: public/ sem index.html).
      response.status(404);
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.send(buildNotFoundHtml(cleanPath));
    });
  } else {
    app.get(/.*/, (request, response) => {
      const cleanPath = normalizeWebPath(request.path);
      response.status(404);
      response.vary('Accept');
      if (prefersMarkdown(request.headers.accept)) {
        response.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        response.send(buildNotFoundMarkdown(cleanPath));
        return;
      }
      if (prefersJsonOverHtml(request.headers.accept)) {
        sendProblem(response, {
          status: 404,
          code: 'resource_not_found',
          title: 'Recurso não encontrado',
          detail: `O caminho '${cleanPath}' não existe em leonardobrasil.com.br.`,
          hint: `Consulte ${BASE_URL}/docs, ${BASE_URL}/llms.txt ou ${BASE_URL}/sitemap.xml.`,
          instance: request.originalUrl
        });
        return;
      }
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.send(buildNotFoundHtml(cleanPath));
    });
  }

  app.use((err, request, response, _next) => {
    sendProblem(response, {
      status: err?.status || 500,
      code: 'internal_server_error',
      title: 'Erro interno do servidor',
      detail: err?.message || 'Erro inesperado ao processar a requisição.',
      hint: `Verifique os parâmetros e tente novamente, ou consulte ${BASE_URL}/docs.`,
      instance: request.originalUrl
    });
  });

  return app;
}
