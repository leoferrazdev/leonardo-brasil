---
title: Checklist de Verificação e Testes
tags:
  - qa
  - testes
  - verificacao
  - qualidade
  - estabilidade
aliases:
  - Checklist de Testes
  - Protocolo de QA
---

# ✅ Checklist de Verificação e Testes

> [!important] Integridade do Build de Produção
> Nenhum código é mesclado na branch `main` ou enviado para deploy sem passar com 100% de sucesso pela suíte automatizada de integridade.

---

## 1. Comandos de Verificação Mandatórios

```bash
# 1. Typecheck Estrito de TypeScript (Zero erros permitidos)
npm run typecheck

# 2. Testes de Servidor e Rotas (18/18 testes passando)
npm run test:server

# 3. Compilação Completa de Produção + SSR + Sitemaps
npm run build
```

---

## 2. Critérios de Aceite para Rotas do CRM (`/crm`)

1. **Exclusão de SSR:** As rotas `/crm`, `/crm/login` e `/crm/dashboard` devem ser ignoradas pelo script de pré-renderização estática (`scripts/prerender.mjs`);
2. **Meta Tags de Bloqueio de Robôs:** Header deve conter `robots: noindex, nofollow` para impedir vazamento de dados de clientes no Google;
3. **Persistência de Sessão Offline:** Validação do guardião `CrmProtectedRoute` para permitir navegação quando `localStorage.getItem("crm_offline_session") === "true"`.

---

## Conexões Relacionadas
* [[Arquitetura do Sistema e Stack Técnica]]
* [[Comandos e Rotinas de Deploy]]
* [[00 - MOC - Índice Geral|Voltar ao MOC]]
