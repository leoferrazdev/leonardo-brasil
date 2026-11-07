import { Helmet } from "react-helmet-async";
import { useLocation } from "../lib/local-router";

interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  schema?: Record<string, any> | Record<string, any>[];
  includeBrandGraph?: boolean;
  robots?: string;
}

export function SeoHead({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = "website",
  schema,
  includeBrandGraph = true,
  robots,
}: SeoHeadProps) {
  const location = useLocation();
  const currentPath = location.pathname === "/" ? "" : location.pathname;
  
  const defaultTitle = "Leonardo Brasil — Especialista em Google Meu Negócio e SEO Local";
  const defaultDescription =
    "Especialista em Google Meu Negócio e SEO Local. Otimização de perfil no Google Maps, posicionamento orgânico e atração de clientes locais. Diagnóstico gratuito.";
  const autoCanonical = `https://leonardobrasil.com.br${currentPath}`;
  const defaultOgImage = "https://leonardobrasil.com.br/logo-completo.png";

  const finalTitle = title
    ? title.includes("Leonardo Brasil")
      ? title
      : `${title} | Leonardo Brasil`
    : defaultTitle;
  const finalDesc = description || defaultDescription;
  const finalUrl = canonicalUrl || autoCanonical;
  const finalOgImage = ogImage || defaultOgImage;

  // Grafo de Entidade Oficial da Marca (Knowledge Graph for Google & AI Engines)
  const brandGraphSchema = includeBrandGraph
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://leonardobrasil.com.br/#organization",
            name: "Leonardo Brasil",
            legalName: "LEONARDO FERRAZ DA SILVA BRASIL",
            url: "https://leonardobrasil.com.br",
            logo: "https://leonardobrasil.com.br/logo-completo.png",
            image: "https://leonardobrasil.com.br/logo-completo.png",
            email: "contato@leonardobrasil.com.br",
            taxID: "65.993.728/0001-07",
            description:
              "Especialista em Google Meu Negócio e SEO Local: posicionamento no topo do Google Maps, atração de clientes locais e otimização de perfil comercial.",
            sameAs: [
              "https://www.instagram.com/leonardobrasil.com.br/",
              "https://www.facebook.com/leonardobrasil.com.br",
              "https://funilcomercial.com",
            ],
            knowsAbout: [
              "Google Meu Negócio",
              "SEO Local",
              "Google Maps",
              "Otimização de Perfil da Empresa no Google",
              "Posicionamento no Topo das Buscas Locais",
              "Captação de Clientes Locais",
              "Generative Engine Optimization (GEO)",
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Serviços de Google Meu Negócio e SEO Local",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Otimização e Gestão de Google Meu Negócio",
                    description: "Colocamos sua empresa nas 3 primeiras posições do Google Maps para atrair clientes prontos para comprar.",
                    url: "https://leonardobrasil.com.br/google-meu-negocio",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Diagnóstico Gratuito de Google Meu Negócio",
                    description: "Análise completa do seu perfil da empresa no Google e mapa de oportunidades para dominar as buscas locais.",
                    url: "https://leonardobrasil.com.br",
                  },
                },
              ],
            },
          },
          {
            "@type": "Person",
            "@id": "https://leonardobrasil.com.br/#person",
            name: "Leonardo Brasil",
            jobTitle: "Especialista em Google Meu Negócio e SEO Local",
            worksFor: { "@id": "https://leonardobrasil.com.br/#organization" },
            image: "https://leonardobrasil.com.br/avatar-leonardo-brasil.jpg",
            sameAs: [
              "https://www.instagram.com/leonardobrasil.com.br/",
            ],
            knowsAbout: [
              "Google Meu Negócio",
              "Google Maps",
              "SEO Local",
              "SEO Programático Local",
              "Otimização de Conversão no Google",
            ],
          },
          {
            "@type": "ProfessionalService",
            "@id": "https://leonardobrasil.com.br/#service",
            name: "Leonardo Brasil — Especialista em Google Meu Negócio e SEO Local",
            url: "https://leonardobrasil.com.br",
            priceRange: "$$$",
            areaServed: "BR",
            knowsLanguage: "pt-BR",
            publisher: { "@id": "https://leonardobrasil.com.br/#organization" },
          },
          {
            "@type": "WebSite",
            "@id": "https://leonardobrasil.com.br/#website",
            url: "https://leonardobrasil.com.br",
            name: "Leonardo Brasil",
            publisher: { "@id": "https://leonardobrasil.com.br/#organization" },
          },
        ],
      }
    : null;

  const pageSchemas = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [];

  const schemasToRender = brandGraphSchema
    ? [brandGraphSchema, ...pageSchemas]
    : pageSchemas;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {robots && <meta name="robots" content={robots} />}
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Leonardo Brasil" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={finalOgImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Schema.org Structured Data */}
      {schemasToRender.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
