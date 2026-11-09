---
title: Identificação visual e prova concreta na home
date: 2026-11-09
tipo: decisao
area: Estratégia e Marca
status: implementado
tags:
  - leonardo-brasil
  - site
  - conversao
  - identidade-visual
---

# Identificação visual e prova concreta na home

> [[Mapa de Estratégia e Marca|Estratégia e Marca]] · [[Brandbook e Diretrizes Visuais]] · [[Rotas e Componentes Principais]]

## Contexto e autorização

Em 09/11/2026, o usuário aprovou três ajustes pontuais na página inicial de [Leonardo Brasil](https://leonardobrasil.com.br/), com registro neste cofre, commit e push na `main`. O escopo preserva as demais áreas, textos e funcionalidades do projeto.

## Decisão e implementação

1. Substituir o ponto decorativo da identificação acima do título por um pin genérico azul, acompanhado de “Perfil da Empresa no Google · SEO Local”. Usar `MapPin` da dependência existente `lucide-react`.
2. Acrescentar junto à foto um bloco com identidade própria para presença nas buscas, informações do perfil, avaliações e caminhos para contato.
3. Exibir após a primeira dobra uma entrega verificável: o Raio-X gratuito já existente em `/auditoria-perfil-google`. Explicar as seis perguntas, a pontuação de 0 a 100 e os pontos de atenção, com chamada para experimentar a ferramenta.

O terceiro ajuste demonstra uma ferramenta real do projeto. Não foram encontrados neste escopo depoimentos ou casos de clientes com autorização documentada para publicação. O novo bloco apresenta corretamente uma autoavaliação baseada nas respostas do visitante, sem atribuir à ferramenta uma consulta automática ao Google.

> [!note] Identidade e evidência
> Manter a marca Leonardo Brasil, sua paleta escura e azul e a foto atual. Não usar logo Google, “G” multicolorido, pin oficial, imitação da interface do Maps, depoimentos inventados ou resultados de clientes sem comprovação. Melhorias em reconhecimento e conversão permanecem hipóteses a medir.

## Plano de execução

- [x] Aplicar somente os três ajustes em `src/App.tsx`, usando React, TypeScript e classes Tailwind existentes.
- [x] Verificar tipagem, testes existentes e build completo com `npm run verify`.
- [x] Conferir a página em desktop e celular, incluindo o acesso ao Raio-X.
- [x] Conferir o diff final e delimitar o versionamento a `src/App.tsx` e esta nota.

## Validação e publicação

- `npm run verify`: concluído com código de saída 0; TypeScript sem erros, build de cliente e SSR concluídos, 127/127 rotas pré-renderizadas e 31/31 testes existentes aprovados.
- Revisão visual local em desktop (1280 px) e celular (390 px): identificação com pin, bloco junto à foto e seção de demonstração legíveis, sem transbordamento horizontal.
- O novo botão “Testar o Raio-X gratuito” aponta para `/auditoria-perfil-google` e sua navegação foi exercitada no navegador.
- Sem dependências adicionadas. Mudança de código restrita a `src/App.tsx`; registro documental restrito a esta nota.
- Havia trabalho de CRM e do cofre em paralelo, posteriormente registrado por outro trabalho no commit `9cf3f6f`. Esse conteúdo não foi editado nem incluído como alteração desta solicitação.
- O build utiliza as rotinas existentes de geração de `dist/` e sitemaps. Os arquivos gerados já apresentavam alterações locais antes desta implementação e ficam fora do commit solicitado.
- Não foi medida melhoria de conversão. A publicação por deploy automático deve ser distinguida da confirmação do push para o GitHub.
- Versionamento autorizado: commit destes dois arquivos na `main` e envio com `git push origin main`. O identificador desta entrega fica disponível no [histórico da branch principal](https://github.com/leoferrazdev/leonardo-brasil/commits/main/).
- Registro preparado com as skills locais Obsidian Markdown e Obsidian CLI; conteúdo e propriedades conferidos no modo de leitura do Obsidian. A CLI não respondeu nesta sessão, e a conferência foi realizada pela interface do aplicativo.

## Fontes e conexões

- Código da home: `src/App.tsx`.
- Ferramenta demonstrada: `src/pages/AuditoriaPerfilGoogle.tsx`.
- [Raio-X disponível no site](https://leonardobrasil.com.br/auditoria-perfil-google).
- [Orientações de marca do Google](https://about.google/brand-resource-center/brand-elements/).
- [[Motor 1 - Raio-X e Auditoria Interativa]].
- [[Checklist de Verificação e Testes]].
