import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test, { afterEach } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createMainApp, resetTtsCircuitForTests } from './app.mjs';

afterEach(() => {
  resetTtsCircuitForTests();
});

test('unsupported discovery protocols return JSON 404 while implemented OAuth metadata returns RFC JSON 200', async () => {
  const app = createMainApp({ env: {}, distDir: fileURLToPath(new URL('../public/', import.meta.url)) });
  for (const discoveryPath of [
    '/.well-known/openid-configuration',
    '/.well-known/http-message-signatures-directory',
    '/.well-known/mcp/server-card.json', '/.well-known/agent-card.json',
    '/.well-known/acp.json', '/.well-known/ucp',
    '/.well-known/agent-skills/missing/SKILL.md'
  ]) {
    const response = await request(app, discoveryPath, { headers: { Accept: 'text/markdown', Origin: 'https://example.org' } });
    assert.equal(response.status, 404, discoveryPath);
    assert.match(response.headers.get('content-type'), /^application\/json/, discoveryPath);
    assert.deepEqual(await response.json(), { error: 'Discovery resource not found' });
  }

  const oauthAs = await request(app, '/.well-known/oauth-authorization-server', {
    headers: { Origin: 'https://example.org' }
  });
  assert.equal(oauthAs.status, 200);
  assert.equal(oauthAs.headers.get('access-control-allow-origin'), '*');
  const asMeta = await oauthAs.json();
  assert.equal(asMeta.issuer, 'https://leonardobrasil.com.br');
  assert.equal(asMeta.token_endpoint, 'https://leonardobrasil.com.br/api/v1/oauth/token');
  assert.equal(asMeta.registration_endpoint, 'https://leonardobrasil.com.br/api/v1/oauth/sandbox-clients');
  assert.deepEqual(asMeta.scopes_supported, ['health:read', 'catalog:read', 'audit:write']);

  const oauthPr = await request(app, '/.well-known/oauth-protected-resource', {
    headers: { Origin: 'https://example.org' }
  });
  assert.equal(oauthPr.status, 200);
  assert.equal(oauthPr.headers.get('access-control-allow-origin'), '*');
  const prMeta = await oauthPr.json();
  assert.equal(prMeta.resource, 'https://leonardobrasil.com.br/api/v1');
  assert.deepEqual(prMeta.scopes_supported, ['health:read', 'catalog:read', 'audit:write']);
});

test('Markdown discovery advertises only working public resources and current content', async () => {
  const app = createMainApp({ env: {}, distDir: fileURLToPath(new URL('../public/', import.meta.url)) });
  const response = await request(app, '/', { headers: { Accept: 'text/markdown' } });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/markdown/);
  assert.ok(response.headers.get('vary').includes('Accept'));
  const links = response.headers.get('link');
  assert.ok(links.includes('rel="api-catalog"') && links.includes('rel="ai-catalog"'));
  assert.ok(!links.includes('mcp-server-card') && !links.includes('agents-index'));
  const summary = await response.text();
  assert.ok(summary.includes('/auditoria-perfil-google'));
  assert.ok(!summary.includes('/calculadora'));
  for (const path of [
    '/.well-known/api-catalog', '/.well-known/ai-catalog.json',
    '/.well-known/agent-skills/index.json', '/.well-known/poppy.json'
  ]) {
    const resource = await request(app, path, { headers: { Origin: 'https://example.org' } });
    assert.equal(resource.status, 200);
    assert.equal(resource.headers.get('access-control-allow-origin'), '*');
  }
});

test('Poppy discovery declares website-only support without claiming OAuth or sessions', async () => {
  const app = createMainApp({ env: {}, distDir: fileURLToPath(new URL('../public/', import.meta.url)) });
  const response = await request(app, '/.well-known/poppy.json');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  const manifest = await response.json();
  assert.deepEqual(manifest, {
    protocol_version: '0.1',
    organization: { name: 'Leonardo Brasil', domain: 'leonardobrasil.com.br' },
    web: {}
  });
});

