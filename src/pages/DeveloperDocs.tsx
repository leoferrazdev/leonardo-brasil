import { useEffect } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const SANDBOX_SNIPPET = `# 1. Provisionar cliente OAuth 2.0 gratuito (self-serve, sem aprovação manual)
curl -s -X POST https://leonardobrasil.com.br/api/v1/oauth/sandbox-clients \\
  -H "Content-Type: application/json" \\
  -d '{"clientName":"Agente SEO","requestedScopes":["catalog:read","audit:write"]}'

# 2. Emitir Bearer token via grant_type=client_credentials
curl -s -X POST https://leonardobrasil.com.br/api/v1/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials&client_id=SEU_CLIENT_ID&client_secret=SEU_CLIENT_SECRET&scope=catalog:read audit:write"

# 3. Calcular score 0-100 do Perfil da Empresa no Google
curl -s -X POST https://leonardobrasil.com.br/api/v1/audit/score \\
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"companyName":"Clínica Exemplo","cityState":"Porto Alegre - RS","answers":{"category":true,"nap":false,"description":true,"catalog":false,"reviews":false,"photos":true}}'`;

const PROBLEM_EXAMPLE = `{
  "type": "https://leonardobrasil.com.br/docs#error-insufficient_scope",
  "title": "Permissão insuficiente (least privilege)",
  "status": 403,
  "detail": "O token autenticado possui escopos [catalog:read], mas esta operação exige 'audit:write'.",
  "instance": "/api/v1/audit/score",
  "code": "insufficient_scope",
  "message": "O token autenticado possui escopos [catalog:read], mas esta operação exige 'audit:write'.",
  "hint": "Solicite um token incluindo 'audit:write' em POST /api/v1/oauth/token."
}`;

function DocsHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight hover:text-accent transition-colors">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent/15 border border-accent/30">
            <svg viewBox="0 0 48 48" className="w-[18px] h-[18px]" fill="none" aria-hidden="true">
              <rect x="6" y="9" width="36" height="9" rx="4" fill="#3b82f6" opacity="0.4" />
              <rect x="13" y="21" width="22" height="9" rx="4" fill="#3b82f6" opacity="0.7" />
              <rect x="20" y="33" width="8" height="9" rx="4" fill="#60a5fa" />
            </svg>
          </span>
          Leonardo Brasil
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
          <Link to="/docs" className="text-accent font-semibold">API Docs</Link>
          <Link to="/webmcp" className="text-muted hover:text-text transition-colors">WebMCP</Link>
          <a href="/openapi.json" className="text-muted hover:text-text transition-colors">OpenAPI 3.1</a>
          <a href="https://github.com/leoferrazdev" target="_blank" rel="noreferrer" className="text-muted hover:text-text transition-colors">GitHub</a>
        </nav>
      </div>
    </header>
  );
}

