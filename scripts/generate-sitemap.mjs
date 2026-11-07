import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://leonardobrasil.com.br";
const PUBLIC_DIR = path.resolve(__dirname, "../public");
const SITEMAP_INDEX_PATH = path.join(PUBLIC_DIR, "sitemap.xml");
const LOCATIONS_JSON_PATH = path.resolve(__dirname, "../src/data/seoLocations.json");
const BLOG_PATH = path.resolve(__dirname, "../src/data/blogData.ts");

const MAX_URLS_PER_SITEMAP = 40000;

const STATIC_ROUTES = [
  "",
  "/google-meu-negocio",
  "/consultoria",
  "/brandbook",
  "/cidades",
  "/calculadora",
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

function writeSitemapFiles(publicDir, prefix, urlNodesArray) {
  const chunks = chunkUrls(urlNodesArray);
  const sitemapFiles = [];
  
  chunks.forEach((chunk, index) => {
    const fileName = chunks.length === 1 ? `${prefix}.xml` : `${prefix}-${index + 1}.xml`;
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${chunk.join('')}\n</urlset>`;
    fs.writeFileSync(path.join(publicDir, fileName), sitemapContent, "utf8");
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

  // Hubs de Nicho do Google Meu Negócio
  nicheSlugs.forEach((niche) => {
    coreUrls.push(generateUrlNode(`/google-meu-negocio/${niche}`, "0.9", "weekly"));
    coreUrls.push(generateUrlNode(`/estrutura-de-vendas-para-${niche}`, "0.7", "monthly"));
  });

  // Blog
  const blogRoutes = getDynamicBlogPosts();
  blogRoutes.forEach((route) => {
    coreUrls.push(generateUrlNode(route, "0.8", "weekly"));
  });

  allSitemapFiles.push(...writeSitemapFiles(PUBLIC_DIR, "sitemap-core", coreUrls));

  // 2. Google Meu Negócio Local Sitemap (5.570 Cidades x 14 Nichos = 77.980 rotas)
  const localGmnUrls = [];
  TARGET_CITIES.forEach((location) => {
    nicheSlugs.forEach((niche) => {
      localGmnUrls.push(
        generateUrlNode(
          `/google-meu-negocio/${niche}/${location.estado}/${location.cidade}`,
          "0.7",
          "monthly"
        )
      );
    });
  });

  allSitemapFiles.push(...writeSitemapFiles(PUBLIC_DIR, "sitemap-local", localGmnUrls));

  // 3. Sitemap Index Master (Índice Raiz)
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

  fs.writeFileSync(SITEMAP_INDEX_PATH, sitemapIndex, "utf8");

  console.log(`✅ Sitemap Index gerado em ${SITEMAP_INDEX_PATH} com ${allSitemapFiles.length} arquivos.`);
  console.log(`🚀 Rotas Core / Hubs / Blog: ${coreUrls.length}`);
  console.log(`🚀 Rotas Locais Google Meu Negócio: ${localGmnUrls.length}`);
}

generateSitemap();