test('ARD manifest serves JSON with public CORS and valid resolvable resources', async () => {
  const app = createMainApp({ env: {}, distDir: fileURLToPath(new URL('../public/', import.meta.url)) });
  const response = await request(app, '/.well-known/ai-catalog.json', { headers: { Origin: 'https://example.org' } });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
  const manifest = await response.json();
  assert.equal(manifest.specVersion, '1.0');
  assert.ok(manifest.host.displayName && manifest.host.identifier);
  assert.ok(manifest.entries.length > 0);
  const identifiers = new Set();
  for (const entry of manifest.entries) {
    assert.match(entry.identifier, /^urn:air:leonardobrasil\.com\.br:[a-z0-9-]+:[a-z0-9-]+$/);
    assert.ok(!identifiers.has(entry.identifier));
    identifiers.add(entry.identifier);
    assert.ok(entry.displayName);
    assert.ok(['application/json', 'text/markdown'].includes(entry.type));
    assert.notEqual(Object.hasOwn(entry, 'url'), Object.hasOwn(entry, 'data'));
    assert.ok(entry.representativeQueries.length >= 2 && entry.representativeQueries.length <= 5);
    const linked = await request(app, new URL(entry.url).pathname);
    assert.equal(linked.status, 200);
    assert.ok(linked.headers.get('content-type').startsWith(entry.type));
  }
});

test('skills discovery serves JSON and an artifact matching its advertised digest', async () => {
  const app = createMainApp({ env: {}, distDir: fileURLToPath(new URL('../public/', import.meta.url)) });
  const response = await request(app, '/.well-known/agent-skills/index.json');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  const index = await response.json();
  assert.equal(index.$schema, 'https://schemas.agentskills.io/discovery/0.2.0/schema.json');
  assert.ok(index.skills.length > 0);
  for (const skill of index.skills) {
    assert.match(skill.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(skill.type, 'skill-md');
    assert.ok(skill.description);
    const artifact = await request(app, new URL(skill.url).pathname);
    assert.equal(artifact.status, 200);
    const bytes = Buffer.from(await artifact.arrayBuffer());
    assert.equal(skill.digest, `sha256:${createHash('sha256').update(bytes).digest('hex')}`);
    assert.match(bytes.toString(), /^---\nname:/);
  }
  const missing = await request(app, '/.well-known/agent-skills/missing/SKILL.md');
  assert.equal(missing.status, 404);
});

test('API catalog serves a hidden well-known file with discoverable specification, docs and status', async () => {
  const app = createMainApp({ env: {}, distDir: fileURLToPath(new URL('../public/', import.meta.url)) });
  const response = await request(app, '/.well-known/api-catalog');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/linkset\+json/);
  const catalog = await response.json();
  assert.ok(catalog.linkset.length > 0);
  for (const entry of catalog.linkset) {
    assert.equal(new URL(entry.anchor).protocol, 'https:');
    for (const relation of ['service-desc', 'service-doc', 'status']) {
      const linked = await request(app, new URL(entry[relation][0].href).pathname);
      assert.equal(linked.status, 200, relation);
      if (relation === 'service-desc') {
        const spec = await linked.json();
        assert.equal(spec.openapi, '3.1.0');
        assert.ok(spec.paths['/api/v1/health']);
      }
    }
  }
});

async function request(app, path, options = {}) {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    return await fetch(`http://127.0.0.1:${port}${path}`, options);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('health returns integration booleans without secrets', async () => {
  const app = createMainApp({
    env: {
      npm_package_version: '1.0.0',
      ANTHROPIC_API_KEY: 'secret',
      ANTHROPIC_MODEL: 'claude-sonnet-4-5'
    }
  });

  const response = await request(app, '/api/health');
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, {
    ok: true,
    version: '1.0.0',
    integrations: {
      anthropic: true,
      geminiBrain: false,
      geminiTts: false,
      elevenLabs: false,
      stt: false,
      automationWebhook: false
    },
    runtime: {
      ttsCircuitOpen: false,
      ttsCircuitOpenUntil: null
    }
  });
  assert.equal(JSON.stringify(body).includes('secret'), false);
});

test('assistant route uses Gemini brain first and returns text', async () => {
  const calls = [];
  const app = createMainApp({
    env: {
      GEMINI_API_KEY: 'gemini-secret',
      GEMINI_MODEL: 'gemini-3.5-flash'
    },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Resposta Gemini.' }] } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const response = await request(app, '/api/anthropic/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: 'Sistema do Brasa',
      userText: 'Comando atual',
      messages: [{ role: 'assistant', content: 'Resposta anterior' }, { role: 'user', content: 'Oi' }]
    })
  });

  const body = await response.json();
  const sent = JSON.parse(calls[0].init.body);

  assert.equal(response.status, 200);
  assert.deepEqual(body, { text: 'Resposta Gemini.' });
  assert.equal(calls[0].url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent');
  assert.equal(calls[0].init.headers['x-goog-api-key'], 'gemini-secret');
  assert.deepEqual(sent.systemInstruction, { parts: [{ text: 'Sistema do Brasa' }] });
  assert.deepEqual(sent.contents, [
    { role: 'model', parts: [{ text: 'Resposta anterior' }] },
    { role: 'user', parts: [{ text: 'Oi' }] },
    { role: 'user', parts: [{ text: 'Comando atual' }] }
  ]);
});

