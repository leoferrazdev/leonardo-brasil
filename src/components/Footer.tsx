import { Link } from "../lib/local-router";
import { NICHES } from "../data/niches";
import { LOCATIONS } from "../data/locations";

const TOP_LOCATIONS = LOCATIONS.filter(l => 
  ["sao-paulo", "rio-de-janeiro", "belo-horizonte", "curitiba", "balneario-camboriu", "florianopolis"].includes(l.slug)
);

export function Footer() {
  return (
    <footer className="border-t border-line mt-12 bg-[#080d18]">
      <div className="mx-auto max-w-6xl px-5 py-12 text-sm text-muted">
        
        {/* SEO Linking Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 pb-10 border-b border-line">
          <div>
            <h4 className="font-semibold text-text mb-4">Google Meu Negócio</h4>
            <ul className="grid grid-cols-1 gap-2">
              {NICHES.slice(0, 6).map(niche => (
                <li key={niche.slug}>
                  <Link to={`/google-meu-negocio/${niche.slug}`} className="hover:text-accent transition-colors">
                    Google Maps para {niche.badge}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/google-meu-negocio" className="text-accent font-semibold inline-block mt-2 hover:underline">
                  Ver Todos os Nichos no Google →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">Estrutura de Vendas</h4>
            <ul className="grid grid-cols-1 gap-2">
              {NICHES.slice(0, 6).map(niche => (
                <li key={niche.slug}>
                  <Link to={`/estrutura-de-vendas-para-${niche.slug}`} className="hover:text-primary transition-colors">
                    {niche.badge}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">Principais Cidades</h4>
            <ul className="grid grid-cols-1 gap-2">
              {TOP_LOCATIONS.map(city => (
                <li key={city.slug}>
                  <Link to={`/google-meu-negocio/dentistas/${city.state.toLowerCase()}/${city.slug}`} className="hover:text-accent transition-colors">
                    Dentistas em {city.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/cidades" className="hover:text-accent transition-colors mt-2 block font-medium underline underline-offset-4">
                  Todas as Cidades Atendidas →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-text">Leonardo Brasil</p>
            <p className="text-xs text-muted">Consultor em Google Meu Negócio & Estrutura de Vendas Local</p>
          </div>

          {/* Redes Sociais */}
          <div className="flex items-center gap-4 py-2 sm:py-0">
            <a
              href="https://www.instagram.com/leonardobrasil.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram do Leonardo Brasil"
              className="p-2 text-muted hover:text-accent hover:scale-110 transition-all duration-200 rounded-lg hover:bg-white/5"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            <a
              href="https://www.facebook.com/leonardobrasil.com.br"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook do Leonardo Brasil"
              className="p-2 text-muted hover:text-accent hover:scale-110 transition-all duration-200 rounded-lg hover:bg-white/5"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            <a
              href="https://www.threads.com/@leonardobrasil.com.br"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads do Leonardo Brasil"
              className="p-2 text-muted hover:text-accent hover:scale-110 transition-all duration-200 rounded-lg hover:bg-white/5"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/>
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a href="mailto:contato@leonardobrasil.com.br" className="hover:text-text transition-colors">contato@leonardobrasil.com.br</a>
            <span className="text-line-strong">·</span>
            <a href="https://funilcomercial.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Funil Comercial ↗</a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-line text-center text-xs leading-relaxed text-muted/80">
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mb-3">
            <Link to="/google-meu-negocio" className="hover:text-accent text-accent transition-colors font-medium">Google Meu Negócio</Link>
            <span className="text-line-strong">·</span>
            <Link to="/termos" className="hover:text-text transition-colors">Termos</Link>
            <span className="text-line-strong">·</span>
            <Link to="/privacidade" className="hover:text-text transition-colors">Privacidade</Link>
            <span className="text-line-strong">·</span>
            <Link to="/exclusao-de-dados" className="hover:text-text transition-colors">Exclusão de Dados</Link>
            <span className="text-line-strong">·</span>
            <Link to="/brandbook" className="hover:text-text transition-colors">Brandbook</Link>
            <span className="text-line-strong">·</span>
            <Link to="/cidades" className="hover:text-text transition-colors">Cidades Atendidas</Link>
            <span className="text-line-strong">·</span>
            <Link to="/calculadora" className="hover:text-text transition-colors">Calculadora Comercial</Link>
          </div>
          <p>LEONARDO FERRAZ DA SILVA BRASIL · CNPJ 65.993.728/0001-07</p>
          <p className="mt-1">© {new Date().getFullYear()} · Otimização Google Meu Negócio & Estrutura de Vendas · leonardobrasil.com.br</p>
        </div>
      </div>
    </footer>
  );
}
