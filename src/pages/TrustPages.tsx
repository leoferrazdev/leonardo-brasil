import { useEffect, type ReactNode } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá, Leonardo! Vim pela página institucional do seu site e gostaria de falar sobre SEO Local e Google Meu Negócio.")}`;

function TrustHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight hover:text-accent transition-colors">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent/15 border border-accent/30">
            <svg viewBox="0 0 48 48" className="w-[18px] h-[18px]" fill="none" aria-hidden="true">
              <rect x="6" y="9" width="36" height="9" rx="4" fill="#3b82f6" opacity="0.4" />
              <rect x="13" y="21" width="22" height="9" rx="4" fill="#3b82f6" opacity="0.7" />
              <rect x="20" y="33" width="8" height="9" rx="4" fill="#60a5fa" />
            </svg>
          </span>
          Leonardo Brasil
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
          <Link to="/about" className="text-muted hover:text-text transition-colors">Sobre</Link>
          <Link to="/contact" className="text-muted hover:text-text transition-colors">Contato</Link>
          <Link to="/privacy" className="text-muted hover:text-text transition-colors">Privacidade</Link>
          <Link to="/docs" className="text-accent hover:text-accent-300 font-semibold transition-colors">API & Docs</Link>
        </nav>
      </div>
    </header>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-text mb-4">{title}</h2>
      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Sobre Leonardo Brasil — Especialista em SEO Local e Google Meu Negócio",
    url: "https://leonardobrasil.com.br/about",
    mainEntity: { "@id": "https://leonardobrasil.com.br/#organization" },
  };

  return (
    <div className="min-h-screen bg-ink text-text flex flex-col font-sans">
      <SeoHead
        title="Sobre Leonardo Brasil — Especialista em SEO Local e Google Meu Negócio"
        description="Conheça Leonardo Brasil (CNPJ 65.993.728/0001-07), especialista em SEO Local e Google Meu Negócio em Porto Alegre - RS com atendimento para todo o Brasil."
        canonicalUrl="https://leonardobrasil.com.br/about"
        schema={aboutSchema}
      />
      <TrustHeader />

      <main className="flex-1 mx-auto max-w-4xl w-full px-5 py-12 md:py-16 space-y-8">
        <div>
          <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent-300">
            Quem somos & Metodologia
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-balance">
            Sobre <span className="text-accent-400">Leonardo Brasil</span> — SEO Local &amp; Google Meu Negócio
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
            Leonardo Brasil é uma consultoria especializada em posicionamento orgânico no Google Maps, SEO Local e estrutura comercial de conversão via WhatsApp para negócios locais e profissionais liberais em todo o Brasil.
          </p>
        </div>

        <SectionCard title="Identidade Corporativa e Atuação">
          <p>
            A operação é conduzida por <strong className="text-text">LEONARDO FERRAZ DA SILVA BRASIL</strong> (CNPJ <strong className="text-text">65.993.728/0001-07</strong>), sediada em <strong className="text-text">Porto Alegre - RS, Brasil</strong>, com atendimento consultivo direto e remoto para mais de 5.570 municípios brasileiros.
          </p>
          <p>
            O foco da consultoria é atender empresas que dependem de intenção de busca imediata na própria cidade — incluindo médicos (em conformidade com a Resolução CFM 2.336), advogados (Provimento 205 da OAB), dentistas (normas do CFO), clínicas veterinárias, oficinas, prestadores de serviços de urgência e estabelecimentos locais.
          </p>
        </SectionCard>

        <SectionCard title="Os 4 Pilares da Metodologia de Vendas Locais">
          <ul className="grid sm:grid-cols-2 gap-4 pt-1">
            <li className="rounded-xl border border-line bg-ink/60 p-4">
              <h3 className="font-bold text-text">01. Presença no Google Maps</h3>
              <p className="mt-1 text-sm text-muted">Auditoria NAP, definição precisa de categorias primária/secundárias, catálogo de serviços, fotos georreferenciadas e descrição com SEO Local.</p>
            </li>
            <li className="rounded-xl border border-line bg-ink/60 p-4">
              <h3 className="font-bold text-text">02. Aquisição Orgânica e Pago Local</h3>
              <p className="mt-1 text-sm text-muted">Captura de buscas geolocalizadas de alta urgência para aumentar chamadas telefônicas, rotas no Maps e mensagens qualificadas.</p>
            </li>
            <li className="rounded-xl border border-line bg-ink/60 p-4">
              <h3 className="font-bold text-text">03. Conversão no WhatsApp</h3>
              <p className="mt-1 text-sm text-muted">Protocolos de atendimento rápido, roteiros consultivos e estratégia ativa de captação e resposta a avaliações 5 estrelas.</p>
            </li>
            <li className="rounded-xl border border-line bg-ink/60 p-4">
              <h3 className="font-bold text-text">04. Escala e Previsibilidade</h3>
              <p className="mt-1 text-sm text-muted">Estrutura de mensuração e reativação documental quando perfis sofrem suspensões indevidas ou quedas de visibilidade.</p>
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Transparência Técnica e Ferramentas Abertas">
          <p>
            Não fazemos promessas irreais de "1ª posição garantida", pois o algoritmo do Google considera proximidade física e histórico de interações. Aplicamos boas práticas verificáveis e disponibilizamos gratuitamente o{" "}
            <Link to="/auditoria-perfil-google" className="text-accent hover:underline font-semibold">Raio-X Interativo do Perfil no Google</Link>{" "}
            e uma{" "}
            <Link to="/docs" className="text-accent hover:underline font-semibold">API pública versionada (/docs)</Link>{" "}
            com sandbox OAuth 2.0 aberto para desenvolvedores e agentes de IA.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/auditoria-perfil-google" className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 transition-colors">
              Fazer Raio-X Gratuito
            </Link>
            <Link to="/contact" className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-bold text-text hover:border-accent transition-colors">
              Canais de Contato
            </Link>
            <Link to="/brandbook" className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-bold text-text hover:border-accent transition-colors">
              Brandbook Oficial
            </Link>
          </div>
        </SectionCard>
      </main>

      <Footer />
    </div>
  );
}