test('assistant route uses Gemini 3.5 Flash by default', async () => {
  const calls = [];
  const app = createMainApp({
    env: { GEMINI_API_KEY: 'gemini-secret' },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Resposta Gemini.' }] } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const response = await request(app, '/api/anthropic/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userText: 'Oi' })
  });

  const sent = JSON.parse(calls[0].init.body);

  assert.equal(response.status, 200);
  assert.equal(calls[0].url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent');
  assert.equal(sent.contents[0].role, 'user');
  assert.equal(sent.contents[0].parts[0].text, 'Oi');
});

test('assistant route reports Gemini errors without masking them with Anthropic fallback', async () => {
  const calls = [];
  const app = createMainApp({
    env: {
      GEMINI_API_KEY: 'gemini-secret',
      ANTHROPIC_API_KEY: 'anthropic-secret',
      ANTHROPIC_MODEL: 'claude-test'
    },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ error: { message: 'Gemini model unavailable.' } }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const response = await request(app, '/api/anthropic/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userText: 'Oi' })
  });

  const body = await response.json();

  assert.equal(response.status, 400);
  assert.match(response.headers.get('content-type'), /^application\/problem\+json/);
  assert.equal(body.status, 400);
  assert.equal(body.code, 'bad_request');
  assert.equal(body.error, 'Gemini model unavailable.');
  assert.equal(body.message, 'Gemini model unavailable.');
  assert.ok(body.hint);
  assert.equal(calls.length, 1);
});

