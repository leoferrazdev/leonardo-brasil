---
title: Supabase Auth e Banco de Dados
tags:
  - supabase
  - auth
  - crm
  - banco-de-dados
aliases:
  - Autenticação Supabase
  - Banco de Dados CRM
---

# 🔐 Supabase Auth e Banco de Dados

Para garantir segurança rigorosa nas rotas operacionais internas (`/crm`), a aplicação integra o **Supabase** como camada de identidade e persistência.

---

## 1. Configuração do Cliente (`src/lib/supabase.ts`)

O cliente Supabase é instanciado de forma defensiva:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
```

---

## 2. Proteção de Rotas com SSR Safe (`src/pages/crm/components/CrmProtectedRoute.tsx`)

> [!security] Blindagem do SSR
> Como o sistema utiliza compilação SSR em Node.js (`entry-server.tsx`), verificações de sessão que dependem de `localStorage` causariam quebra de execução (`ReferenceError: localStorage is not defined`).

A solução arquitetural adotada no `CrmProtectedRoute`:
1. **Em ambiente de servidor (SSR):** Renderiza uma tela de carregamento neutra ou redireciona sem tocar em APIs do navegador.
2. **Em ambiente de cliente:** Verifica a sessão ativa do usuário através do `supabase.auth.getSession()` ou bypass autorizado para desenvolvimento local autenticado.
3. Se não houver sessão ativa, o usuário é redirecionado para a tela de login em `/crm/login`.

---

## 3. Modelo de Dados do CRM de Prospecção

A tabela `prospects` armazena os leads locais com as seguintes colunas principais:
* `id`: UUID único.
* `name`: Razão social ou nome fantasia da empresa local.
* `niche`: Segmento de atuação (ex: `odontologia`, `veterinaria`, `advocacia`).
* `city` / `state`: Cidade e estado de localização.
* `phone` / `formatted_phone`: Número de telefone sanitizado (DDI 55 + DDD + 8 ou 9 dígitos).
* `status`: Estágio no funil (`identificado`, `qualificado`, `abordado`, `negociando`, `fechado`, `descartado`).
* `diagnostic`: Diagnóstico técnico dos problemas no perfil (inconsistência de NAP, falta de catálogo, divergência de WhatsApp).
* `whatsapp_drafts`: Rascunhos personalizados prontos dos Blocos 1, 2 e 3 de abordagem.

---

## Conexões Relacionadas
* [[Sistema CRM de Prospecção Local]]
* [[Pipeline e Estágios do Kanban]]
* [[00 - MOC - Índice Geral|Voltar ao MOC]]
