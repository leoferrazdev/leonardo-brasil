import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { BASE_URL, PUBLIC_SERVICES } from './v1-api.mjs';

function parseAcceptPreferences(acceptHeader = '') {
  return String(acceptHeader || '')
    .split(',')
    .map((part) => {
      const [mediaRaw, ...params] = part.trim().split(';');
      const media = mediaRaw.trim().toLowerCase();
      if (!media) return null;
      let q = 1;
      for (const param of params) {
        const [k, v] = param.trim().split('=');
        if (k === 'q' && v !== undefined) {
          const parsed = Number(v);
          if (Number.isFinite(parsed)) {
            q = parsed;
          }
        }
      }
      return { media, q };
    })
    .filter((entry) => entry && entry.q > 0);
}

export function prefersMarkdown(acceptHeader = '') {
  const prefs = parseAcceptPreferences(acceptHeader);
  const md = prefs.find((p) => p.media === 'text/markdown');
  if (!md) return false;
  const html = prefs.find((p) => p.media === 'text/html' || p.media === 'application/xhtml+xml');
  if (!html) return true;
  return md.q >= html.q;
}

export function prefersJsonOverHtml(acceptHeader = '') {
  const prefs = parseAcceptPreferences(acceptHeader);
  const json = prefs.find((p) => p.media === 'application/json' || p.media === 'application/problem+json');
  if (!json) return false;
  const html = prefs.find((p) => p.media === 'text/html' || p.media === 'application/xhtml+xml');
  if (!html) return true;
  return json.q >= html.q;
}

export function buildNotFoundMarkdown(requestPath) {
  return `# 404 — Recurso não encontrado

O caminho \`${requestPath}\` não existe em \`leonardobrasil.com.br\`. Verifique a URL solicitada ou utilize um dos pontos de entrada documentados abaixo.

## Onde encontrar recursos válidos

- [Documentação Oficial da API (/docs)](${BASE_URL}/docs)
- [Guia Markdown para Agentes (/llms.txt)](${BASE_URL}/llms.txt)
- [Mapa do Site XML (/sitemap.xml)](${BASE_URL}/sitemap.xml)
- [Catálogo de APIs (RFC 9727)](${BASE_URL}/.well-known/api-catalog)
- [Especificação OpenAPI 3.1 (/openapi.json)](${BASE_URL}/openapi.json)
- [Metadados OAuth 2.0 (RFC 8414)](${BASE_URL}/.well-known/oauth-authorization-server)
`;
}

