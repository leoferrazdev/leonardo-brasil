---
title: Guia do cofre
tipo: guia
area: Painel
tags:
- leonardo-brasil
- cofre/guia
revisao_estrutura: 2026-11-08
---

# Guia do cofre

## Como encontrar e registrar conhecimento

1. Comece em [[Início]] ou use `Ctrl + O` para abrir uma nota pelo título.
2. Capture ideias em `01 - Entrada`. Classifique-as depois, sem criar pastas para cada ideia.
3. Consulte o mapa da área antes de criar uma nova nota, evitando duplicações.
4. Use os modelos em `80 - Recursos/Modelos` com o comando **Modelos: inserir modelo**.
5. Conecte a nota ao mapa da área e a referências relacionadas usando wikilinks.
6. Mova material superado para `90 - Arquivo`, preservando contexto e uma ligação para o documento substituto quando existir.

## Arquitetura

| Pasta | Finalidade |
| --- | --- |
| `00 - Painel` | Início, orientação e registro da organização. |
| `01 - Entrada` | Ideias, material a classificar e diário. |
| `10 - Estratégia e Marca` | Posicionamento e presença profissional. |
| `20 - SEO e Aquisição` | Google e perfis; motores e conteúdo. |
| `30 - Comercial e CRM` | Método e oferta; scripts; CRM e leads. |
| `40 - Engenharia` | Arquitetura, rotas, dados e infraestrutura. |
| `50 - Operação` | Qualidade, manutenção e publicação. |
| `80 - Recursos` | Modelos, anexos e localização das fontes externas ao cofre. |
| `90 - Arquivo` | Documentos históricos e material substituído. |

A divisão por áreas foi escolhida para este projeto. As skills Obsidian Markdown e Obsidian CLI orientam o formato das notas, os links, as propriedades e a operação do aplicativo; elas não exigem uma taxonomia única de pastas.

## Propriedades das notas

- `title`: título legível.
- `tipo`: `referencia`, `indice`, `decisao`, `diario`, `historico`, `guia` ou `modelo`.
- `area`: área responsável pelo conteúdo.
- `tags`: temas úteis para busca. Preserve as tags específicas existentes.
- `aliases`: nomes alternativos para encontrar a mesma nota.
- `revisao_estrutura`: data da organização documental; **não significa verificação factual**.

Use `[[Título da nota]]` para notas internas, `[[Título#Seção|Rótulo]]` para uma seção e `[rótulo](https://...)` para fontes da web. Prefira títulos únicos; deixe o Obsidian atualizar os links ao mover notas. Para destacar contexto, use callouts nativos como `> [!note]` e `> [!warning]`.

## Fontes e conteúdos históricos

O conteúdo técnico e comercial anterior foi preservado. As notas podem conter números, preços, decisões e descrições de implementação de momentos diferentes. A reorganização não comprova vigência desses dados e não substitui a consulta ao código, à fonte original ou à decisão comercial atual.

Confira [[Recursos e fontes do projeto]] para documentos que ficam fora do cofre.

## Aparência e legibilidade

- Texto das notas: **20 px**, com maior espaçamento entre linhas.
- Pastas principais: **18 px**, em negrito, com linhas mais altas e uma cor por área.
- Arquivos e subpastas: **16 px**, com espaço maior entre itens.
- Tema escuro: fundo `#080d18`, azul como acento e fonte Inter quando instalada, com alternativa nas fontes do sistema.
- Painel lateral ampliado para facilitar a leitura dos nomes.
- As personalizações ficam no snippet `leonardo-brasil-cofre`, em `.obsidian/snippets`.

Para ajustar depois, use **Configurações → Aparência**. Para desligar apenas o estilo personalizado, desative esse snippet em **Fragmentos CSS**. Não é necessário instalar plugins da comunidade.

## Cores das pastas e do gráfico

| Área | Cor | Pasta |
| --- | --- | --- |
| Painel | `#60a5fa` | `00 - Painel` |
| Entrada | `#fbbf24` | `01 - Entrada` |
| Estratégia e Marca | `#c4b5fd` | `10 - Estratégia e Marca` |
| SEO e Aquisição | `#5eead4` | `20 - SEO e Aquisição` |
| Comercial e CRM | `#86efac` | `30 - Comercial e CRM` |
| Engenharia | `#7dd3fc` | `40 - Engenharia` |
| Operação | `#fdba74` | `50 - Operação` |
| Recursos | `#f9a8d4` | `80 - Recursos` |
| Arquivo | `#94a3b8` | `90 - Arquivo` |

O gráfico usa grupos por caminho, com as mesmas cores das pastas. Abra com `Ctrl + G`. Modelos, anexos e arquivo ficam fora da visualização inicial para reduzir ruído; os arquivos continuam no cofre. Remova o filtro em **Filtros → Pesquisa** para mostrá-los. Os grupos de cores ficam disponíveis em **Grupos**.

## Manutenção simples

- Esvazie a entrada periodicamente, movendo cada nota para uma área.
- Atualize o mapa da área ao incluir uma referência importante.
- Evite duplicar a mesma informação em diferentes notas: faça links.
- Separe observações, hipóteses e decisões confirmadas ao registrar informações novas.
- Faça cópia de segurança antes de futuras reorganizações grandes.


---

[[Início|Voltar ao painel]] · [[Guia do cofre|Como usar o cofre]]
