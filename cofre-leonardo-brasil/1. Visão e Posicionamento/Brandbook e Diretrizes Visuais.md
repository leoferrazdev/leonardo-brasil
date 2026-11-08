---
title: Brandbook e Diretrizes Visuais
tags:
  - design
  - brandbook
  - tailwind
  - tokens
aliases:
  - Diretrizes Visuais
  - Identidade Visual
---

# 🎨 Brandbook e Diretrizes Visuais

A identidade visual de [leonardobrasil.com.br](https://leonardobrasil.com.br) expressa autoridade executiva, precisão técnica e sobriedade, distanciando-se de paletas infantis ou padrões genéricos de agências.

---

## 1. Paleta de Cores e Tokens CSS

Definidos e consolidados no `tailwind.config.js`:

| Nome do Token | Cor Hex | Uso / Aplicação |
| :--- | :--- | :--- |
| **`ink` (Background)** | `#0a0d14` | Fundo principal da aplicação (Dark Mode profundo, sem ruído). |
| **`line` (Bordas Sutis)** | `#1a2030` | Divisores e linhas de separação estrutural de cards e seções. |
| **`line-strong`** | `#2d3748` | Bordas com maior contraste em hover ou estados ativos. |
| **`text` (Texto Principal)** | `#f1f5f9` | Títulos H1, H2 e textos de alta legibilidade. |
| **`muted` (Texto Secundário)** | `#94a3b8` | Parágrafos de apoio, metadados e legendas. |
| **`accent` (Azul Google Tech)** | `#3b82f6` | Acentos primários, botões de ação principal, gradientes sutis e badges. |
| **`accent-300` / `400`** | `#93c5fd` / `#60a5fa` | Realces de texto e palavras-chave destacadas em títulos. |
| **`gold` (Aviso / Destaque)** | `#f59e0b` / `#fbbf24` | Barra superior de aviso (`AnnouncementBar`) para contraste imediato. |
| **`emerald` (WhatsApp / Sucesso)** | `#10b981` / `#25D366` | Botão flutuante de WhatsApp e indicadores de status online. |
| **`red-400` (Alerta / Suspensão)** | `#f87171` | Destaque para serviços de recuperação de perfis suspensos. |

---

## 2. Tipografia

* **Fonte Principal (Sans-Serif):** `Inter`, `system-ui`, `-apple-system`, `sans-serif`.
* **Hierarquia:**
  * **H1 Hero:** `text-4xl sm:text-5xl font-black leading-[1.08] tracking-tight`.
  * **H2 Seções:** `text-3xl sm:text-4xl font-extrabold tracking-tight`.
  * **Eyebrow / Badges:** `text-xs font-bold uppercase tracking-wider rounded-full border px-3 py-1`.
  * **Corpo:** `text-base sm:text-lg text-muted leading-relaxed`.

---

## 3. Elementos de Interface e Microinterações

1. **Backdrop Blur no Header:** `sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl`.
2. **Radial Gradients de Fundo:** Luzes volumétricas sutis com opacidade entre 12% e 18% para dar profundidade estética sem poluição visual.
3. **Pills de Navegação:** Uso de `whitespace-nowrap flex-shrink-0` em todos os botões e links para evitar quebras de linha em qualquer resolução de tela.

---

## Conexões Relacionadas
* [[Posicionamento e Tese da Marca]]
* [[Arquitetura do Sistema e Stack Técnica]]
* [[00 - MOC - Índice Geral|Voltar ao MOC]]
