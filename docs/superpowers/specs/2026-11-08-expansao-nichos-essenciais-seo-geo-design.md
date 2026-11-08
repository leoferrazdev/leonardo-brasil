# Design Doc: Expansão de Nichos Essenciais em SEO Local, GEO e Malha Programática

**Data:** 2026-11-08  
**Autor:** Leonardo Brasil (Estrategista Comercial & Diretor de SEO) / Antigravity AI  
**Status:** Aprovado  
**Alvo:** `https://leonardobrasil.com.br`

---

## 1. Visão Geral e Objetivos de Negócio

O objetivo deste projeto é expandir a dominância orgânica do ecossistema de **Google Meu Negócio e SEO Local** do Leonardo Brasil para **10 nichos de serviços essenciais e necessidades imediatas da população**. 

Essa expansão ataca diretamente buscas de altíssima intenção de contratação imediata no Google Maps (urgência mecânica, elétrica, socorro veicular, assistência de dispositivos, saúde animal e alimentação), fortalecendo tanto a atração orgânica tradicional quanto a citação em motores de IA generativa (**GEO - Generative Engine Optimization**, como Google AI Overviews, SearchGPT, Perplexity, Gemini e Claude).

---

## 2. Arquitetura de Clusters Semânticos & Prevenção de Canibalização

Para evitar diluição de autoridade e penalizações do Google por *doorway pages* ou *thin content*, 17 termos foram sintetizados em **10 Clusters Semânticos Canônicos**:

| ID / Slug | Nome Canônico | Sinônimos e Termos LSI Cobertos | Tipo Schema.org |
| :--- | :--- | :--- | :--- |
| `eletricistas` | Eletricistas | Eletricista 24h, residencial, predial, industrial, curto-circuito, padrão de luz, instalação elétrica | `Electrician` / `EmergencyService` |
| `pedreiros` | Pedreiros e Empreiteiras | Pedreiro, reformas, assentamento de pisos, alvenaria, empreiteira, pequenas obras, construção | `GeneralContractor` |
| `guinchos` | Guinchos e Auto Socorro | Guincho 24h, auto socorro, reboque de carros, guincho plataforma, guincho pesado, socorro mecânico | `EmergencyService` / `AutoRepair` |
| `assistencia-celulares` | Assistência Técnica de Celulares | Manutenção de celular, conserto de smartphone, troca de tela, troca de bateria, iPhone, Samsung, Xiaomi | `ElectronicsRepair` |
| `manutencao-computadores` | Manutenção de Computadores | Manutenção de computador, conserto de notebook, formatação, upgrade SSD, reparo de placas, limpeza | `ElectronicsRepair` |
| `oficinas-mecanicas` | Oficinas Mecânicas | Oficina mecânica, oficina automotiva, oficina de carro, oficina de veículo, auto center, suspensão, freios, injeção | `AutoRepair` |
| `clinicas-veterinarias` | Clínicas Veterinárias | Clínica veterinária, médico veterinário, médica veterinária, hospital veterinário 24h, cirurgia animal, vacinação pet, CFMV | `VeterinaryCare` |
| `pet-shops` | Pet Shops | Pet shop, banho e tosa, rações, estética canina, hotelzinho pet, acessórios | `PetStore` |
| `agropecuarias` | Lojas Agropecuárias | Casa agropecuária, insumos agrícolas, sementes, rações a granel, ferramentas rurais, adubos | `Store` |
| `restaurantes` | Restaurantes | Restaurante, marmitaria executiva, self-service, almoço corporativo, delivery, gastronomia local | `Restaurant` |

*(Nota: `medicos` e `dentistas` já estão ativos como hubs prioritários nos Motores 2 e 3).*

---

## 3. Especificação de Dados e Copywriting

