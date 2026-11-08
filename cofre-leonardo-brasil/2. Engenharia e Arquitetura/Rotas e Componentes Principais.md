---
title: Rotas e Componentes Principais
tags:
  - rotas
  - componentes
  - react
  - frontend
aliases:
  - Mapeamento de Rotas
  - Estrutura de Componentes
---

# 🗺️ Rotas e Componentes Principais

Todas as rotas da aplicação são sincronizadas de maneira idêntica entre o cliente ([`src/main.tsx`](file:///d:/LEONARDO/Drive/Projetos/leonardo-brasil/src/main.tsx)) e o servidor SSR ([`src/entry-server.tsx`](file:///d:/LEONARDO/Drive/Projetos/leonardo-brasil/src/entry-server.tsx)).

---

## 1. Tabela Mestra de Rotas

| Padrão da Rota | Componente | Finalidade / Descrição |
| :--- | :--- | :--- |
| `/` | `App.tsx` | Página inicial principal (GMN, 6 Pilares, FAQ, CTA). |
| `/google-meu-negocio` | `GoogleMeuNegocioLanding.tsx` | Hub institucional de Google Meu Negócio. |
| `/otimizacao-google-meu-negocio` | `GoogleMeuNegocioLanding.tsx` | Vertical de otimização de perfil. |
| `/consultor-google-meu-negocio` | `GoogleMeuNegocioLanding.tsx` | Vertical de consultor de presença local. |
| `/especialista-google-maps` | `GoogleMeuNegocioLanding.tsx` | Vertical de especialista em Google Maps. |
| `/auditoria-perfil-google` | `AuditoriaPerfilGoogle.tsx` | **Motor 1:** Ferramenta de Raio-X Interativo do perfil. |
| `/recuperar-perfil-suspenso-google` | `RecuperarPerfilSuspenso.tsx` | Hub de recuperação de perfis suspensos/desativados. |
| `/google-meu-negocio/medicos-cfm` | `GoogleMeuNegocioMedicosCfm.tsx` | **Motor 3:** Hub de conformidade com CFM 2.336/2023. |
| `/google-meu-negocio/advogados-oab` | `GoogleMeuNegocioAdvogadosOab.tsx` | **Motor 3:** Hub de sobriedade e Provimento 205/2021 OAB. |
| `/google-meu-negocio/dentistas-cfo` | `GoogleMeuNegocioDentistasCfo.tsx` | **Motor 3:** Hub de captação de particulares e normas CFO. |
| `/cidades` | `CitiesDirectory.tsx` | Diretório navegável dos 5.571 municípios do Brasil. |
| `/blog` | `BlogIndex.tsx` | Listagem de artigos sobre SEO Local e Google Maps. |
| `/blog/:slug` | `BlogPost.tsx` | Post completo em Markdown com Topic Clusters. |
| `/:vertical/:nicho` | `GoogleMeuNegocioNicheHub.tsx` | Hub nacional de nicho para cada uma das 4 verticais. |
| `/:vertical/:nicho/:estado/:cidade` | `GoogleMeuNegocioLocalLanding.tsx` | **Motor 2:** 311.976 landing pages locais programáticas. |
| `/crm` | `Dashboard.tsx` | Painel Kanban do CRM de Prospecção Local. |
| `/crm/login` | `Login.tsx` | Tela de autenticação para acesso ao CRM. |
| `/brandbook` | `Brandbook.tsx` | Documentação visual e diretrizes da marca. |
| `/porto-alegre-digital` | `PortoAlegreDigital.tsx` | Página de contrato comercial aprovado. |
| `/termos`, `/privacidade` | `LegalPages.tsx` | Páginas jurídicas e políticas de privacidade. |

---

## 2. Componentes Globais Reutilizáveis

* **`SeoHead.tsx`:** Injeta dinamicamente `title`, `meta[name=description]`, tags Open Graph (OG), Twitter Cards, `canonical` e scripts de `application/ld+json` para rich snippets do Google.
* **`Footer.tsx`:** Rodapé estruturado com links canônicos para todas as verticais, ferramentas, cidades, dados da empresa (CNPJ) e copyright.
* **`AnnouncementBar.tsx`:** Faixa no topo da página destacando o diagnóstico gratuito ou novidades.

---

## Conexões Relacionadas
* [[Arquitetura do Sistema e Stack Técnica]]
* [[SSR e Pré-Renderização Estática]]
* [[00 - MOC - Índice Geral|Voltar ao MOC]]
