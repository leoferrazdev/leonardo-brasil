# Leonardo Brasil API — Documentação Oficial (v1)

API pública versionada para consulta de serviços de **SEO Local e Google Meu Negócio**, catálogo de segmentos atendidos no Brasil e execução programática do **Raio-X do Perfil no Google (0 a 100)** com autenticação OAuth 2.0 `client_credentials`.

- **Base URL:** `https://leonardobrasil.com.br`
- **Portal HTML:** [`https://leonardobrasil.com.br/docs`](https://leonardobrasil.com.br/docs)
- **Especificação OpenAPI 3.1:** [`/openapi.json`](https://leonardobrasil.com.br/openapi.json)
- **Catálogo RFC 9727:** [`/.well-known/api-catalog`](https://leonardobrasil.com.br/.well-known/api-catalog)
- **OAuth 2.0 Discovery:** [`/.well-known/oauth-authorization-server`](https://leonardobrasil.com.br/.well-known/oauth-authorization-server) | [`/.well-known/oauth-protected-resource`](https://leonardobrasil.com.br/.well-known/oauth-protected-resource)

## Início rápido (Zero atrito / Sandbox gratuito)

### 1. Consultar endpoints públicos (sem autenticação)

```bash
curl -s https://leonardobrasil.com.br/api/v1/services
curl -s "https://leonardobrasil.com.br/api/v1/niches?q=dentistas&limit=5"
```

### 2. Provisionar cliente sandbox OAuth 2.0 e emitir token

```bash
# Passo 1: gerar client_id e client_secret instantaneamente (free-sandbox)
curl -s -X POST https://leonardobrasil.com.br/api/v1/oauth/sandbox-clients \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Meu Agente SEO","requestedScopes":["catalog:read","audit:write"]}'

# Passo 2: obter access_token Bearer via grant_type=client_credentials
curl -s -X POST https://leonardobrasil.com.br/api/v1/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=SEU_CLIENT_ID&client_secret=SEU_CLIENT_SECRET&scope=catalog:read audit:write"
```

### 3. Executar diagnóstico de perfil no Google Meu Negócio (`audit:write`)

```bash
curl -s -X POST https://leonardobrasil.com.br/api/v1/audit/score \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Clínica Exemplo",
    "cityState": "Porto Alegre - RS",
    "answers": {
      "category": true,
      "nap": false,
      "description": true,
      "catalog": false,
      "reviews": false,
      "photos": true
    }
  }'
```

## Endpoints v1 disponíveis

| Método e Rota | Autenticação / Escopo | Descrição |
| --- | --- | --- |
| `GET /api/v1/health` | Pública (`keyless`) | Status do servidor, versão da API e booleanos de integrações. |
| `GET /api/v1/services` | Pública (`keyless`) | Lista oficial de serviços de Google Meu Negócio e links de onboarding. |
| `GET /api/v1/niches` | Pública (`keyless`) | Segmentos locais suportados com parâmetros `q` e `limit` (`1..50`). |
| `POST /api/v1/oauth/sandbox-clients` | Pública (self-serve) | Provisionamento gratuito e imediato de credenciais OAuth 2.0 sandbox. |
| `POST /api/v1/oauth/token` | Client Credentials | Emissão de access token Bearer JWT com escopos solicitados. |
| `GET /api/v1/audit/checklist` | Bearer (`catalog:read`) | Critérios, pesos (total 100) e faixas de risco do Raio-X do Perfil. |
| `POST /api/v1/audit/score` | Bearer (`audit:write`) | Cálculo de score 0–100, diagnóstico e recomendações priorizadas. |

## Escopos OAuth 2.0 (Least Privilege)

- `health:read`: consulta de status operacional e versão da API.
- `catalog:read`: acesso autenticado à matriz de pilares e pesos de auditoria (`/api/v1/audit/checklist`).
- `audit:write`: execução de cálculos diagnósticos (`/api/v1/audit/score`).

## Política de Versionamento e Depreciação

- Todas as operações públicas suportadas estão versionadas no caminho `/api/v1/`.
- Opcionalmente, clientes podem enviar o cabeçalho `X-API-Version: 1`. Versões inválidas retornam HTTP `400 unsupported_api_version`.
- A API responde com `API-Version: 1.0.0`, `X-API-Version: v1` e `X-API-Deprecation-Policy`.
- Qualquer eventual depreciação futura de rota ou versão será anunciada com **antecedência mínima de 6 meses** usando cabeçalhos RFC 9745 `Deprecation: true`, RFC 8594 `Sunset` e `Link; rel="successor-version"`. A rota legada `/api/health` já expõe cabeçalhos indicando sucessão para `/api/v1/health` (Sunset `Fri, 31 Dec 2027 23:59:59 GMT`).

## Rate Limiting e Modelo de Erros (RFC 9457)

- **Rate Limiting:** Padrão de 60 requisições por janela de 60 segundos por IP. Todas as respostas retornam os cabeçalhos IETF `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` e `RateLimit-Policy`. Ao atingir o limite, a API retorna `HTTP 429` com `Retry-After` em segundos.
- **Erros Estruturados:** Todos os erros 4xx e 5xx usam `Content-Type: application/problem+json` com os campos `type`, `title`, `status`, `detail`, `instance`, `code`, `message` e `hint` para recuperação programática.
