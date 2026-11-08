---
title: Comandos e Rotinas de Deploy
tags:
  - deploy
  - ci-cd
  - hostinger
  - scripts-npm
  - git
aliases:
  - Rotinas de Deploy
  - Comandos NPM
  - Publicação em Produção
---

# 🚀 Comandos e Rotinas de Deploy

> [!abstract] Ciclo de Vida e Publicação
> O projeto utiliza Git com fluxo de entrega contínua vinculado ao repositório `https://github.com/leoferrazdev/leonardo-brasil.git` e sincronização automatizada para o servidor de produção na Hostinger.

---

## 1. Dicionário de Scripts NPM

| Comando | Descrição da Operação |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento Vite na porta `5173`. |
| `npm run typecheck` | Executa o compilador TypeScript (`tsc --noEmit`) para verificar tipos. |
| `npm run test:server` | Executa a suíte de testes de rotas do Express e SSR com Vitest. |
| `npm run verify` | Executa a sequência completa de validação (`typecheck` + `test:server`). |
| `npm run build` | Compila o bundle do cliente, gera o runtime SSR, executa pré-renderização estática de rotas e cria os índices de sitemaps XML. |
| `npm start` | Inicia o servidor Express de produção em `server.js`. |

---

## 2. Fluxo de Publicação para a Branch `main`

```bash
# 1. Verificar integridade
npm run verify

# 2. Compilar e testar build de produção
npm run build

# 3. Commitar alterações com Conventional Commits
git add .
git commit -m "feat(crm): implement complete knowledge base and framework"

# 4. Enviar para o repositório remoto
git push origin main
```

---

## Conexões Relacionadas
* [[Checklist de Verificação e Testes]]
* [[Infraestrutura e Deploy na Hostinger]]
* [[00 - MOC - Índice Geral|Voltar ao MOC]]
