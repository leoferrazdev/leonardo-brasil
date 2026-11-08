import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551992568861";
const waLink = (msg: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const WA_MEDICOS = waLink("Olá, Leonardo! Sou médico / gestor de clínica e gostaria de uma avaliação do meu Perfil no Google Meu Negócio dentro das diretrizes éticas do CFM.");

const FAQ = [
  {
    q: "O médico pode ter perfil no Google Meu Negócio sem ferir o CFM?",
    a: "Sim, com total segurança. A presença no Google Maps é considerada informação de utilidade pública pela Resolução CFM nº 2.336/2023. O perfil serve para informar especialidade registrada (RQE), CRM, endereço do consultório, horários e formas de contato.",
  },
  {
    q: "O que o CFM proíbe terminantemente no Google Maps?",
    a: "É proibido garantir resultados de tratamentos, utilizar termos sensacionalistas como 'o melhor médico da cidade', prometer cura ou expor pacientes de forma sensacionalista. Minha consultoria adequa 100% dos textos às regras éticas.",
  },
  {
    q: "Como o Google Maps ajuda a atrair pacientes particulares?",
    a: "A maioria dos pacientes busca por 'médico [especialidade] perto de mim'. Ao posicionar seu consultório no Top 3 do mapa com catálogo de procedimentos e botão direto para a secretária no WhatsApp, você atrai pacientes particulares qualificados sem depender exclusivamente de repasses de planos de saúde.",
  },
  {
    q: "Médico que atende em vários hospitais pode ter perfil próprio?",
    a: "Sim. É possível configurar um perfil de profissional individual vinculado ao endereço do seu consultório principal ou clínica onde atende regularmente, blindando sua reputação e concentrando as avaliações no seu nome.",
  },
];

export default function GoogleMeuNegocioMedicosCfm() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Consultoria em Google Meu Negócio para Médicos e Clínicas — Leonardo Brasil",
    description: "Posicionamento ético de consultórios e clínicas médicas no Top 3 do Google Maps, em total conformidade com a Resolução CFM nº 2.336/2023.",
    url: "https://leonardobrasil.com.br/google-meu-negocio/medicos-cfm",
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
        title="Google Meu Negócio para Médicos e Clínicas — Regras do CFM | Leonardo Brasil"
        description="Atraia pacientes particulares no Google Maps com segurança jurídica. Otimização de Perfil da Empresa para Médicos e Clínicas em total conformidade com o CFM."
        canonicalUrl="https://leonardobrasil.com.br/google-meu-negocio/medicos-cfm"
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
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Conformidade com a Resolução CFM nº 2.336/2023
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-balance">
              Google Meu Negócio para <span className="text-accent-400">Médicos & Clínicas</span> sem Risco de Punição Ética
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              Posicione seu consultório ou clínica no Top 3 do Google Maps para atrair pacientes particulares, mantendo rigoroso respeito aos limites da publicidade médica do CFM e CRM.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={WA_MEDICOS}
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center items-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-white hover:bg-accent-600 transition-all active:scale-95 shadow-[0_0_35px_rgba(59,130,246,0.4)]"
              >
                Avaliar meu Consultório no WhatsApp →
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

        {/* OS 4 PILARES DA CONFORMIDADE MÉDICA NO GOOGLE */}
        <section className="py-20 border-b border-line bg-panel/30">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Metodologia Blindada</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
                Como posicionar sua especialidade no Google com sobriedade
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">01. Identificação RQE</span>
                <h3 className="mt-3 text-lg font-bold text-text">Especialidade & Registro</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Configuração exata de CRM e RQE nas descrições e títulos para atender às regras do CFM e gerar autoridade imediata.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">02. Sem Sensacionalismo</span>
                <h3 className="mt-3 text-lg font-bold text-text">Textos Informativos</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Descrições focadas em esclarecer sintomas, tratamentos e estrutura física, sem autopromoção exagerada ou promessas de resultado.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">03. Fotos Humanizadas</span>
                <h3 className="mt-3 text-lg font-bold text-text">Ambiente & Consultório</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Fotos georreferenciadas da recepção, consultório e equipamentos autorizados, transmitindo acolhimento e profissionalismo.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">04. Gestão de Avaliações</span>
                <h3 className="mt-3 text-lg font-bold text-text">Reputação e Ética</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Método para coletar depoimentos espontâneos de pacientes e respostas elegantes mantendo o sigilo médico.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 max-w-3xl mx-auto px-5">
          <h2 className="text-3xl font-black tracking-tight text-center mb-10">Dúvidas Frequentes de Médicos</h2>
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
              Quer estruturar seu consultório no Google Maps com segurança ética?
            </h2>
            <p className="mt-4 text-muted text-base max-w-xl mx-auto">
              Eu avalio seu perfil médico gratuitamente, aponto o que pode ser melhorado e mostro como alcançar os pacientes que procuram pela sua especialidade.
            </p>
            <a
              href={WA_MEDICOS}
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
