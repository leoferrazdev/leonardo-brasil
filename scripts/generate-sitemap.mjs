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
  "/otimizacao-google-meu-negocio",
  "/consultor-google-meu-negocio",
  "/especialista-google-maps",
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
  "/brandbook",
  "/cidades",
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

  // Hubs de Nicho das 4 Verticais
  nicheSlugs.forEach((niche) => {
    coreUrls.push(generateUrlNode(`/google-meu-negocio/${niche}`, "0.9", "weekly"));
    coreUrls.push(generateUrlNode(`/otimizacao-google-meu-negocio/${niche}`, "0.9", "weekly"));
    coreUrls.push(generateUrlNode(`/consultor-google-meu-negocio/${niche}`, "0.9", "weekly"));
    coreUrls.push(generateUrlNode(`/especialista-google-maps/${niche}`, "0.9", "weekly"));
  });

  // Blog
  const blogRoutes = getDynamicBlogPosts();
  blogRoutes.forEach((route) => {
    coreUrls.push(generateUrlNode(route, "0.8", "weekly"));
  });

  allSitemapFiles.push(...writeSitemapFiles(PUBLIC_DIR, "sitemap-core", coreUrls));

  // 2. Malha Local Multivertical (5.571 Cidades x 14 Nichos x 4 Verticais = 311.976 rotas)
  const localGmnUrls = [];
  TARGET_CITIES.forEach((location) => {
    nicheSlugs.forEach((niche) => {
      // Vertical 1: Especialista Google Meu Negócio
      localGmnUrls.push(
        generateUrlNode(
          `/google-meu-negocio/${niche}/${location.estado}/${location.cidade}`,
          "0.7",
          "monthly"
        )
      );
      // Vertical 2: Otimização de Google Meu Negócio
      localGmnUrls.push(
        generateUrlNode(
          `/otimizacao-google-meu-negocio/${niche}/${location.estado}/${location.cidade}`,
          "0.7",
          "monthly"
        )
      );
      // Vertical 3: Consultor Google Meu Negócio
      localGmnUrls.push(
        generateUrlNode(
          `/consultor-google-meu-negocio/${niche}/${location.estado}/${location.cidade}`,
          "0.7",
          "monthly"
        )
      );
      // Vertical 4: Especialista Google Maps
      localGmnUrls.push(
        generateUrlNode(
          `/especialista-google-maps/${niche}/${location.estado}/${location.cidade}`,
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

  safeWriteFileSync(SITEMAP_INDEX_PATH, sitemapIndex);

  console.log(`✅ Sitemap Index gerado em ${SITEMAP_INDEX_PATH} com ${allSitemapFiles.length} arquivos.`);
  console.log(`🚀 Rotas Core / Hubs / Blog: ${coreUrls.length}`);
  console.log(`🚀 Rotas Locais Multiplicadas (4 verticais): ${localGmnUrls.length}`);
}

generateSitemap();
