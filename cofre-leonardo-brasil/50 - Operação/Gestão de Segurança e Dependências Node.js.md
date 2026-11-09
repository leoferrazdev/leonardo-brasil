---
title: Gestão de Segurança e Dependências Node.js
tags:
- seguranca
- nodejs
- hostinger
- dependencias
aliases:
- Segurança e Dependências
- Resolução de Vulnerabilidades
tipo: referencia
area: Operação
revisao_estrutura: 2026-11-08
---

> [[Início|Painel]] › [[Mapa de Operação|Operação]]

# 🔒 Gestão de Segurança e Dependências Node.js

> [!abstract] Resolução Proativa de Riscos
> Em servidores compartilhados e VPS da Hostinger, scanners automatizados alertam sobre pacotes com vulnerabilidades conhecidas. A arquitetura de Leonardo Brasil mantém dependências auditadas e atualizadas.

---

## 1. Protocolo de Auditoria e Correção

* **Auditoria de Pacotes:** `npm audit` executado periodicamente;
* **Substituição de Bibliotecas Depreciadas:**
  * Uso de pacotes modernos e leves (`@supabase/supabase-js`, `@dnd-kit`, `lucide-react`, `react-hot-toast`);
  * Isolamento de scripts de build na pasta `scripts/*.mjs`.

---

## Conexões Relacionadas
* [[Arquitetura do Sistema e Stack Técnica]]
* [[Infraestrutura e Deploy na Hostinger]]
* [[Início|Voltar ao MOC]]
