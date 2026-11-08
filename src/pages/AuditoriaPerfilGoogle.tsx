import { useState } from "react";
import { Link } from "../lib/local-router";
import { SeoHead } from "../components/SeoHead";
import { Footer } from "../components/Footer";

const WHATSAPP_NUMBER = "5551992568861";

interface Question {
  id: string;
  title: string;
  desc: string;
  weight: number;
}

const QUESTIONS: Question[] = [
  {
    id: "category",
    title: "1. Categoria Primária Exata",
    desc: "A categoria principal do seu perfil é rigorosamente o serviço que os clientes mais procuram no Google (e não algo genérico)?",
    weight: 20,
  },
  {
    id: "nap",
    title: "2. Consistência de Dados (NAP)",
    desc: "O Nome, Endereço e Telefone da sua empresa estão idênticos no Google, site, redes sociais e guias locais da internet?",
    weight: 15,
  },
  {
    id: "description",
    title: "3. Descrição com SEO Local",
    desc: "Sua descrição possui os 750 caracteres estruturados com as principais palavras-chave dos seus serviços e bairros atendidos?",
    weight: 15,
  },
  {
    id: "catalog",
    title: "4. Catálogo de Serviços e Produtos",
    desc: "Seus serviços e produtos estão todos cadastrados individualmente com descrições, fotos reais e botão para WhatsApp?",
    weight: 15,
  },
  {
    id: "reviews",
    title: "5. Avaliações 5 Estrelas Ativas",
    desc: "Você tem um método ativo para receber novas avaliações positivas semanais e responde a 100% delas citando os serviços prestados?",
    weight: 20,
  },
  {
    id: "photos",
    title: "6. Fotos Recentes e Fachada",
    desc: "Você publica fotos reais da equipe, ambiente e fachada pelo menos a cada 15 ou 30 dias na sua ficha?",
    weight: 15,
  },
];

