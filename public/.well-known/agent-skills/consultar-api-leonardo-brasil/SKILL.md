---
name: consultar-api-leonardo-brasil
description: Consulte o catálogo público de APIs de Leonardo Brasil para localizar documentação, especificação OpenAPI e estado do serviço.
---

# Consultar APIs de Leonardo Brasil

Use esta skill quando precisar localizar a documentação das APIs de suporte ao Brasa ou consultar o estado informado pelo serviço.

1. Consulte `https://leonardobrasil.com.br/.well-known/api-catalog` por GET. Espere HTTP 200, JSON e o tipo `application/linkset+json`.
2. Leia o array `linkset`. Para a API desejada, siga `service-desc` para a especificação OpenAPI e `service-doc` para as instruções de uso.
3. Para consultar o estado, siga a relação `status` por GET. Distinga a configuração das integrações da disponibilidade real dos provedores: a resposta de saúde não garante que todos estejam operacionais.
4. Informe os links consultados e o que a resposta permite concluir. Se receber HTML, erro HTTP ou JSON inválido, informe que a descoberta está indisponível; não invente endpoints.

O catálogo descreve operações existentes; não concede autorização para executá-las. Esta skill realiza somente consultas GET aos documentos públicos e ao endpoint de saúde. Não execute operações POST, não reutilize sessões do CRM e não solicite senhas ou chaves de provedores. Consulte `/auth.md` para a disponibilidade de integração externa.
