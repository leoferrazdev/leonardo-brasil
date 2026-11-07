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
    "/otimizacao-google-meu-negocio",
    "/recuperar-perfil-suspenso-google",
    "/consultoria",
    "/blog",
    "/brandbook",
    "/cidades",
    "/porto-alegre-digital",
    "/termos",
    "/privacidade",
    "/exclusao-de-dados",
  ];

  const niches = readSlugs(NICHES_PATH, "niches.ts");
  const blogSlugs = readSlugs(BLOG_PATH, "blogData.ts");

  const gmnHubRoutes = niches.map((slug) => `/google-meu-negocio/${slug}`);
  const otimizacaoHubRoutes = niches.map((slug) => `/otimizacao-google-meu-negocio/${slug}`);
  const blogRoutes = blogSlugs.map((slug) => `/blog/${slug}`);

  // Set para evitar rotas duplicadas
  return [...new Set([...staticRoutes, ...gmnHubRoutes, ...otimizacaoHubRoutes, ...blogRoutes])];
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
      failures.push({ route, error: error.message });
    }
  }

  console.log(`[prerender] ${ok}/${routes.length} rotas geradas com sucesso.`);
  if (failures.length > 0) {
    console.warn(`[prerender] ${failures.length} falhas:`);
    for (const f of failures) {
      console.warn(`  - ${f.route}: ${f.error}`);
    }
    // Falha o build se alguma rota quebrar
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("[prerender] Erro fatal:", err);
  process.exit(1);
});
