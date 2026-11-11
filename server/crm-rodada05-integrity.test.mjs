import { readFile } from "node:fs/promises";
import ts from "typescript";
import test from "node:test";
import assert from "node:assert/strict";

async function loadTsModule(relativePath, stripPatterns = []) {
  let raw = await readFile(new URL(relativePath, import.meta.url), "utf8");
  for (const pat of stripPatterns) {
    raw = raw.replace(pat, "");
  }
  const compiled = ts.transpileModule(raw, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
}

const stripTypes = [
  /import\s+type\s+\{[^}]+\}\s+from\s+["'][^"']+["'];?\r?\n?/g,
  /:\s*ProspectLead\[\]/g,
];

const scoring = await loadTsModule("../src/pages/crm/utils/deterministicScoring.ts", stripTypes);
const activeMod = await loadTsModule("../src/pages/crm/data/initialProspects.ts", stripTypes);
const archivedMod = await loadTsModule("../src/pages/crm/data/archivedProspectsRound01.ts", stripTypes);
const drawerRaw = await readFile(
  new URL("../src/pages/crm/components/MessageBlocksDrawer.tsx", import.meta.url),
  "utf8",
);
const dashboardRaw = await readFile(
  new URL("../src/pages/crm/Dashboard.tsx", import.meta.url),
  "utf8",
);

const activeLeads = activeMod.INITIAL_PROSPECTS;
const archivedLeads = archivedMod.ARCHIVED_PROSPECTS_ROUND01;
const r05Leads = activeLeads.filter((l) => l.round === "Rodada 05");

test("Dataset counts and zero-duplication of Rodada 05 against all 92 prior active + archived leads", () => {
  assert.equal(activeLeads.length, 72, "INITIAL_PROSPECTS must have 72 leads (52 prior + 20 Rodada 05)");
  assert.equal(archivedLeads.length, 40, "ARCHIVED_PROSPECTS_ROUND01 must have 40 leads");
  assert.equal(r05Leads.length, 20, "Rodada 05 must contain exactly 20 leads");

  // 1. All 72 active leads must have unique IDs, phones, and names
  const activeIds = new Set();
  const activePhones = new Set();
  const activeNames = new Set();
  for (const lead of activeLeads) {
    assert.ok(!activeIds.has(lead.id), `Duplicate active ID: ${lead.id}`);
    activeIds.add(lead.id);

    const normName = lead.name.trim().toLowerCase();
    assert.ok(!activeNames.has(normName), `Duplicate active company name: ${lead.name}`);
    activeNames.add(normName);

    const digits = (lead.formattedPhone || lead.phone || "").replace(/\D/g, "").replace(/^55/, "");
    if (digits) {
      assert.ok(!activePhones.has(digits), `Duplicate active phone: ${digits} (${lead.id})`);
      activePhones.add(digits);
    }
  }

  // 2. Every Rodada 05 lead must be globally unique against ALL 92 prior active + archived leads
  const priorLeads = [...activeLeads.filter((l) => l.round !== "Rodada 05"), ...archivedLeads];
  const priorIds = new Set(priorLeads.map((l) => l.id));
  const priorNames = new Set(priorLeads.map((l) => l.name.trim().toLowerCase()));
  const priorPhones = new Set(
    priorLeads
      .map((l) => (l.formattedPhone || l.phone || "").replace(/\D/g, "").replace(/^55/, ""))
      .filter(Boolean),
  );

  for (const lead of r05Leads) {
    assert.ok(!priorIds.has(lead.id), `Rodada 05 ID collides with prior pool: ${lead.id}`);
    assert.ok(!priorNames.has(lead.name.trim().toLowerCase()), `Rodada 05 name collides with prior pool: ${lead.name}`);
    const digits = (lead.formattedPhone || lead.phone || "").replace(/\D/g, "").replace(/^55/, "");
    assert.ok(!priorPhones.has(digits), `Rodada 05 phone collides with prior pool: ${digits} (${lead.id})`);
  }
});