### 3.1. `src/data/niches.ts`
Cada novo cluster recebe:
* `slug`: identificador único URL-safe.
* `title`: Tag `<title>` otimizada para SEO e CTR.
* `description`: Meta tag description persuasiva com chamada de ação.
* `badge`: Etiqueta visual de setor.
* `h1`: Chamada principal atacando o gargalo financeiro de estar fora do Top 3.
* `h1Highlight`: Trecho em destaque visual com a proposta de valor.
* `subheadline`: Parágrafo com resposta direta em estilo BLUF (Bottom Line Up Front) amigável para motores de IA.
* `painPoints`: 3 dores factuais e agudas enfrentadas pelo dono do negócio.
* `ctaText`: Texto do botão principal.
* `waMessage`: Mensagem contextualizada e parametrizada para o WhatsApp (`+55 51 99673-7359`).

### 3.2. `src/data/seoNicheData.ts`
Enriquecimento detalhado para cada cluster com:
* `title`: Título formatado para a página local.
* `heroSubtitle`: Parágrafo explicativo da importância da geolocalização.
* `painPointTitle` & `painPointDescription`: Argumentação consultiva e autoridade técnica.
* `benefits`: 3 benefícios tangíveis de faturamento e previsibilidade.
* `faqs`: 3 a 5 perguntas frequentes respondidas de forma factual e direta para indexação em `FAQPage` e AI Overviews.

### 3.3. `src/data/seoLocations.json`
* Inserção dos novos slugs e nomes formais na chave `NICHES`.
* Padronização de nomes como "Guinchos e Auto Socorro", "Assistência Técnica de Celulares", "Clínicas Veterinárias".

---

## 4. Otimização GEO (Generative Engine Optimization) & SEO On-Page

Para garantir que assistentes de IA (SearchGPT, Perplexity, Gemini, Claude) recomendem o Leonardo Brasil como especialista:
1. **Estrutura BLUF (Bottom Line Up Front):** Conteúdo responde "O que é", "Por que é crítico" e "Como resolver" nas primeiras 50 palavras.
2. **Schema.org Específico:** Injeção dinâmica no `SeoHead` e nas landings de tipos compatíveis do Schema.org (`VeterinaryCare`, `EmergencyService`, `Electrician`, `AutoRepair`, etc.) associados ao serviço do consultor Leonardo Brasil (`ProfessionalService`).
3. **Formatters de Nicho (`src/pages/GoogleMeuNegocioLocalLanding.tsx`):** Atualização da função `formatNiche` para garantir concordância gramatical e semântica impecável em todas as 5.571 cidades.

---

## 5. Infraestrutura Técnica, Sitemaps e Build

1. **Malha Programática:**
   * 23 Nichos × 5.571 Cidades × 4 Verticais de Busca = **512.532 rotas indexáveis**.
2. **Sitemaps Particionados (`scripts/generate-sitemap.mjs`):**
   * Manter chunk de 40.000 URLs por arquivo XML.
   * Geração automática de `sitemap-core.xml`, `sitemap-local-1.xml` até `sitemap-local-13.xml` / `14.xml` sob o índice mestre `sitemap.xml`.
3. **Pré-renderização Estática (`scripts/prerender.mjs`):**
   * Compilação dos novos hubs em HTML estático pré-renderizado no diretório `dist/` durante o build de produção, garantindo Core Web Vitals impecáveis (LCP < 1.2s) e entrega de texto puro para robôs de busca.

---

## 6. Critérios de Aceite e Verificação

1. **Compilação TypeScript:** `npm run build` deve compilar com 0 erros de tipagem.
2. **Geração de Sitemaps:** `node scripts/generate-sitemap.mjs` deve gerar o índice e os arquivos particionados contendo todas as URLs esperadas.
3. **Rotas e Renderização:** Testar navegação dos 10 novos hubs em modo SSR / desenvolvimento, validando canonicals, meta tags e formulários de WhatsApp.
4. **Validação de Schema:** Dados estruturados JSON-LD válidos sem alertas ou erros de tipagem.
