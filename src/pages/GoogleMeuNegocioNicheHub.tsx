import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import locationsData from "../data/seoLocations.json";

export default function GoogleMeuNegocioNicheHub() {
  const { nicho } = useParams();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("TODOS");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nicho]);

  const nicheInfo = locationsData.NICHES.find((n) => n.slug === nicho) || {
    nome: nicho || "Negócios Locais",
    slug: nicho || "geral"
  };

  let basePath = "/google-meu-negocio";
  let verticalBadge = "Especialista em Google Meu Negócio";
  let verticalPrefix = "Google Meu Negócio para ";
  let verticalTitle = `Google Meu Negócio para ${nicheInfo.nome} no Brasil`;
  let verticalDesc = `Encontre a consultoria de otimização de Google Meu Negócio e presença no Google Maps para ${nicheInfo.nome} na sua cidade e estado.`;

  if (location.pathname.startsWith("/otimizacao-google-meu-negocio")) {
    basePath = "/otimizacao-google-meu-negocio";
    verticalBadge = "Otimização & Gestão de Google Maps";
    verticalPrefix = "Otimização de Google Meu Negócio para ";
    verticalTitle = `Otimização de Google Meu Negócio para ${nicheInfo.nome} no Brasil`;
    verticalDesc = `Encontre serviços especializados de otimização de Perfil da Empresa no Google Maps para ${nicheInfo.nome} na sua cidade e estado. Suba para o Top 3 das buscas locais.`;
  } else if (location.pathname.startsWith("/consultor-google-meu-negocio")) {
    basePath = "/consultor-google-meu-negocio";
    verticalBadge = "Consultor Especialista Google Meu Negócio";
    verticalPrefix = "Consultoria de Google Meu Negócio para ";
    verticalTitle = `Consultor Google Meu Negócio para ${nicheInfo.nome} no Brasil`;
    verticalDesc = `Contrate consultoria especializada em Google Meu Negócio e presença local para ${nicheInfo.nome} na sua cidade e estado com Leonardo Brasil.`;
  } else if (location.pathname.startsWith("/especialista-google-maps")) {
    basePath = "/especialista-google-maps";
    verticalBadge = "Especialista em Google Maps & SEO Local";
    verticalPrefix = "Especialista em Google Maps para ";
    verticalTitle = `Especialista em Google Maps para ${nicheInfo.nome} no Brasil`;
    verticalDesc = `Encontre especialista dedicado em Google Maps para colocar ${nicheInfo.nome} no Top 3 da sua cidade e estado.`;
  }

  const canonicalUrl = `https://leonardobrasil.com.br${basePath}/${nicho}`;

  const allCities = locationsData.TARGET_CITIES;
  const statesList = ["TODOS", ...Array.from(new Set(allCities.map((c) => c.estado.toUpperCase()))).sort()];

  const filteredCities = allCities.filter((c) => {
    const matchesState = selectedState === "TODOS" || c.estado.toUpperCase() === selectedState;
    const matchesSearch =
      searchTerm.trim() === "" ||
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.estado.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesSearch;
  });

  // Agrupa cidades por estado
  const citiesByState = filteredCities.reduce((acc, c) => {
    const uf = c.estado.toUpperCase();
    if (!acc[uf]) acc[uf] = [];
    acc[uf].push(c);
    return acc;
  }, {} as Record<string, typeof allCities>);

  const sortedUFs = Object.keys(citiesByState).sort();

  return (
    <div className="min-h-screen bg-ink text-text font-sans">
      <SeoHead
        title={`${verticalTitle} | Leonardo Brasil`}
        description={verticalDesc}
        canonicalUrl={canonicalUrl}
      />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-text hover:text-accent transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
            Leonardo Brasil
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auditoria-perfil-google" className="text-xs font-semibold text-accent hover:underline">
              Raio-X Gratuito
            </Link>
            <Link to="/recuperar-perfil-suspenso-google" className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors">
              Perfil Suspenso?
            </Link>
            <Link to="/cidades" className="text-xs font-semibold text-muted hover:text-text transition-colors">
              Cidades Atendidas
            </Link>
            <Link to="/" className="text-xs font-semibold text-muted hover:text-text transition-colors">
              Início
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          {/* HEADER DO NICHO */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
              {verticalBadge}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-text mt-4">
              {verticalPrefix}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-gold">
                {nicheInfo.nome}
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-muted">
              Selecione seu estado e cidade abaixo para ver como Leonardo Brasil estrutura o Perfil da Empresa no Google Maps para atrair clientes particulares na sua região.
            </p>
          </div>

          {/* BUSCA E FILTROS */}
          <div className="mb-12 flex flex-col sm:flex-row gap-4 items-center justify-between bg-panel p-4 rounded-2xl border border-line">
            <input
              type="text"
              placeholder="Digite o nome da sua cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-xs bg-ink border border-line rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-accent"
            />
            <div className="flex flex-wrap gap-1.5 items-center justify-center">
              {statesList.slice(0, 10).map((uf) => (
                <button
                  key={uf}
                  onClick={() => setSelectedState(uf)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedState === uf
                      ? "bg-accent text-white"
                      : "bg-ink border border-line text-muted hover:text-text"
                  }`}
                >
                  {uf}
                </button>
              ))}
            </div>
          </div>

          {/* LISTAGEM POR ESTADO */}
          <div className="space-y-10">
            {sortedUFs.map((uf) => (
              <section key={uf} className="border border-line rounded-2xl p-6 bg-panel/30">
                <h2 className="text-xl font-bold text-accent mb-4 border-b border-line pb-2 flex items-center gap-2">
                  <span>Estado: {uf}</span>
                  <span className="text-xs font-normal text-muted">({citiesByState[uf].length} cidades)</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {citiesByState[uf].slice(0, 40).map((city) => (
                    <Link
                      key={city.cidade}
                      to={`${basePath}/${nicho}/${city.estado}/${city.cidade}`}
                      className="p-2.5 rounded-lg border border-line/40 bg-ink/60 hover:border-accent hover:bg-panel transition-all text-xs font-medium text-muted hover:text-text truncate"
                      title={`${nicheInfo.nome} em ${city.nome} - ${uf}`}
                    >
                      {city.nome}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
