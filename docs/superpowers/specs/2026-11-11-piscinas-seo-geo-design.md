# Design Doc: Cluster B2B de Piscinas em SEO Local, GEO e Malha Programática

**Data:** 2026-11-11  
**Autor:** Leonardo Brasil (Diretor de SEO) / Antigravity AI  
**Status:** Aguardando Revisão Final da Spec  
**Alvo:** `https://leonardobrasil.com.br`

---

## 1. Visão Geral, Posicionamento B2B e Regras Editoriais

Este projeto cria a vertical estratégica para o **setor de piscinas** dentro do ecossistema `leonardo-brasil`, com o objetivo de gerar leads B2B qualificados via Google Search, Google Maps e motores de resposta por IA (**GEO — Generative Engine Optimization**).

### Regra Inegociável de Posicionamento B2B
- **Público-alvo exclusivo:** donos de lojas de piscinas, revendas de equipamentos e acessórios, empresas de limpeza/tratamento e *piscineiros* autônomos que buscam contratar um **especialista em Google Meu Negócio e SEO Local**.
- **Proibição B2C:** nenhuma página, `<title>`, `<h1>`, box **BLUF** ou `Schema.org` ofertará limpeza avulsa de piscina residencial ou venda de cloro, bombas e acessórios ao consumidor final.
- **Uso semântico das 21 palavras-chave:** os termos pesquisados por consumidores finais (ex.: *limpeza de piscina*, *loja de piscinas perto de mim*, *acessórios para piscina*, *piscineiro porto alegre*) aparecem exclusivamente enquadrados como **a demanda de buscas de alta intenção que a consultoria do Leonardo Brasil faz o negócio do empresário capturar no Top 3 do Google Maps e nas IAs**.
- **Tom de voz e compliance:** direto, persuasivo, voltado ao empresário local (`pt-BR`), mantendo a política de **zero falsas promessas** (*"1º lugar fixo garantido"*).

---

## 2. Arquitetura Anti-Canibalização (21 Palavras-Chave → 3 Guias B2B + 2 Nichos)

Criar 21 páginas individuais para variações preposicionais (`de/para/em piscina`, `loja de piscina/piscinas`) causaria canibalização e *keyword stuffing*. Aplicando a regra **1 Intenção Única = 1 URL Canônica**, os 21 termos são consolidados em **3 Guias Editoriais B2B** mais **2 Nichos Canônicos** na malha programática nacional:

### 2.1. Os 3 Guias B2B Canônicos

| Rota Canônica | Componente React (`src/pages/`) | Termos-Alvo Absorvidos (Demanda B2C Enquadrada em B2B) | Estratégia & Mecânica de Conversão |
| :--- | :--- | :--- | :--- |
| `/google-meu-negocio-limpeza-e-manutencao-de-piscina` | `GoogleMeuNegocioLimpezaPiscina.tsx` | `limpeza de piscina`, `limpeza para piscina`, `limpeza em piscina`, `limpeza piscina`, `manutenção de piscina` | Configuração de Perfil como **Área de Atendimento (SAB)** ocultando endereço residencial; uso de fotos antes/depois (*piscina verde recuperada*) e catálogo de planos para fechar **contratos mensais recorrentes no WhatsApp**. |
| `/google-meu-negocio-loja-de-piscinas-e-acessorios` | `GoogleMeuNegocioLojaPiscinas.tsx` | `loja de piscinas`, `loja de piscina`, `loja de piscinas perto de mim`, `loja de piscina perto de mim`, `acessorios piscina`, `acessorios para piscina`, `loja de equipamentos de piscina` | Playbook de varejo físico para dominar buscas **"perto de mim"**: estruturação da **aba Produtos** (cloro, filtros, bombas, trocadores de calor, kits e acessórios) com sinais de estoque local para atrair fluxo ao balcão e WhatsApp. |
| `/google-meu-negocio-piscinas-porto-alegre` | `GoogleMeuNegocioPiscinasPortoAlegre.tsx` | `loja de piscinas porto alegre`, `loja de piscina porto alegre`, `loja de piscina em porto alegre`, `loja de piscinas em porto alegre`, `loja de produtos para piscina porto alegre`, `piscineiro porto alegre`, `limpeza de piscina em porto alegre`, `limpeza de piscina porto alegre`, `limpeza piscina porto alegre` | Estudo regional com **Entity Anchoring em Porto Alegre - RS** (Zona Sul: Tristeza, Ipanema, Pedra Redonda, Vila Assunção, Espírito Santo, Belém Novo; Norte/Leste: Moinhos de Vento, Bela Vista, Três Figueiras, Chácara das Pedras), sazonalidade do verão gaúcho e diagnóstico com consultor local na capital. |

