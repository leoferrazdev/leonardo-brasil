# Manual Operacional: Rotina Comercial Diária no CRM (/crm)

- **Acesso Local / Homologação:** `http://localhost:5173/crm` (ou via `npm run dev`)
- **Acesso em Produção:** `https://leonardobrasil.com.br/crm`

---

## 1. Como Acessar e Fazer Login
1. Acesse `https://leonardobrasil.com.br/crm` (redireciona automaticamente para `/crm/login`);
2. Digite o seu **e-mail e senha** do Supabase (o mesmo usuário e senha do `funilcomercial.com`);
3. *Opção alternativa em desenvolvimento/offline:* Clique no botão cinza **"Acesso Rápido / Modo Offline Local"** para entrar diretamente no dashboard sem depender de internet.

---

## 2. A Rotina Diária Passo a Passo (45 a 60 min/dia)

### Etapa 1: Filtrar a Meta do Dia (5 minutos)
- No topo do Dashboard, use os filtros rápidos:
  - Escolha o **Segmento** (ex: *Clínicas Veterinárias* ou *Clínicas Odontológicas*);
  - Escolha o **Bairro** (ex: *Tristeza* ou *Ipanema*).
- A coluna **"1. A Abordar (Novo)"** exibirá as empresas prontas com diagnóstico já realizado.

### Etapa 2: Disparar Abordagens no WhatsApp (15 a 20 minutos)
Para cada empresa na coluna `1. A Abordar`:
1. Clique no botão verde **`[ Chamar ]`** no card da empresa:
   - Uma nova aba do WhatsApp Web se abrirá automaticamente com o número da clínica e o **Bloco 1 (Gancho de Abertura)** já digitado!
2. Revise e aperte `Enter` para enviar no WhatsApp.
3. Volte ao CRM e clique no botão **`[ Avançar > ]`** no rodapé do card:
   - O card será movido automaticamente para a coluna **"2. Contatado"**.

### Etapa 3: Conduzir as Respostas (Ao longo do dia)
Quando uma empresa responder no WhatsApp:
1. Abra o CRM e clique no botão **`[ Ver Blocos ]`** no card da empresa;
2. A gaveta lateral se abrirá com as informações da clínica e as 4 abas de mensagens:
   - **Prospect respondeu com dúvida?** Clique na aba **Bloco 2 (Diagnóstico)** e aperte **`[ Copiar Bloco 2 ]`**; cole no WhatsApp e clique em *"Mover para 'Em Conversa'"*;
   - **Perguntou como funciona o serviço?** Clique na aba **Bloco 3 (Serviço)** e aperte **`[ Copiar Bloco 3 ]`**;
   - **Perguntou valores ou pediu proposta?** Clique na aba **Bloco 4 (Proposta)** e aperte **`[ Copiar Bloco 4 ]`** (valores ancorados: R$ 650 implantação / R$ 380 mensal);
3. Se desejar, anote observações da conversa no campo *"Anotações da Conversa"* e clique em **`[ Salvar Anotações ]`**.

---

## 3. Gestão Visual pelo Kanban
- **Arrastar e Soltar:** Você pode arrastar qualquer cartão livremente entre as colunas conforme o avanço das negociações;
- **Persistência Dupla:** Todas as alterações são salvas instantaneamente no navegador (`localStorage`) e sincronizadas com a tabela `leads` do Supabase.
