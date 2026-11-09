# Planejador de Palavras-Chave Local (/crm/planejador) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o sistema interno de pesquisa e planejamento de palavras-chave (`/crm/planejador`) integrado à API oficial do Google Ads (`KeywordPlanIdeaService`) com fluxo OAuth2 integrado, motor de contingência local, calculadora de oportunidades no WhatsApp para prospecção e agrupador de campanhas para pós-venda.

**Architecture:**
- **Backend (`server/google-ads-keywords.mjs` + `server/app.mjs`):** Serviço de integração com a Google Ads REST API (`generateKeywordIdeas`), endpoints OAuth2 (`/api/ads/status`, `/api/ads/credentials`, `/api/ads/oauth/url`, `/api/ads/oauth/callback`), classificador semântico de intenção e clusters de grupos de anúncios, e motor de contingência em tempo real.
- **Frontend (`src/pages/crm/KeywordPlanner.tsx` + `src/pages/crm/components/*`):** Interface dark premium protegida por `CrmProtectedRoute` em `/crm/planejador`, com barra de navegação unificada no `CrmHeader.tsx` e atalho direto em cada `KanbanCard.tsx`.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Express 5, Node Test Runner (`node:test`).

---

### Task 1: Backend Google Ads Keyword Planner Service & Endpoints (TDD)

**Files:**
- Create: `server/google-ads-keywords.mjs`
- Modify: `server/app.mjs`
- Modify: `server/app.test.mjs`

- [ ] **Step 1: Escrever testes automatizados em `server/app.test.mjs`**
  Testar `GET /api/ads/status`, `POST /api/ads/keyword-ideas` (com mock da Google Ads API oficial e com fallback inteligente local), validação de campos obrigatórios, classificação de intenção, clusters de grupos de anúncios e palavras-chave negativas.
- [ ] **Step 2: Rodar os testes para confirmar falha inicial**
  Run: `npm test`
- [ ] **Step 3: Implementar `server/google-ads-keywords.mjs` e rotas em `server/app.mjs`**
  Implementar integração OAuth2 + `generateKeywordIdeas` da Google Ads API (`v18`), mapeamento de GeoTargetConstants brasileiros, classificador de intenção/clusters, gerador de negativas por nicho e persistência segura de credenciais em `.env`.
- [ ] **Step 4: Rodar os testes para confirmar aprovação**
  Run: `npm test`

---

### Task 2: Navegação Unificada no CRM e Atalho nos Cards do Kanban

**Files:**
- Modify: `src/pages/crm/components/CrmHeader.tsx`
- Modify: `src/pages/crm/components/KanbanCard.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Atualizar `CrmHeader.tsx`**
  Adicionar navegação superior entre **Kanban de Prospecção** (`/crm/dashboard`) e **Planejador de Palavras-Chave** (`/crm/planejador`).
- [ ] **Step 2: Atualizar `KanbanCard.tsx`**
  Adicionar botão *"Demanda Ads"* que redireciona para `/crm/planejador?q={segment}&city=porto-alegre&neighborhood={neighborhood}&lead={companyName}`.
- [ ] **Step 3: Registrar a rota protegida `/crm/planejador` em `src/main.tsx`**
  Proteger com `CrmProtectedRoute`.

---

### Task 3: Interface Completa do Planejador de Palavras-Chave (`src/pages/crm/KeywordPlanner.tsx`)

**Files:**
- Create: `src/pages/crm/KeywordPlanner.tsx`
- Create: `src/pages/crm/components/AdsApiConfigModal.tsx`

- [ ] **Step 1: Criar `AdsApiConfigModal.tsx`**
  Modal passo a passo para conectar e testar as credenciais do Google Ads MCC (`Developer Token`, `MCC Customer ID`, `Client ID`, `Client Secret`, `Customer ID`) e botão de autorização OAuth2 em 1 clique.
- [ ] **Step 2: Criar `KeywordPlanner.tsx`**
  Implementar os dois modos de operação:
  1. **Modo Prospecção (Pitch Comercial):** KPIs de demanda local, Calculadora de Oportunidades no WhatsApp e Gerador de Pitch pronto para copiar/disparar no WhatsApp.
  2. **Modo Pós-Venda (Engenharia de Campanha):** Tabela completa com filtros de intenção, sazonalidade de 12 meses, visão de Grupos de Anúncios (`"Frase"` e `[Exata]`), lista de Palavras-Chave Negativas e exportação CSV.
- [ ] **Step 3: Verificar tipagem, build e testes completos**
  Run: `npm run verify`