export default function AuditoriaPerfilGoogle() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Dados da empresa
  const [companyName, setCompanyName] = useState("");
  const [cityState, setCityState] = useState("");
  const [segment, setSegment] = useState("");

  // Respostas (sim = true, não = false)
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const handleStartQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !cityState.trim()) return;
    setStep(2);
  };

  const handleAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  // Cálculo do Score
  const calculateScore = () => {
    return QUESTIONS.reduce((acc, q) => {
      return answers[q.id] ? acc + q.weight : acc;
    }, 0);
  };

  const score = calculateScore();

  const getScoreData = (s: number) => {
    if (s <= 40) {
      return {
        label: "Risco Crítico de Invisibilidade",
        color: "text-red-400",
        border: "border-red-500/40",
        bg: "bg-red-950/20",
        badge: "bg-red-500/20 text-red-300",
        summary:
          "Seu perfil está praticamente invisível para quem busca seus serviços no Google Maps. Seus concorrentes diretos estão absorvendo praticamente todas as ligações e rotas locais da sua cidade.",
      };
    }
    if (s <= 70) {
      return {
        label: "Perfil Vulnerável / Abaixo do Top 3",
        color: "text-amber-400",
        border: "border-amber-500/40",
        bg: "bg-amber-950/20",
        badge: "bg-amber-500/20 text-amber-300",
        summary:
          "Seu perfil possui o básico, mas peca em pontos técnicos decisivos para o algoritmo. Você aparece apenas quando o cliente pesquisa o nome exato da empresa, perdendo as pesquisas mais valiosas de novos clientes.",
      };
    }
    return {
      label: "Perfil Competitivo com Oportunidades",
      color: "text-emerald-400",
      border: "border-emerald-500/40",
      bg: "bg-emerald-950/20",
      badge: "bg-emerald-500/20 text-emerald-300",
      summary:
        "Sua empresa tem boas bases no Google Meu Negócio, mas ajustes finos em consistência NAP e respostas estratégicas de avaliações podem consolidar o seu perfil de forma definitiva na 1ª página do Maps.",
    };
  };

  const scoreInfo = getScoreData(score);

  // Falhas detectadas
  const failedQuestions = QUESTIONS.filter((q) => answers[q.id] === false);

  // Link do WhatsApp com mensagem pronta
  const failedSummary = failedQuestions.map((q) => `• ${q.title}`).join("%0A");
  const waMsg = `Olá, Leonardo! Fiz o Raio-X do Google Meu Negócio no seu site.%0A%0A*Empresa:* ${encodeURIComponent(companyName)}%0A*Cidade:* ${encodeURIComponent(cityState)}%0A*Score Obtido:* ${score}/100 (${encodeURIComponent(scoreInfo.label)})%0A%0A*Pontos com falha identificados:*%0A${failedSummary || "Nenhum ponto grave"}%0A%0AQuero receber sua análise técnica e saber como colocar minha empresa no Top 3 do Google Maps.`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Raio-X do Google Meu Negócio — Auditoria Gratuita",
    url: "https://leonardobrasil.com.br/auditoria-perfil-google",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    creator: {
      "@type": "Person",
      name: "Leonardo Brasil",
      jobTitle: "Especialista em Google Meu Negócio e SEO Local",
      url: "https://leonardobrasil.com.br",
    },
  };

  return (
    <div className="min-h-screen bg-ink text-text selection:bg-accent selection:text-white">
      <SeoHead
        title="Raio-X do Google Meu Negócio — Auditoria Gratuita de Visibilidade no Maps"
        description="Avalie a pontuação da sua empresa no Google Maps em 2 minutos. Descubra falhas que afastam clientes e receba o diagnóstico prático do consultor Leonardo Brasil."
        canonicalUrl="https://leonardobrasil.com.br/auditoria-perfil-google"
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
            <Link to="/" className="text-sm font-medium text-muted hover:text-text transition-colors">Voltar ao Início</Link>
          </div>
        </div>
      </header>

      <main className="py-12 md:py-20">
        <div className="mx-auto max-w-3xl px-5">
          {/* TOPO INTRODUTÓRIO */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent-300 mb-4">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Ferramenta Gratuita de Diagnóstico Local
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text text-balance">
              Raio-X do seu Perfil no <span className="text-accent-400">Google Maps</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
              Descubra por que sua empresa não aparece nas primeiras posições e onde estão os vazamentos que enviam clientes diretamente para a concorrência.
            </p>
          </div>

          {/* PASSO 1: DADOS BÁSICOS */}
          {step === 1 && (
            <div className="rounded-3xl border border-line bg-panel p-8 sm:p-12 shadow-2xl">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-line">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Etapa 1 de 2: Identificação</span>
                <span className="text-xs text-muted">2 minutos</span>
              </div>

              <form onSubmit={handleStartQuestions} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-text mb-2">
                    Nome da sua empresa no Google Maps:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Clínica Sorriso Perfeito / Advocacia Santos"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-line-strong bg-ink/70 px-4 py-3.5 text-text placeholder-zinc-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm sm:text-base"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-text mb-2">
                      Cidade e Estado:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: São Paulo - SP"
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      className="w-full rounded-xl border border-line-strong bg-ink/70 px-4 py-3.5 text-text placeholder-zinc-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text mb-2">
                      Ramo de Atuação:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Dentista / Médico / Imobiliária"
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                      className="w-full rounded-xl border border-line-strong bg-ink/70 px-4 py-3.5 text-text placeholder-zinc-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 rounded-xl bg-accent hover:bg-accent-600 px-6 py-4 font-bold text-white transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 text-base"
                >
                  Iniciar Perguntas do Raio-X →
                </button>
              </form>
            </div>
          )}

          {/* PASSO 2: CHECKLIST DIAGNÓSTICO */}
          {step === 2 && (
            <div className="rounded-3xl border border-line bg-panel p-8 sm:p-12 shadow-2xl">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-line">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Etapa 2 de 2: Avaliação Técnica</span>
                <span className="text-xs text-muted">{companyName} ({cityState})</span>
              </div>

              <div className="space-y-8">
                {QUESTIONS.map((q) => (
                  <div key={q.id} className="p-5 rounded-2xl border border-line/60 bg-ink/40">
                    <h3 className="font-bold text-base sm:text-lg text-text">{q.title}</h3>
                    <p className="mt-1 text-sm text-muted leading-relaxed">{q.desc}</p>
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleAnswer(q.id, true)}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border transition-all ${
                          answers[q.id] === true
                            ? "bg-accent border-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                            : "border-line bg-panel text-muted hover:text-text hover:border-line-strong"
                        }`}
                      >
                        ✓ Sim, está feito
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAnswer(q.id, false)}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border transition-all ${
                          answers[q.id] === false
                            ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                            : "border-line bg-panel text-muted hover:text-text hover:border-line-strong"
                        }`}
                      >
                        ✕ Não / Não tenho certeza
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-muted hover:text-text underline"
                >
                  ← Alterar dados da empresa
                </button>

                <button
                  type="button"
                  disabled={!allAnswered}
                  onClick={() => setStep(3)}
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl font-black text-white transition-all ${
                    allAnswered
                      ? "bg-accent hover:bg-accent-600 shadow-[0_0_30px_rgba(59,130,246,0.4)] cursor-pointer active:scale-95"
                      : "bg-zinc-800 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {allAnswered ? "Calcular Meu Score e Gerar Diagnóstico →" : "Responda todas as 6 perguntas"}
                </button>
              </div>
            </div>
          )}

          {/* PASSO 3: RESULTADO E SCORE */}
          {step === 3 && (
            <div className="rounded-3xl border border-line bg-panel p-8 sm:p-12 shadow-2xl">
              <div className="text-center">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${scoreInfo.badge}`}>
                  Diagnóstico Concluído
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-text">
                  Resultado para <span className="text-accent-300">{companyName}</span>
                </h2>
                <p className="text-xs text-muted mt-1">{cityState} · Segmento: {segment || "Geral"}</p>

                {/* VISOR DO SCORE */}
                <div className={`mt-8 mx-auto w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center ${scoreInfo.border} ${scoreInfo.bg} shadow-2xl`}>
                  <span className={`text-5xl font-black ${scoreInfo.color}`}>{score}</span>
                  <span className="text-xs font-bold uppercase text-muted tracking-widest mt-1">de 100 pontos</span>
                </div>

                <div className="mt-6 max-w-xl mx-auto">
                  <h3 className={`text-xl font-bold ${scoreInfo.color}`}>
                    {scoreInfo.label}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                    {scoreInfo.summary}
                  </p>
                </div>
              </div>

              {/* LISTA DE PONTOS CRÍTICOS IDENTIFICADOS */}
              {failedQuestions.length > 0 && (
                <div className="mt-10 p-6 rounded-2xl bg-ink/70 border border-red-500/20">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                    <span>⚠️</span> {failedQuestions.length} Falhas Críticas que Estão Afastando Clientes:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted">
                    {failedQuestions.map((q) => (
                      <li key={q.id} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold shrink-0">✕</span>
                        <span><strong className="text-text">{q.title}:</strong> {q.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA FINAL WHATSAPP */}
              <div className="mt-10 p-8 rounded-2xl bg-accent/10 border border-accent/30 text-center">
                <h4 className="text-lg sm:text-xl font-black text-white">
                  Quer o plano de ação individual para corrigir essas brechas?
                </h4>
                <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
                  Eu analiso pessoalmente seu perfil no Google Maps, audito seus 3 principais concorrentes locais e apresento o que precisa ser corrigido para subir posições.
                </p>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-black text-white hover:bg-accent-600 transition-all active:scale-95 shadow-[0_0_35px_rgba(59,130,246,0.45)] text-base"
                >
                  <span>Receber Diagnóstico Detalhado no WhatsApp</span>
                  <span>→</span>
                </a>

                <p className="mt-3 text-xs text-muted">
                  Atendimento direto com Leonardo Brasil · Consultoria técnica e individual.
                </p>
              </div>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setAnswers({});
                  }}
                  className="text-xs text-muted hover:text-text underline"
                >
                  Refazer o teste com outra empresa
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
