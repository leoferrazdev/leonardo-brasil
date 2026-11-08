import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import test from 'node:test';
import assert from 'node:assert/strict';
const source = await readFile(new URL('../src/lib/webmcp.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext } }).outputText;
const { createSiteTools, registerSiteTools } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('WebMCP callbacks expose services, navigate only to diagnosis and read catalog without credentials', async () => {
  let destination;
  let request;
  const tools = createSiteTools(path => { destination = path; }, async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ linkset: [] }), { headers: { 'Content-Type': 'application/linkset+json' } });
  });
  assert.equal(tools.length, 3);
  const services = JSON.parse((await tools[0].execute({})).content[0].text);
  assert.equal(services.servicos.length, 4);
  await tools[1].execute({});
  assert.equal(destination, '/auditoria-perfil-google');
  await tools[2].execute({});
  assert.equal(request.url, '/.well-known/api-catalog');
  assert.equal(request.options.credentials, 'omit');
});

test('WebMCP prefers document and aborts all registrations on cleanup', async () => {
  const calls = [];
  const tools = createSiteTools(() => {});
  const cleanup = registerSiteTools({ modelContext: { registerTool: async (tool, options) => { calls.push({ tool, options }); } } }, { modelContext: { registerTool: () => { throw new Error('legacy must not run'); } } }, tools);
  assert.equal(calls.length, 3);
  assert.ok(calls.every(c => !c.options.signal.aborted));
  cleanup();
  assert.ok(calls.every(c => c.options.signal.aborted));
});

test('WebMCP tolerates missing and rejected APIs and cleans up legacy registrations', async () => {
  const tools = createSiteTools(() => {});
  registerSiteTools({}, {}, tools)();
  const removed = [];
  const cleanup = registerSiteTools({}, { modelContext: { registerTool: () => {}, unregisterTool: name => removed.push(name) } }, tools);
  await Promise.resolve();
  cleanup();
  assert.deepEqual(removed, tools.map(t => t.name));
  registerSiteTools({ modelContext: { registerTool: () => Promise.reject(new Error('unsupported')) } }, {}, tools)();
  await new Promise(resolve => setImmediate(resolve));
});

test('WebMCP rejects HTML fallback instead of returning it as catalog data', async () => {
  const tools = createSiteTools(() => {}, async () => new Response('<html></html>', { headers: { 'Content-Type': 'text/html' } }));
  await assert.rejects(tools[2].execute({}), /indisponível/);
});
