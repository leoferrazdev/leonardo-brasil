import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import { BLOG_POSTS } from "../data/blogData";

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-ink text-text font-sans">
      <SeoHead 
        title="Blog de Google Meu Negócio e SEO Local | Leonardo Brasil"
        description="Aprenda como dominar o Google Maps e atrair clientes locais todos os dias. Artigos sobre Google Meu Negócio, SEO Local e conversão."
        canonicalUrl="https://leonardobrasil.com.br/blog"
      />
      
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight hover:text-accent transition-colors">
            Leonardo Brasil
          </Link>
          <nav className="flex gap-6 items-center">
            <Link to="/google-meu-negocio" className="text-sm font-bold text-accent hover:text-accent-300 transition-colors">Google Meu Negócio</Link>
            <Link to="/" className="text-sm font-medium text-muted hover:text-text transition-colors">
              Voltar ao Início
            </Link>
          </nav>
        </div>
      </header>

      <main className="py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Google Meu Negócio & <span className="text-accent">SEO Local</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Estratégias avançadas para posicionar o Perfil da sua Empresa no Top 3 do Google Maps e transformar pesquisas locais em chamadas no WhatsApp.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="group flex flex-col rounded-2xl border border-line bg-panel p-6 hover:border-accent/30 transition-all hover:-translate-y-1 shadow-lg">
                <div className="flex items-center gap-3 text-xs mb-4">
                  <time dateTime={post.date} className="text-muted font-medium">
                    {new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  <span className="rounded-full bg-accent/15 px-2.5 py-1 font-semibold text-accent-400">
                    {post.category}
                  </span>
                </div>
                
                <Link to={`/blog/${post.slug}`} className="block mt-2">
                  <h2 className="text-2xl font-bold leading-tight group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="mt-4 text-muted leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-sm overflow-hidden">
                    {post.authorAvatar ? (
                      <img src={post.authorAvatar} alt={post.author} className="h-full w-full object-cover" />
                    ) : (
                      post.author.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{post.author}</p>
                    <p className="text-xs text-muted">Especialista em Google Meu Negócio</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
