# auth.md — Leonardo Brasil API v1

## Acesso público sem atrito (Sandbox & Tier Gratuito)

A API pública versionada de Leonardo Brasil (`/api/v1/*`) possui onboarding self-serve para agentes e desenvolvedores, sem exigir contato comercial prévio:

1. **Rotas públicas sem chave (`keyless`):**
   - `GET /api/v1/health` — estado operacional e versão da API.
   - `GET /api/v1/services` — catálogo oficial de serviços de SEO Local e Google Meu Negócio.
   - `GET /api/v1/niches` — lista de segmentos locais atendidos com filtro por termo.
2. **Rotas protegidas por OAuth 2.0 (`client_credentials`) com menor privilégio:**
   - Provisione suas credenciais gratuitas em **`POST /api/v1/oauth/sandbox-clients`**.
   - Troque `client_id` e `client_secret` por um Bearer JWT em **`POST /api/v1/oauth/token`** (`grant_type=client_credentials`, aceita HTTP Basic Auth ou `application/x-www-form-urlencoded` / JSON).

## Metadados e Escopos Declarados

- **Authorization Server Metadata (RFC 8414):** https://leonardobrasil.com.br/.well-known/oauth-authorization-server
- **Protected Resource Metadata (RFC 9728):** https://leonardobrasil.com.br/.well-known/oauth-protected-resource
- **Escopos suportados (`scopes_supported`):**
  - `health:read`: consultar status operacional e metadados de versão da API v1.
  - `catalog:read`: ler a matriz oficial dos 6 pilares e pesos de auditoria em `GET /api/v1/audit/checklist`.
  - `audit:write`: executar cálculos diagnósticos de 0 a 100 em `POST /api/v1/audit/score`.

Solicite apenas os escopos mínimos necessários para a tarefa. Requisições sem token retornam `HTTP 401` (`application/problem+json`) e tokens válidos sem o escopo exigido retornam `HTTP 403 insufficient_scope`.

## Limites e ambientes separados

- **CRM (`/crm/*`) e integrações internas do aplicativo Brasa (`/api/anthropic/*`, `/api/elevenlabs/*`, `/api/stt/*`):** permanecem restritos ao aplicativo interno e autenticados separadamente; sessões de usuário do CRM (Supabase) não concedem acesso às rotas de agentes e vice-versa.
- **Suporte e parcerias customizadas:** para necessidades corporativas além do sandbox gratuito, escreva para contato@leonardobrasil.com.br.

## Descoberta das APIs

- [Portal de Documentação HTML](https://leonardobrasil.com.br/docs)
- [Referência Markdown da API](https://leonardobrasil.com.br/api-docs.md)
- [Especificação OpenAPI 3.1](https://leonardobrasil.com.br/openapi.json)
- [Catálogo de APIs RFC 9727](https://leonardobrasil.com.br/.well-known/api-catalog)
