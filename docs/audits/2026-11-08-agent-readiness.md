# Auditoria de prontidão para agentes — Leonardo Brasil

Data: 08/11/2026. Site: https://leonardobrasil.com.br.

## Resultado e limites

A imagem enviada mostra 67% e nível 4 (Agent-Integrated). A nova consulta ao verificador, após as correções desta auditoria, confirmou **nível 4 — Agent-Integrated**, em 08/11/2026 às 18:58:26 no horário de Brasília. A resposta JSON do verificador não inclui percentual global; não foi inferida uma nova porcentagem.

Resultado da varredura: **11 verificações aprovadas, 6 pendentes e 6 informativas/neutras**. Comércio não foi detectado. A pontuação do verificador mede presença e estrutura de protocolos; não demonstra resultados comerciais, recomendação por modelos de IA, segurança completa da aplicação ou funcionamento de integrações autenticadas.

O site permite descoberta de documentação e ferramentas públicas, leitura do resumo em Markdown e execução de três ferramentas WebMCP em navegadores compatíveis. Não oferece contas delegadas para agentes, transações automáticas, servidor MCP remoto ou interface A2A.

## Correções publicadas nesta auditoria

Commit funcional: `91556bf` (main, publicação automática confirmada).

- Recursos inexistentes de `/.well-known/` retornam 404 JSON no servidor Express, em vez de HTTP 200 com HTML da SPA. A regra equivalente de status 404 foi adicionada ao fallback Apache/LiteSpeed; essa regra não foi executada em Apache local nesta sessão.
- Os documentos públicos implementados de descoberta permitem GET de outras origens com `Access-Control-Allow-Origin: *`.
- Os cabeçalhos Link divulgam API Catalog, ARD, índice de skills e o resumo Markdown. Foram removidos os anúncios de índices fictícios e de MCP remoto inexistente.
- O resumo Markdown da página inicial foi atualizado para Google Meu Negócio e SEO Local, com links atuais, incluindo o diagnóstico interativo. A referência à calculadora não implementada foi retirada.
- `Vary: Accept` separa HTML e Markdown na negociação da página inicial. Outras páginas não recebem automaticamente o resumo genérico da home quando solicitadas como Markdown.
- Foram removidos seis arquivos antigos que anunciavam OAuth, escopos read/write, A2A, MCP ou chave de assinatura de exemplo sem implementação correspondente. As versões anteriores continuam recuperáveis no Git.

Não foram alterados servidores DNS, hospedagem, autenticação, regras de uso de conteúdo, preços ou pagamentos. As alterações locais preexistentes em `dist/.htaccess` e no submódulo `cofre-mestre-contexto-ia` não entraram no commit.

## Capacidades que continuam verificadas

- API Catalog: https://leonardobrasil.com.br/.well-known/api-catalog
- OpenAPI: https://leonardobrasil.com.br/openapi.json
- Skills: https://leonardobrasil.com.br/.well-known/agent-skills/index.json
- ARD: https://leonardobrasil.com.br/.well-known/ai-catalog.json
- Poppy 0.1, website-only: https://leonardobrasil.com.br/.well-known/poppy.json
- WebMCP: consultar_servicos, abrir_diagnostico, consultar_catalogo_apis. O registro no navegador não constitui servidor MCP remoto.
- Markdown: requisição GET à raiz com Accept: text/markdown; o resumo também está disponível em /llms.txt.

## Pendências e decisão recomendada

| Item | Situação atual | O que permitiria atender |
| --- | --- | --- |
| DNS-AID | Ausente. Nameservers públicos continuam pixel.dns-parking.com e byte.dns-parking.com. Consulta DS sem resposta e sem cadeia autenticada observada. | Provedor com SVCB/HTTPS e DNSSEC, cópia da zona e mudança de delegação. A migração não é necessária para o site, o deploy ou as ferramentas WebMCP. Não foi executada. |
| OAuth/OIDC discovery | Não há servidor de autorização para agentes nas APIs do domínio. O CRM autentica pelo Supabase. | Definir a integração, o emissor e os fluxos reais antes de publicar metadata. Não copiar URLs de login nem inventar endpoints de token. |
| OAuth Protected Resource | As APIs do domínio não validam tokens OAuth com os escopos anunciados nos arquivos antigos. | Implementar validação, autorização e escopos reais antes de divulgar authorization_servers. |
| Auth.md / registro de agentes | /auth.md informa a indisponibilidade de cadastro automático e como solicitar uma avaliação humana de integração. | Implementar provisionamento e ciclo de credenciais antes de declarar cadastro automático. |
| MCP Server Card | Sem servidor MCP remoto. O endpoint antigo /mcp/sse não tinha implementação MCP. | Projeto de servidor MCP funcional, inicialmente apenas com consultas públicas, com testes de protocolo e definição de responsabilidades. Publicar só um card não implementa o servidor. |
| A2A Agent Card | Sem implementação A2A. | Implementar interface A2A, mensagens, execução e políticas de acesso antes de anunciar um agente. |
| Web Bot Auth | Informativo. Não há bot próprio identificado realizando requisições assinadas a outros sites. | Definir o bot e implementar assinatura e gestão de chaves antes de publicar o diretório. |
| x402, MPP, UCP, ACP, AP2 | Informativos. Não há checkout ou API comercializada por chamada. | Definir produto, preço, cobrança e integração de pagamentos. Não adicionar JSON ou middleware para simular cobrança. |

