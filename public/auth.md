# auth.md — Leonardo Brasil

## Público e disponibilidade

Este documento orienta agentes que procuram acesso às APIs de Leonardo Brasil. O serviço não oferece cadastro automático de agentes, provisionamento de credenciais ou emissão de tokens OAuth para integrações externas.

## Solicitação de integração

Para solicitar uma avaliação humana de integração, entre em contato com contato@leonardobrasil.com.br e descreva a finalidade, as operações necessárias e o responsável pela integração. Esse contato não registra automaticamente o agente nem garante a emissão de credenciais.

## Métodos e credenciais

Não há métodos de registro de agentes, tipos de identidade ou credenciais de agente suportados atualmente. Não existe endpoint de registro, reivindicação de conta ou revogação de credenciais de agente.

O CRM usa autenticação de usuários pelo Supabase. A sessão do CRM não é um mecanismo de autorização para agentes acessarem as APIs do Brasa. Não solicite nem reutilize senhas, sessões ou chaves de provedores dos usuários para esse fim.

## Descoberta das APIs

- [Catálogo de APIs](https://leonardobrasil.com.br/.well-known/api-catalog)
- [Especificação OpenAPI](https://leonardobrasil.com.br/openapi.json)
- [Documentação](https://leonardobrasil.com.br/api-docs.md)

A existência de uma rota ou sua descrição no catálogo não constitui autorização de uso externo. Os metadados OAuth de recurso protegido e servidor de autorização para agentes não são publicados porque esse fluxo não está implementado.
