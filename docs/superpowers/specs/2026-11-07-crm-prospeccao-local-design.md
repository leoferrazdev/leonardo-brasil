# Especificação de Design: CRM de Prospecção Local (/crm)

- **Status:** Aprovado para Implementação
- **Data:** 07/11/2026
- **Autor:** Leonardo Brasil & Antigravity
- **Repositório:** [https://github.com/leoferrazdev/leonardo-brasil](https://github.com/leoferrazdev/leonardo-brasil)
- **Caminho Local:** `D:\LEONARDO\Drive\Projetos\leonardo-brasil`
- **Domínio de Produção:** `https://leonardobrasil.com.br/crm`

---

## 1. Visão Geral e Objetivos

O objetivo deste projeto é disponibilizar um **CRM operacional leve e determinístico** instalado no caminho `/crm` do site `leonardobrasil.com.br`. 

Ele foi desenhado especificamente para a rotina diária de prospecção de negócios locais (Google Meu Negócio / Perfil da Empresa no Google), fornecendo:
1. **Autenticação segura** em `/crm/login` via Supabase Auth;
2. **Dashboard operacional com painel Kanban** em `/crm/dashboard` organizado em 5 etapas determinísticas;
3. **Cartões de prospecção** com diagnóstico imediato de oportunidades (Classe B, Classe C, falhas de horário, telefones ausentes, perfis não reivindicados);
4. **Fluxo de mensagens em 4 blocos modulares** pré-formatados para WhatsApp;
5. **Ações de alta produtividade (1 clique):** botões de *"Copiar Bloco 1/2/3/4"* com formatação nativa e botão *"Abrir no WhatsApp Web"* com mensagem pré-carregada;
6. **Alinhamento tecnológico 100% fiel ao `funilcomercial.com`**, utilizando a mesma stack que já gera resultados consistentes de conversão orgânica.

---

## 2. Stack Tecnológica e Dependências

Para manter paridade completa com o `funilcomercial.com`:
- **Frontend:** React 18 + TypeScript + Vite 8 + TailwindCSS 3 (tema dark refinado);
- **Biblioteca de Ícones:** `lucide-react` para iconografia padronizada;
- **Arrastar e Soltar (Drag & Drop):** `@dnd-kit/core`, `@dnd-kit/sortable` e `@dnd-kit/utilities` para manipulação suave das colunas e cards do Kanban;
- **Notificações:** `react-hot-toast` para confirmações visuais imediatas de cópia e movimentação;
- **Backend & Nuvem:** Supabase (`@supabase/supabase-js`) utilizando as tabelas e autenticação nativas;
- **Servidor:** Express 5 (`server/app.mjs`) servindo SSR/estáticos e APIs com suporte a SPA fallback nas rotas `/crm/*`.

---

## 3. Arquitetura de Rotas e Isolamento

### 3.1 Mapeamento de Rotas
- `/crm` -> Redirecionamento condicional:
  - Se sessão ativa no Supabase -> `/crm/dashboard`
  - Se deslogado -> `/crm/login`
- `/crm/login` -> Tela de autenticação com e-mail e senha do Supabase;
- `/crm/dashboard` -> Painel restrito protegido por componente `ProtectedRoute`;
- `/crm/logout` -> Finalização de sessão e retorno ao login.

### 3.2 Isolamento de SEO e Roteador
- As páginas do CRM residem em `src/pages/crm/` e são carregadas sob lazy loading (`React.lazy`);
- Todas as rotas sob `/crm` injetam automaticamente a diretiva:
  ```html
  <meta name="robots" content="noindex, nofollow" />
  ```
  Isso assegura que nenhuma tela administrativa seja indexada pelo Google, preservando integralmente a autoridade orgânica e o sitemap do site institucional `leonardobrasil.com.br`.

---

## 4. Modelo de Dados e Integração com Supabase

### 4.1 Estrutura das 5 Etapas do Funil (`pipeline_stages`)
1. **`1. A Abordar (Novo)`**: Prospect pesquisado e qualificado, com celular comercial confirmado e blocos gerados;
2. **`2. Contatado`**: Bloco 1 (Gancho de Abertura) disparado pelo WhatsApp; aguardando resposta;
3. **`3. Em Conversa`**: Prospect respondeu com interesse ou dúvida; condução dos Blocos 2 (Diagnóstico) e 3 (Serviço);
4. **`4. Proposta Enviada`**: Bloco 4 (Condições comerciais: R$ 650 implantação / R$ 380 mensal) enviado;
5. **`5. Fechado / Arquivado`**: Contrato fechado ou registro de encerramento sem interesse.

### 4.2 Esquema do Lead de Prospecção Local
Cada registro conterá:
- `id`: UUID único;
- `nome`: Nome da Empresa (ex: *"Ceron Centro Veterinário"*);
- `segmento`: Categoria (ex: *"Clínica Veterinária"*, *"Clínica Odontológica"*, *"Oficina Mecânica"*);
- `bairro`: Bairro oficial (ex: *"Ipanema"*, *"Tristeza"*, *"Vila Assunção"*, *"Cristal"*);
- `cidade`: *"Porto Alegre"*;
- `telefone`: Número sanitizado no formato internacional `55519...`;
- `maps_url`: Link direto para o Perfil no Google Maps;
- `site_url`: Link oficial comparado (site institucional ou rede social);
- `classe_oportunidade`: *"Classe B (20 pts)"*, *"Classe C (15 pts)"*, *"Classe D"*;
- `falha_resumida`: Resumo em 1 frase da divergência encontrada;
- `etapa`: Etapa atual do Kanban (1 a 5);
- `bloco_1_gancho`: Texto pronto de abertura para WhatsApp;
- `bloco_2_diagnostico`: Texto pronto demonstrando a divergência com comprovação;
- `bloco_3_servico`: Texto pronto detalhando o escopo da implantação e blindagem;
- `bloco_4_proposta`: Texto pronto com a oferta financeira ancorada;
- `proxima_acao`: Indicação do próximo passo da rotina;
- `notas`: Campo livre para anotações das tratativas.

### 4.3 Carga Inicial de Dados
A base de 40 perfis pesquisados e auditados na Rodada 01 (10 clínicas veterinárias, 10 clínicas odontológicas, 10 oficinas e 10 restaurantes) será sincronizada diretamente com o Supabase via script `scripts/sync-crm-leads.mjs`.

---

## 5. Especificação da Interface do Usuário (UI/UX)

### 5.1 Barra Superior e Filtros Rápidos
- Logo Leonardo Brasil com indicador *"CRM Local"*;
- **Filtros por Segmento:** Pílulas interativas `Todos` | `Veterinárias` | `Odontologia` | `Oficinas` | `Restaurantes`;
- **Filtros por Bairro:** `Todos` | `Tristeza` | `Ipanema` | `Vila Assunção` | `Cristal`;
- **Barra de Métricas do Dia:**
  - Total de Leads;
  - Leads a Abordar Hoje;
  - Conversas Ativas;
  - Propostas Enviadas;
  - Fechamentos.
- Botão de logout no canto superior direito.

### 5.2 Painel Kanban
- 5 colunas verticais com cabeçalho contendo nome da etapa e quantidade de cartões;
- Suporte a drag-and-drop nativo com `@dnd-kit` e botões de atalho rápido para mover o card para a próxima etapa sem precisar arrastar.

### 5.3 Design dos Cartões (Cards)
- **Título:** Nome da Empresa + badge de bairro;
- **Alerta de Oportunidade:** Tag colorida com a Classe e ícone de alerta da falha principal (ex: `⚠️ Horário divergente`);
- **Ações Imediatas no Card:**
  - Botão verde de WhatsApp: abre o WhatsApp Web com a mensagem do Bloco atual pré-preenchida;
  - Botão "Ver Blocos": abre a gaveta de atendimento.

### 5.4 Gaveta Lateral de Atendimento (Drawer)
Ao selecionar um prospect, abre-se uma gaveta lateral focada:
- **Abas dos 4 Blocos Modulares:**
  - Bloco 1 (Gancho Inicial)
  - Bloco 2 (Diagnóstico Factual)
  - Bloco 3 (Escopo do Serviço)
  - Bloco 4 (Oferta e Valores)
- **Botão de Ação Primária:** `[ 📋 Copiar Bloco ]` com formatação adequada para WhatsApp (negritos `*...*`, quebras de linha e emojis profissionais);
- **Feedback Visual:** Notificação instantânea com `react-hot-toast` (*"Bloco copiado para o WhatsApp!"*);
- **Histórico e Notas:** Campo para registrar a resposta do empresário.

---

## 6. Segurança, Sessão e Resiliência Operacional

1. **Guarda de Rotas (`ProtectedRoute`):**
   - Intercepta acessos a `/crm/dashboard`;
   - Se `session == null`, redireciona imediatamente para `/crm/login`;
   - Ouve alterações em tempo real via `supabase.auth.onAuthStateChange`.

2. **Modo de Contingência Offline (Fallback de Dados):**
   - Caso a conexão com a nuvem oscile, o CRM carrega um snapshot local dos 40 prospects em cache/JSON para que o operador nunca fique sem acesso aos telefones e blocos de mensagem durante o expediente diário de prospecção.

3. **Sanitização de Contatos:**
   - Normalização automática de números telefônicos para evitar erros de discagem ou links inválidos do WhatsApp Web.

4. **Compatibilidade SSR:**
   - As páginas sob `/crm` verificam a disponibilidade do ambiente do navegador (`typeof window !== 'undefined'`) para evitar quebra no script de pré-renderização estática do site principal.

---

## 7. Plano de Verificação e Testes

1. **Verificação de Tipos e Build:**
   - Executar `npm run typecheck` e garantir zero erros TypeScript;
   - Executar `npm run build` e confirmar que as páginas SSR públicas e os bundles SPA do CRM são compilados com sucesso.
2. **Teste de Fluxo de Autenticação:**
   - Acesso deslogado em `/crm/dashboard` -> redireciona para `/crm/login`;
   - Login com credenciais válidas -> redireciona para `/crm/dashboard`;
   - Logout -> limpa sessão e retorna a `/crm/login`.
3. **Teste Funcional do Kanban:**
   - Arrastar e soltar card entre colunas;
   - Atualização imediata do status persistida no Supabase.
4. **Teste de Cópia e WhatsApp Web:**
   - Clicar em "Copiar Bloco 1" -> confirmação de toast e validação de texto no clipboard com formatação do WhatsApp;
   - Clicar em "Abrir no WhatsApp" -> abertura de aba com número sanitizado e texto codificado em URI.
