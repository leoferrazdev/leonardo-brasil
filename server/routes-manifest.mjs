import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function loadLocationsData() {
  try {
    const raw = readFileSync(path.join(ROOT_DIR, 'src', 'data', 'seoLocations.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return { TARGET_CITIES: [], NICHES: [] };
  }
}

function loadSlugsFromTs(relativeFilePath) {
  try {
    const content = readFileSync(path.join(ROOT_DIR, relativeFilePath), 'utf8');
    return [...content.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  } catch {
    return [];
  }
}

const locationsData = loadLocationsData();
const locationNiches = Array.isArray(locationsData.NICHES) ? locationsData.NICHES : [];
const detailedNicheSlugs = loadSlugsFromTs(path.join('src', 'data', 'niches.ts'));
const blogSlugs = loadSlugsFromTs(path.join('src', 'data', 'blogData.ts'));

export const VALID_VERTICALS = new Set([
  'google-meu-negocio',
  'otimizacao-google-meu-negocio',
  'consultor-google-meu-negocio',
  'especialista-google-maps'
]);

export const NICHES_CATALOG = locationNiches.map((niche) => ({
  slug: String(niche.slug),
  nome: String(niche.nome)
}));

export const VALID_NICHE_SLUGS = new Set([
  ...locationNiches.map((niche) => String(niche.slug)),
  ...detailedNicheSlugs,
  'estetica'
]);

export const VALID_CITY_KEYS = new Set(
  (Array.isArray(locationsData.TARGET_CITIES) ? locationsData.TARGET_CITIES : []).map(
    (city) => `${String(city.estado).toLowerCase()}/${String(city.cidade).toLowerCase()}`
  )
);

export const VALID_BLOG_SLUGS = new Set(blogSlugs);

export const STATIC_WEB_ROUTES = new Set([
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/docs',
  '/api',
  '/developers',
  '/webmcp',
  '/auditoria-perfil-google',
  '/google-meu-negocio',
  '/otimizacao-google-meu-negocio',
  '/consultor-google-meu-negocio',
  '/especialista-google-maps',
  '/google-meu-negocio/medicos-cfm',
  '/google-meu-negocio/advogados-oab',
  '/google-meu-negocio/dentistas-cfo',
  '/recuperar-perfil-suspenso-google',
  '/consultoria',
  '/blog',
  '/brandbook',
  '/cidades',
  '/porto-alegre-digital',
  '/segmentos-locais-google-maps',
  '/primeiro-lugar-no-google-2027',
  '/como-colocar-minha-empresa-no-google',
  '/como-ficar-na-primeira-pagina-do-google',
  '/como-divulgar-minha-empresa-no-google',
  '/como-aparecer-no-google-maps',
  '/como-vender-mais-no-google',
  '/como-aparecer-no-google-de-graca',
  '/anunciar-no-google',
  '/como-fazer-meu-site-aparecer-no-google-em-primeiro',
  '/como-fazer-um-site-aparecer-no-google',
  '/termos',
  '/privacidade',
  '/exclusao-de-dados',
  '/crm',
  '/crm/login',
  '/crm/dashboard',
  '/crm/planejador',
  '/crm/keywords',
  '/crm/clientes'
]);

export function normalizeWebPath(pathname = '/') {
  if (!pathname || pathname === '/') {
    return '/';
  }
  return pathname.replace(/\/+$/, '') || '/';
}

export function resolveLegacyRedirectPath(rawPath) {
  const cleanPath = normalizeWebPath(rawPath);
  if (!cleanPath.startsWith('/estrutura-de-vendas-para-')) {
    return null;
  }

  const clean = cleanPath.replace('/estrutura-de-vendas-para-', '');
  const parts = clean.split('-em-');
  const nicheSlug = parts[0];

  if (!VALID_NICHE_SLUGS.has(nicheSlug)) {
    return null;
  }

  return `/google-meu-negocio/${nicheSlug}`;
}

export function isKnownWebRoute(rawPath) {
  const cleanPath = normalizeWebPath(rawPath);

  if (STATIC_WEB_ROUTES.has(cleanPath)) {
    return true;
  }

  if (resolveLegacyRedirectPath(cleanPath)) {
    return true;
  }

  const segments = cleanPath.slice(1).split('/');

  if (segments.length === 2 && segments[0] === 'blog') {
    return VALID_BLOG_SLUGS.has(segments[1]);
  }

  if (segments.length === 3 && segments[0] === 'crm' && segments[1] === 'clientes') {
    return /^[a-z0-9-]+$/i.test(segments[2]);
  }

  if (segments.length === 2 && VALID_VERTICALS.has(segments[0])) {
    return VALID_NICHE_SLUGS.has(segments[1]);
  }

  if (segments.length === 4 && VALID_VERTICALS.has(segments[0])) {
    const [, nicheSlug, estado, cidade] = segments;
    return VALID_NICHE_SLUGS.has(nicheSlug) && VALID_CITY_KEYS.has(`${estado.toLowerCase()}/${cidade.toLowerCase()}`);
  }

  return false;
}

export const CITIES_COUNT = VALID_CITY_KEYS.size;