export function DeveloperDocs({ variant = "docs" }: { variant?: "docs" | "api" | "developers" }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [variant]);

  const titles = {
    docs: "Leonardo Brasil API — Documentação Oficial para Agentes e Desenvolvedores (v1)",
    api: "Leonardo Brasil API Reference (v1) — OpenAPI 3.1, OAuth 2.0 e Endpoints",
    developers: "Leonardo Brasil Developers — API Pública, Sandbox OAuth 2.0 e WebMCP",
  };
  const canonicalPath = variant === "docs" ? "/docs" : variant === "api" ? "/api" : "/developers";

  const apiSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: titles[variant],
    name: "Leonardo Brasil API",
    url: `https://leonardobrasil.com.br${canonicalPath}`,
    author: { "@id": "https://leonardobrasil.com.br/#person" },
    publisher: { "@id": "https://leonardobrasil.com.br/#organization" },
    about: [
      "Leonardo Brasil API",
      "OAuth 2.0 Client Credentials",
      "SEO Local",
      "Google Meu Negócio",
    ],
  };

  return (
    <div className="min-h-screen bg-ink text-text flex flex-col font-sans">
      <SeoHead
        title={titles[variant]}
        description="Documentação oficial da Leonardo Brasil API v1: endpoints públicos gratuitos, sandbox OAuth 2.0 self-serve com escopos granulares, rate limits IETF, erros RFC 9457 e especificação OpenAPI 3.1."
        canonicalUrl={`https://leonardobrasil.com.br${canonicalPath}`}
        schema={apiSchema}
      />
      <DocsHeader />

      <main className="flex-1 mx-auto max-w-5xl w-full px-5 py-12 md:py-16 space-y-10">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-accent-300">API v1.0.0 · OpenAPI 3.1</span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-emerald-300">Self-Serve Free Sandbox</span>
            <span className="rounded-full border border-line-strong bg-panel px-3 py-1 text-muted">RFC 8414 · RFC 9727 · RFC 9457</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-balance">
            Leonardo Brasil <span className="text-accent-400">API</span> — Documentação Oficial
          </h1>
          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-3xl">
            Integre agentes de IA, fluxos de auditoria local e aplicações diretamente aos endpoints REST versionados (<code className="text-accent-300">/api/v1/*</code>) de Leonardo Brasil. Consulte catálogos públicos sem chave ou gere credenciais OAuth 2.0 sandbox em segundos sem aprovação humana.
          </p>

          <div className="flex flex-wrap gap-3 pt-2 text-xs sm:text-sm">
            <a href="/openapi.json" className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 font-bold text-accent-300 hover:bg-accent/20 transition-colors">
              OpenAPI 3.1 (`/openapi.json`)
            </a>
            <a href="/api-docs.md" className="rounded-xl border border-line-strong bg-panel px-4 py-2 font-semibold text-text hover:border-accent transition-colors">
              Markdown Docs (`/api-docs.md`)
            </a>
            <a href="/.well-known/api-catalog" className="rounded-xl border border-line-strong bg-panel px-4 py-2 font-semibold text-text hover:border-accent transition-colors">
              API Catalog (`/.well-known/api-catalog`)
            </a>
            <a href="/.well-known/oauth-authorization-server" className="rounded-xl border border-line-strong bg-panel px-4 py-2 font-semibold text-text hover:border-accent transition-colors">
              OAuth 2.0 Metadata
            </a>
            <a href="/llms.txt" className="rounded-xl border border-line-strong bg-panel px-4 py-2 font-semibold text-text hover:border-accent transition-colors">
              Guia para Agentes (`/llms.txt`)
            </a>
          </div>
        </section>

        <section id="quickstart" className="rounded-2xl border border-line bg-panel p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-bold text-text">Início Rápido — Onboarding Self-Serve e Sandbox</h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Não há fila de vendas para testar. Endpoints de catálogo (<code className="text-text">GET /api/v1/services</code>, <code className="text-text">GET /api/v1/niches</code> e <code className="text-text">GET /api/v1/health</code>) são abertos; rotas diagnósticas aceitam tokens OAuth 2.0 gerados instantaneamente via sandbox self-serve:
          </p>
          <pre className="overflow-x-auto rounded-xl border border-line bg-ink p-4 text-xs sm:text-sm text-emerald-300 leading-relaxed">
            <code>{SANDBOX_SNIPPET}</code>
          </pre>
        </section>

        <section id="authentication" className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-line bg-panel p-6 space-y-3">
            <h2 className="text-xl font-bold text-text">Autenticação OAuth 2.0 &amp; Descoberta</h2>
            <ul className="space-y-2 text-sm text-muted">
              <li><strong className="text-text">Authorization Server (RFC 8414):</strong> <code className="text-accent-300">/.well-known/oauth-authorization-server</code></li>
              <li><strong className="text-text">Protected Resource (RFC 9728):</strong> <code className="text-accent-300">/.well-known/oauth-protected-resource</code></li>
              <li><strong className="text-text">Registro Sandbox:</strong> <code className="text-accent-300">POST /api/v1/oauth/sandbox-clients</code></li>
              <li><strong className="text-text">Token Endpoint:</strong> <code className="text-accent-300">POST /api/v1/oauth/token</code> (<code className="text-text">client_credentials</code>)</li>
              <li><strong className="text-text">Documento de acesso:</strong> <a href="/auth.md" className="text-accent hover:underline">/auth.md</a></li>
            </ul>
          </div>

          <div id="scopes" className="rounded-2xl border border-line bg-panel p-6 space-y-3">
            <h2 className="text-xl font-bold text-text">Escopos Granulares (Least Privilege)</h2>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><code className="text-accent-300 font-bold">health:read</code> — Consulta estado operacional e versão da API v1.</li>
              <li><code className="text-accent-300 font-bold">catalog:read</code> — Acessa matriz oficial dos 6 pilares e pesos de auditoria (<code className="text-text">GET /api/v1/audit/checklist</code>).</li>
              <li><code className="text-accent-300 font-bold">audit:write</code> — Executa cálculo diagnóstico de score 0–100 e gera plano de correção (<code className="text-text">POST /api/v1/audit/score</code>).</li>
            </ul>
          </div>
        </section>

        <section id="endpoints" className="rounded-2xl border border-line bg-panel p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-bold text-text">Endpoints Públicos Versionados (`/api/v1`)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-line text-text">
                  <th className="py-3 pr-4">Método / Rota</th>
                  <th className="py-3 pr-4">OperationId</th>
                  <th className="py-3 pr-4">Escopo</th>
                  <th className="py-3">Função</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-muted">
                <tr>
                  <td className="py-3 pr-4 font-mono text-emerald-300">GET /api/v1/health</td>
                  <td className="py-3 pr-4 font-mono">getApiHealth</td>
                  <td className="py-3 pr-4">Público</td>
                  <td className="py-3">Status operacional, versão e integrações ativas.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-emerald-300">GET /api/v1/services</td>
                  <td className="py-3 pr-4 font-mono">listServices</td>
                  <td className="py-3 pr-4">Público</td>
                  <td className="py-3">Catálogo de serviços e URLs de onboarding.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-emerald-300">GET /api/v1/niches</td>
                  <td className="py-3 pr-4 font-mono">listLocalNiches</td>
                  <td className="py-3 pr-4">Público</td>
                  <td className="py-3">Segmentos atendidos com filtro <code className="text-text">?q=</code> e <code className="text-text">?limit=</code>.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-accent-300">POST /api/v1/oauth/sandbox-clients</td>
                  <td className="py-3 pr-4 font-mono">createSandboxClient</td>
                  <td className="py-3 pr-4">Público</td>
                  <td className="py-3">Provisiona <code className="text-text">client_id</code> e <code className="text-text">client_secret</code> sandbox.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-accent-300">POST /api/v1/oauth/token</td>
                  <td className="py-3 pr-4 font-mono">issueOAuthToken</td>
                  <td className="py-3 pr-4">Client Auth</td>
                  <td className="py-3">Emite Bearer JWT via <code className="text-text">client_credentials</code>.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-amber-300">GET /api/v1/audit/checklist</td>
                  <td className="py-3 pr-4 font-mono">getAuditChecklist</td>
                  <td className="py-3 pr-4 font-mono">catalog:read</td>
                  <td className="py-3">Retorna os 6 pilares e faixas de risco do Raio-X.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-amber-300">POST /api/v1/audit/score</td>
                  <td className="py-3 pr-4 font-mono">calculateAuditScore</td>
                  <td className="py-3 pr-4 font-mono">audit:write</td>
                  <td className="py-3">Calcula pontuação 0–100 e recomendações técnicas.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div id="versioning" className="rounded-2xl border border-line bg-panel p-6 space-y-3">
            <h2 className="text-xl font-bold text-text">Política de Versionamento e Depreciação</h2>
            <p className="text-sm text-muted leading-relaxed">
              Todas as operações públicas residem em <code className="text-text">/api/v1/</code> e aceitam o cabeçalho opcional <code className="text-text">X-API-Version: 1</code>. As respostas retornam <code className="text-text">API-Version: 1.0.0</code>. Mudanças incompatíveis inauguram um novo prefixo (<code className="text-text">/api/v2/</code>).
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Qualquer descontinuação futura é comunicada com mínimo de 6 meses pelos cabeçalhos RFC 9745 <code className="text-text">Deprecation: true</code>, RFC 8594 <code className="text-text">Sunset</code> e <code className="text-text">Link; rel="successor-version"</code>.
            </p>
          </div>

          <div id="ratelimits" className="rounded-2xl border border-line bg-panel p-6 space-y-3">
            <h2 className="text-xl font-bold text-text">Rate Limits IETF e WebMCP</h2>
            <p className="text-sm text-muted leading-relaxed">
              Todas as rotas em <code className="text-text">/api/*</code> retornam cabeçalhos padronizados <code className="text-text">RateLimit-Limit</code> (60/min), <code className="text-text">RateLimit-Remaining</code>, <code className="text-text">RateLimit-Reset</code> e <code className="text-text">RateLimit-Policy</code>. Em <code className="text-text">HTTP 429</code>, o cabeçalho <code className="text-text">Retry-After</code> informa quantos segundos aguardar.
            </p>
            <p className="text-sm text-muted">
              Para agentes executando no navegador via <code className="text-text">document.modelContext</code>, veja também{" "}
              <Link to="/webmcp" className="text-accent hover:underline font-semibold">Leonardo Brasil WebMCP (`/webmcp`)</Link>.
            </p>
          </div>
        </section>

        <section id="errors" className="rounded-2xl border border-line bg-panel p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-bold text-text">Modelo Tipado de Erros (RFC 9457 `application/problem+json`)</h2>
          <p className="text-sm sm:text-base text-muted">
            Qualquer falha de cliente, autenticação, escopo, JSON malformado ou rota inexistente sob <code className="text-text">/api/*</code> retorna JSON estruturado com <code className="text-text">code</code>, <code className="text-text">message</code> e <code className="text-text">hint</code>:
          </p>
          <pre className="overflow-x-auto rounded-xl border border-line bg-ink p-4 text-xs sm:text-sm text-amber-200 leading-relaxed">
            <code>{PROBLEM_EXAMPLE}</code>
          </pre>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function WebMcpDocsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Leonardo Brasil WebMCP — Ferramentas no Navegador para Agentes",
    name: "Leonardo Brasil WebMCP",
    url: "https://leonardobrasil.com.br/webmcp",
    author: { "@id": "https://leonardobrasil.com.br/#person" },
    publisher: { "@id": "https://leonardobrasil.com.br/#organization" },
  };

  return (
    <div className="min-h-screen bg-ink text-text flex flex-col font-sans">
      <SeoHead
        title="Leonardo Brasil WebMCP — Ferramentas no Navegador para Agentes"
        description="Conheça as 3 ferramentas WebMCP registradas em navegador compatível por leonardobrasil.com.br via modelContext e quando utilizar a API REST v1."
        canonicalUrl="https://leonardobrasil.com.br/webmcp"
        schema={schema}
      />
      <DocsHeader />

      <main className="flex-1 mx-auto max-w-4xl w-full px-5 py-12 md:py-16 space-y-8">
        <div>
          <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent-300">
            Browser Agent Interface · WebMCP
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-balance">
            Leonardo Brasil <span className="text-accent-400">WebMCP</span> — Ferramentas no Navegador
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
            Em navegadores compatíveis com <code className="text-accent-300">document.modelContext</code> ou <code className="text-accent-300">navigator.modelContext</code>, o domínio registra três ferramentas client-side para inspeção imediata dos serviços e abertura assistida do diagnóstico.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-line bg-panel p-6">
            <h2 className="text-lg font-bold text-text">1. `consultar_servicos` (`readOnlyHint: true`)</h2>
            <p className="mt-2 text-sm text-muted">Retorna os quatro serviços principais de Google Meu Negócio e SEO Local com suas URLs públicas oficiais.</p>
          </div>
          <div className="rounded-2xl border border-line bg-panel p-6">
            <h2 className="text-lg font-bold text-text">2. `abrir_diagnostico` (`readOnlyHint: false`)</h2>
            <p className="mt-2 text-sm text-muted">Navega com segurança para o aplicativo interativo <code className="text-accent-300">/auditoria-perfil-google</code> sem enviar mensagens externas.</p>
          </div>
          <div className="rounded-2xl border border-line bg-panel p-6">
            <h2 className="text-lg font-bold text-text">3. `consultar_catalogo_apis` (`readOnlyHint: true`)</h2>
            <p className="mt-2 text-sm text-muted">Lê <code className="text-accent-300">/.well-known/api-catalog</code> sem credenciais e devolve o linkset RFC 9727 com OpenAPI e documentação.</p>
          </div>
        </div>

        <section className="rounded-2xl border border-line bg-panel p-6 space-y-3">
          <h2 className="text-xl font-bold text-text">WebMCP vs. API REST v1</h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            WebMCP funciona exclusivamente no navegador do usuário final e não é um servidor MCP remoto. Para automação headless ou servidor-servidor, utilize a API REST v1 autenticada por OAuth 2.0 descrita na{" "}
            <Link to="/docs" className="text-accent hover:underline font-semibold">Documentação Oficial da API (`/docs`)</Link>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
