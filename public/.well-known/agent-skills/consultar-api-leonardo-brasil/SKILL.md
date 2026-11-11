---
name: consultar-api-leonardo-brasil
description: Use esta skill quando o usuário precisar consultar os serviços ou nichos de SEO Local de Leonardo Brasil, provisionar acesso gratuito OAuth 2.0 sandbox ou calcular a pontuação diagnóstica (0 a 100) de um Perfil da Empresa no Google via API v1.
---

# Consultar APIs e Diagnóstico v1 — Leonardo Brasil

## When to use this

Acione esta skill quando:
- Um usuário quiser descobrir quais segmentos locais ou serviços de Google Meu Negócio Leonardo Brasil atende no Brasil (`GET /api/v1/services`, `GET /api/v1/niches`).
- Um agente precisar obter acesso instantâneo de teste (**free-sandbox**) sem contato comercial usando OAuth 2.0 `client_credentials` (`POST /api/v1/oauth/sandbox-clients` e `POST /api/v1/oauth/token`).
- Um usuário solicitar uma avaliação estruturada (score de 0 a 100 e recomendações técnicas) sobre os 6 pilares do Perfil da Empresa no Google (`GET /api/v1/audit/checklist` com escopo `catalog:read` e `POST /api/v1/audit/score` com escopo `audit:write`).
- For necessário inspecionar contratos OpenAPI 3.1, cabeçalhos de rate limit (`RateLimit-*`) ou erros RFC 9457 (`application/problem+json`).

## Passo a passo de descoberta e uso

1. **Descoberta do catálogo (GET):**
   - Consulte `https://leonardobrasil.com.br/.well-known/api-catalog` (`application/linkset+json`), `https://leonardobrasil.com.br/openapi.json` (OpenAPI 3.1.0) e `https://leonardobrasil.com.br/.well-known/oauth-authorization-server` (RFC 8414).
2. **Consultas públicas sem chave (`keyless`):**
   - Use `GET /api/v1/health`, `GET /api/v1/services` e `GET /api/v1/niches?q=<termo>&limit=20`.
3. **Autenticação OAuth 2.0 Sandbox com menor privilégio:**
   - Provisione um cliente sandbox em `POST /api/v1/oauth/sandbox-clients` solicitando apenas os escopos mínimos exigidos (`health:read`, `catalog:read`, `audit:write`).
   - Solicite o token em `POST /api/v1/oauth/token` com `grant_type=client_credentials`.
4. **Execução de diagnóstico de perfil Google Maps:**
   - Consulte os 6 pilares em `GET /api/v1/audit/checklist` (`Bearer` com `catalog:read`).
   - Envie as respostas booleanas (`category`, `nap`, `description`, `catalog`, `reviews`, `photos`) para `POST /api/v1/audit/score` (`Bearer` com `audit:write`) para receber score 0–100, nível de risco e plano de correção.
5. **Tratamento de erros e limites:**
   - Observe os cabeçalhos `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` e, em caso de `HTTP 429`, respeite `Retry-After`.
   - Erros seguem RFC 9457 (`application/problem+json`) com `code`, `message` e `hint`.

## Restrições de segurança

- Não reutilize sessões de usuário do `/crm/*` (Supabase) nem solicite senhas humanas.
- Consulte `/auth.md` ou `/docs` em caso de erro `401 unauthorized` ou `403 insufficient_scope`.
