---
title: Infraestrutura e Deploy na Hostinger
tags:
  - infraestrutura
  - deploy
  - hostinger
  - nodejs
aliases:
  - Hospedagem Hostinger
  - Infraestrutura de Servidor
---

# 🌐 Infraestrutura e Deploy na Hostinger

O projeto está hospedado no ambiente de hospedagem Cloud da **Hostinger**, executando uma aplicação **Node.js gerenciada**.

---

## 1. Ponto de Entrada da Aplicação (`app.js`)

O arquivo raiz `app.js` é o entrypoint esperado pelo painel da Hostinger para iniciar o processo Node.js:

```javascript
import './server/index.mjs';
```

Ele delega a execução para `server/index.mjs`, que sobe a instância do Express na porta definida na variável de ambiente `PORT` (ou 3000 por padrão).

---

## 2. Servindo Arquivos Estáticos e SSR Híbrido

O servidor Express opera com a seguinte lógica de prioridade:
1. **Verificação de Arquivo Estático:** Se existir um arquivo pré-renderizado no disco para a rota (ex: `dist/auditoria-perfil-google/index.html`), ele é entregue imediatamente com cabeçalhos de cache otimizados.
2. **Fallback SSR Dinâmico:** Se a rota for dinâmica (ex: uma das 311.976 rotas locais programáticas como `/google-meu-negocio/advogados/sp/sao-paulo`), o servidor invoca o bundle SSR `dist/server/entry-server.js` em tempo real para renderizar o HTML da página específica.
3. **Fallback SPA:** Caso ocorra qualquer falha no SSR, a rota entrega o `dist/index.html` padrão como fallback resiliente.

---

## 3. Gestão de Variáveis de Ambiente (`.env`)

As credenciais necessárias para operação em produção incluem:
* `VITE_SUPABASE_URL`: Endpoint da instância Supabase.
* `VITE_SUPABASE_ANON_KEY`: Chave pública de cliente para autenticação e queries seguras por RLS.
* `SUPABASE_SERVICE_ROLE_KEY`: (Uso restrito no backend, nunca exposto no bundle do cliente).
* `PORT`: Porta de escuta do Express (fornecida automaticamente pela Hostinger).

---

## 4. Rotina Automática de Postinstall

No `package.json`:
```json
"postinstall": "npm run build"
```
Quando a Hostinger realiza um deploy via Git (`git push origin main`), o comando `npm install` executa automaticamente o build completo do cliente, do servidor SSR, a pré-renderização das 82 páginas e a geração dos 8 sitemaps XML.

---

## Conexões Relacionadas
* [[Arquitetura do Sistema e Stack Técnica]]
* [[Gestão de Segurança e Dependências Node.js]]
* [[Comandos e Rotinas de Deploy]]
* [[00 - MOC - Índice Geral|Voltar ao MOC]]
