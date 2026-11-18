import { PortoAlegreDecision } from "../components/PortoAlegreDecision";
import { SeoHead } from "../components/SeoHead";
import {
  ECOSYSTEM_PROFILES,
  FINAL_QUESTION,
  FIRST_30_DAYS,
  FOLLOWER_CONTEXT,
  METRIC_CONTEXT,
  MONETIZATION_LEVELS,
  NEXT_48_HOURS,
  NINETY_DAY_OUTCOMES,
  NOMINAL_FOLLOWERS,
  PILLARS,
  RESPONSIBILITIES,
  ROUTINE,
  SAMPLE_METRICS,
} from "../data/portoAlegreDigital";

const NAV_ITEMS = [
  { href: "#oportunidade", label: "Oportunidade" },
  { href: "#operacao", label: "Operação" },
  { href: "#rotina", label: "Rotina" },
  { href: "#plano-90-dias", label: "90 dias" },
  { href: "#decisao", label: "Decisão" },
] as const;

const CURRENT_ASSETS = [
  "Audiência regional",
  "Reconhecimento local",
  "Capacidade de distribuição",
  "Inventário de formatos e campanhas",
  "Histórico de conteúdo e interação",
] as const;

const COMMERCIAL_STRUCTURE = [
  "Pipeline e qualificação",
  "Ofertas padronizadas",
  "Cadências e follow-up",
  "Forecast comercial",
  "Acompanhamento de entregas e renovações",
] as const;

const CRM_CAPABILITIES = [
  "Empresas e contatos",
  "Origem e perfil",
  "Qualificação e score",
  "Pipeline e tarefas",
  "Propostas e perdas",
  "Campanhas e entregas",
  "Renovação e recorrência",
  "Metas e forecast",
] as const;

const METRIC_IMAGES = [
  "/porto-alegre-digital/metricas-publicacao-01.webp",
  "/porto-alegre-digital/metricas-publicacao-02.webp",
  "/porto-alegre-digital/metricas-publicacao-03.webp",
] as const;

const formatInteger = (value: number) =>
  new Intl.NumberFormat("pt-BR").format(value);

