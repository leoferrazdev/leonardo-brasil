# CRM de Prospecção Local (/crm) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir e instalar o módulo completo do CRM de Prospecção Local em `leonardobrasil.com.br/crm` (com tela de `/login`, `/dashboard` com Kanban de 5 etapas, cartões de prospecção, gaveta de 4 blocos de mensagens para WhatsApp e botões de cópia rápida), utilizando a mesma stack do `funilcomercial.com` (React 18 + Supabase + Tailwind + Lucide + DndKit).

**Architecture:** Módulo SPA integrado em `src/pages/crm/` protegido por `CrmProtectedRoute` conectado ao Supabase Auth e PostgreSQL. O Kanban opera em 5 etapas determinísticas da rotina diária de vendas, e cada card exibe diagnóstico de Perfil da Empresa no Google com botões para disparar WhatsApp Web e copiar blocos de mensagens formatados. Rotas isoladas de indexação com `noindex, nofollow`.

**Tech Stack:** React 18, TypeScript 5, Vite 8, TailwindCSS 3, `@supabase/supabase-js`, `lucide-react`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `react-hot-toast`.

## Global Constraints

- Diretório do projeto: `D:\LEONARDO\Drive\Projetos\leonardo-brasil`
- Rotas públicas do site principal não podem sofrer regressão visual ou de SEO (`npm run verify` e `npm run build` devem continuar passando 100%).
- Todas as rotas do CRM ficam sob `/crm` (`/crm`, `/crm/login`, `/crm/dashboard`).
- As páginas do CRM não devem ser pré-renderizadas estaticamente no SSR do Node (devem ter guard client-side com lazy loading).
- Formatação de WhatsApp deve usar `*negrito*`, quebras de linha `\n` e sanitização internacional de telefone (`5551...`).

---

### Task 1: Instalação de Dependências e Configuração do Supabase

**Files:**
- Modify: `package.json`
- Create: `.env`
- Create: `src/lib/supabase.ts`
- Test: `scripts/test-supabase-connection.mjs`

**Interfaces:**
- Produces: `supabase` (instância configurada do `@supabase/supabase-js`), `isSupabaseConfigured()` (helper booleano).

- [ ] **Step 1: Instalar dependências da stack no repositório leonardo-brasil**

Executar a instalação de `@supabase/supabase-js`, `lucide-react`, `react-hot-toast`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.

Comando:
```powershell
npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" install @supabase/supabase-js lucide-react react-hot-toast @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- [ ] **Step 2: Configurar variáveis de ambiente do Supabase**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\.env` com as chaves do projeto Supabase:
```env
VITE_SUPABASE_URL=https://juvwfxnlusrnvcarkrmc.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_yHgMqSz5KFAAPpWUht81vA_Rrjy36VF
```

- [ ] **Step 3: Criar cliente Supabase em `src/lib/supabase.ts`**

Criar `D:\LEONARDO\Drive\Projetos\leonardo-brasil\src\lib\supabase.ts`:
```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://juvwfxnlusrnvcarkrmc.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_yHgMqSz5KFAAPpWUht81vA_Rrjy36VF";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

- [ ] **Step 4: Criar script de teste e verificar conexão**

Criar `scripts/test-supabase-connection.mjs`:
```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://juvwfxnlusrnvcarkrmc.supabase.co";
const supabaseAnonKey = "sb_publishable_yHgMqSz5KFAAPpWUht81vA_Rrjy36VF";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const { data, error } = await supabase.auth.getSession();

if (error) {
  console.error("Erro na conexão Supabase:", error.message);
  process.exit(1);
} else {
  console.log("Conexão com Supabase validada com sucesso!");
}
```
Run: `node scripts/test-supabase-connection.mjs`
Expected: "Conexão com Supabase validada com sucesso!"

- [ ] **Step 5: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add package.json package-lock.json src/lib/supabase.ts .env scripts/test-supabase-connection.mjs; git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): install dependencies and configure supabase client"
```

---

### Task 2: Modelo de Dados, Tipos e Carga dos 40 Prospects Auditados

**Files:**
- Create: `src/pages/crm/types.ts`
- Create: `src/pages/crm/data/initialProspects.ts`
- Create: `src/pages/crm/services/crmProspectService.ts`

**Interfaces:**
- Produces: `ProspectLead`, `PipelineStageId`, `crmProspectService.getLeads()`, `crmProspectService.updateLeadStage()`, `crmProspectService.updateLeadNotes()`.

