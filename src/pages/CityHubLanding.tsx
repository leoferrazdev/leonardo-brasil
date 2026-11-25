import { useEffect } from "react";
import { Link, useParams } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import locationsData from "../data/seoLocations.json";

const WHATSAPP_NUMBER = "5551996737359";

interface CityMeta {
  name: string;
  state: string;
  uf: string;
  regiao: string;
  descriptionSnippet: string;
}

const CITIES_METADATA: Record<string, CityMeta> = {
  "curitiba": {
    name: "Curitiba",
    state: "Paraná",
    uf: "PR",
    regiao: "na capital paranaense e região metropolitana",
    descriptionSnippet: "em Curitiba e região metropolitana do Paraná",
  },
  "joinville": {
    name: "Joinville",
    state: "Santa Catarina",
    uf: "SC",
    regiao: "no maior polo econômico e industrial de Santa Catarina",
    descriptionSnippet: "no maior polo econômico de Santa Catarina",
  },
  "belo-horizonte": {
    name: "Belo Horizonte",
    state: "Minas Gerais",
    uf: "MG",
    regiao: "na capital mineira e polo comercial de Minas Gerais",
    descriptionSnippet: "em Belo Horizonte (BH) e região metropolitana de Minas Gerais",
  },
  "brasilia": {
    name: "Brasília",
    state: "Distrito Federal",
    uf: "DF",
    regiao: "no Distrito Federal e cidades-satélites",
    descriptionSnippet: "em Brasília e em todo o Distrito Federal",
  },
  "uberlandia": {
    name: "Uberlândia",
    state: "Minas Gerais",
    uf: "MG",
    regiao: "no Triângulo Mineiro",
    descriptionSnippet: "em Uberlândia e no Triângulo Mineiro",
  },
  "juiz-de-fora": {
    name: "Juiz de Fora",
    state: "Minas Gerais",
    uf: "MG",
    regiao: "na Zona da Mata mineira",
    descriptionSnippet: "em Juiz de Fora e Zona da Mata de Minas Gerais",
  },
  "guarapuava": {
    name: "Guarapuava",
    state: "Paraná",
    uf: "PR",
    regiao: "no centro-sul paranaense",
    descriptionSnippet: "em Guarapuava e região centro-sul do Paraná",
  },
  "porto-alegre": {
    name: "Porto Alegre",
    state: "Rio Grande do Sul",
    uf: "RS",
    regiao: "na capital gaúcha e região metropolitana",
    descriptionSnippet: "em Porto Alegre e região metropolitana do Rio Grande do Sul",
  },
  "sao-paulo": {
    name: "São Paulo",
    state: "São Paulo",
    uf: "SP",
    regiao: "na capital paulista e maior mercado do Brasil",
    descriptionSnippet: "em São Paulo capital e Grande SP",
  },
};

