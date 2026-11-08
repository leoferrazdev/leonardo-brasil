import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551992568861";
const waLink = (msg: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const WA_DENTISTAS = waLink("Olá, Leonardo! Sou dentista / gestor de clínica odontológica e gostaria de uma avaliação do meu Perfil no Google Meu Negócio para captar mais pacientes particulares.");

const FAQ = [
  {
    q: "Como o Google Maps atrai pacientes particulares de implantes e alinhadores?",
    a: "Pacientes que buscam procedimentos de alto valor (como implantes, facetas ou ortodontia invisível) não compram por impulso: eles pesquisam clínicas perto de casa ou do trabalho, comparam fotos da estrutura e leem os relatos de outros pacientes. Estar no Top 3 do mapa com dezenas de avaliações 5 estrelas é o fator decisivo para a escolha.",
  },
  {
    q: "O que o CFO permite e proíbe na divulgação no Google Maps?",
    a: "O Conselho Federal de Odontologia permite a divulgação de especialidades registradas (CRO), estrutura da clínica, equipe e tratamentos. É vedada a divulgação de preços como chamariz sensacionalista ('consulta grátis') ou promessas irreais. Otimizamos sua ficha respeitando rigorosamente a ética profissional.",
  },
  {
    q: "Como me livrar da dependência de convênios odontológicos?",
    a: "Convênios pagam pouco e exigem volume excessivo. O Google Maps atrai a pessoa que está procurando ativamente pelo tratamento de forma particular na sua rua e bairro. Ao blindar seu perfil, a demanda de particulares cresce e você pode reduzir gradativamente os planos de saúde.",
  },
  {
    q: "Minha clínica tem vários dentistas parceiros. Como configurar?",
    a: "Configuramos o perfil principal da clínica como a âncora de autoridade no Google Maps e podemos vincular os especialistas às suas respectivas áreas (Implantodontia, Ortodontia, Endodontia, Harmonização), maximizando as buscas captadas.",
  },
];

export default function GoogleMeuNegocioDentistasCfo() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Consultoria em Google Meu Negócio para Dentistas — Leonardo Brasil",
    description: "Atraia pacientes particulares para implantes, alinhadores e estética odontológica no Top 3 do Google Maps, de acordo com as normas do CFO.",
    url: "https://leonardobrasil.com.br/google-meu-negocio/dentistas-cfo",
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
        title="Google Meu Negócio para Dentistas — Capte Pacientes Particulares no Maps | Leonardo Brasil"
        description="Coloque sua clínica odontológica no Top 3 do Google Maps. Atraia pacientes de implantes, ortodontia e estética com otimização profissional alinhada ao CFO."
        canonicalUrl="https://leonardobrasil.com.br/google-meu-negocio/dentistas-cfo"
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
              Especialistas em Odontologia · Normas do CFO
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-balance">
              Google Meu Negócio para <span className="text-accent-400">Dentistas</span>: Atraia Pacientes Particulares no seu Bairro
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              Transforme buscas no Google Maps em agendamentos de implantes, próteses, alinhadores e tratamentos de alto ticket, reduzindo a dependência de repasses baixos de convênios.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={WA_DENTISTAS}
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

        {/* OS 4 PILARES DA ATRAÇÃO DE PARTICULARES */}
        <section className="py-20 border-b border-line bg-panel/30">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Conversão Odontológica</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
                O que faz um paciente particular escolher seu consultório
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">01. Procedimentos Chave</span>
                <h3 className="mt-3 text-lg font-bold text-text">Catálogo de Alto Valor</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Destaque para Implantes, Próteses Protocolo, Alinhadores Invisíveis, Facetas e Odontopediatria organizados por categoria.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">02. Avaliações com Prova</span>
                <h3 className="mt-3 text-lg font-bold text-text">Depoimentos 5 Estrelas</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Método para engajar pacientes satisfeitos a deixarem avaliações espontâneas elogiando o atendimento e a pontualidade.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">03. Fotos que Encantam</span>
                <h3 className="mt-3 text-lg font-bold text-text">Ambiente & Consultório</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Fotos profissionais da sala de espera, consultório odontológico, esterilização e fachada, eliminando o medo de dentista.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">04. Contato Imediato</span>
                <h3 className="mt-3 text-lg font-bold text-text">Agendamento Ágil</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Botão de WhatsApp com mensagem personalizada para a secretária responder em minutos e marcar a primeira consulta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 max-w-3xl mx-auto px-5">
          <h2 className="text-3xl font-black tracking-tight text-center mb-10">Dúvidas Frequentes de Clínicas Odontológicas</h2>
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
              Quer colocar sua clínica odontológica no Top 3 do Google Maps?
            </h2>
            <p className="mt-4 text-muted text-base max-w-xl mx-auto">
              Eu avalio sua ficha no Google Maps gratuitamente, identifico por que seus concorrentes estão na frente e mostro o caminho para atrair pacientes particulares todo mês.
            </p>
            <a
              href={WA_DENTISTAS}
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
