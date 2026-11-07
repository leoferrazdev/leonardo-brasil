import { useState, useEffect } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import locationsData from "../data/seoLocations.json";
import { LOCATIONS, LocationData } from "../data/locations";

export default function CitiesDirectory() {
  const [selectedState, setSelectedState] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const niches = locationsData.NICHES;
  const states = ["TODOS", ...Array.from(new Set(LOCATIONS.map((l) => l.state)))];

  const filteredLocations = LOCATIONS.filter((loc) => {
    const matchesState = selectedState === "TODOS" || loc.state === selectedState;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesSearch;
  });

  const locationsByState = filteredLocations.reduce((acc, loc) => {
    if (!acc[loc.state]) acc[loc.state] = [];
    acc[loc.state].push(loc);
    return acc;
  }, {} as Record<string, LocationData[]>);

  const stateNames: Record<string, string> = {
    SP: "São Paulo",
    RJ: "Rio de Janeiro",
    SC: "Santa Catarina",
    PR: "Paraná",
    MG: "Minas Gerais",
  };

  return (
    <div className="min-h-screen bg-ink text-text font-sans selection:bg-accent selection:text-white">
      <SeoHead
        title="Regiões & Cidades Atendidas — Google Meu Negócio | Leonardo Brasil"
        description="Diretório completo de otimização de Google Meu Negócio e presença no Google Maps para negócios locais nas principais capitais e cidades do Brasil."
        canonicalUrl="https://leonardobrasil.com.br/cidades"
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
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
          <nav className="flex gap-6 items-center">
            <Link to="/google-meu-negocio" className="text-sm font-bold text-accent hover:text-accent-300 transition-colors">
              Google Meu Negócio
            </Link>
            <Link to="/" className="text-sm font-medium text-muted hover:text-text transition-colors">
              Voltar ao Início
            </Link>
          </nav>
        </div>
      </header>

      <main className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          {/* HERO E BUSCA */}
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent-400 uppercase tracking-wide mb-4">
              Presença Local & Google Maps
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Google Meu Negócio <span className="text-accent-400">na sua Cidade</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed">
              Explore o posicionamento no Top 3 do Google Maps desenhado sob medida para empresas e profissionais liberais nas principais cidades do Brasil.
            </p>

            {/* Filtros */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="text"
                placeholder="Buscar cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 rounded-xl border border-line bg-panel px-4 py-2.5 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <div className="flex flex-wrap justify-center gap-1.5">
                {states.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedState === st
                        ? "bg-accent text-white shadow-sm"
                        : "bg-panel border border-line text-muted hover:text-text"
                    }`}
                  >
                    {st === "TODOS" ? "Todos os Estados" : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GRID DE CIDADES */}
          <div className="space-y-16">
            {Object.keys(locationsByState).length === 0 ? (
              <div className="text-center py-12 text-muted">
                Nenhuma cidade encontrada para os filtros selecionados.
              </div>
            ) : (
              Object.entries(locationsByState).map(([uf, cities]) => (
                <section key={uf} className="scroll-mt-20">
                  <div className="flex items-center gap-3 border-b border-line pb-4 mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-text">
                      {stateNames[uf] || uf}
                    </h2>
                    <span className="rounded-full bg-panel border border-line px-2.5 py-0.5 text-xs font-semibold text-muted">
                      {cities.length} {cities.length === 1 ? "cidade" : "cidades"}
                    </span>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {cities.map((city) => (
                      <div key={city.slug} className="rounded-2xl border border-line bg-panel p-6 flex flex-col justify-between hover:border-accent/40 transition-colors">
                        <div>
                          <h3 className="text-lg font-bold text-text flex items-center justify-between mb-4">
                            {city.name}
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-ink border border-line text-accent-400">
                              {city.state}
                            </span>
                          </h3>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                            Google Maps por Especialidade:
                          </p>
                          <div className="flex flex-col gap-1.5">
                            {niches.slice(0, 8).map((niche) => (
                              <Link
                                key={niche.slug}
                                to={`/google-meu-negocio/${niche.slug}/${city.state.toLowerCase()}/${city.slug}`}
                                className="text-sm text-muted hover:text-accent-400 hover:translate-x-1 transition-all flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-400/60" />
                                {niche.nome} em {city.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