export default function PortoAlegreDigital() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-text selection:bg-gold-500 selection:text-ink">
      <SeoHead
        title="Plano de Implantação Comercial | Porto Alegre Digital"
        description="Plano executivo para estruturar CRM próprio, prospecção, ofertas, rotina comercial e acompanhamento de metas da Porto Alegre Digital."
        canonicalUrl="https://leobrasil.com.br/porto-alegre-digital"
        robots="noindex, nofollow"
        includeBrandGraph={false}
      />

      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-1 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600"
      />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <a
            href="#inicio"
            className="font-black tracking-tight text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            Porto Alegre <span className="text-gold-400">Digital</span>
          </a>
          <nav
            aria-label="Navegação da apresentação"
            className="hidden gap-6 md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-muted transition hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#decisao"
            className="rounded-full border border-gold-500/30 px-4 py-2 text-sm font-bold text-gold-400 transition hover:bg-gold-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            Decisão
          </a>
        </div>
      </header>

      <main id="inicio">
        <section className="relative px-5 py-24 sm:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_10%,rgba(242,183,5,0.12),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-gold-400">
              Plano de implantação comercial
            </p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.98] tracking-tight text-balance sm:text-7xl lg:text-8xl">
              Uma audiência regional forte. Agora, uma operação comercial à
              altura.
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
              Um plano para transformar relevância local em prospecção, ofertas,
              acompanhamento e receita comercial com método.
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm font-bold text-text">
              <span>Porto Alegre Digital</span>
              <span
                aria-hidden="true"
                className="h-px w-8 bg-gold-500/60"
              />
              <span>Leonardo Brasil</span>
            </div>
          </div>
        </section>

        <section
          id="oportunidade"
          className="scroll-mt-20 border-y border-line bg-panel/35 px-5 py-20"
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-400">
              A oportunidade já existe
            </p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <h2 className="max-w-4xl text-3xl font-black tracking-tight text-balance sm:text-5xl">
                Três perfis. Relevância regional. Um ativo comercial pronto para
                ganhar sistema.
              </h2>
              <div className="lg:text-right">
                <p className="text-4xl font-black tabular-nums text-gold-400 sm:text-5xl">
                  {formatInteger(NOMINAL_FOLLOWERS)}
                </p>
                <p className="mt-2 text-sm font-semibold text-muted">
                  seguidores na soma nominal
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {ECOSYSTEM_PROFILES.map((profile) => (
                <article
                  key={profile.handle}
                  className="overflow-hidden rounded-3xl border border-line bg-ink shadow-2xl shadow-black/20"
                >
                  <img
                    src={profile.image}
                    alt={`Perfil ${profile.handle} no Instagram`}
                    className="aspect-[4/3] w-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="flex items-end justify-between gap-3 p-5">
                    <h3 className="font-bold">{profile.handle}</h3>
                    <p className="text-2xl font-black text-gold-400">
                      {profile.followersLabel}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
              {FOLLOWER_CONTEXT}
            </p>

            <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {SAMPLE_METRICS.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-2xl border border-line bg-ink p-5"
                >
                  <p className="text-2xl font-black tabular-nums text-text">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm text-muted">{metric.label}</p>
                </article>
              ))}
            </div>
            <p className="mt-5 max-w-4xl text-sm leading-relaxed text-muted">
              {METRIC_CONTEXT}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {METRIC_IMAGES.map((image, index) => (
                <figure
                  key={image}
                  className="overflow-hidden rounded-2xl border border-line bg-ink"
                >
                  <img
                    src={image}
                    alt={`Evidência da publicação analisada ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-line bg-panel p-7 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-accent-400">
                Ativos existentes
              </p>
              <ul className="mt-6 space-y-4 text-lg">
                {CURRENT_ASSETS.map((item) => (
                  <li key={item} className="border-b border-line pb-4">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-3xl border border-gold-500/20 bg-gold-500/[0.04] p-7 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-400">
                Estrutura a implantar
              </p>
              <ul className="mt-6 space-y-4 text-lg">
                {COMMERCIAL_STRUCTURE.map((item) => (
                  <li
                    key={item}
                    className="border-b border-gold-500/10 pb-4"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section
          id="operacao"
          className="scroll-mt-20 border-y border-line bg-panel/35 px-5 py-20"
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-400">
              A decisão proposta
            </p>
            <h2 className="mt-4 max-w-5xl text-4xl font-black tracking-tight text-balance sm:text-6xl">
              Leonardo lidera a implantação da operação comercial da Porto
              Alegre Digital.
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {PILLARS.map((pillar) => (
                <article
                  key={pillar.number}
                  className="rounded-3xl border border-line bg-ink p-6"
                >
                  <p className="text-sm font-black text-gold-400">
                    {pillar.number}
                  </p>
                  <h3 className="mt-5 text-xl font-black">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {pillar.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-400">
                CRM próprio
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-balance sm:text-5xl">
                Construído para a forma como esta operação vende.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                A implantação começa pela versão operacional necessária para
                prospectar, acompanhar, entregar e renovar. O sistema evolui
                com os aprendizados reais da equipe.
              </p>
            </div>
            <div className="rounded-3xl border border-line bg-panel p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {CRM_CAPABILITIES.map((capability) => (
                  <div
                    key={capability}
                    className="rounded-2xl border border-line bg-ink px-5 py-4 font-semibold"
                  >
                    {capability}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-panel/35 px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-400">
              Arquitetura de monetização
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-balance sm:text-5xl">
              Uma escada para entrar, comprovar valor, permanecer e expandir.
            </h2>
            <div className="mt-12 grid gap-4 lg:grid-cols-4">
              {MONETIZATION_LEVELS.map((offer, index) => (
                <article
                  key={offer.title}
                  className="relative rounded-3xl border border-line bg-ink p-6"
                >
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-gold-400">
                    {offer.level}
                  </span>
                  <h3 className="mt-5 text-2xl font-black">{offer.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {offer.description}
                  </p>
                  {index < MONETIZATION_LEVELS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-3 top-1/2 z-10 hidden text-gold-400 lg:block"
                    >
                      →
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-400">
                Venda consultiva
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-balance sm:text-5xl">
                O contato deixa de ser improviso e passa a ter método.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                Mensagem, contexto, diagnóstico, proposta e próximo passo
                passam a formar uma cadência documentada no CRM.
              </p>
            </div>
            <figure className="overflow-hidden rounded-3xl border border-line bg-panel p-3">
              <img
                src="/porto-alegre-digital/script-vendas.webp"
                alt="Exemplo real de roteiro comercial utilizado em uma venda"
                className="w-full rounded-2xl"
                loading="lazy"
              />
            </figure>
          </div>
        </section>

        <section
          id="rotina"
          className="scroll-mt-20 border-y border-line bg-panel/35 px-5 py-20"
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-400">
              Rotina comercial na prática
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-balance sm:text-5xl">
              A previsibilidade nasce do que acontece todos os dias.
            </h2>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {ROUTINE.map((block) => (
                <article
                  key={block.cadence}
                  className="rounded-3xl border border-line bg-ink p-7"
                >
                  <h3 className="text-2xl font-black text-gold-400">
                    {block.cadence}
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3 text-muted">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="plano-90-dias"
          className="scroll-mt-20 px-5 py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-line bg-panel p-7 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-accent-400">
                Primeiros 30 dias
              </p>
              <h2 className="mt-4 text-3xl font-black">
                Implantar, testar e acompanhar.
              </h2>
              <ol className="mt-7 space-y-4">
                {FIRST_30_DAYS.map((item, index) => (
                  <li key={item} className="flex gap-4 text-muted">
                    <span className="font-black text-accent-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-7 text-sm leading-relaxed text-muted">
                Referências operacionais iniciais, sujeitas à validação dos
                dados reais. São metas de processo, não promessas de
                faturamento.
              </p>
            </article>
            <article className="rounded-3xl border border-gold-500/20 bg-gold-500/[0.04] p-7 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-400">
                Horizonte de 90 dias
              </p>
              <h2 className="mt-4 text-3xl font-black">
                Transformar atividade em sistema.
              </h2>
              <ul className="mt-7 space-y-4">
                {NINETY_DAY_OUTCOMES.map((item) => (
                  <li
                    key={item}
                    className="border-b border-gold-500/10 pb-4 text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="border-y border-line bg-panel/35 px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-400">
              Responsabilidades claras
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-balance sm:text-5xl">
              Liderança definida. Decisões sem ruído.
            </h2>
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {RESPONSIBILITIES.map((block) => (
                <article
                  key={block.owner}
                  className="rounded-3xl border border-line bg-ink p-7 sm:p-9"
                >
                  <h3 className="text-2xl font-black">{block.owner}</h3>
                  <ul className="mt-6 space-y-4 text-muted">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="text-gold-400">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PortoAlegreDecision
          question={FINAL_QUESTION}
          nextSteps={NEXT_48_HOURS}
        />
      </main>
    </div>
  );
}
