import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551996737359";
const waLink = (msg: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const WA_ADVOGADOS = waLink("Olá, Leonardo! Sou advogado / sócio de escritório de advocacia e gostaria de uma avaliação do meu Perfil no Google Meu Negócio dentro das normas da OAB.");

const FAQ = [
  {
    q: "O Provimento 205/2021 da OAB permite presença no Google Meu Negócio?",
    a: "Sim, de forma expressa. O Provimento 205/2021 do Conselho Federal da OAB autoriza o marketing jurídico de caráter informativo, incluindo presença em mapas e ferramentas de busca, desde que mantida a sobriedade e sem promessa de causa ganha.",
  },
  {
    q: "O que o escritório de advocacia NÃO pode colocar no Google Maps?",
    a: "Não é permitido divulgar tabelas de honorários, gratuidade de consultas como chamariz, expressões mercantilistas ('o melhor advogado da comarca') ou indução ao litígio. Nossa consultoria estrutura os textos com estrita linguagem técnica e informativa.",
  },
  {
    q: "Como o Google Maps gera novos clientes para a advocacia?",
    a: "Quando alguém precisa de um advogado (seja para um divórcio, demissão, inventário ou defesa empresarial), a primeira atitude é pesquisar no Google por 'advogado trabalhista perto de mim' ou 'advogado especialista em família em [cidade]'. Estar no Top 3 do Maps com endereço e WhatsApp direto gera contatos qualificados e imediatos.",
  },
  {
    q: "Advogado autônomo sem escritório físico pode ter ficha?",
    a: "Sim. Podemos configurar o perfil como 'Área de Atendimento', permitindo que você atue na comarca e cidade sem precisar expor seu endereço residencial ou particular.",
  },
];

export default function GoogleMeuNegocioAdvogadosOab() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Consultoria em Google Meu Negócio para Advogados — Leonardo Brasil",
    description: "Posicionamento sóbrio e estratégico de escritórios de advocacia no Top 3 do Google Maps, em total conformidade com o Provimento nº 205/2021 da OAB.",
    url: "https://leonardobrasil.com.br/google-meu-negocio/advogados-oab",
    telephone: `+${WHATSAPP_NUMBER}`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
    },
  };

  return (
    <div className="min-h-screen bg-ink text-text selection:bg-accent selection:text-white">
      <SeoHead
        title="Google Meu Negócio para Advogados — Normas do Provimento OAB | Leonardo Brasil"
        description="Atraia clientes para seu escritório de advocacia no Google Maps com sobriedade. Posicionamento no Top 3 dentro das normas do Provimento 205/2021 da OAB."
        canonicalUrl="https://leonardobrasil.com.br/google-meu-negocio/advogados-oab"
        schema={schema}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight hover:text-accent transition-colors">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent/15 border border-accent/30">
              <svg viewBox="0 0 48 48" className="w-[18px] h-[18px]" fill="none"><rect x="6" y="9" width="36" height="9" rx="4" fill="#3b82f6" opacity="0.4" /><rect x="13" y="21" width="22" height="9" rx="4" fill="#3b82f6" opacity="0.7" /><rect x="20" y="33" width="8" height="9" rx="4" fill="#60a5fa" /></svg>
            </span>
            Leonardo Brasil
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/auditoria-perfil-google" className="text-sm font-semibold text-accent hover:underline">Fazer Raio-X Gratuito</Link>
            <Link to="/" className="text-sm font-medium text-muted hover:text-text transition-colors">Início</Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative py-16 sm:py-24 border-b border-line overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(59,130,246,0.15), transparent 70%)" }} />
          <div className="relative mx-auto max-w-5xl px-5 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Marketing Jurídico Informativo · Provimento 205/2021 da OAB
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-balance">
              Google Meu Negócio para <span className="text-accent-400">Advogados</span> com Sobriedade e Rigor Ético
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              Posicione sua banca de advocacia no Top 3 do Google Maps para atrair clientes em busca de assessoria jurídica especializada, sem mercantilização da profissão e respeitando as normas da OAB.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={WA_ADVOGADOS}
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center items-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-white hover:bg-accent-600 transition-all active:scale-95 shadow-[0_0_35px_rgba(59,130,246,0.4)]"
              >
                Avaliar meu Escritório no WhatsApp →
              </a>
              <Link
                to="/auditoria-perfil-google"
                className="inline-flex justify-center items-center gap-2 rounded-full border border-line-strong px-7 py-4 font-semibold text-text hover:bg-panel transition-colors"
              >
                Fazer Raio-X do Perfil
              </Link>
            </div>
          </div>
        </section>

        {/* 4 EIXOS DO SEO LOCAL JURÍDICO */}
        <section className="py-20 border-b border-line bg-panel/30">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Estratégia Sóbria</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
                Como advogados captam causas qualificadas de forma passiva
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">01. Especialidades</span>
                <h3 className="mt-3 text-lg font-bold text-text">Áreas de Atuação</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Configuração precisa de categorias para Direito Trabalhista, Família, Tributário, Cível, Previdenciário ou Empresarial.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">02. Linguagem Sóbria</span>
                <h3 className="mt-3 text-lg font-bold text-text">Conteúdo Informativo</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Descrições detalhadas dos direitos e serviços de consultoria jurídica, sem apelo comercial agressivo ou promessa de êxito.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">03. Presença Local</span>
                <h3 className="mt-3 text-lg font-bold text-text">Comarca & Região</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Otimização de termos geográficos para aparecer nas pesquisas de pessoas e empresas instaladas na sua cidade e arredores.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">04. Contato Direto</span>
                <h3 className="mt-3 text-lg font-bold text-text">WhatsApp e Agendamento</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Canal de comunicação ágil para direcionar o cliente imediatamente para a triagem da secretária ou advogado de plantão.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 max-w-3xl mx-auto px-5">
          <h2 className="text-3xl font-black tracking-tight text-center mb-10">Dúvidas Frequentes da Advocacia</h2>
          <div className="space-y-4">
            {FAQ.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-line bg-panel">
                <h3 className="font-bold text-lg text-text">{f.q}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-16 border-t border-line bg-ink text-center">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="text-3xl font-black tracking-tight text-white">
              Pronto para colocar sua banca de advocacia no topo do Google Maps?
            </h2>
            <p className="mt-4 text-muted text-base max-w-xl mx-auto">
              Eu analiso a presença digital do seu escritório no Google, aponto as oportunidades na sua comarca e mostro como conquistar clientes com total conformidade ética.
            </p>
            <a
              href={WA_ADVOGADOS}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-white hover:bg-accent-600 transition-all shadow-[0_0_40px_rgba(59,130,246,0.4)]"
            >
              Falar no WhatsApp com Leonardo Brasil →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
