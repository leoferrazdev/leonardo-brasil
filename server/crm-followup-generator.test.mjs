import { readFile } from "node:fs/promises";
import ts from "typescript";
import test from "node:test";
import assert from "node:assert/strict";

const generatorRaw = await readFile(
  new URL("../src/pages/crm/utils/followUpGenerator.ts", import.meta.url),
  "utf8"
);
const compiledGenerator = ts.transpileModule(generatorRaw, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
}).outputText;
const generator = await import(
  `data:text/javascript;base64,${Buffer.from(compiledGenerator).toString("base64")}`
);

const prospectsRaw = await readFile(
  new URL("../src/pages/crm/data/initialProspects.ts", import.meta.url),
  "utf8"
);
const strippedProspects = prospectsRaw.replace(
  /import\s+type\s+\{[^}]+\}\s+from\s+["'][^"']+["'];?\r?\n?/,
  ""
).replace(/:\s*ProspectLead\[\]/g, "");
const compiledProspects = ts.transpileModule(strippedProspects, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
}).outputText;
const prospectsMod = await import(
  `data:text/javascript;base64,${Buffer.from(compiledProspects).toString("base64")}`
);

const COLUMN_3_IDS = ["V-003", "E-002", "O-017", "O-022", "V-012"];

test("Column 3 Em Conversa leads carry bespoke blocoFollowUp with CNPJ Pix, video call and in-person options", () => {
  for (const id of COLUMN_3_IDS) {
    const lead = prospectsMod.INITIAL_PROSPECTS.find((p) => p.id === id);
    assert.ok(lead, `Lead ${id} must exist in INITIAL_PROSPECTS`);
    assert.ok(lead.blocoFollowUp && lead.blocoFollowUp.length > 200, `${id} must define blocoFollowUp`);

    const msg = lead.blocoFollowUp;
    assert.match(msg, /LEONARDO FERRAZ DA SILVA BRASIL/);
    assert.match(msg, /65\.993\.728\/0001-07/);
    assert.match(msg, /Pix/i);
    assert.match(msg, /chamada de vídeo/i);
    assert.match(msg, /pessoalmente/i);
    assert.match(msg, /R\$ 497,00/);
    assert.match(msg, /2x de R\$ 250,00/);

    assert.doesNotMatch(msg, /\b(?:nós|nossa|nosso|trabalhamos|fazemos)\b/i);
    assert.doesNotMatch(msg, /placa|qr\s*code|380|dois formatos/i);
  }
});

test("resolveFollowUpMessage builds tailored fallback for any future lead without explicit blocoFollowUp", () => {
  const genericLead = {
    id: "X-999",
    sampleId: "X-999",
    name: "Oficina Teste - Unidade Sul",
    segment: "Oficina Mecânica",
    neighborhood: "Camaquã",
    city: "Porto Alegre",
    address: "Av. Otto Niemeyer, 500 - Camaquã",
    phone: "(51) 99999-0000",
    formattedPhone: "5551999990000",
    whatsappConfirmed: true,
    mapsUrl: "",
    opportunityClass: "Classe A",
    opportunityIssue: "Fora do Top 3",
    searchKeyword: "oficina no Camaquã",
    monthlySearches: "1.500",
    observedPosition: 6,
    stage: "em_conversa",
    bloco1: "",
    bloco1Volume: "",
    bloco1Falha: "",
    bloco2: "",
    bloco3: "",
    bloco4: "",
    updatedAt: "2026-11-11T10:00:00Z",
  };

  const generated = generator.resolveFollowUpMessage(genericLead);
  assert.match(generated, /\*Oficina Teste\*/);
  assert.match(generated, /6º lugar/);
  assert.match(generated, /oficina no Camaquã/);
  assert.match(generated, /Av\. Otto Niemeyer, 500/);
  assert.match(generated, /LEONARDO FERRAZ DA SILVA BRASIL/);
  assert.match(generated, /65\.993\.728\/0001-07/);
  assert.match(generated, /chamada de vídeo/i);
  assert.match(generated, /pessoalmente/i);
  assert.doesNotMatch(generated, /\b(?:nós|nossa|nosso|trabalhamos|fazemos)\b/i);
});
