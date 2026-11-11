import { Link, useLocation } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-ink text-text flex flex-col font-sans">
      <SeoHead
        title="404 — Página não encontrada | Leonardo Brasil"
        description="O endereço acessado não foi encontrado em leonardobrasil.com.br."
        robots="noindex, nofollow"
      />
      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="max-w-xl w-full rounded-3xl border border-line bg-panel p-8 sm:p-10 text-center space-y-5">
          <p className="text-xs font-extrabold uppercase tracking-widest text-accent-300">Erro HTTP 404</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Página não encontrada</h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            O caminho <code className="text-text">{pathname}</code> não existe neste site. Acesse um dos atalhos abaixo para continuar:
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/" className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 transition-colors">
              Ir para o Início
            </Link>
            <Link to="/auditoria-perfil-google" className="rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-bold text-accent-300 hover:bg-accent/20 transition-colors">
              Raio-X do Perfil
            </Link>
            <Link to="/docs" className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-bold text-text hover:border-accent transition-colors">
              API &amp; Docs
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