export function buildNotFoundHtml(requestPath) {
  const safePath = String(requestPath || '/')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>404 — Página não encontrada | Leonardo Brasil</title>
</head>
<body style="margin:0;background:#080d18;color:#f1f5f9;font-family:Inter,system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">
  <main style="max-width:640px;width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:20px;padding:32px;">
    <p style="margin:0 0 8px;color:#3b82f6;font-weight:800;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Erro HTTP 404</p>
    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;">Página não encontrada</h1>
    <p style="margin:0 0 20px;color:#94a3b8;line-height:1.6;">
      O recurso solicitado (<code style="color:#e2e8f0;">${safePath}</code>) não existe neste domínio.
    </p>
    <ul style="margin:0 0 24px;padding-left:20px;line-height:1.8;color:#cbd5e1;">
      <li><a href="/" style="color:#60a5fa;">Página inicial — Leonardo Brasil (SEO Local &amp; Google Meu Negócio)</a></li>
      <li><a href="/auditoria-perfil-google" style="color:#60a5fa;">Raio-X Gratuito do Perfil no Google</a></li>
      <li><a href="/docs" style="color:#60a5fa;">Documentação Oficial da API (/docs)</a></li>
      <li><a href="/llms.txt" style="color:#60a5fa;">Índice para Agentes (/llms.txt)</a></li>
      <li><a href="/sitemap.xml" style="color:#60a5fa;">Sitemap XML (/sitemap.xml)</a></li>
    </ul>
  </main>
</body>
</html>`;
}

export function getMarkdownForKnownRoute(cleanPath, distDir) {
  if (cleanPath === '/' || cleanPath === '') {
    const llmsPath = path.join(distDir, 'llms.txt');
    if (existsSync(llmsPath)) {
      return readFileSync(llmsPath, 'utf8');
    }
  }

  if (cleanPath === '/docs' || cleanPath === '/api' || cleanPath === '/developers') {
    const docsMdPath = path.join(distDir, 'api-docs.md');
    if (existsSync(docsMdPath)) {
      return readFileSync(docsMdPath, 'utf8');
    }
  }

  if (cleanPath === '/webmcp') {
    return `# Leonardo Brasil WebMCP — Ferramentas no Navegador

As páginas públicas de \`leonardobrasil.com.br\` registram ferramentas client-side via API experimental \`navigator.modelContext\` / \`document.modelContext\` (WebMCP) em navegadores compatíveis.

## Ferramentas registradas

1. \`consultar_servicos\` (somente leitura) — Retorna a lista oficial de serviços e URLs públicas.
2. \`abrir_diagnostico\` — Navega para o diagnóstico interativo \`/auditoria-perfil-google\`.
3. \`consultar_catalogo_apis\` (somente leitura) — Consulta \`/.well-known/api-catalog\` (RFC 9727).

> WebMCP executa exclusivamente no navegador do visitante e não substitui a API REST v1 em \`/api/v1/*\`. Para automação headless ou servidor-servidor, utilize [\`/docs\`](${BASE_URL}/docs).
`;
  }

  if (cleanPath === '/about') {
    return `# Sobre — Leonardo Brasil (SEO Local e Google Meu Negócio)

- **Marca:** Leonardo Brasil
- **Razão Social:** LEONARDO FERRAZ DA SILVA BRASIL
- **CNPJ:** 65.993.728/0001-07
- **Atuação:** Porto Alegre - RS e atendimento consultivo remoto em todas as cidades do Brasil
- **Especialidade:** Posicionamento no Google Maps (Perfil da Empresa no Google), SEO Local e Estrutura de Vendas para Negócios Locais.

## Metodologia dos 4 Pilares

1. **Presença:** Reestruturação técnica do Perfil da Empresa no Google (categorias, consistência NAP, catálogo e fotos georreferenciadas).
2. **Aquisição:** Atração de buscas com intenção imediata via SEO Local e tráfego geolocalizado.
3. **Conversão:** Integração de WhatsApp com atendimento consultivo rápido e protocolo de respostas a avaliações.
4. **Escala:** Previsibilidade de contatos e atendimento conforme regras éticas setoriais (CFM, OAB, CFO, CFMV).

## Recursos Relacionados

- [Raio-X Gratuito do Perfil](${BASE_URL}/auditoria-perfil-google)
- [Contato Oficial](${BASE_URL}/contact)
- [Documentação da API v1](${BASE_URL}/docs)
- [Serviços Públicos](/api/v1/services): ${PUBLIC_SERVICES.map((s) => s.name).join(', ')}
`;
  }

  if (cleanPath === '/contact') {
    return `# Contato — Leonardo Brasil

- **Empresa:** LEONARDO FERRAZ DA SILVA BRASIL (CNPJ 65.993.728/0001-07)
- **Localização base:** Porto Alegre - RS, Brasil (atendimento nacional em 5.571 municípios)
- **E-mail oficial:** contato@leonardobrasil.com.br
- **WhatsApp comercial:** +55 51 99673-7359 (https://wa.me/5551996737359)
- **Horário de atendimento:** Segunda a Sexta, das 09h00 às 18h00 (BRT, UTC-3)
- **Documentação para Desenvolvedores e Agentes:** ${BASE_URL}/docs
- **Suporte técnico de API:** contato@leonardobrasil.com.br
`;
  }

  if (cleanPath === '/privacy' || cleanPath === '/privacidade') {
    return `# Política de Privacidade — Leonardo Brasil

Controlador: LEONARDO FERRAZ DA SILVA BRASIL (CNPJ 65.993.728/0001-07), responsável pelo domínio \`leonardobrasil.com.br\`, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).

- **Dados coletados no site institucional:** Informações enviadas voluntariamente pelo usuário via WhatsApp/e-mail e dados técnicos mínimos de navegação/analytics quando aplicável.
- **API pública / Sandbox OAuth 2.0:** Os endpoints públicos \`/api/v1/*\` operam com tokens stateless HMAC-SHA256 e não armazenam dados pessoais de clientes sandbox em banco de dados permanente.
- **Direitos do titular e exclusão:** Solicitações de acesso, correção ou exclusão podem ser enviadas para \`contato@leonardobrasil.com.br\` com assunto "Exclusão de dados" ou consultando ${BASE_URL}/exclusao-de-dados.
- **Versão HTML completa:** ${BASE_URL}/privacy
`;
  }

  return null;
}
