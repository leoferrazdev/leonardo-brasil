import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function jsonError(response, status, error) {
  response.status(status).json({ error });
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
  if (allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
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

  app.disable('x-powered-by');
  app.use(applyCors);
  app.use('/api/stt/transcribe', express.raw({ type: '*/*', limit: '15mb' }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_request, response) => {
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

  if (existsSync(distDir)) {
    // Agent Readiness: API Catalog Endpoint
    app.get('/.well-known/api-catalog', (request, response) => {
      const catalogPath = path.join(distDir, '.well-known', 'api-catalog');
      if (existsSync(catalogPath)) {
        response.setHeader('Content-Type', 'application/linkset+json');
        response.sendFile(catalogPath, { dotfiles: 'allow' });
        return;
      }
      response.status(404).end();
    });

    // Agent Readiness: Web Bot Auth Endpoint
    app.get('/.well-known/http-message-signatures-directory', (request, response) => {
      const authPath = path.join(distDir, '.well-known', 'http-message-signatures-directory');
      if (existsSync(authPath)) {
        response.setHeader('Content-Type', 'application/jwk-set+json');
        response.sendFile(authPath);
        return;
      }
      response.status(404).end();
    });

    app.use('/assets', express.static(path.join(distDir, 'assets'), { immutable: true, maxAge: '1y' }));
    // index:false e redirect:false para não servir index.html automaticamente nem
    // redirecionar para URLs com barra final. As rotas HTML são resolvidas abaixo,
    // servindo a página pré-renderizada correspondente quando ela existe.
    app.use(express.static(distDir, { maxAge: '1h', index: false, redirect: false }));
    app.get(/.*/, (request, response) => {
      const cleanPath = request.path.replace(/\/+$/, '');

      // Agent Readiness: Markdown Content-Negotiation
      if (request.headers.accept && request.headers.accept.includes('text/markdown')) {
        const llmsTxtPath = path.join(distDir, 'llms.txt');
        if (existsSync(llmsTxtPath)) {
          response.setHeader('Content-Type', 'text/markdown; charset=utf-8');
          response.sendFile(llmsTxtPath);
          return;
        }
      }

      // Agent Readiness: Link Headers for Discovery (RFC 8288) no root
      if (cleanPath === '' || cleanPath === '/') {
        response.setHeader(
          'Link',
          '</.well-known/api-catalog>; rel="api-catalog", </.well-known/agents-index.json>; rel="agents-index", </.well-known/mcp/server-card.json>; rel="mcp-server-card"'
        );
      }

      // Serve a página pré-renderizada da rota (dist/<rota>/index.html), quando existir.
      if (cleanPath && cleanPath !== '/') {
        const prerendered = path.join(distDir, cleanPath, 'index.html');
        if (prerendered.startsWith(distDir) && existsSync(prerendered)) {
          response.sendFile(prerendered);
          return;
        }
      }
      // Fallback (rotas não pré-renderizadas): SPA a partir do index.html raiz.
      response.sendFile(path.join(distDir, 'index.html'));
    });
  }

  return app;
}