test('tts route uses Gemini TTS first and returns wav audio', async () => {
  const calls = [];
  const app = createMainApp({
    env: {
      GEMINI_API_KEY: 'gemini-secret',
      GEMINI_TTS_VOICE: 'Charon'
    },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      const pcm = Buffer.alloc(8, 1).toString('base64');
      return new Response(JSON.stringify({ output_audio: { data: pcm } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const response = await request(app, '/api/elevenlabs/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Senhor, voz Gemini ativa.' })
  });

  const audio = Buffer.from(await response.arrayBuffer());
  const sent = JSON.parse(calls[0].init.body);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'audio/wav');
  assert.equal(audio.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(audio.subarray(8, 12).toString('ascii'), 'WAVE');
  assert.equal(calls[0].url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
  assert.equal(calls[0].init.headers['x-goog-api-key'], 'gemini-secret');
  assert.equal(sent.model, 'gemini-3.1-flash-tts-preview');
  assert.equal(sent.input, 'Say in Portuguese with a formal, strategic and warm executive tone: Senhor, voz Gemini ativa.');
  assert.deepEqual(sent.response_format, { type: 'audio' });
  assert.deepEqual(sent.generation_config, { speech_config: [{ voice: 'Charon' }] });
});

test('tts route maps deprecated Gemini TTS model to current preview model', async () => {
  const calls = [];
  const app = createMainApp({
    env: {
      GEMINI_API_KEY: 'gemini-secret',
      GEMINI_TTS_MODEL: 'gemini-2.5-flash-preview-tts'
    },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      const pcm = Buffer.alloc(8, 1).toString('base64');
      return new Response(JSON.stringify({ output_audio: { data: pcm } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const response = await request(app, '/api/elevenlabs/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Teste.' })
  });

  const sent = JSON.parse(calls[0].init.body);

  assert.equal(response.status, 200);
  assert.equal(sent.model, 'gemini-3.1-flash-tts-preview');
});

test('tts route accepts Gemini audio from output arrays', async () => {
  const app = createMainApp({
    env: { GEMINI_API_KEY: 'gemini-secret' },
    fetchImpl: async () => {
      const pcm = Buffer.alloc(8, 2).toString('base64');
      return new Response(JSON.stringify({ output: [{ type: 'audio', data: pcm }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const response = await request(app, '/api/elevenlabs/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Teste.' })
  });

  const audio = Buffer.from(await response.arrayBuffer());

  assert.equal(response.status, 200);
  assert.equal(audio.subarray(0, 4).toString('ascii'), 'RIFF');
});

test('tts route accepts Gemini audio nested in interaction steps', async () => {
  const app = createMainApp({
    env: { GEMINI_API_KEY: 'gemini-secret' },
    fetchImpl: async () => {
      const pcm = Buffer.alloc(8, 3).toString('base64');
      return new Response(JSON.stringify({ steps: [{ output: [{ type: 'audio', data: pcm }] }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const response = await request(app, '/api/elevenlabs/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Teste.' })
  });

  const audio = Buffer.from(await response.arrayBuffer());

  assert.equal(response.status, 200);
  assert.equal(audio.subarray(0, 4).toString('ascii'), 'RIFF');
});

test('tts route reports Gemini TTS errors without masking them with ElevenLabs fallback', async () => {
  const calls = [];
  const app = createMainApp({
    env: {
      GEMINI_API_KEY: 'gemini-secret',
      GEMINI_TTS_MODEL: 'gemini-3.1-flash-tts-preview',
      ELEVENLABS_API_KEY: 'eleven-secret',
      ELEVENLABS_VOICE_ID: 'voice-id'
    },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ error: { message: 'Gemini TTS unavailable.' } }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const response = await request(app, '/api/elevenlabs/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Teste.' })
  });

  const body = await response.json();

  assert.equal(response.status, 404);
  assert.match(response.headers.get('content-type'), /^application\/problem\+json/);
  assert.equal(body.status, 404);
  assert.equal(body.code, 'not_found');
  assert.equal(body.error, 'Gemini TTS unavailable.');
  assert.equal(calls.length, 1);
});

test('tts route times out slow Gemini TTS requests', async () => {
  const app = createMainApp({
    env: {
      GEMINI_API_KEY: 'gemini-secret',
      BRASA_TTS_TIMEOUT_MS: '1'
    },
    fetchImpl: async (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () => {
          const error = new Error('aborted');
          error.name = 'AbortError';
          reject(error);
        });
      })
  });

  const response = await request(app, '/api/elevenlabs/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Teste lento.' })
  });

  const body = await response.json();

  assert.equal(response.status, 504);
  assert.match(response.headers.get('content-type'), /^application\/problem\+json/);
  assert.equal(body.status, 504);
  assert.equal(body.code, 'gateway_timeout');
  assert.equal(body.error, 'Gemini TTS demorou demais.');
});

test('tts route opens a circuit after Gemini TTS quota errors', async () => {
  const calls = [];
  const app = createMainApp({
    env: {
      GEMINI_API_KEY: 'gemini-secret',
      BRASA_TTS_CIRCUIT_OPEN_MS: '60000'
    },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ error: { message: 'Resource exhausted.' } }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const firstResponse = await request(app, '/api/elevenlabs/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Primeira tentativa.' })
  });
  const secondResponse = await request(app, '/api/elevenlabs/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Segunda tentativa.' })
  });

  const firstBody = await firstResponse.json();
  const secondBody = await secondResponse.json();

  assert.equal(firstResponse.status, 429);
  assert.equal(firstBody.error, 'Resource exhausted.');
  assert.equal(firstBody.code, 'rate_limit_exceeded');
  assert.equal(secondResponse.status, 429);
  assert.match(secondBody.error, /circuito de voz/i);
  assert.equal(calls.length, 1);
});

test('cors allows the Brasa subdomain', async () => {
  const app = createMainApp({ env: {} });
  const response = await request(app, '/api/health', {
    headers: { Origin: 'https://brasa.leonardobrasil.com.br' }
  });

  assert.equal(response.headers.get('access-control-allow-origin'), 'https://brasa.leonardobrasil.com.br');
});

test('assistant route falls back to Anthropic and returns text', async () => {
  const calls = [];
  const app = createMainApp({
    env: { ANTHROPIC_API_KEY: 'secret', ANTHROPIC_MODEL: 'claude-test' },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ content: [{ type: 'text', text: 'Resposta do Brasa.' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const response = await request(app, '/api/anthropic/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: 'Sistema',
      userText: 'Comando',
      messages: [{ role: 'system', content: 'ignore' }, { role: 'user', content: 'Oi' }]
    })
  });

  const body = await response.json();
  const sent = JSON.parse(calls[0].init.body);

  assert.equal(response.status, 200);
  assert.deepEqual(body, { text: 'Resposta do Brasa.' });
  assert.equal(sent.model, 'claude-test');
  assert.deepEqual(sent.messages, [
    { role: 'user', content: 'Oi' },
    { role: 'user', content: 'Comando' }
  ]);
});

test('GET /api/ads/status reports credential status and fallback mode when unconfigured', async () => {
  const app = createMainApp({ env: {} });
  const response = await request(app, '/api/ads/status');
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.ready, false);
  assert.equal(body.mode, 'local-intelligence-fallback');
  assert.equal(body.configured.developerToken, false);
  assert.equal(body.configured.refreshToken, false);
});

test('POST /api/ads/keyword-ideas calls official Google Ads REST API when credentials are present', async () => {
  const calls = [];
  const app = createMainApp({
    env: {
      GOOGLE_ADS_DEVELOPER_TOKEN: 'dev-token-123',
      GOOGLE_ADS_CLIENT_ID: 'client-id-123.apps.googleusercontent.com',
      GOOGLE_ADS_CLIENT_SECRET: 'client-secret-123',
      GOOGLE_ADS_REFRESH_TOKEN: 'refresh-token-123',
      GOOGLE_ADS_LOGIN_CUSTOMER_ID: '123-456-7890',
      GOOGLE_ADS_CUSTOMER_ID: '987-654-3210'
    },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      if (url === 'https://oauth2.googleapis.com/token') {
        return new Response(JSON.stringify({ access_token: 'ya29.mock-access-token' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (url.includes('googleads.googleapis.com') && url.includes(':generateKeywordIdeas')) {
        return new Response(
          JSON.stringify({
            results: [
              {
                text: 'clínica veterinária porto alegre 24h',
                keywordIdeaMetrics: {
                  avgMonthlySearches: '1900',
                  competition: 'HIGH',
                  competitionIndex: '82',
                  lowTopOfPageBidMicros: '2400000',
                  highTopOfPageBidMicros: '6800000',
                  monthlySearchVolumes: [
                    { year: '2026', month: 'JANUARY', monthlySearches: '1800' },
                    { year: '2026', month: 'FEBRUARY', monthlySearches: '1950' }
                  ]
                }
              },
              {
                text: 'consulta veterinário preço',
                keywordIdeaMetrics: {
                  avgMonthlySearches: '880',
                  competition: 'MEDIUM',
                  competitionIndex: '55',
                  lowTopOfPageBidMicros: '1800000',
                  highTopOfPageBidMicros: '4500000',
                  monthlySearchVolumes: []
                }
              }
            ]
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`Unexpected fetch URL: ${url}`);
    }
  });

  const response = await request(app, '/api/ads/keyword-ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      keywords: ['clínica veterinária'],
      citySlug: 'porto-alegre',
      neighborhood: 'Tristeza'
    })
  });

  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.source, 'google-ads-api');
  assert.ok(Array.isArray(body.ideas));
  assert.equal(body.ideas.length, 2);
  assert.equal(body.ideas[0].keyword, 'clínica veterinária porto alegre 24h');
  assert.equal(body.ideas[0].avgMonthlySearches, 1900);
  assert.equal(body.ideas[0].lowTopOfPageBidBrl, 2.4);
  assert.equal(body.ideas[0].highTopOfPageBidBrl, 6.8);
  assert.equal(body.ideas[0].intent, 'transacional');
  assert.ok(body.ideas[0].adGroupCluster.includes('Urgência'));
  assert.ok(Array.isArray(body.negativeKeywords));
  assert.ok(body.negativeKeywords.length > 5);

  const adsCall = calls.find((c) => c.url.includes('generateKeywordIdeas'));
  assert.ok(adsCall);
  assert.equal(adsCall.init.headers['developer-token'], 'dev-token-123');
  assert.equal(adsCall.init.headers['login-customer-id'], '1234567890');
});

test('POST /api/ads/keyword-ideas returns local intelligence fallback when Google Ads credentials are not configured', async () => {
  const app = createMainApp({
    env: {},
    fetchImpl: async () => {
      return new Response(JSON.stringify(['clínica odontológica', ['clínica odontológica tristeza', 'dentista urgente porto alegre']]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const response = await request(app, '/api/ads/keyword-ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      keywords: ['clínica odontológica'],
      citySlug: 'porto-alegre',
      neighborhood: 'Tristeza'
    })
  });

  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.source, 'local-intelligence-fallback');
  assert.ok(body.ideas.length >= 10);
  assert.ok(body.summary.totalMonthlySearches > 0);
  assert.ok(body.negativeKeywords.includes('grátis'));
});

test('unknown routes return real HTTP 404 with Markdown error body, JSON ProblemDetails, or HTML while valid routes serve 200', async () => {
  const tempDist = mkdtempSync(path.join(tmpdir(), 'lb-dist-404-'));
  try {
    writeFileSync(path.join(tempDist, 'index.html'), '<!doctype html><html><body>SPA Shell</body></html>');
    writeFileSync(path.join(tempDist, 'llms.txt'), '# Leonardo Brasil');
    writeFileSync(path.join(tempDist, 'api-docs.md'), '# Leonardo Brasil API Docs');
    mkdirSync(path.join(tempDist, 'docs'), { recursive: true });
    writeFileSync(path.join(tempDist, 'docs', 'index.html'), '<!doctype html><html><body><h1>Leonardo Brasil API</h1></body></html>');

    const app = createMainApp({ env: {}, distDir: tempDist });

    // Unknown path with Accept: text/markdown -> 404 text/markdown (>= 20 chars + pointers)
    const md404 = await request(app, '/some-path-that-does-not-exist', {
      headers: { Accept: 'text/markdown' }
    });
    assert.equal(md404.status, 404);
    assert.match(md404.headers.get('content-type'), /^text\/markdown/);
    assert.match(md404.headers.get('vary'), /Accept/);
    const mdBody = await md404.text();
    assert.ok(mdBody.length >= 20);
    assert.ok(mdBody.includes('/docs'));
    assert.ok(mdBody.includes('/sitemap.xml'));
    assert.ok(mdBody.includes('/llms.txt'));

    // Unknown path with Accept: application/json -> 404 application/problem+json
    const json404 = await request(app, '/some-path-that-does-not-exist', {
      headers: { Accept: 'application/json' }
    });
    assert.equal(json404.status, 404);
    assert.match(json404.headers.get('content-type'), /^application\/problem\+json/);
    const jsonProblem = await json404.json();
    assert.equal(jsonProblem.code, 'resource_not_found');

    // Unknown path with Accept: text/html -> 404 HTML
    const html404 = await request(app, '/some-path-that-does-not-exist', {
      headers: { Accept: 'text/html' }
    });
    assert.equal(html404.status, 404);
    assert.match(html404.headers.get('content-type'), /^text\/html/);
    assert.match(await html404.text(), /404/);

    // Invalid programmatic niche/city & invalid blog slug combinations also return 404
    const badLocal = await request(app, '/google-meu-negocio/nicho-inventado/rs/porto-alegre');
    assert.equal(badLocal.status, 404);
    const badCity = await request(app, '/google-meu-negocio/dentistas/zz/cidade-inexistente');
    assert.equal(badCity.status, 404);
    const badBlog = await request(app, '/blog/artigo-que-nao-existe');
    assert.equal(badBlog.status, 404);

    // Known programmatic & static & trust routes return 200
    for (const validRoute of [
      '/',
      '/about',
      '/contact',
      '/privacy',
      '/docs',
      '/google-meu-negocio/dentistas/rs/porto-alegre',
      '/blog/como-captar-pacientes-odontologia-particular-implantes',
      '/crm/login'
    ]) {
      const ok = await request(app, validRoute);
      assert.equal(ok.status, 200, validRoute);
    }

    // Content negotiation on /docs & /about serves text/markdown when requested
    const docsMd = await request(app, '/docs', { headers: { Accept: 'text/markdown' } });
    assert.equal(docsMd.status, 200);
    assert.match(docsMd.headers.get('content-type'), /^text\/markdown/);
    assert.match(await docsMd.text(), /Leonardo Brasil API/);

    const aboutMd = await request(app, '/about', { headers: { Accept: 'text/markdown' } });
    assert.equal(aboutMd.status, 200);
    assert.match(aboutMd.headers.get('content-type'), /^text\/markdown/);
    assert.match(await aboutMd.text(), /65\.993\.728\/0001-07/);
  } finally {
    rmSync(tempDist, { recursive: true, force: true });
  }
});

test('API returns RFC 9457 JSON errors for malformed JSON, unknown /api endpoints, invalid API version and emits rate limit + deprecation headers', async () => {
  const app = createMainApp({
    env: {},
    rateLimitMax: 4,
    rateLimitWindowMs: 60_000
  });

  // Malformed JSON -> RFC 9457 400
  const malformed = await request(app, '/api/v1/oauth/sandbox-clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"broken": '
  });
  assert.equal(malformed.status, 400);
  assert.match(malformed.headers.get('content-type'), /^application\/problem\+json/);
  assert.equal((await malformed.json()).code, 'invalid_json');
  assert.equal(malformed.headers.get('ratelimit-limit'), '4');
  assert.equal(malformed.headers.get('ratelimit-remaining'), '3');

  // Invalid X-API-Version -> 400 unsupported_api_version
  const badVer = await request(app, '/api/v1/health', {
    headers: { 'X-API-Version': '99' }
  });
  assert.equal(badVer.status, 400);
  assert.equal((await badVer.json()).code, 'unsupported_api_version');

  // Legacy /api/health returns deprecation + Sunset headers + successor Link
  const legacyHealth = await request(app, '/api/health');
  assert.equal(legacyHealth.status, 200);
  assert.equal(legacyHealth.headers.get('deprecation'), 'true');
  assert.ok(legacyHealth.headers.get('sunset'));
  assert.match(legacyHealth.headers.get('link'), /\/api\/v1\/health>; rel="successor-version"/);

  // Unknown /api/* route -> 404 endpoint_not_found
  const unknownApi = await request(app, '/api/v1/does-not-exist');
  assert.equal(unknownApi.status, 404);
  assert.match(unknownApi.headers.get('content-type'), /^application\/problem\+json/);
  assert.equal((await unknownApi.json()).code, 'endpoint_not_found');

  // Exceeding 4 requests triggers 429 + Retry-After
  const limited = await request(app, '/api/v1/services');
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) >= 1);
  assert.match(limited.headers.get('content-type'), /^application\/problem\+json/);
  const limitBody = await limited.json();
  assert.equal(limitBody.code, 'rate_limit_exceeded');
  assert.ok(limitBody.hint);
});

test('self-serve sandbox OAuth 2.0 flow enforces least-privilege scopes and calculates Google Business Profile audit score', async () => {
  const app = createMainApp({
    env: { OAUTH_SIGNING_SECRET: 'test-signing-secret-0123456789' }
  });

  // 1. Keyless free discovery works without credentials
  const servicesRes = await request(app, '/api/v1/services');
  assert.equal(servicesRes.status, 200);
  assert.equal(servicesRes.headers.get('api-version'), '1.0.0');
  const servicesJson = await servicesRes.json();
  assert.equal(servicesJson.onboarding.tier, 'free-sandbox');
  assert.ok(servicesJson.services.length >= 4);

  const nichesRes = await request(app, '/api/v1/niches?q=dent&limit=5');
  assert.equal(nichesRes.status, 200);
  const nichesJson = await nichesRes.json();
  assert.ok(nichesJson.items.some((n) => n.slug === 'dentistas'));

  // 2. Unauthenticated call to protected route -> 401
  const noAuthChecklist = await request(app, '/api/v1/audit/checklist');
  assert.equal(noAuthChecklist.status, 401);
  assert.match(noAuthChecklist.headers.get('www-authenticate'), /^Bearer /);

  // 3. Provision sandbox client with limited scope ['catalog:read']
  const regReadOnly = await request(app, '/api/v1/oauth/sandbox-clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientName: 'Read-Only Agent',
      requestedScopes: ['catalog:read']
    })
  });
  assert.equal(regReadOnly.status, 201);
  const readOnlyClient = await regReadOnly.json();
  assert.deepEqual(readOnlyClient.scopes, ['catalog:read']);

  // Exchange via form-urlencoded
  const tokenRes = await request(app, '/api/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: readOnlyClient.client_id,
      client_secret: readOnlyClient.client_secret
    }).toString()
  });
  assert.equal(tokenRes.status, 200);
  const readOnlyToken = await tokenRes.json();
  assert.equal(readOnlyToken.token_type, 'Bearer');
  assert.equal(readOnlyToken.scope, 'catalog:read');

  // Cannot escalate scope beyond client registration
  const escalateRes = await request(app, '/api/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: readOnlyClient.client_id,
      client_secret: readOnlyClient.client_secret,
      scope: 'catalog:read audit:write'
    })
  });
  assert.equal(escalateRes.status, 403);
  assert.equal((await escalateRes.json()).code, 'invalid_scope');

  // Read checklist succeeds with catalog:read
  const checklistRes = await request(app, '/api/v1/audit/checklist', {
    headers: { Authorization: `Bearer ${readOnlyToken.access_token}` }
  });
  assert.equal(checklistRes.status, 200);
  assert.equal((await checklistRes.json()).totalWeight, 100);

  // Attempt write endpoint with read-only token -> 403 insufficient_scope
  const forbiddenWrite = await request(app, '/api/v1/audit/score', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${readOnlyToken.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answers: { category: true, nap: true, description: true, catalog: true, reviews: true, photos: true }
    })
  });
  assert.equal(forbiddenWrite.status, 403);
  assert.equal((await forbiddenWrite.json()).code, 'insufficient_scope');

  // 4. Provision full sandbox client via Basic Auth & run real audit scoring
  const regFull = await request(app, '/api/v1/oauth/sandbox-clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientName: 'Full Audit Agent' })
  });
  assert.equal(regFull.status, 201);
  const fullClient = await regFull.json();

  const basicCreds = Buffer.from(`${fullClient.client_id}:${fullClient.client_secret}`).toString('base64');
  const fullTokenRes = await request(app, '/api/v1/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicCreds}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=audit:write'
  });
  assert.equal(fullTokenRes.status, 200);
  const fullToken = await fullTokenRes.json();

  const scoreRes = await request(app, '/api/v1/audit/score', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${fullToken.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      companyName: 'Clínica Teste',
      cityState: 'Porto Alegre - RS',
      answers: {
        category: true,
        nap: false,
        description: true,
        catalog: false,
        reviews: true,
        photos: false
      }
    })
  });
  assert.equal(scoreRes.status, 200);
  const scoreJson = await scoreRes.json();
  // category(20) + description(15) + reviews(20) = 55
  assert.equal(scoreJson.score, 55);
  assert.equal(scoreJson.tier, 'vulneravel');
  assert.equal(scoreJson.failedPillars.length, 3);

  // Invalid answers payload -> 400 validation_error
  const badScore = await request(app, '/api/v1/audit/score', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${fullToken.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answers: { category: 'yes' } })
  });
  assert.equal(badScore.status, 400);
  assert.equal((await badScore.json()).code, 'validation_error');
});