- [ ] **Step 1: Criar definições de tipos em `src/pages/crm/types.ts`**

```typescript
export type PipelineStageId = 
  | "a_abordar"
  | "contatado"
  | "em_conversa"
  | "proposta_enviada"
  | "fechado_arquivado";

export interface PipelineStage {
  id: PipelineStageId;
  title: string;
  badgeColor: string;
  description: string;
}

export interface ProspectLead {
  id: string;
  sampleId: string;
  name: string;
  segment: "Clínica Veterinária" | "Clínica Odontológica" | "Oficina Mecânica" | "Restaurante";
  neighborhood: "Tristeza" | "Ipanema" | "Vila Assunção" | "Cristal";
  city: string;
  phone: string;
  formattedPhone: string;
  whatsappConfirmed: boolean;
  mapsUrl: string;
  siteUrl?: string;
  opportunityClass: "Classe B (20 pts)" | "Classe C (15 pts)" | "Classe C (5 pts)" | "Classe D (0 pts)";
  opportunityIssue: string;
  stage: PipelineStageId;
  bloco1: string;
  bloco2: string;
  bloco3: string;
  bloco4: string;
  notes?: string;
  updatedAt: string;
}
```

- [ ] **Step 2: Criar repositório com os 40 perfis auditados em `src/pages/crm/data/initialProspects.ts`**

Exportar a lista completa dos 40 perfis avaliados na Rodada 01, já com seus 4 blocos de mensagens estruturados e formatados para WhatsApp, servindo como carga inicial e base de fallback offline caso a rede oscile.

- [ ] **Step 3: Criar serviço de gerenciamento em `src/pages/crm/services/crmProspectService.ts`**

Implementar lógica de leitura e sincronização:
1. Tenta carregar os leads da tabela `leads` / `opportunities` do Supabase;
2. Se a tabela remota estiver vazia no primeiro acesso, realiza o seed automático com `initialProspects`;
3. Se offline, lê do `localStorage` com fallback para `initialProspects`;
4. Métodos: `getLeads()`, `updateLeadStage(id, stage)`, `updateLeadNotes(id, notes)`.

- [ ] **Step 4: Executar typecheck**

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run typecheck`
Expected: 0 errors.

- [ ] **Step 5: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add src/pages/crm/types.ts src/pages/crm/data/initialProspects.ts src/pages/crm/services/crmProspectService.ts; git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add types, initial prospects dataset and crm service"
```

---

### Task 3: Tela de Login e Guarda de Autenticação (`ProtectedRoute`)

**Files:**
- Create: `src/pages/crm/components/CrmProtectedRoute.tsx`
- Create: `src/pages/crm/Login.tsx`

**Interfaces:**
- Produces: `<CrmProtectedRoute>`, `<CrmLogin>`.

- [ ] **Step 1: Criar componente de guarda `CrmProtectedRoute.tsx`**

Verifica sessão do Supabase:
- Estado de carregamento: exibe spinner dark com mensagem de autenticação;
- Se `session === null`: redireciona para `/crm/login`;
- Se logado: renderiza `children`.

- [ ] **Step 2: Criar tela de Login `Login.tsx`**

Layout com identidade dark do Funil Comercial / Leonardo Brasil:
- Logotipo com badge *"CRM de Prospecção"*;
- Formulário com campos E-mail e Senha;
- Botão "Acessar CRM";
- Alertas de erro via `react-hot-toast` em caso de credenciais inválidas;
- Redirecionamento automático para `/crm/dashboard` ao logar.

- [ ] **Step 3: Testar compilação**

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run typecheck`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add src/pages/crm/components/CrmProtectedRoute.tsx src/pages/crm/Login.tsx; git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): add protected route guard and login page"
```

---

### Task 4: Interface do Dashboard, Kanban (@dnd-kit) e Gaveta de Blocos

**Files:**
- Create: `src/pages/crm/components/CrmHeader.tsx`
- Create: `src/pages/crm/components/KanbanCard.tsx`
- Create: `src/pages/crm/components/KanbanColumn.tsx`
- Create: `src/pages/crm/components/MessageBlocksDrawer.tsx`
- Create: `src/pages/crm/Dashboard.tsx`

**Interfaces:**
- Produces: `<CrmDashboard>`, arrastar e soltar funcional, cópia para clipboard com toast e link direto para WhatsApp Web.

