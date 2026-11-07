import { useEffect } from "react";
import { useParams, Link, Navigate } from "../lib/local-router";
import ReactMarkdown from "react-markdown";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";
import { BLOG_POSTS } from "../data/blogData";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Encontra links de satélite/pilar se existirem
  const satellitePosts = post.clusterType === 'pillar' 
    ? BLOG_POSTS.filter(p => p.pillarSlug === post.slug) 
    : [];
  
  const pillarPost = post.clusterType === 'satellite' && post.pillarSlug 
    ? BLOG_POSTS.find(p => p.slug === post.pillarSlug) 
    : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "datePublished": post.date,
    "author": [{
        "@type": "Person",
        "name": post.author
    }],
  };

  const formattedDate = new Date(post.date).toLocaleDateString('pt-BR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-ink text-text font-sans">
      <SeoHead 
        title={`${post.title} | Blog Leonardo Brasil`}
        description={post.excerpt}
        canonicalUrl={`https://leonardobrasil.com.br/blog/${post.slug}`}
        schema={articleSchema}
      />
      
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight hover:text-accent transition-colors">
            Leonardo Brasil
          </Link>
          <nav className="flex gap-6 items-center">
            <Link to="/google-meu-negocio" className="text-sm font-bold text-accent hover:text-accent-300 transition-colors">Google Meu Negócio</Link>
            <Link to="/blog" className="text-sm font-medium text-muted hover:text-text transition-colors flex items-center gap-2">
              &larr; Voltar ao Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="py-12 md:py-20">
        <article className="mx-auto max-w-3xl px-5">
          <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-accent-400">
                {post.category}
              </span>
              <time dateTime={post.date} className="text-sm text-muted font-medium">
                {formattedDate}
              </time>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-8 leading-[1.1]">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-3">
               <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent-400 overflow-hidden">
                 {post.authorAvatar ? (
                   <img src={post.authorAvatar} alt={post.author} className="h-full w-full object-cover" />
                 ) : (
                   post.author.charAt(0)
                 )}
               </div>
               <div className="text-left leading-tight">
                 <p className="font-semibold text-sm">{post.author}</p>
                 <p className="text-xs text-muted">Especialista em Google Meu Negócio</p>
               </div>
            </div>
          </header>

          {/* Aviso de Pilar (se for satélite) */}
          {post.clusterType === 'satellite' && pillarPost && (
            <div className="mb-10 rounded-2xl border border-accent/30 bg-accent/10 p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="flex-1">
                <p className="text-xs font-bold text-accent-400 uppercase tracking-wider mb-1">Faz parte do guia:</p>
                <Link to={`/blog/${pillarPost.slug}`} className="text-lg font-bold hover:text-accent-300 transition-colors">
                  {pillarPost.title}
                </Link>
              </div>
            </div>
          )}

          {/* Conteúdo Markdown com tipografia prose-invert */}
          <div className="prose prose-invert prose-lg md:prose-xl mx-auto prose-headings:font-bold prose-a:text-accent-400 hover:prose-a:text-accent-300 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-accent-500">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Índice de Satélites (se for pilar) */}
          {post.clusterType === 'pillar' && satellitePosts.length > 0 && (
            <div className="mt-16 rounded-3xl border border-line bg-panel p-8">
              <h3 className="text-2xl font-black mb-2">Artigos neste Guia</h3>
              <p className="text-muted mb-6">Aprofunde-se nas estratégias avançadas:</p>
              <div className="flex flex-col gap-3">
                {satellitePosts.map((sat, index) => (
                  <Link 
                    key={sat.slug} 
                    to={`/blog/${sat.slug}`} 
                    className="flex items-center gap-4 p-4 rounded-xl border border-line bg-ink hover:border-accent/40 transition-colors group"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent-400 font-bold group-hover:bg-accent group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                    <span className="font-semibold group-hover:text-accent-300 transition-colors">{sat.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