test('OpenAPI 3.1 spec has 100% versioned operations, operationIds, typed response & error schemas, OAuth2 scopes and deprecation policy', () => {
  const specPath = fileURLToPath(new URL('../public/openapi.json', import.meta.url));
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));

  assert.equal(spec.openapi, '3.1.0');
  assert.ok(spec.components?.securitySchemes?.oauth2?.flows?.clientCredentials?.scopes);
  assert.ok(spec.components?.schemas?.ProblemDetails);
  assert.match(spec.info.description, /Deprecation|Sunset/i);

  const seenOpIds = new Set();
  const pathEntries = Object.entries(spec.paths);
  assert.ok(pathEntries.length >= 7);

  for (const [routePath, methods] of pathEntries) {
    assert.match(routePath, /^\/api\/v1\//, `Expected versioned path: ${routePath}`);
    for (const [method, operation] of Object.entries(methods)) {
      assert.ok(operation.operationId, `Missing operationId on ${method} ${routePath}`);
      assert.ok(!seenOpIds.has(operation.operationId), `Duplicate operationId: ${operation.operationId}`);
      seenOpIds.add(operation.operationId);
      assert.ok(operation.description && operation.description.length > 20);

      // Every operation must declare typed success schema & 4xx/5xx ProblemDetails responses
      const okResponse = operation.responses['200'] || operation.responses['201'];
      assert.ok(okResponse, `Missing 2xx response on ${operation.operationId}`);
      const okSchemaRef = okResponse.content?.['application/json']?.schema?.$ref;
      assert.ok(okSchemaRef, `Missing typed $ref schema on 2xx response for ${operation.operationId}`);

      const has4xx = Boolean(operation.responses['400'] || operation.responses['401'] || operation.responses['403']);
      const has5xx = Boolean(operation.responses['500']);
      assert.ok(has4xx && has5xx, `Missing 4xx/5xx typed error responses on ${operation.operationId}`);
    }
  }

  // Ensure every schema object under components.schemas defines concrete properties (not bare empty object)
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    assert.equal(schema.type, 'object', name);
    assert.ok(schema.properties && Object.keys(schema.properties).length >= 2, `Incomplete schema properties: ${name}`);
  }
});