export function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contato Oficial — Leonardo Brasil SEO Local",
    url: "https://leonardobrasil.com.br/contact",
    mainEntity: { "@id": "https://leonardobrasil.com.br/#organization" },
  };

  return (
    <div className="min-h-screen bg-ink text-text flex flex-col font-sans">
      <SeoHead
        title="Contato — Leonardo Brasil (SEO Local & Google Meu Negócio)"
        description="Entre em contato com Leonardo Brasil via WhatsApp (+55 51 99673-7359) ou e-mail (contato@leonardobrasil.com.br). Atendimento comercial em Porto Alegre - RS e todo o Brasil."
        canonicalUrl="https://leonardobrasil.com.br/contact"
        schema={contactSchema}
      />
      <TrustHeader />

      <main className="flex-1 mx-auto max-w-4xl w-full px-5 py-12 md:py-16 space-y-8">
        <div>
          <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent-300">
            Atendimento Direto &amp; Suporte Técnico
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-balance">
            Contato — <span className="text-accent-400">Leonardo Brasil</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
            Canais oficiais para diagnósticos comerciais de Google Meu Negócio, suporte técnico de API e dúvidas sobre privacidade ou parcerias.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <SectionCard title="WhatsApp Comercial">
            <p>Atendimento direto para avaliação preliminar gratuita do perfil da sua empresa no Google Maps e consultoria de SEO Local.</p>
            <p className="text-text font-bold">+55 51 99673-7359</p>
            <p className="text-xs text-muted">Segunda a Sexta, 09h00 às 18h00 (Horário de Brasília)</p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600 transition-colors"
            >
              Chamar no WhatsApp
            </a>
          </SectionCard>

          <SectionCard title="E-mail & Suporte Técnico">
            <p>Canal oficial para propostas corporativas, questões de privacidade (LGPD) e integrações com a API Leonardo Brasil.</p>
            <p>
              <a href="mailto:contato@leonardobrasil.com.br" className="text-accent font-bold hover:underline">
                contato@leonardobrasil.com.br
              </a>
            </p>
            <p className="text-xs text-muted">Para testar nossa API imediatamente sem aprovação manual, use o sandbox gratuito self-serve.</p>
            <Link to="/docs" className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-bold text-accent-300 hover:bg-accent/20 transition-colors">
              Documentação da API (/docs)
            </Link>
          </SectionCard>
        </div>

        <SectionCard title="Dados Cadastrais, Localização e Redes">
          <ul className="space-y-2 text-sm sm:text-base">
            <li><strong className="text-text">Razão Social:</strong> LEONARDO FERRAZ DA SILVA BRASIL</li>
            <li><strong className="text-text">CNPJ:</strong> 65.993.728/0001-07</li>
            <li><strong className="text-text">Cidade Base:</strong> Porto Alegre, RS — Brasil (Atendimento remoto em todo o território nacional)</li>
            <li>
              <strong className="text-text">GitHub Oficial:</strong>{" "}
              <a href="https://github.com/leoferrazdev" target="_blank" rel="noreferrer" className="text-accent hover:underline">
                https://github.com/leoferrazdev
              </a>
            </li>
            <li>
              <strong className="text-text">LinkedIn:</strong>{" "}
              <a href="https://www.linkedin.com/in/oleonardobrasil/" target="_blank" rel="noreferrer" className="text-accent hover:underline">
                linkedin.com/in/oleonardobrasil
              </a>
            </li>
          </ul>
        </SectionCard>
      </main>

      <Footer />
    </div>
  );
}
