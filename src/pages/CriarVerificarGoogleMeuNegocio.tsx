import { useEffect, useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const WA_CRIAR = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá, Leonardo! Preciso criar e verificar o perfil da minha empresa no Google Meu Negócio sem correr risco de suspensão."
)}`;

const ETAPAS_CRIACAO = [
  {
    num: "01",
    titulo: "Mapeamento de Elegibilidade e Modelo do Perfil",
    desc: "Definimos se sua empresa deve ser cadastrada como Local Físico (com fachada e atendimento presencial) ou Empresa de Área de Atendimento (SAB, ocultando endereço residencial).",
  },
  {
    num: "02",
    titulo: "Estruturação Cadastral Blindada (Anti-Suspensão)",
    desc: "Preenchimento exato da razão/nome fantasia conforme fachada e CNPJ, evitando termos proibidos que disparam suspensão automática logo após a criação.",
  },
  {
    num: "03",
    titulo: "Roteiro Técnico para Verificação por Vídeo do Google",
    desc: "Hoje o método padrão do Google é a gravação de vídeo contínuo pelo celular. Preparamos o checklist exato do que filmar (rua, placa, interior, equipamento/documento) para aprovação rápida.",
  },
  {
    num: "04",
    titulo: "Otimização Inicial de SEO Local Pós-Verificação",
    desc: "Assim que o perfil fica verificado e visível no Google Maps, configuramos categorias secundárias, serviços, descrição SEO, fotos e link direto para WhatsApp.",
  },
];

const ERROS_VERIFICACAO = [
  "Tentar cadastrar endereço residencial como loja aberta sem placa fixa na fachada",
  "Colocar palavras-chave extras no nome da empresa antes mesmo de passar na verificação",
  "Gravar vídeo de verificação cortado, escuro ou sem mostrar placa da rua e prova de operação",
  "Criar uma segunda ficha quando já existe um perfil antigo não reivindicado no mesmo endereço",
];

const FAQ = [
  {
    q: "Por que o Google exige verificação por vídeo e reprova tantas empresas?",
    a: "O Google endureceu os sistemas antifraude para barrar perfis falsos. O vídeo precisa provar três coisas em uma única gravação sem cortes: localização geográfica real (rua/número), existência da empresa (fachada/equipamentos) e que você tem autorização de gestão (abrir a porta, acessar sistema/documentos).",
  },
  {
    q: "Posso criar um perfil no Google Meu Negócio se trabalho em casa ou atendo a domicílio?",
    a: "Sim! Prestadores de serviço como eletricistas, chaveiros, encanadores, arquitetos, consultores e psicólogos online podem ter perfil 100% aprovado usando o modo 'Área de Atendimento', mantendo o endereço residencial oculto ao público.",
  },
  {
    q: "E se o meu perfil já foi criado, mas ficou travado em 'Processamento' ou foi suspenso na hora?",
    a: "Se o perfil já caiu em suspensão ou travou na verificação, não crie outra ficha. Analisamos o motivo da trava, corrigimos a inconsistência e fazemos o protocolo de liberação junto ao suporte.",
  },
  {
    q: "Quanto tempo leva para a empresa aparecer no Google Maps após verificar?",
    a: "Após a aprovação da verificação por vídeo (geralmente entre algumas horas e 5 dias úteis), o perfil entra no ar no Google Pesquisa e Google Maps imediatamente, pronto para receber otimização e avaliações.",
  },
];

export default function CriarVerificarGoogleMeuNegocio() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canonicalUrl = "https://leonardobrasil.com.br/criar-e-verificar-google-meu-negocio";

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Criação e Verificação de Google Meu Negócio",
      description:
        "Serviço profissional para criar, configurar e aprovar a verificação por vídeo do Perfil da Empresa no Google (Google Meu Negócio) sem cair em suspensão.",
      url: canonicalUrl,
      provider: {
        "@type": "Organization",
        "@id": "https://leonardobrasil.com.br/#organization",
        name: "Leonardo Brasil",
      },
      areaServed: { "@type": "Country", name: "Brasil" },
      serviceType: "Cadastro e Verificação no Google Meu Negócio",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://leonardobrasil.com.br" },
        { "@type": "ListItem", position: 2, name: "Google Meu Negócio", item: "https://leonardobrasil.com.br/google-meu-negocio" },
        { "@type": "ListItem", position: 3, name: "Criar e Verificar Google Meu Negócio", item: canonicalUrl },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ink text-text font-sans selection:bg-accent selection:text-white">
      <SeoHead
        title="Criar e Verificar Google Meu Negócio (Sem Suspensão) | Leonardo Brasil"
        description="Serviço especializado para criar e verificar seu Perfil da Empresa no Google Maps do jeito certo. Checklist para verificação por vídeo, endereço oculto (SAB) e SEO inicial."
        keywords="criar google meu negócio, verificar google meu negócio, verificação por vídeo google meu negócio, cadastrar empresa no google maps, serviço cadastro google meu negócio"
        canonicalUrl={canonicalUrl}
        schema={schema}
      />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-text hover:text-accent transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
            Leonardo Brasil
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-muted">
            <Link to="/google-meu-negocio" className="hover:text-text transition-colors">Google Meu Negócio</Link>
            <Link to="/gestao-google-meu-negocio" className="hover:text-text transition-colors">Gestão Mensal</Link>
            <Link to="/recuperar-perfil-suspenso-google" className="text-red-400 hover:text-red-300 transition-colors">Perfil Suspenso?</Link>
            <Link to="/google-ads" className="text-accent hover:text-accent-300 transition-colors">Google Ads</Link>
          </nav>
          <a
            href={WA_CRIAR}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-600 transition-all shadow-lg shadow-accent/20"
          >
            Criar Meu Perfil
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-line py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-ink to-ink -z-10" />
          <div className="mx-auto max-w-4xl px-5 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/30 mb-6">
              Cadastro Blindado · Verificação por Vídeo
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-balance">
              Crie e verifique seu <span className="text-emerald-400">Google Meu Negócio</span> do jeito certo
            </h1>
            <p className="mt-6 text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Não arrisque ter sua ficha recém-criada bloqueada por erros básicos na verificação por vídeo ou na configuração de endereço. Estruturo seu cadastro desde o primeiro clique já pronto para ranquear no Google Maps.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WA_CRIAR}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white font-black text-base px-8 py-4 rounded-full hover:bg-accent-600 transition-all shadow-xl shadow-accent/25"
              >
                Quero Criar e Verificar Meu Perfil →
              </a>
              <Link
                to="/recuperar-perfil-suspenso-google"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-950/20 px-7 py-4 text-sm font-bold text-red-300 hover:bg-red-950/40 transition-colors"
              >
                Já foi suspenso? Clique aqui
              </Link>
            </div>
          </div>
        </section>

        {/* ETAPAS */}
        <section className="py-20 border-b border-line bg-ink">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Passo a Passo Técnico</span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">
                Como funciona o serviço de criação e verificação
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {ETAPAS_CRIACAO.map((etapa) => (
                <div key={etapa.num} className="rounded-2xl border border-line bg-panel p-7">
                  <span className="text-xs font-black text-emerald-400">{etapa.num}</span>
                  <h3 className="text-lg font-bold text-text mt-2 mb-2">{etapa.titulo}</h3>
                  <p className="text-sm text-muted leading-relaxed">{etapa.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ERROS QUE BLOQUEIAM */}
        <section className="py-16 border-b border-line bg-panel/40">
          <div className="mx-auto max-w-4xl px-5">
            <div className="rounded-3xl border border-red-500/20 bg-red-950/10 p-8">
              <h2 className="text-xl sm:text-2xl font-black text-text mb-4">
                4 erros que travam a verificação do Google logo no primeiro dia
              </h2>
              <ul className="space-y-3 text-sm text-muted">
                {ERROS_VERIFICACAO.map((erro) => (
                  <li key={erro} className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>{erro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-ink">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">Perguntas Frequentes</h2>
            <div className="space-y-3">
              {FAQ.map((item, idx) => (
                <div key={item.q} className="rounded-2xl border border-line bg-panel overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-sm sm:text-base text-text"
                  >
                    <span>{item.q}</span>
                    <span className="text-accent text-lg shrink-0">{openFaq === idx ? "−" : "+"}</span>
                  </button>
                  {openFaq === idx && (
                    <p className="px-5 pb-5 -mt-1 text-sm text-muted leading-relaxed">{item.a}</p>
                  )}
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