test('trust pages, developer docs and Organization JSON-LD completeness are wired cleanly', () => {
  const seoHead = readFileSync(fileURLToPath(new URL('../src/components/SeoHead.tsx', import.meta.url)), 'utf8');
  assert.match(seoHead, /"@type":\s*"ContactPoint"/);
  assert.match(seoHead, /"@type":\s*"PostalAddress"/);
  assert.match(seoHead, /Leonardo Brasil SEO Local/);

  const skillMd = readFileSync(
    fileURLToPath(new URL('../public/.well-known/agent-skills/consultar-api-leonardo-brasil/SKILL.md', import.meta.url)),
    'utf8'
  );
  assert.match(skillMd, /When to use this/i);

  const llmsTxt = readFileSync(fileURLToPath(new URL('../public/llms.txt', import.meta.url)), 'utf8');
  assert.match(llmsTxt, /When to use this/i);
  assert.ok(llmsTxt.includes('https://leonardobrasil.com.br/docs'));
  assert.ok(llmsTxt.includes('https://leonardobrasil.com.br/about'));
  assert.ok(llmsTxt.includes('https://leonardobrasil.com.br/contact'));
  assert.ok(llmsTxt.includes('https://leonardobrasil.com.br/privacy'));

  const appSource = readFileSync(fileURLToPath(new URL('../src/App.tsx', import.meta.url)), 'utf8');
  assert.ok(appSource.includes('to="/docs"'));
  assert.ok(appSource.includes('https://github.com/leoferrazdev'));

  const trustPages = readFileSync(fileURLToPath(new URL('../src/pages/TrustPages.tsx', import.meta.url)), 'utf8');
  assert.ok(existsSync(fileURLToPath(new URL('../src/pages/DeveloperDocs.tsx', import.meta.url))));
  assert.ok(trustPages.length > 1500);
});
