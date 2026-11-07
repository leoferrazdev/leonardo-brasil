import React, { useEffect, useState } from "react";
import { Link, useParams } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import locationsData from "../data/seoLocations.json";

export default function GoogleMeuNegocioNicheHub() {
  const { nicho } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("TODOS");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nicho]);

  const nicheInfo = locationsData.NICHES.find((n) => n.slug === nicho) || {
    nome: nicho || "Negócios Locais",
    slug: nicho || "geral"
  };

  const title = `Google Meu Negócio para ${nicheInfo.nome} no Brasil`;
  const description = `Encontre a consultoria de otimização de Google Meu Negócio e presença no Google Maps para ${nicheInfo.nome} na sua cidade e estado.`;
  const canonicalUrl = `https://leonardobrasil.com.br/google-meu-negocio/${nicho}`;

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
        title={`${title} | Leonardo Brasil`}
        description={description}
        canonicalUrl={canonicalUrl}
      />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-text hover:text-accent transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
            Leonardo Brasil
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/google-meu-negocio" className="text-xs font-semibold text-muted hover:text-text transition-colors">
              Google Meu Negócio
            </Link>
            <Link to="/cidades" className="text-xs font-semibold text-muted hover:text-text transition-colors">
              Todas as Cidades
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent-300 mb-4">
              Cobertura Nacional · 5.570 Municípios
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-text tracking-tight">
              Google Meu Negócio para{" "}
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
                      to={`/google-meu-negocio/${nicho}/${city.estado}/${city.cidade}`}
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
