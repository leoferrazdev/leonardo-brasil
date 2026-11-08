import React, { useEffect } from "react";
import { Link, useParams, useLocation } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import locationsData from "../data/seoLocations.json";
import { seoNicheData, getDefaultNicheData } from "../data/seoNicheData";

const WHATSAPP_NUMBER = "5551992568861";

function formatLocationName(slug?: string) {
  if (!slug) return "";
  const specialCases: Record<string, string> = {
    "sao-paulo": "São Paulo",
    "rio-de-janeiro": "Rio de Janeiro",
    "belo-horizonte": "Belo Horizonte",
    "curitiba": "Curitiba",
    "campinas": "Campinas",
    "porto-alegre": "Porto Alegre",
    "brasilia": "Brasília",
    "salvador": "Salvador",
    "fortaleza": "Fortaleza",
    "florianopolis": "Florianópolis",
    "goiania": "Goiânia",
    "recife": "Recife",
    "sp": "SP",
    "rj": "RJ",
    "mg": "MG",
    "pr": "PR",
    "rs": "RS",
    "sc": "SC",
    "ba": "BA",
    "ce": "CE",
    "df": "DF",
    "go": "GO",
    "pe": "PE"
  };
  if (specialCases[slug]) return specialCases[slug];
  
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatNiche(nicho?: string) {
  if (!nicho) return "negócios locais";
  if (nicho === "psicologas") return "psicólogos";
  if (nicho === "nutricionistas") return "nutricionistas";
  if (nicho === "contadores") return "contadores";
  if (nicho === "fisioterapeutas") return "fisioterapeutas";
  if (nicho === "dentistas") return "dentistas";
  if (nicho === "advogados") return "advogados";
  if (nicho === "medicos") return "médicos";
  if (nicho === "arquitetos") return "arquitetos";
  if (nicho === "esteticistas" || nicho === "estetica") return "clínicas de estética";
  if (nicho === "corretores") return "corretores de imóveis";
  if (nicho === "oficinas-mecanicas") return "oficinas mecânicas";
  return nicho.split("-").join(" ");
}

export default function GoogleMeuNegocioLocalLanding() {
  const { nicho, estado, cidade } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nicho, estado, cidade]);

  const formattedCidade = formatLocationName(cidade);
  const formattedEstado = formatLocationName(estado).toUpperCase();
  const formattedNicho = formatNiche(nicho);

  let basePath = "/google-meu-negocio";
  let title = `Especialista em Google Meu Negócio para ${formattedNicho} em ${formattedCidade} - ${formattedEstado}`;
  let description = `Otimização e gestão de Perfil da Empresa no Google (Google Meu Negócio) para ${formattedNicho} em ${formattedCidade} (${formattedEstado}). Apareça no Top 3 do Google Maps e receba ligações e mensagens no WhatsApp.`;
  let eyebrow = "Especialista em Google Meu Negócio & SEO Local";
  let h1Text = `Google Meu Negócio para ${formattedNicho} em ${formattedCidade} - ${formattedEstado}`;
  let whatsappMessage = `Olá, Leonardo! Vi seu site e gostaria de um diagnóstico do meu Google Meu Negócio para ${formattedNicho} em ${formattedCidade} - ${formattedEstado}.`;

  if (location.pathname.startsWith("/otimizacao-google-meu-negocio")) {
    basePath = "/otimizacao-google-meu-negocio";
    title = `Otimização de Google Meu Negócio para ${formattedNicho} em ${formattedCidade} - ${formattedEstado} | Top 3 Maps`;
    description = `Serviço especializado de otimização de Google Meu Negócio e Perfil da Empresa para ${formattedNicho} em ${formattedCidade} (${formattedEstado}). Auditoria, SEO local e posicionamento no Top 3 do Google Maps.`;
    eyebrow = "Otimização de Perfil & Top 3 no Google Maps";
    h1Text = `Otimização de Google Meu Negócio para ${formattedNicho} em ${formattedCidade} - ${formattedEstado}`;
    whatsappMessage = `Olá, Leonardo! Vi seu site sobre otimização de Google Meu Negócio para ${formattedNicho} em ${formattedCidade} - ${formattedEstado} e gostaria de uma avaliação do meu perfil no Google Maps.`;
  } else if (location.pathname.startsWith("/consultor-google-meu-negocio")) {
    basePath = "/consultor-google-meu-negocio";
    title = `Consultor Google Meu Negócio para ${formattedNicho} em ${formattedCidade} - ${formattedEstado}`;
    description = `Consultoria individual com Leonardo Brasil em Google Meu Negócio para ${formattedNicho} em ${formattedCidade} (${formattedEstado}). Auditoria, posicionamento no Google Maps e atração de clientes locais.`;
    eyebrow = "Consultor Especialista Google Meu Negócio";
    h1Text = `Consultoria de Google Meu Negócio para ${formattedNicho} em ${formattedCidade} - ${formattedEstado}`;
    whatsappMessage = `Olá, Leonardo! Vi seu site e gostaria de contratar sua consultoria de Google Meu Negócio para ${formattedNicho} em ${formattedCidade} - ${formattedEstado}.`;
  } else if (location.pathname.startsWith("/especialista-google-maps")) {
    basePath = "/especialista-google-maps";
    title = `Especialista em Google Maps para ${formattedNicho} em ${formattedCidade} - ${formattedEstado} | SEO Local`;
    description = `Contrate especialista em Google Maps e presença local para ${formattedNicho} em ${formattedCidade} (${formattedEstado}). Coloque sua empresa no Top 3 do mapa e receba mais ligações e rotas.`;
    eyebrow = "Especialista em Google Maps & SEO Local";
    h1Text = `Especialista em Google Maps para ${formattedNicho} em ${formattedCidade} - ${formattedEstado}`;
    whatsappMessage = `Olá, Leonardo! Gostaria de falar com você como especialista em Google Maps para ${formattedNicho} em ${formattedCidade} - ${formattedEstado}.`;
  }

  const nicheData = nicho && seoNicheData[nicho]
    ? seoNicheData[nicho]
    : getDefaultNicheData(formattedNicho, formattedCidade);

  const canonicalUrl = `https://leonardobrasil.com.br${basePath}/${nicho}/${estado}/${cidade}`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  // Navegação cruzada (cidades próximas no mesmo estado)
  const nearbyCities = locationsData.TARGET_CITIES
    .filter((c) => c.estado === estado && c.cidade !== cidade)
    .slice(0, 4);

  // Outros nichos disponíveis na mesma cidade
  const otherNiches = locationsData.NICHES
    .filter((n) => n.slug !== nicho)
    .slice(0, 4);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": `Leonardo Brasil — ${h1Text}`,
      "description": description,
      "url": canonicalUrl,
      "telephone": "+55-51-99256-8861",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": formattedCidade,
        "addressRegion": formattedEstado,
        "addressCountry": "BR"
      },
      "areaServed": {
        "@type": "City",
        "name": formattedCidade
      },
      "priceRange": "$$"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Como funciona o serviço para ${formattedNicho} em ${formattedCidade}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Leonardo Brasil realiza a revisão completa do Perfil da Empresa no Google, configurando categorias primárias e secundárias estratégicas, descrição comercial com SEO local, catálogo de serviços, fotografias de alta conversão e método ativo de coleta de avaliações 5 estrelas.`
          }
        },
        {
          "@type": "Question",
          "name": `Quanto tempo leva para ver resultados no Google Maps em ${formattedCidade}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Muitos perfis começam a notar aumento significativo nas ligações e solicitações de rota no WhatsApp nas primeiras duas a três semanas após as correções cirúrgicas de SEO Local.`
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-ink text-text font-sans">
      <SeoHead
        title={`${title} | Leonardo Brasil`}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-text hover:text-accent transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
            Leonardo Brasil
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auditoria-perfil-google" className="hidden sm:inline-block text-xs font-semibold text-accent hover:underline">
              Raio-X Gratuito
            </Link>
            <Link to="/recuperar-perfil-suspenso-google" className="hidden sm:inline-block text-xs font-semibold text-red-400 hover:text-red-300 transition-colors">
              Perfil Suspenso?
            </Link>
            <Link to="/cidades" className="hidden sm:inline-block text-xs font-semibold text-muted hover:text-text transition-colors">
              Cidades Atendidas
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-600 transition-all shadow-lg shadow-accent/20"
            >
              Pedir Diagnóstico no WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main>
        <section className="relative overflow-hidden border-b border-line py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/15 via-ink to-ink -z-10" />
          <div className="mx-auto max-w-5xl px-5 text-center">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {eyebrow} · {formattedCidade} - {formattedEstado}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-text max-w-4xl mx-auto">
              {h1Text}
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
              Coloque seu negócio no <strong>Top 3 do Google Maps</strong>. Quando alguém na sua região procura por {formattedNicho}, seu perfil precisa transmitir autoridade imediata, gerar ligações e receber mensagens diretas no WhatsApp.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent text-white font-black text-base px-8 py-4 rounded-full hover:bg-accent-600 transition-all shadow-xl shadow-accent/25 hover:scale-105"
              >
                Solicitar Diagnóstico Gratuito do Meu Perfil
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <Link
                to="/auditoria-perfil-google"
                className="w-full sm:w-auto inline-flex items-center justify-center font-bold text-sm text-accent hover:text-accent-300 px-6 py-4 rounded-full border border-accent/30 hover:border-accent transition-all"
              >
                Fazer Raio-X do Perfil Online →
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 rounded-xl border border-line bg-panel/50 backdrop-blur">
                <p className="text-2xl font-black text-accent">+70%</p>
                <p className="text-xs text-muted mt-1">Dos cliques locais vão para o Top 3 do Maps</p>
              </div>
              <div className="p-4 rounded-xl border border-line bg-panel/50 backdrop-blur">
                <p className="text-2xl font-black text-gold">Sem Anúncios</p>
                <p className="text-xs text-muted mt-1">Tráfego orgânico recorrente e qualificado</p>
              </div>
              <div className="p-4 rounded-xl border border-line bg-panel/50 backdrop-blur">
                <p className="text-2xl font-black text-text">WhatsApp</p>
                <p className="text-xs text-muted mt-1">Contato direto sem intermediários</p>
              </div>
              <div className="p-4 rounded-xl border border-line bg-panel/50 backdrop-blur">
                <p className="text-2xl font-black text-accent-300">5 Estrelas</p>
                <p className="text-xs text-muted mt-1">Método ativo para construir reputação</p>
              </div>
            </div>

          </div>
        </section>

        {/* COMPARATIVO: PERFIL COMUM VS PERFIL BLINDADO */}
        <section className="py-20 border-b border-line bg-panel">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-text">
                Seu concorrente em {formattedCidade} não é melhor. Ele só está mais visível.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted">
                A maioria dos perfis de {formattedNicho} perde dezenas de pacientes e clientes todo mês por causa de erros bobos de configuração.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* PERFIL AMADOR */}
              <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 sm:p-8">
                <div className="inline-block text-xs font-black uppercase text-red-400 bg-red-500/10 px-3 py-1 rounded-full mb-4">
                  O que afasta o cliente
                </div>
                <h3 className="text-xl font-bold text-text mb-4">Perfil Comum / Desatualizado</h3>
                <ul className="space-y-3 text-sm text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Categoria errada ou apenas categoria genérica sem termos de busca</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Poucas fotos, desatualizadas ou fotos de baixa qualidade de clientes antigos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Avaliações negativas sem resposta ou sem avaliações recentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>Telefone fixo que ninguém atende ou ausência de link direto para o WhatsApp</span>
                  </li>
                </ul>
              </div>

              {/* PERFIL OTIMIZADO */}
              <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6 sm:p-8 shadow-xl shadow-accent/5">
                <div className="inline-block text-xs font-black uppercase text-accent-300 bg-accent/20 px-3 py-1 rounded-full mb-4">
                  O padrão de autoridade
                </div>
                <h3 className="text-xl font-bold text-text mb-4">Perfil Otimizado por Leonardo Brasil</h3>
                <ul className="space-y-3 text-sm text-text">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold shrink-0">✓</span>
                    <span>Categoria primária cirúrgica e categorias secundárias completas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold shrink-0">✓</span>
                    <span>Catálogo de serviços e produtos com fotos atraentes e preços/descrições claras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold shrink-0">✓</span>
                    <span>Método ativo de coleta de avaliações 5 estrelas com respostas estratégicas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold shrink-0">✓</span>
                    <span>Botão de WhatsApp com mensagem personalizada para atendimento rápido</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6 PILARES DO SERVIÇO */}
        <section id="como-funciona" className="py-20 border-b border-line">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Metodologia Comprovada</span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-text mt-2">
                O que faço na Otimização do seu Google
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted">
                Um processo prático, sem mensalidade obrigatória, para blindar a presença do seu consultório ou empresa em {formattedCidade}.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  n: "01",
                  title: "Auditoria & Consistência NAP",
                  desc: "Padronização de Nome, Endereço e Telefone em toda a internet para que o Google confie 100% na sua localização."
                },
                {
                  n: "02",
                  title: "Categorias Estratégicas",
                  desc: "Definição da categoria exata mais buscada por quem precisa de serviços de saúde ou consultoria na sua região."
                },
                {
                  n: "03",
                  title: "SEO na Descrição Comercial",
                  desc: "Texto comercial persuasivo contendo as palavras-chave geolocalizadas que o robô do Google e as pessoas usam."
                },
                {
                  n: "04",
                  title: "Estruturação de Serviços",
                  desc: "Organização clara de cada especialidade atendida com descrições objetivas e botão de agendamento."
                },
                {
                  n: "05",
                  title: "Kit de Avaliações 5 Estrelas",
                  desc: "Orientação e link curto com script pronto para seus clientes satisfeitos deixarem avaliações positivas toda semana."
                },
                {
                  n: "06",
                  title: "Direcionamento no WhatsApp",
                  desc: "Conexão direta com seu canal de vendas no WhatsApp para não perder nenhum contato gerado pelo Maps."
                }
              ].map((item) => (
                <div key={item.n} className="p-6 rounded-2xl border border-line bg-panel hover:border-line-strong transition-all">
                  <span className="text-xs font-black text-accent">{item.n}</span>
                  <h3 className="text-lg font-bold text-text mt-3 mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GEO DIRECT ANSWER BLOCK */}
        <section className="py-16 bg-panel-2 border-b border-line">
          <div className="mx-auto max-w-4xl px-5">
            <h2 className="text-xl sm:text-2xl font-bold text-text mb-4">
              Como funciona o trabalho de consultoria para {formattedNicho} em {formattedCidade}?
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              O trabalho conduzido por <strong>Leonardo Brasil</strong> organiza e potencializa o Perfil da Empresa no Google (antigo Google Meu Negócio) para {formattedNicho} em {formattedCidade} ({formattedEstado}). A consultoria inclui diagnóstico dos concorrentes locais que estão no Top 3 do Maps, correção de atributos e horários, inserção de fotos geolocalizadas e alinhamento com a estrutura de atendimento no WhatsApp, garantindo previsibilidade de novos contatos para o seu negócio.
            </p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-b from-ink to-panel border-b border-line text-center">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="text-3xl sm:text-4xl font-black text-text tracking-tight">
              Vamos colocar seu negócio no Top 3 do Google Maps?
            </h2>
            <p className="mt-4 text-base text-muted">
              Envie uma mensagem agora e receba uma análise preliminar gratuita do seu perfil em {formattedCidade}.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent text-white font-black text-lg px-8 py-4 rounded-full hover:bg-accent-600 transition-all shadow-xl shadow-accent/25 hover:scale-105"
              >
                Falar com Leonardo Brasil no WhatsApp
              </a>
              <Link
                to="/auditoria-perfil-google"
                className="w-full sm:w-auto inline-flex items-center justify-center font-bold text-sm text-muted hover:text-text px-6 py-4 rounded-full border border-line hover:border-line-strong transition-all"
              >
                Fazer Raio-X Online
              </Link>
            </div>
          </div>
        </section>

        {/* NAVEGAÇÃO CRUZADA (HUB & SPOKE) */}
        <section className="py-16 bg-ink">
          <div className="mx-auto max-w-5xl px-5">
            {/* CALLOUT SUSPENSÃO */}
            <div className="mb-12 rounded-2xl border border-red-500/30 bg-red-950/15 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Teve a Ficha Suspensa pelo Google?</p>
                <p className="text-sm text-text font-semibold">Perfil desativado ou sob restrição de diretrizes em {formattedCidade}?</p>
              </div>
              <Link
                to="/recuperar-perfil-suspenso-google"
                className="shrink-0 text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 px-4 py-2 rounded-full hover:bg-red-500/30 transition-all"
              >
                Como recuperar ficha suspensa →
              </Link>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-8">Navegação Local & Especialidades</h3>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div>
                <h4 className="font-bold text-text mb-3">Google Meu Negócio em Cidades Próximas ({formattedEstado})</h4>
                <ul className="space-y-2">
                  {nearbyCities.map((c) => (
                    <li key={c.cidade}>
                      <Link
                        to={`${basePath}/${nicho}/${c.estado}/${c.cidade}`}
                        className="text-muted hover:text-accent transition-colors flex items-center justify-between py-1 border-b border-line"
                      >
                        <span>{formattedNicho} em {c.nome}</span>
                        <span className="text-xs text-accent">→</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to={`${basePath}/${nicho}`} className="text-accent font-semibold inline-block mt-3 hover:underline">
                      Ver todas as cidades para {formattedNicho} →
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-text mb-3">Outras Especialidades em {formattedCidade}</h4>
                <ul className="space-y-2">
                  {otherNiches.map((n) => (
                    <li key={n.slug}>
                      <Link
                        to={`${basePath}/${n.slug}/${estado}/${cidade}`}
                        className="text-muted hover:text-accent transition-colors flex items-center justify-between py-1 border-b border-line"
                      >
                        <span>{n.nome} em {formattedCidade}</span>
                        <span className="text-xs text-accent">→</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/cidades" className="text-accent font-semibold inline-block mt-3 hover:underline">
                      Ver Diretório Nacional Completo →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