export default function CityHubLanding() {
  const { cidade } = useParams();
  const slug = cidade?.toLowerCase() || "curitiba";
  const cityInfo = CITIES_METADATA[slug] || {
    name: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    state: "Brasil",
    uf: "BR",
    regiao: "na sua região",
    descriptionSnippet: `em ${slug}`,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cidade]);

  const waMsg = `Olá, Leonardo! Gostaria de um diagnóstico de Google Meu Negócio e Google Ads para minha empresa em ${cityInfo.name} - ${cityInfo.uf}.`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

  const pageTitle = `Google Meu Negócio e Google Ads em ${cityInfo.name} - ${cityInfo.uf} | Leonardo Brasil`;
  const pageDesc = `Especialista em Google Meu Negócio e Google Ads ${cityInfo.descriptionSnippet}. Posicionamento no Top 3 do Google Maps e anúncios de alta conversão no WhatsApp.`;
  const canonicalUrl = `https://leobrasil.com.br/cidades/${slug}`;

  const niches = locationsData.NICHES.slice(0, 12);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Como colocar minha empresa no Top 3 do Google Maps em ${cityInfo.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A liderança no Google Maps em ${cityInfo.name} exige alinhamento de 6 pilares: consistência cadastral de Nome, Endereço e Telefone (NAP), categorias primárias e secundárias estratégicas, descrição geolocalizada, catálogo de produtos/serviços e fluxo constante de avaliações 5 estrelas de clientes reais atendidos.`,
        },
      },
      {
        "@type": "Question",
        name: `Vale a pena investir em Google Ads para negócios locais em ${cityInfo.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sim. O mercado de ${cityInfo.name} possui alta demanda de buscas comerciais no Google. Com campanhas de pesquisa focadas em palavras-chave fundo de funil e termos negativos diários, o Google Ads atrai contatos qualificados no WhatsApp com custo por lead muito inferior a canais tradicionais.`,
        },
      },
      {
        "@type": "Question",
        name: `Como funciona a consultoria de Leonardo Brasil para empresas de ${cityInfo.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Através de auditoria independente, reestruturação técnica do perfil da empresa no Google, implementação de campanhas de alta intenção e treinamento da equipe para converter visitantes do mapa em contratos no WhatsApp.`,
        },
      },
    ],
  };

  const localServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `Leonardo Brasil — Google Meu Negócio e Google Ads em ${cityInfo.name}`,
    description: pageDesc,
    url: canonicalUrl,
    telephone: `+${WHATSAPP_NUMBER}`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: cityInfo.name,
      addressRegion: cityInfo.uf,
      addressCountry: "BR",
    },
    areaServed: {
      "@type": "City",
      name: cityInfo.name,
    },
  };

  return (
    <div className="min-h-screen bg-white text-text font-sans selection:bg-accent selection:text-white">
      <SeoHead
        title={pageTitle}
        description={pageDesc}
        keywords={`google meu negócio ${cityInfo.name.toLowerCase()}, consultor google ads ${cityInfo.name.toLowerCase()}, especialista google maps ${cityInfo.name.toLowerCase()}, seo local ${cityInfo.name.toLowerCase()}, gestão de google ads ${cityInfo.name.toLowerCase()}, agência google ads ${cityInfo.name.toLowerCase()}`}
        canonicalUrl={canonicalUrl}
        schema={[faqSchema, localServiceSchema]}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight hover:text-accent transition-colors">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent/15 border border-accent/30">
              <svg viewBox="0 0 48 48" className="w-[18px] h-[18px]" fill="none">
                <rect x="6" y="9" width="36" height="9" rx="4" fill="#3b82f6" opacity="0.4" />
                <rect x="13" y="21" width="22" height="9" rx="4" fill="#3b82f6" opacity="0.7" />
                <rect x="20" y="33" width="8" height="9" rx="4" fill="#60a5fa" />
              </svg>
            </span>
            Leonardo Brasil
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/cidades" className="text-xs font-semibold text-muted hover:text-text transition-colors">
              Todas as Cidades
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-600 transition-all shadow-sm"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative py-16 sm:py-24 border-b border-line bg-gradient-to-b from-blue-50/50 via-white to-white">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent-400 mb-6 uppercase tracking-wider">
              <span>{cityInfo.name} - {cityInfo.uf}</span>
              <span>•</span>
              <span>SEO Local & Tráfego Pago</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-text leading-[1.1] mb-6">
              Especialista em Google Meu Negócio e Google Ads em{" "}
              <span className="text-accent">{cityInfo.name}</span>
            </h1>

            <p className="text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-8">
              Coloque sua clínica, escritório ou empresa no <strong>Top 3 do Google Maps</strong> e anuncie na primeira página da busca com anúncios de alta conversão direcionados para o seu WhatsApp {cityInfo.regiao}.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-4 text-sm font-bold text-white shadow-lg shadow-accent/25 hover:bg-accent-600 transition-all"
              >
                Solicitar Avaliação em {cityInfo.name}
              </a>
              <Link
                to="/auditoria-perfil-google"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-7 py-4 text-sm font-bold text-text hover:border-accent transition-all"
              >
                Fazer Raio-X Gratuito do Perfil
              </Link>
            </div>
          </div>
        </section>

        {/* 3 PILARES COMERCIAIS */}
        <section className="py-16 md:py-20 border-b border-line">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">
                Soluções Completas
              </span>
              <h2 className="text-3xl font-black text-text">
                Como Escalamos o Faturamento de Empresas em {cityInfo.name}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-line p-8 bg-panel hover:border-accent/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-lg mb-6">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">
                    Top 3 no Google Maps ({cityInfo.name})
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Auditoria cirúrgica do Perfil da Empresa no Google, correção de inconsistências cadastrais, escolha precisa da categoria primária e estratégia de avaliações para dominar o mapa de {cityInfo.name}.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-line">
                  <Link to="/google-meu-negocio" className="text-xs font-bold text-accent hover:underline">
                    Ver Otimização de Perfil →
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-line p-8 bg-panel hover:border-accent/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-lg mb-6">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">
                    Gestão de Google Ads Local
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Campanhas na Rede de Pesquisa e Extensão de Local no Maps. Foco em palavras-chave fundo de funil (com urgência e intenção de contratação em {cityInfo.name}) e blindagem diária contra cliques de curiosos.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-line">
                  <Link to="/google-ads" className="text-xs font-bold text-accent hover:underline">
                    Ver Gestão de Google Ads →
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-line p-8 bg-panel hover:border-accent/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-lg mb-6">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">
                    Auditoria & Recuperação de Perfil
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Teve seu perfil suspenso pelo Google em {cityInfo.name} ou percebeu queda repentina nas ligações? Diagnosticamos penalizações e conduzimos o recurso técnico formal perante o suporte do Google.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-line">
                  <Link to="/recuperar-perfil-suspenso-google" className="text-xs font-bold text-accent hover:underline">
                    Ver Recuperação de Perfil →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NICHOS ATENDIDOS NA CIDADE */}
        <section className="py-16 md:py-20 border-b border-line bg-panel-2">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">
                Especialidades Setoriais
              </span>
              <h2 className="text-3xl font-black text-text">
                Nichos Estruturados em {cityInfo.name}
              </h2>
              <p className="text-sm text-muted mt-2">
                Arquitetura de busca local e campanhas validadas para os maiores mercados locais:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {niches.map((niche) => (
                <Link
                  key={niche.slug}
                  to={`/google-meu-negocio/${niche.slug}/${cityInfo.uf.toLowerCase()}/${slug}`}
                  className="rounded-xl border border-line bg-white p-4 hover:border-accent hover:shadow-sm transition-all flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-sm font-semibold text-text">
                    {niche.nome} em {cityInfo.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ DA CIDADE */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-5">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-text">
                Perguntas Frequentes sobre Google em {cityInfo.name}
              </h2>
            </div>

            <div className="space-y-4">
              {faqSchema.mainEntity.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-line p-6 bg-panel">
                  <h3 className="text-base font-bold text-text mb-2">{item.name}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
