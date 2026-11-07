import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

/**
 * Pré-renderização estática.
 *
 * Depois do build do cliente (vite build) e do build de servidor
 * (vite build --ssr src/entry-server.tsx --outDir dist/server), este script
 * gera um index.html com CONTEÚDO REAL para cada rota do site.
 *
 * Motivo: robôs de IA e buscadores que não executam JavaScript passam a ler
 * o texto das páginas (antes viam só uma <div id="root"> vazia).
 */

const root = process.cwd();
const distDir = path.resolve(root, "dist");
const templatePath = path.join(distDir, "index.html");
const serverEntry = path.join(distDir, "server", "entry-server.js");

const NICHES_PATH = path.resolve(root, "src/data/niches.ts");
const BLOG_PATH = path.resolve(root, "src/data/blogData.ts");
const LOCATIONS_PATH = path.resolve(root, "src/data/locations.ts");

function readSlugs(filePath, label) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return [...content.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  } catch (error) {
    console.error(`[prerender] Falha ao ler ${label}:`, error.message);
    return [];
  }
}

function buildRoutes() {
  const staticRoutes = [
    "/",
    "/google-meu-negocio",
    "/consultoria",
    "/blog",
    "/brandbook",
    "/cidades",
    "/calculadora",
    "/porto-alegre-digital",
    "/termos",
    "/privacidade",
    "/exclusao-de-dados",
  ];

  const niches = readSlugs(NICHES_PATH, "niches.ts");
  const locations = readSlugs(LOCATIONS_PATH, "locations.ts");
  const blogSlugs = readSlugs(BLOG_PATH, "blogData.ts");

  const gmnHubRoutes = niches.map((slug) => `/google-meu-negocio/${slug}`);
  const nicheRoutes = niches.map((slug) => `/estrutura-de-vendas-para-${slug}`);
  const cityRoutes = [];
  for (const niche of niches) {
    for (const city of locations) {
      cityRoutes.push(`/estrutura-de-vendas-para-${niche}-em-${city}`);
    }
  }
  const blogRoutes = blogSlugs.map((slug) => `/blog/${slug}`);

  // Set para evitar rotas duplicadas
  return [...new Set([...staticRoutes, ...gmnHubRoutes, ...nicheRoutes, ...cityRoutes, ...blogRoutes])];
}

function outputPathFor(route) {
  if (route === "/") return path.join(distDir, "index.html");
  return path.join(distDir, route.replace(/^\//, ""), "index.html");
}

async function main() {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template não encontrado: ${templatePath}. Rode 'vite build' antes.`);
  }
  if (!fs.existsSync(serverEntry)) {
    throw new Error(
      `Bundle de servidor não encontrado: ${serverEntry}. Rode o build --ssr antes.`
    );
  }

  const template = fs.readFileSync(templatePath, "utf8");
  const { render } = await import(pathToFileURL(serverEntry).href);

  const routes = buildRoutes();
  let ok = 0;
  const failures = [];

  for (const route of routes) {
    try {
      const { appHtml, head } = render(route);
      const html = template
        .replace("<!--app-head-->", head)
        .replace("<!--app-html-->", appHtml);

      const outPath = outputPathFor(route);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, "utf8");
      ok += 1;
    } catch (error) {
      failures.push({ route, message: error.message });
      console.error(`[prerender] ERRO em ${route}:`, error.message);
    }
  }

  // Limpa o bundle de servidor (não deve ir para produção).
  try {
    fs.rmSync(path.join(distDir, "server"), { recursive: true, force: true });
  } catch {
    /* ignora */
  }

  console.log(`[prerender] ${ok}/${routes.length} páginas geradas com sucesso.`);
  if (failures.length > 0) {
    console.error(`[prerender] ${failures.length} rota(s) falharam.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[prerender] Falha geral:", error);
  process.exit(1);
});
