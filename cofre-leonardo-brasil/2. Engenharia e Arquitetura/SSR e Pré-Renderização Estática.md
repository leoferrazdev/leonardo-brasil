---
title: SSR e Pré-Renderização Estática
tags:
  - ssr
  - ssg
  - prerender
  - seo-tecnico
aliases:
  - Pré-Renderização
  - Prerender
---

# 🚀 SSR e Pré-Renderização Estática

> [!important] O Desafio dos SPAs Tradicionais
> SPAs puros (Single Page Applications) entregam aos buscadores apenas um HTML vazio com `<div id="root"></div>`. Motores de busca e bots de IA que não executam JavaScript completo indexam uma página vazia, comprometendo drasticamente o ranking.

Para solucionar isso de forma definitiva e veloz, [leonardobrasil.com.br](https://leonardobrasil.com.br) adota uma arquitetura híbrida de **Pré-Renderização Estática no Build** + **SSR sob demanda em tempo de execução**.

---

## 1. O Fluxo de Build de Dois Estágios

```mermaid
flowchart LR
    Step1["1. vite build<br>(Assets do Cliente em dist/)"] --> Step2["2. vite build --ssr<br>(entry-server.tsx em dist/server/)"]
    Step2 --> Step3["3. node prerender.mjs<br>(82 HTMLs Estáticos com Conteúdo Real)"]
```

1. **Build do Cliente:** Compila os componentes React, Tailwind e assets para a pasta `dist/`.
2. **Build do Servidor:** Compila `src/entry-server.tsx` em um bundle SSR em `dist/server/entry-server.js`.
3. **Execução de `scripts/prerender.mjs`:** O script Node.js itera sobre todas as 82 rotas core e hubs de nicho, invoca a função `render(url)` do bundle SSR e grava no disco arquivos `index.html` estáticos preenchidos com o HTML completo, metatags do Helmet e schemas JSON-LD.

---

## 2. Rotas Pré-Renderizadas no Build (82 Rotas)

O script [`scripts/prerender.mjs`](file:///d:/LEONARDO/Drive/Projetos/leonardo-brasil/scripts/prerender.mjs) pré-renderiza:

1. **Rotas Estáticas:**
   * `/` (Home)
   * `/google-meu-negocio` (Hub Principal)
   * `/otimizacao-google-meu-negocio`
   * `/consultor-google-meu-negocio`
   * `/especialista-google-maps`
   * `/recuperar-perfil-suspenso-google`
   * `/auditoria-perfil-google` (Raio-X Interativo)
   * `/google-meu-negocio/medicos-cfm`
   * `/google-meu-negocio/advogados-oab`
   * `/google-meu-negocio/dentistas-cfo`
   * `/cidades`
   * `/blog`
   * `/brandbook`
   * `/termos`, `/privacidade`, `/exclusao-de-dados`
   * `/porto-alegre-digital` (Regra de isolamento comercial)
2. **Hubs de Nicho das 4 Verticais:**
   * 14 nichos × 4 verticais = 56 páginas de nicho (ex: `/consultor-google-meu-negocio/advogados`).
3. **Artigos do Blog:** Todas as postagens de `src/data/blogData.ts`.

---

## 3. Benefícios Práticos para SEO

* **First Contentful Paint (FCP) Instantâneo:** O navegador recebe o texto pronto em menos de 100ms.
* **Leitura Imediata por Robôs de IA:** ChatGPT, Gemini, Perplexity e Googlebot leem o conteúdo sem depender de renderização JavaScript assíncrona.
* **Hidratação Transparente:** Quando o JavaScript termina de baixar, o React "hidrata" os nós existentes sem saltos de layout (CLS = 0).

---

## Conexões Relacionadas
* [[Arquitetura do Sistema e Stack Técnica]]
* [[Sitemaps XML e Particionamento GSC]]
* [[00 - MOC - Índice Geral|Voltar ao MOC]]