- [ ] **Step 1: Criar `CrmHeader.tsx`**
- Barra de topo com branding, status do Supabase e botão Logout;
- Barra de filtros: Segmento (`Todos`, `Veterinárias`, `Odontologia`, `Oficinas`, `Restaurantes`) e Bairro (`Tristeza`, `Ipanema`, `Vila Assunção`, `Cristal`);
- Indicadores numéricos do funil (Leads totais, A Abordar, Contatados, Fechados).

- [ ] **Step 2: Criar `KanbanCard.tsx` e `KanbanColumn.tsx`**
- Uso de `useDraggable` e `useDroppable` do `@dnd-kit/core`;
- Badge de Classe (`Classe B - 20 pts`, etc.);
- Alerta da falha principal com ícone;
- Botão de WhatsApp: abre `https://web.whatsapp.com/send?phone=${lead.formattedPhone}&text=${encodeURIComponent(lead.bloco1)}`;
- Botão "Ver Blocos": aciona a gaveta lateral de mensagens;
- Menu de ações rápidas para mover de coluna com 1 clique.

- [ ] **Step 3: Criar `MessageBlocksDrawer.tsx`**
- Gaveta lateral deslizante ao clicar em um card;
- 4 Abas ou seções verticais com os Blocos 1, 2, 3 e 4;
- Botão individual `[ Copiar Bloco N ]` com cópia direta para a área de transferência e aviso via `react-hot-toast`;
- Botão de avanço rápido de etapa: *"Marcar como Bloco 1 Enviado -> Mover para Contatado"*;
- Campo para anotações rápidas e histórico.

- [ ] **Step 4: Criar `Dashboard.tsx`**
- Agrupa Header, DndContext do `@dnd-kit`, colunas do Kanban e Gaveta lateral;
- Ouve evento `onDragEnd` e persiste a mudança de etapa no Supabase e no estado local.

- [ ] **Step 5: Testar compilação**

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run typecheck`
Expected: 0 errors.

- [ ] **Step 6: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add src/pages/crm/components/* src/pages/crm/Dashboard.tsx; git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): build dashboard with kanban board and message drawer"
```

---

### Task 5: Roteamento, Integração no `src/main.tsx` e SSR Guard

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx` (se aplicável para navegação)
- Test: `scripts/prerender.mjs`

- [ ] **Step 1: Adicionar rotas `/crm/*` no `src/main.tsx`**

Configurar carregamento preguiçoso (`React.lazy`):
- `/crm`: redireciona para `/crm/login`
- `/crm/login`: carrega `<CrmLogin />`
- `/crm/dashboard`: carrega `<CrmProtectedRoute><CrmDashboard /></CrmProtectedRoute>`
- Inserir `Toaster` do `react-hot-toast` para exibir notificações do CRM.

- [ ] **Step 2: Garantir que o SSR ignore rotas client-only do CRM**

Verificar `scripts/prerender.mjs` para garantir que `/crm/*` não seja incluído na lista de rotas estáticas pré-renderizadas do servidor Node, evitando falhas com APIs de navegador (`window`, `localStorage`).

- [ ] **Step 3: Executar build e verificação completa**

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run build`
Expected: Build SSR e client-side concluídos com sucesso gerando a pasta `dist/`.

- [ ] **Step 4: Commit**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add src/main.tsx scripts/prerender.mjs; git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "feat(crm): integrate crm routes and ensure ssr compatibility"
```

---

### Task 6: Validação End-to-End e Documentação Operacional

**Files:**
- Create: `docs/superpowers/specs/2026-11-07-crm-manual-de-uso.md`
- Run: `npm run verify`

- [ ] **Step 1: Executar suite de verificação completa**

Run: `npm --prefix "D:\LEONARDO\Drive\Projetos\leonardo-brasil" run verify`
Expected: Typecheck e testes passando com sucesso.

- [ ] **Step 2: Criar manual operacional rápido da rotina diária**

Criar guia conciso em `docs/superpowers/specs/2026-11-07-crm-manual-de-uso.md` explicando:
1. Como acessar `/crm/login` e `/crm/dashboard`;
2. Como usar o Kanban diário;
3. Como copiar os blocos e disparar contatos para WhatsApp em menos de 1 minuto por empresa.

- [ ] **Step 3: Commit final**

```powershell
git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" add docs/superpowers/specs/2026-11-07-crm-manual-de-uso.md; git -C "D:\LEONARDO\Drive\Projetos\leonardo-brasil" commit -m "docs(crm): add daily routine operating manual"
```
