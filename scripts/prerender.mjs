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
const LOCATIONS_JSON_PATH = path.resolve(root, "src/data/seoLocations.json");
const BLOG_PATH = path.resolve(root, "src/data/blogData.ts");

function readLocationNicheSlugs() {
  try {
    const parsed = JSON.parse(fs.readFileSync(LOCATIONS_JSON_PATH, "utf8"));
    return Array.isArray(parsed.NICHES) ? parsed.NICHES.map((n) => n.slug) : [];
  } catch (error) {
    console.error("[prerender] Falha ao ler seoLocations.json:", error.message);
    return [];
  }
}

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
    "/consultor-google-meu-negocio",
    "/especialista-google-maps",
    "/gestao-google-meu-negocio",
    "/criar-e-verificar-google-meu-negocio",
    "/recuperar-perfil-suspenso-google",
    "/auditoria-perfil-google",
    "/google-meu-negocio/medicos-cfm",
    "/google-meu-negocio/advogados-oab",
    "/google-meu-negocio/dentistas-cfo",
    "/consultoria",
    "/blog",
    "/brandbook",
    "/cidades",
    "/porto-alegre-digital",
    "/segmentos-locais-google-maps",
    "/primeiro-lugar-no-google-2027",
    "/como-colocar-minha-empresa-no-google",
    "/como-ficar-na-primeira-pagina-do-google",
    "/como-divulgar-minha-empresa-no-google",
    "/como-aparecer-no-google-maps",
    "/como-vender-mais-no-google",
    "/como-aparecer-no-google-de-graca",
    "/anunciar-no-google",
    "/google-ads",
    "/anuncios-google",
    "/gestor-google-ads",
    "/consultor-google-ads",
    "/agencia-google-ads-negocios-locais",
    "/google-ads-e-google-meu-negocio",
    "/auditoria-google-ads",
    "/como-fazer-meu-site-aparecer-no-google-em-primeiro",
    "/como-fazer-um-site-aparecer-no-google",
    "/termos",
    "/privacidade",
    "/privacy",
    "/exclusao-de-dados",
    "/about",
    "/contact",
    "/docs",
    "/api",
    "/developers",
    "/webmcp",
  ];

  const niches = [...new Set([...readSlugs(NICHES_PATH, "niches.ts"), ...readLocationNicheSlugs()])];
  const adsNiches = readLocationNicheSlugs();
  const blogSlugs = readSlugs(BLOG_PATH, "blogData.ts");

  const gmnHubRoutes = niches.map((slug) => `/google-meu-negocio/${slug}`);
  const otimizacaoHubRoutes = niches.map((slug) => `/otimizacao-google-meu-negocio/${slug}`);
  const consultorHubRoutes = niches.map((slug) => `/consultor-google-meu-negocio/${slug}`);
  const especialistaHubRoutes = niches.map((slug) => `/especialista-google-maps/${slug}`);
  const googleAdsHubRoutes = adsNiches.map((slug) => `/google-ads/${slug}`);
  const blogRoutes = blogSlugs.map((slug) => `/blog/${slug}`);

  const priorityCities = [
    "blumenau",
    "florianopolis",
    "caxias-do-sul",
    "maringa",
    "londrina",
    "ribeirao-preto",
    "santos",
    "campinas",
    "curitiba",
    "joinville",
    "belo-horizonte",
    "brasilia",
    "uberlandia",
    "juiz-de-fora",
    "guarapuava",
    "porto-alegre",
    "sao-paulo",
  ];
  const cityHubRoutes = priorityCities.map((slug) => `/cidades/${slug}`);

  // Set para evitar rotas duplicadas
  return [...new Set([
    ...staticRoutes,
    ...gmnHubRoutes,
    ...otimizacaoHubRoutes,
    ...consultorHubRoutes,
    ...especialistaHubRoutes,
    ...googleAdsHubRoutes,
    ...blogRoutes,
    ...cityHubRoutes
  ])];
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
    throw new Error(`Entry server não encontrado: ${serverEntry}. Rode 'vite build --ssr' antes.`);
  }

  const template = fs.readFileSync(templatePath, "utf8");
  const { render } = await import(pathToFileURL(serverEntry).href);

  const routes = buildRoutes();
  let ok = 0;
  let fail = 0;

  for (const route of routes) {
    try {
      const { appHtml, head } = render(route);
      const html = template
        .replace("<!--app-head-->", head || "")
        .replace("<!--app-html-->", appHtml || "");

      const outFile = outputPathFor(route);
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, html, "utf8");
      ok++;
    } catch (error) {
      fail++;
      console.error(`[prerender] Erro ao renderizar rota ${route}:`, error.message);
    }
  }

  console.log(`[prerender] ${ok}/${routes.length} rotas geradas com sucesso.`);
  if (fail > 0) {
    console.warn(`[prerender] ${fail} rota(s) falharam.`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("[prerender] Falha fatal:", err);
  process.exit(1);
});
