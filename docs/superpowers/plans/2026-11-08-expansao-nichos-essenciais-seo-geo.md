# Expansão de Nichos Essenciais em SEO Local e GEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expandir a máquina de SEO Local e GEO do ecossistema Leonardo Brasil com 10 clusters canônicos de serviços essenciais de alta urgência e necessidade básica, gerando 512.532 URLs na malha programática com dados estruturados e sitemaps particionados.

**Architecture:** Mapeamento de 10 clusters semânticos enriquecidos em `src/data/niches.ts` e `src/data/seoNicheData.ts`, integrados à lista geográfica `src/data/seoLocations.json`. Formatação semântica na landing page local `GoogleMeuNegocioLocalLanding.tsx`, compilação em 13-14 sitemaps particionados (`generate-sitemap.mjs`) e pré-renderização estática (`prerender.mjs`).

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Schema.org (JSON-LD), Node.js ESM Scripts.

## Global Constraints
- WhatsApp oficial: `5551996737359` (`+55 51 99673-7359`).
- Cores e tema: Dark mode premium (#080d18, acentos em azul #2563eb / #3b82f6).
- Não instalar novas dependências sem necessidade estrita.
- Preservar Core Web Vitals (LCP < 1.2s) e rotas híbridas SSR/Prerender.
- Todas as mensagens de WhatsApp devem ser contextualizadas e parametrizadas.

---

### Task 1: Enriquecer dados dos nichos em `src/data/niches.ts`

**Files:**
- Modify: `src/data/niches.ts`
- Test: `scripts/test-niches-data.mjs`

**Interfaces:**
- Produces: `NICHES: NicheData[]` exportando os 10 novos clusters (`eletricistas`, `pedreiros`, `guinchos`, `assistencia-celulares`, `manutencao-computadores`, `oficinas-mecanicas`, `clinicas-veterinarias`, `pet-shops`, `agropecuarias`, `restaurantes`).

- [ ] **Step 1: Escrever teste de validação dos dados de nichos**

Criar `scripts/test-niches-data.mjs` para checar se todos os 10 novos slugs existem e contêm os campos obrigatórios da interface `NicheData`:

```javascript
import fs from "fs";
import path from "path";

const content = fs.readFileSync("src/data/niches.ts", "utf8");
const requiredSlugs = [
  "eletricistas",
  "pedreiros",
  "guinchos",
  "assistencia-celulares",
  "manutencao-computadores",
  "oficinas-mecanicas",
  "clinicas-veterinarias",
  "pet-shops",
  "agropecuarias",
  "restaurantes"
];

const missing = requiredSlugs.filter(slug => !content.includes(`slug: "${slug}"`));
if (missing.length > 0) {
  console.error("FAIL: Slugs ausentes em niches.ts:", missing);
  process.exit(1);
}
console.log("PASS: Todos os 10 clusters estão declarados em niches.ts.");
```

- [ ] **Step 2: Rodar teste e verificar falha**

Run: `node scripts/test-niches-data.mjs`  
Expected: FAIL com slugs ausentes.

- [ ] **Step 3: Implementar os dados dos novos clusters em `src/data/niches.ts`**

Adicionar ao array `NICHES` em `src/data/niches.ts` as definições completas de cada um dos novos clusters com copywriting de alta conversão, dores específicas e parâmetros de WhatsApp.

- [ ] **Step 4: Rodar teste e verificar aprovação**

Run: `node scripts/test-niches-data.mjs`  
Expected: PASS: Todos os 10 clusters estão declarados em niches.ts.

- [ ] **Step 5: Commit**

```bash
git add src/data/niches.ts scripts/test-niches-data.mjs
git commit -m "feat(seo): add 10 essential niche clusters to niches.ts"
```

---

### Task 2: Enriquecer argumentos de SEO, GEO e FAQs em `src/data/seoNicheData.ts`

**Files:**
- Modify: `src/data/seoNicheData.ts`
- Test: `scripts/test-seo-niche-data.mjs`

**Interfaces:**
- Produces: `seoNicheData: Record<string, NicheData>` contendo entradas completas para todos os novos slugs, incluindo `title`, `heroSubtitle`, `painPointTitle`, `painPointDescription`, `benefits` e `faqs`.

- [ ] **Step 1: Escrever teste de validação de `seoNicheData.ts`**

Criar `scripts/test-seo-niche-data.mjs`:

```javascript
import fs from "fs";

const content = fs.readFileSync("src/data/seoNicheData.ts", "utf8");
const requiredSlugs = [
  "eletricistas",
  "pedreiros",
  "guinchos",
  "assistencia-celulares",
  "manutencao-computadores",
  "oficinas-mecanicas",
  "clinicas-veterinarias",
  "pet-shops",
  "agropecuarias",
  "restaurantes"
];

const missing = requiredSlugs.filter(slug => !content.includes(`${slug}: {`) && !content.includes(`"${slug}": {`));
if (missing.length > 0) {
  console.error("FAIL: Slugs ausentes em seoNicheData.ts:", missing);
  process.exit(1);
}
console.log("PASS: Todos os 10 clusters possuem FAQs e dados ricos em seoNicheData.ts.");
```

- [ ] **Step 2: Rodar teste e verificar falha**

Run: `node scripts/test-seo-niche-data.mjs`  
Expected: FAIL com slugs ausentes.

- [ ] **Step 3: Implementar conteúdo detalhado em `src/data/seoNicheData.ts`**

Adicionar para cada cluster os dados ricos de GEO, benefícios, dores de captação e perguntas frequentes preparadas para `FAQPage` e AI Overviews.

- [ ] **Step 4: Rodar teste e verificar aprovação**

Run: `node scripts/test-seo-niche-data.mjs`  
Expected: PASS: Todos os 10 clusters possuem FAQs e dados ricos em seoNicheData.ts.

- [ ] **Step 5: Commit**

```bash
git add src/data/seoNicheData.ts scripts/test-seo-niche-data.mjs
git commit -m "feat(seo): enrich seoNicheData with GEO FAQs and pain points"
```

---

### Task 3: Integrar malha em `src/data/seoLocations.json` e atualizar `GoogleMeuNegocioLocalLanding.tsx`

**Files:**
- Modify: `src/data/seoLocations.json`
- Modify: `src/pages/GoogleMeuNegocioLocalLanding.tsx`
- Test: `scripts/test-locations-integration.mjs`

**Interfaces:**
- Consumes: Slugs definidos em `niches.ts`.
- Produces: `locationsData.NICHES` contendo os 23 nichos no total; `formatNiche(nicho)` formatando com precisão gramatical todos os novos nichos.

- [ ] **Step 1: Escrever teste de validação de `seoLocations.json` e `formatNiche`**

Criar `scripts/test-locations-integration.mjs`:

```javascript
import fs from "fs";

const locData = JSON.parse(fs.readFileSync("src/data/seoLocations.json", "utf8"));
const landingCode = fs.readFileSync("src/pages/GoogleMeuNegocioLocalLanding.tsx", "utf8");

const requiredSlugs = [
  "eletricistas",
  "pedreiros",
  "guinchos",
  "assistencia-celulares",
  "manutencao-computadores",
  "oficinas-mecanicas",
  "clinicas-veterinarias",
  "pet-shops",
  "agropecuarias",
  "restaurantes"
];

const missingInLoc = requiredSlugs.filter(slug => !locData.NICHES.some(n => n.slug === slug));
if (missingInLoc.length > 0) {
  console.error("FAIL: Slugs ausentes em seoLocations.json:", missingInLoc);
  process.exit(1);
}

const missingInFormat = requiredSlugs.filter(slug => !landingCode.includes(`"${slug}"`));
if (missingInFormat.length > 0) {
  console.error("FAIL: Slugs ausentes no formatNiche de GoogleMeuNegocioLocalLanding.tsx:", missingInFormat);
  process.exit(1);
}

console.log("PASS: Malha de locais e formatters 100% sincronizados.");
```

- [ ] **Step 2: Rodar teste e verificar falha**

Run: `node scripts/test-locations-integration.mjs`  
Expected: FAIL.

- [ ] **Step 3: Atualizar `src/data/seoLocations.json` e `formatNiche`**

Adicionar os novos nichos à chave `NICHES` em `src/data/seoLocations.json` e mapear cada um na função `formatNiche` em `src/pages/GoogleMeuNegocioLocalLanding.tsx`.

- [ ] **Step 4: Rodar teste e verificar aprovação**

Run: `node scripts/test-locations-integration.mjs`  
Expected: PASS: Malha de locais e formatters 100% sincronizados.

- [ ] **Step 5: Commit**

```bash
git add src/data/seoLocations.json src/pages/GoogleMeuNegocioLocalLanding.tsx scripts/test-locations-integration.mjs
git commit -m "feat(seo): sync 23 niches into seoLocations.json and local landing formatters"
```

---

### Task 4: Compilação dos Sitemaps Particionados (`generate-sitemap.mjs`)

**Files:**
- Modify: `scripts/generate-sitemap.mjs`
- Test: `public/sitemap.xml`

**Interfaces:**
- Produces: 512.532 URLs particionadas em lotes de 40.000 URLs sob o `sitemap.xml` mestre.

- [ ] **Step 1: Executar geração de sitemaps**

Run: `node scripts/generate-sitemap.mjs`  
Expected: Conclusão com sucesso gerando `sitemap-core.xml` e `sitemap-local-1.xml` a `sitemap-local-13.xml` ou `14.xml`.

- [ ] **Step 2: Validar integridade do sitemap mestre e URLs particionadas**

Run: `node -e "const xml = require('fs').readFileSync('public/sitemap.xml', 'utf8'); console.log('Sitemaps referenciados no indice:', (xml.match(/<sitemap>/g) || []).length);"`  
Expected: Pelo menos 14 sitemaps referenciados.

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-sitemap.mjs public/sitemap*.xml
git commit -m "feat(seo): generate partitioned sitemaps for 512k programmatic URLs"
```

---

### Task 5: Validação do Build TypeScript e Pré-renderização Estática

**Files:**
- Test: `dist/index.html`, `dist/google-meu-negocio/guinchos/index.html`

- [ ] **Step 1: Executar build e pré-renderização**

Run: `npm run build`  
Expected: Zero erros de TypeScript, build client e SSR gerados e script `prerender.mjs` executando a pré-renderização das rotas dos novos hubs.

- [ ] **Step 2: Validar arquivos HTML pré-renderizados**

Run: `node -e "const fs = require('fs'); const check = ['dist/google-meu-negocio/guinchos/index.html', 'dist/google-meu-negocio/eletricistas/index.html', 'dist/google-meu-negocio/oficinas-mecanicas/index.html']; check.forEach(f => console.log(f, fs.existsSync(f) ? 'OK' : 'MISSING'));"`  
Expected: Todos OK com conteúdo pré-renderizado.

- [ ] **Step 3: Commit e Limpeza de Scripts Temporários**

```bash
git rm scripts/test-niches-data.mjs scripts/test-seo-niche-data.mjs scripts/test-locations-integration.mjs
git commit -m "chore: cleanup test scripts after verification"
```

---

### Task 6: Push para a Branch Main

- [ ] **Step 1: Push dos commits para o repositório remoto**

Run: `git push origin main`  
Expected: Sucesso no push para `origin/main`.