### 2.2. Expansão da Malha Programática (+2 Nichos Canônicos)

Inserção de **2 novos slugs** para ativar os **8 hubs nacionais pré-renderizados** (`/google-meu-negocio/:nicho`, `/otimizacao-google-meu-negocio/:nicho`, `/consultor-google-meu-negocio/:nicho`, `/especialista-google-maps/:nicho`) e as páginas locais de **5.571 cidades**, com destaque imediato para **`/rs/porto-alegre`**:

1. **`limpeza-de-piscina`**
   - Nome em `src/data/seoLocations.json`: `"Limpeza e Manutenção de Piscinas"`
   - Retorno de `formatNiche("limpeza-de-piscina")` em `GoogleMeuNegocioLocalLanding.tsx`: `"empresas de limpeza e manutenção de piscinas"`
2. **`lojas-de-piscinas`**
   - Nome em `src/data/seoLocations.json`: `"Lojas de Piscinas e Equipamentos"`
   - Retorno de `formatNiche("lojas-de-piscinas")` em `GoogleMeuNegocioLocalLanding.tsx`: `"lojas de piscinas, acessórios e equipamentos"`

Ambos receberão registros B2B completos em `src/data/niches.ts` e `src/data/seoNicheData.ts` (com `painPoints`, `benefits`, `faqs` e `waMessage` dedicados ao proprietário do negócio).

---

## 3. Estrutura On-Page, GEO (IA Search) e Dados Estruturados (`Schema.org`)

Cada um dos 3 Guias B2B segue o sistema visual Tailwind do projeto (tema `#080d18`, acentos `#2563eb` / `#3b82f6`, tipografia `Inter`, apenas utilitários Tailwind) e inclui:

1. **Title & H1 explícitos para o empresário:** ex.: *"Google Meu Negócio e SEO para Lojas de Piscinas, Acessórios e Equipamentos | Leonardo Brasil"*.
2. **BLUF Box (Bottom Line Up Front):** bloco logo abaixo do `<h1>` com 45–65 palavras objetivas explicando como empresas do setor conquistam o Top 3 do Mapa e citações em IAs (AI Overviews, ChatGPT, Perplexity, Gemini).
3. **Tabela Semântica Comparativa (`<table>`):** comparando a operação invisível/dependente de anúncios ou indicação boca a boca contra a operação otimizada nos 6 Pilares do Google Maps.
4. **Diagnóstico dos 4 Gargalos + Plano Prático em 4 Etapas:** específicos por submodelo (SAB domiciliar vs. loja física com aba Produtos vs. disputa por bairros de Porto Alegre).
5. **FAQ Acordeão B2B + CTA Direto para WhatsApp (`+55 51 99673-7359`):** mensagem pré-preenchida identificando o segmento do empresário.
6. **JSON-LD via `SeoHead.tsx`:** `@graph` combinando:
   - `Article` (autor `Leonardo Brasil`, `Diretor de SEO e Especialista em Google Meu Negócio`)
   - `HowTo` (4 passos práticos)
   - `Service` (consultoria de Google Meu Negócio e SEO Local prestada por Leonardo Brasil para o setor)
   - `FAQPage` (perguntas frequentes do empresário)
   - além do `BrandGraph` automático do `SeoHead`.

---

## 4. Melhoria Pontual na Malha Local (`GoogleMeuNegocioLocalLanding.tsx`)

Durante a inspeção de arquitetura, verificou-se que `src/pages/GoogleMeuNegocioLocalLanding.tsx` já importa `seoNicheData` e calcula `nicheData`, mas ainda não renderizava os dados específicos de `nicheData` nem os diferenciava de nichos clínicos (exibindo `"pacientes"` e `"consultório"` para nichos comerciais). Como melhoria pontual integrada a esta entrega:

1. Atualizar `formatNiche()` com `limpeza-de-piscina` e `lojas-de-piscinas`.
2. Renderizar seção dedicada exibindo `nicheData.painPointTitle`, `nicheData.painPointDescription`, `nicheData.benefits` e FAQ interativo alimentado por `nicheData.faqs` (também injetados no `FAQPage` do JSON-LD local), elevando a profundidade semântica das rotas locais contra riscos de *thin/doorway content*.
3. Ajustar o vocabulário de seção genérica para diferenciar segmentos de saúde/clínicos (`dentistas`, `medicos`, `psicologas`, `nutricionistas`, `fisioterapeutas`, `esteticistas`, `estetica`) de segmentos comerciais/serviços (`clientes`, `empresa`, `negócio`).
4. Exibir link cruzado contextual para `/google-meu-negocio-limpeza-e-manutencao-de-piscina`, `/google-meu-negocio-loja-de-piscinas-e-acessorios` e (quando `cidade === "porto-alegre"`) para `/google-meu-negocio-piscinas-porto-alegre`.

---

## 5. Topic Cluster, Infraestrutura Técnica e Cofre Obsidian

### 5.1. Malha de Links Internos (Topic Cluster)
- Interligação mútua entre os 3 Guias B2B + links diretos para os hubs nacionais e para `/google-meu-negocio/limpeza-de-piscina/rs/porto-alegre` e `/google-meu-negocio/lojas-de-piscinas/rs/porto-alegre`.
- Atualização de `src/pages/SegmentosLocaisGoogleMaps.tsx`:
  - **Pilar 04 (Serviços Locais & Domiciliares):** inclusão de *Limpeza e Manutenção de Piscinas* + link para o guia e nicho `limpeza-de-piscina`.
  - **Pilar 05 (Varejo Físico de Nicho):** inclusão de *Lojas de Piscinas e Equipamentos* + link para o guia e nicho `lojas-de-piscinas`.
- Inclusão dos 3 Guias na seção de SEO Local do `src/components/Footer.tsx` e link de reforço em `src/pages/ComoAparecerNoGoogleMaps.tsx`.
- *(Home em `src/App.tsx` e `src/pages/CitiesDirectory.tsx` já consomem `seoLocations.json` dinamicamente.)*

### 5.2. Registro de Rotas, SSR, Express, Sitemaps e Agentes
Todas as rotas novas devem permanecer 100% sincronizadas em:
1. `src/main.tsx` (React Router client-side lazy imports)
2. `src/entry-server.tsx` (renderização SSR)
3. `scripts/prerender.mjs` (`staticRoutes` + 8 novos hubs pré-renderizados em `dist/`)
4. `scripts/generate-sitemap.mjs` (`STATIC_ROUTES` → `sitemap-core.xml` + `2 * 4 * 5.571 = 44.568` novas URLs locais particionadas em blocos de 40.000 em `public/sitemap-local-*.xml` e `dist/`)
5. `server/routes-manifest.mjs` (`STATIC_WEB_ROUTES`, evitando HTTP 404 real no servidor Express em produção)
6. `public/llms.txt` (referência aos novos guias/nichos para agentes IA)

### 5.3. Documentação no Cofre Obsidian
- Carregar a skill `obsidian-markdown` antes de criar/atualizar notas em `cofre-leonardo-brasil/20 - SEO e Aquisição/`.
- Documentar o novo cluster (`Cluster B2B Piscinas - Limpeza, Lojas e Porto Alegre.md`) e conectá-lo ao `Mapa de SEO e Aquisição.md`.

---

## 6. Critérios de Aceite e Testes

1. **Testes automatizados (`server/app.test.mjs`):**
   - Os 3 Guias B2B, os 8 hubs nacionais de piscina e as rotas `/rs/porto-alegre` retornam HTTP `200` via `createMainApp`.
   - As 3 URLs canônicas aparecem em `dist/sitemap-core.xml` e `limpeza-de-piscina` / `lojas-de-piscinas` aparecem na malha local.
   - HTML pré-renderizado em `dist/` contém `<title>`, `<h1>`, JSON-LD (`Article`, `HowTo`, `Service`, `FAQPage`) e posicionamento estritamente consultivo B2B (sem oferta direta de serviços B2C ao consumidor final).
2. **Build & Auditoria Completa:**
   - `npm run verify` (`tsc --noEmit` + `vite build` + SSR + `prerender` + `generate-sitemap` + `node --test server/*.test.mjs`) passando integralmente.
   - `npm run verify:porto-alegre` passando sem erros.
3. **Publicação:**
   - Commit atômico na branch `main` (incluindo `dist/index.html` e `public/sitemap*.xml`, sem incluir o submódulo `cofre-mestre-contexto-ia`) e `git push origin main`.
