---
title: Sitemaps XML e Particionamento GSC
tags:
  - sitemap
  - indexacao
  - google-search-console
  - seo-tecnico
aliases:
  - Sitemaps XML
  - Particionamento de Sitemaps
---

# 🗺️ Sitemaps XML e Particionamento GSC

> [!abstract] Arquitetura de Indexação
> O ecossistema gera centenas de milhares de URLs programáticas e necessita de particionamento estrito para conformidade com o protocolo `sitemaps.org` aceito pelo Google Search Console.

---

## 1. Estrutura de Particionamento

```mermaid
flowchart TD
    Index["public/sitemap.xml<br>(Sitemap Index Principal)"]
    
    S1["sitemap-core.xml<br>(Páginas institucionais, hubs, blog e ferramentas)"]
    S2["sitemap-local-1.xml (Rotas 1 a 40.000)"]
    S3["sitemap-local-2.xml (Rotas 40.001 a 80.000)"]
    S4["sitemap-local-N.xml (...)"]
    
    Index --> S1
    Index --> S2
    Index --> S3
    Index --> S4
```

* **Script Gerador:** `scripts/generate-sitemap.mjs`
* **Limite por Arquivo:** 45.000 URLs (margem de segurança sobre o teto de 50k);
* **Frequência de Atualização:** Executado automaticamente a cada build de produção (`npm run build`).

---

## Conexões Relacionadas
* [[Motor 2 - Malha Programática 3.0 (312k URLs)]]
* [[SSR e Pré-Renderização Estática]]
* [[00 - MOC - Índice Geral|Voltar ao MOC]]