test("Every Rodada 05 lead passes Critério P, Classe A (>=75), Direct Mobile WhatsApp, Modelo B active & Copy Purity", () => {
  for (const lead of r05Leads) {
    assert.equal(lead.stage, "a_abordar", `${lead.id} must start in column 1 (a_abordar)`);
    assert.ok(
      typeof lead.observedPosition === "number" && lead.observedPosition >= 4,
      `${lead.id} violates Critério P: observedPosition=${lead.observedPosition}`,
    );
    assert.equal(lead.whatsappConfirmed, true, `${lead.id} must have whatsappConfirmed=true`);
    assert.match(
      lead.formattedPhone,
      /^55519\d{8}$/,
      `${lead.id} formattedPhone must be a valid (51) 9XXXX-XXXX WhatsApp mobile: ${lead.formattedPhone}`,
    );

    assert.equal(
      scoring.resolveArchetypeTier(lead.segment),
      1,
      `${lead.id} segment "${lead.segment}" must resolve to Archetype Tier 1`,
    );

    assert.ok(lead.deterministicSignals, `${lead.id} must define deterministicSignals`);
    const computed = scoring.calculateDeterministicScore(lead.deterministicSignals);
    assert.equal(computed.eligible, true, `${lead.id} must be eligible`);
    assert.equal(
      lead.deterministicScore,
      computed.score,
      `${lead.id} stored deterministicScore (${lead.deterministicScore}) must match engine (${computed.score})`,
    );
    assert.ok(
      computed.score >= 75 && computed.tier === "A",
      `${lead.id} must be Classe A (>=75 pts), got ${computed.score} (${computed.tier})`,
    );

    // Modelo B (Falha Factual Auditada) active by default + Modelo A also present
    assert.equal(lead.bloco1, lead.bloco1Falha, `${lead.id} must use Modelo B as default bloco1`);
    assert.ok(lead.bloco1Volume && lead.bloco1Volume !== lead.bloco1Falha, `${lead.id} must provide distinct Modelo A option`);

    // Exclusive punctual offer R$ 497 / 2x R$ 250 in bloco4
    assert.match(lead.bloco4, /Esse formato de trabalho é 100% pontual, sem mensalidade nem fidelidade:/);
    assert.match(lead.bloco4, /\*R\$ 497,00\*/);
    assert.match(lead.bloco4, /\*2x de R\$ 250,00\*/);

    for (const field of ["bloco1", "bloco1Volume", "bloco1Falha", "bloco2", "bloco3", "bloco4"]) {
      const text = lead[field];
      assert.doesNotMatch(
        text,
        /\b(?:nós|nossa|nosso|nossas|nossos|trabalhamos|fazemos)\b/i,
        `1st-person plural forbidden in ${lead.id}.${field}`,
      );
      assert.doesNotMatch(
        text,
        /placa|qr\s*code|380|dois formatos|O meu formato de trabalho é/i,
        `Prohibited phrase found in ${lead.id}.${field}`,
      );
      assert.ok(!text.includes("**"), `Double-asterisk markdown (**) forbidden on WhatsApp in ${lead.id}.${field}`);
      assert.ok(!text.includes("`"), `Backtick (\`) forbidden on WhatsApp in ${lead.id}.${field}`);
    }
  }
});

test("Scoring engine blocks Top 3 (Critério P) and scores Tier 1 urgent/automotive niches accurately", () => {
  const top3Blocked = scoring.calculateDeterministicScore({
    observedPosition: 3,
    archetypeTier: 1,
    divergenciaD: true,
    falhaCanalWhatsApp: true,
    semCatalogoOuNaoReivindicado: true,
    horarioOuReviewsSemResposta: true,
    linkQuebradoL: true,
    whatsappConfirmed: true,
    monthlySearchVolume: 2900,
  });
  assert.equal(top3Blocked.eligible, false);
  assert.equal(top3Blocked.score, 0);

  for (const seg of [
    "Borracharia / Auto Socorro",
    "Auto Elétrica / Ar Automotivo",
    "Guincho / Auto Socorro 24h",
    "Chaveiro 24h",
    "Desentupidora 24h",
    "Oficina Mecânica",
  ]) {
    assert.equal(scoring.resolveArchetypeTier(seg), 1, `${seg} must resolve to Tier 1`);
  }
});

test("Dashboard filters and MessageBlocksDrawer support Rodada 05 niches and Modelo B auto-selection", () => {
  assert.match(dashboardRaw, /segLow\.includes\("borracharia"\)/);
  assert.match(dashboardRaw, /segLow\.includes\("reboque"\)/);
  assert.match(dashboardRaw, /segLow\.includes\("socorro"\)/);
  assert.match(
    drawerRaw,
    /lead\.bloco1\s*===\s*lead\.bloco1Falha\s*&&\s*lead\.bloco1\s*!==\s*lead\.bloco1Volume/,
    "Drawer must initialize bloco1Mode to 'falha' when lead.bloco1 defaults to Modelo B",
  );
});
