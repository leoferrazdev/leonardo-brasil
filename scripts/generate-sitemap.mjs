import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://leobrasil.com.br";
const PUBLIC_DIR = path.resolve(__dirname, "../public");
const DIST_DIR = path.resolve(__dirname, "../dist");
const SITEMAP_INDEX_PATH = path.join(PUBLIC_DIR, "sitemap.xml");
const LOCATIONS_JSON_PATH = path.resolve(__dirname, "../src/data/seoLocations.json");
const BLOG_PATH = path.resolve(__dirname, "../src/data/blogData.ts");

const MAX_URLS_PER_SITEMAP = 40000;

const STATIC_ROUTES = [
  "",
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
  "/gestor-google-ads",
  "/consultor-google-ads",
  "/agencia-google-ads-negocios-locais",
  "/google-ads-e-google-meu-negocio",
  "/auditoria-google-ads",
  "/como-fazer-meu-site-aparecer-no-google-em-primeiro",
  "/como-fazer-um-site-aparecer-no-google",
  "/brandbook",
  "/cidades",
  "/about",
  "/contact",
  "/privacy",
  "/docs",
  "/api",
  "/developers",
  "/webmcp",
  "/termos",
  "/privacidade",
  "/exclusao-de-dados",
  "/blog"
];

function generateUrlNode(route, priority, freq) {
  return `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function chunkUrls(urls) {
  const chunks = [];
  for (let i = 0; i < urls.length; i += MAX_URLS_PER_SITEMAP) {
    chunks.push(urls.slice(i, i + MAX_URLS_PER_SITEMAP));
  }
  return chunks;
}

function safeWriteFileSync(filePath, content) {
  let attempts = 5;
  while (attempts > 0) {
    try {
      fs.writeFileSync(filePath, content, "utf8");
      return;
    } catch (err) {
      attempts -= 1;
      if (attempts === 0) throw err;
      const end = Date.now() + 150;
      while (Date.now() < end) {} // sleep síncrono simples para liberar lock de arquivo no Google Drive
    }
  }
}

function writeSitemapFiles(publicDir, prefix, urlNodesArray) {
  const chunks = chunkUrls(urlNodesArray);
  const sitemapFiles = [];
  
  chunks.forEach((chunk, index) => {
    const fileName = chunks.length === 1 ? `${prefix}.xml` : `${prefix}-${index + 1}.xml`;
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${chunk.join('')}\n</urlset>`;
    safeWriteFileSync(path.join(publicDir, fileName), sitemapContent);
    sitemapFiles.push(fileName);
  });
  
  return sitemapFiles;
}

function getDynamicBlogPosts() {
  try {
    if (!fs.existsSync(BLOG_PATH)) return [];
    const content = fs.readFileSync(BLOG_PATH, "utf8");
    const matches = [...content.matchAll(/slug:\s*"([^"]+)"/g)];
    return matches.map((m) => `/blog/${m[1]}`);
  } catch (error) {
    console.error("Erro ao ler blogData.ts:", error);
    return [];
  }
}

function generateSitemap() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const locationsData = JSON.parse(fs.readFileSync(LOCATIONS_JSON_PATH, "utf8"));
  const { TARGET_CITIES, NICHES } = locationsData;
  const nicheSlugs = NICHES.map((n) => n.slug);

  const allSitemapFiles = [];

  // 1. Core Sitemap (Rotas Estáticas + Hubs de Nicho + Blog)
  const coreUrls = [];
  STATIC_ROUTES.forEach((route) => {
    coreUrls.push(generateUrlNode(route, route === "" ? "1.0" : "0.8", "weekly"));
  });

  // Hubs de Nicho das 5 Verticais (GMN, Otimização, Consultor, Especialista Maps e Google Ads)
  nicheSlugs.forEach((niche) => {
    coreUrls.push(generateUrlNode(`/google-meu-negocio/${niche}`, "0.9", "weekly"));
    coreUrls.push(generateUrlNode(`/otimizacao-google-meu-negocio/${niche}`, "0.9", "weekly"));
    coreUrls.push(generateUrlNode(`/consultor-google-meu-negocio/${niche}`, "0.9", "weekly"));
    coreUrls.push(generateUrlNode(`/especialista-google-maps/${niche}`, "0.9", "weekly"));
    coreUrls.push(generateUrlNode(`/google-ads/${niche}`, "0.9", "weekly"));
  });

  // Blog
  const blogRoutes = getDynamicBlogPosts();
  blogRoutes.forEach((route) => {
    coreUrls.push(generateUrlNode(route, "0.8", "weekly"));
  });

  // City Hubs das Capitais e Polos Prioritários
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
  priorityCities.forEach((city) => {
    coreUrls.push(generateUrlNode(`/cidades/${city}`, "0.9", "weekly"));
  });

  allSitemapFiles.push(...writeSitemapFiles(PUBLIC_DIR, "sitemap-core", coreUrls));

  // Remove sitemaps locais antigos não pré-renderizados (evita desperdício de crawl budget e canonical contraditório)
  for (const dir of [PUBLIC_DIR, DIST_DIR]) {
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        if (/^sitemap-local(-\d+)?\.xml$/i.test(f)) {
          try {
            fs.unlinkSync(path.join(dir, f));
          } catch {}
        }
      }
    }
  }

  // 2. Sitemap Index Master (Índice Raiz apontando apenas para rotas pré-renderizadas com canonical próprio)
  const sitemapIndexNodes = allSitemapFiles
    .map(
      (file) => `
  <sitemap>
    <loc>${DOMAIN}/${file}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
    )
    .join("");

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapIndexNodes}\n</sitemapindex>`;

  safeWriteFileSync(SITEMAP_INDEX_PATH, sitemapIndex);

  // Espelha todos os sitemaps gerados em dist/ quando o diretório existir,
  // evitando divergência quando generate-sitemap roda após vite build.
  if (fs.existsSync(DIST_DIR)) {
    for (const fileName of ["sitemap.xml", ...allSitemapFiles]) {
      const srcFile = path.join(PUBLIC_DIR, fileName);
      const destFile = path.join(DIST_DIR, fileName);
      if (fs.existsSync(srcFile)) {
        safeWriteFileSync(destFile, fs.readFileSync(srcFile, "utf8"));
      }
    }
  }

  console.log(`✅ Sitemap Index gerado em ${SITEMAP_INDEX_PATH} com ${allSitemapFiles.length} arquivos.`);
  console.log(`🚀 Rotas Core / Hubs / Blog pré-renderizadas: ${coreUrls.length}`);
}

generateSitemap();