O robots.txt mantém os sinais atuais: search=yes, ai-train=no e ai-input=no. A existência dos documentos de descoberta não altera essas permissões nem garante uso do conteúdo por agentes. Uma mudança nesses sinais é uma decisão de uso de conteúdo, não uma correção de formato.

## Validação realizada

- Build de produção concluído, incluindo SSR e 82 rotas pré-renderizadas.
- 28 testes passaram, incluindo os testes das três ferramentas WebMCP e regressões para descoberta, 404 JSON, CORS, links e negociação Markdown.
- Em produção: HTTP 200 e CORS * confirmados para API Catalog, ARD, índice de skills e Poppy.
- Em produção: HTTP 404 JSON confirmado para OAuth Authorization Server, MCP Server Card, A2A Agent Card, ACP e UCP ausentes.
- Em produção: resumo Markdown atualizado e cabeçalho Vary: Accept confirmados.
- Nova varredura do isitagentready.com manteve todas as aprovações anteriores, incluindo detecção das três ferramentas WebMCP.

## Resultado detalhado do verificador

| Grupo | Verificação | Status | Resultado |
| --- | --- | --- | --- |
| discoverability | robotsTxt | pass | robots.txt exists with valid format |
| discoverability | sitemap | pass | sitemap.xml exists with valid structure |
| discoverability | linkHeaders | pass | Found agent-useful Link relations: api-catalog, alternate |
| discoverability | dnsAid | fail | DNS for AI Discovery (DNS-AID) well-known entrypoint records not found |
| contentAccessibility | markdownNegotiation | pass | Site supports Markdown for Agents |
| botAccessControl | robotsTxtAiRules | pass | No AI-specific bot rules; wildcard rules apply to all crawlers including AI bots |
| botAccessControl | contentSignals | pass | Content Signals found in robots.txt |
| botAccessControl | webBotAuth | neutral | Web Bot Auth directory not found (informational only) |
| discovery | apiCatalog | pass | API Catalog found with 1 API listed |
| discovery | oauthDiscovery | fail | No OAuth/OIDC discovery metadata found |
| discovery | oauthProtectedResource | fail | No OAuth Protected Resource Metadata found |
| discovery | authMd | fail | auth.md exists but does not describe agent registration |
| discovery | mcpServerCard | fail | MCP Server Card not found |
| discovery | a2aAgentCard | fail | A2A Agent Card not found |
| discovery | agentSkills | pass | Agent Skills index exists with valid JSON |
| discovery | webMcp | pass | Found 3 WebMCP tools via document.modelContext: consultar_servicos, abrir_diagnostico, consultar_catalogo_apis |
| discovery | ard | pass | ARD capability manifest found with 2 agentic resources |
| discovery | personalAgentProtocol | pass | Personal Agent Protocol discovery is valid |
| commerce | x402 | neutral | x402 payment protocol not detected (not a commerce site) |
| commerce | mpp | neutral | MPP payment discovery not detected (not a commerce site) |
| commerce | ucp | neutral | UCP profile not found (not a commerce site) |
| commerce | acp | neutral | ACP discovery document not found (not a commerce site) |
| commerce | ap2 | neutral | AP2 not detected (no A2A Agent Card) (not a commerce site) |

## Referências

- Verificador: https://isitagentready.com/leonardobrasil.com.br
- API Catalog: https://www.rfc-editor.org/rfc/rfc9727
- Agent Skills Discovery: https://github.com/cloudflare/agent-skills-discovery-rfc
- WebMCP: https://webmachinelearning.github.io/webmcp/
- ARD: https://agenticresourcediscovery.org/

As verificações foram feitas sobre os documentos públicos e o código do projeto. Não foram emitidos tokens, criadas contas de agentes, executadas transações ou realizadas operações autenticadas no CRM.
