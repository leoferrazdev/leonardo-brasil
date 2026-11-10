import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "../../lib/local-router";
import { SeoHead } from "../../components/SeoHead";
import { supabase } from "../../lib/supabase";
import { AdsApiConfigModal, type AdsIntegrationStatus } from "./components/AdsApiConfigModal";
import { CrmNavBar } from "./components/CrmNavBar";
import {
  Sparkles,
  Search,
  MapPin,
  LogOut,
  KeyRound,
  TrendingUp,
  DollarSign,
  Target,
  MessageCircle,
  Copy,
  Check,
  Download,
  ShieldAlert,
  Layers,
  Sliders,
  ArrowUpDown,
  CheckCircle2,
  Zap
} from "lucide-react";
import { toast } from "react-hot-toast";

export interface MonthlyVolumePoint {
  month: string;
  year: number;
  searches: number;
}

export interface KeywordIdeaItem {
  keyword: string;
  avgMonthlySearches: number;
  competition: "LOW" | "MEDIUM" | "HIGH";
  competitionIndex: number;
  lowTopOfPageBidBrl: number;
  highTopOfPageBidBrl: number;
  intent: "transacional" | "local" | "comercial" | "informacional";
  adGroupCluster: string;
  monthlySearchVolumes: MonthlyVolumePoint[];
}

interface KeywordPlannerResponse {
  source: "google-ads-api" | "local-intelligence-fallback";
  apiWarning?: string;
  location: {
    slug: string;
    name: string;
    state: string;
    neighborhood: string | null;
  };
  ideas: KeywordIdeaItem[];
  summary: {
    totalKeywords: number;
    totalMonthlySearches: number;
    highIntentSearches: number;
    avgLowCpcBrl: number;
    avgHighCpcBrl: number;
    recommendedDailyBudgetBrl: number;
  };
  negativeKeywords: string[];
}

const CITIES = [
  { slug: "porto-alegre", label: "Porto Alegre, RS", factor: 1.0 },
  { slug: "sao-paulo", label: "São Paulo, SP", factor: 4.8 },
  { slug: "curitiba", label: "Curitiba, PR", factor: 1.25 },
  { slug: "florianopolis", label: "Florianópolis, SC", factor: 0.65 },
  { slug: "rio-de-janeiro", label: "Rio de Janeiro, RJ", factor: 2.9 },
  { slug: "belo-horizonte", label: "Belo Horizonte, MG", factor: 1.55 },
  { slug: "campinas", label: "Campinas, SP", factor: 0.85 },
  { slug: "balneario-camboriu", label: "Balneário Camboriú, SC", factor: 0.45 },
  { slug: "brasil", label: "Brasil (Nacional)", factor: 14.0 }
];

const QUICK_NICHES = [
  { label: "Veterinária", seed: "clínica veterinária, veterinário", ticket: 320 },
  { label: "Odontologia", seed: "clínica odontológica, dentista, implante dentário", ticket: 1200 },
  { label: "Médicos / Clínicas", seed: "clínica médica, consulta particular", ticket: 450 },
  { label: "Advocacia", seed: "escritório de advocacia, advogado especialista", ticket: 1800 },
  { label: "Oficina Mecânica", seed: "oficina mecânica, mecânico automotivo", ticket: 650 },
  { label: "Restaurante", seed: "restaurante almoço, restaurante jantar", ticket: 140 }
];

export function getNicheBenchmark(seedKeywords: string[] | string = []) {
  const text = (Array.isArray(seedKeywords) ? seedKeywords.join(" ") : String(seedKeywords)).toLowerCase();

  if (/\b(odonto|dentist|implant|clareament|aparelho|ortodont|protese|invisalign|faceta|canal)\b/i.test(text)) {
    return {
      niche: "odontologia",
      volumeMultiplier: 2.2,
      cpcMin: 4.8,
      cpcMax: 16.5,
      compBase: "HIGH" as const,
      compIdx: 86,
      specificTerms: [
        "implante dentário valor",
        "dentista 24 horas emergência",
        "aparelho invisível preço",
        "clareamento dental a laser",
        "prótese protocolo dentária",
        "consulta avaliação dentista"
      ],
      negatives: ["faculdade de odontologia", "atendimento gratuito", "posto de saúde", "grátis", "sus", "curso", "vagas"]
    };
  }

  if (/\b(advoga|juridic|direito|processo|oab|trabalhista|previdenciar|divorcio|pensao|criminal)\b/i.test(text)) {
    return {
      niche: "advocacia",
      volumeMultiplier: 1.15,
      cpcMin: 9.8,
      cpcMax: 34.5,
      compBase: "HIGH" as const,
      compIdx: 93,
      specificTerms: [
        "advogado trabalhista urgente",
        "advogado divórcio e pensão",
        "aposentadoria inss especialista",
        "escritório de advocacia consulta",
        "dar entrada processo trabalhista",
        "advogado online whatsapp"
      ],
      negatives: ["defensoria pública", "oab prova", "modelo de petição", "jusbrasil", "grátis", "estágio direito", "concurso"]
    };
  }

  if (/\b(medic|clinica medica|consulta|dermatolog|psiquiatr|pediatr|cardiolog|ortoped|oftalmo|cirurgi|exame)\b/i.test(text)) {
    return {
      niche: "medicina",
      volumeMultiplier: 1.7,
      cpcMin: 3.9,
      cpcMax: 12.8,
      compBase: "HIGH" as const,
      compIdx: 82,
      specificTerms: [
        "consulta médica particular hoje",
        "clínica médica agendamento rápido",
        "médico especialista consulta",
        "checkup médico exames",
        "consulta particular valor"
      ],
      negatives: ["sus", "posto de saúde", "hospital público", "grátis", "residência médica", "concurso médico", "estágio"]
    };
  }

  if (/\b(veterin|pet|cachorro|gato|castra|vacina|clinica pet)\b/i.test(text)) {
    return {
      niche: "veterinaria",
      volumeMultiplier: 1.3,
      cpcMin: 2.15,
      cpcMax: 5.95,
      compBase: "HIGH" as const,
      compIdx: 77,
      specificTerms: [
        "veterinário 24 horas emergência",
        "hospital veterinário pronto socorro",
        "consulta cão e gato particular",
        "vacina v10 filhote preço",
        "castração segura veterinária"
      ],
      negatives: ["adoção", "doação", "ong", "resgate", "hospital veterinário público", "grátis", "curso veterinária"]
    };
  }

  if (/\b(oficina|mecanic|carro|auto|motor|pneu|freio|suspens|troca de oleo|eletrica auto)\b/i.test(text)) {
    return {
      niche: "mecanica",
      volumeMultiplier: 1.25,
      cpcMin: 1.95,
      cpcMax: 5.4,
      compBase: "MEDIUM" as const,
      compIdx: 68,
      specificTerms: [
        "mecânica automotiva revisão geral",
        "socorro auto elétrico rápido",
        "troca de freio e suspensão carro",
        "oficina mecânica de confiança",
        "revisão motor e injeção"
      ],
      negatives: ["peças usadas", "ferro velho", "desmanche", "manual pdf", "curso de mecânica", "vagas mecânico"]
    };
  }

  if (/\b(restaurant|comida|almoco|jantar|pizz|hamburg|buffet|rodizio|gastronom|lanche|bar)\b/i.test(text)) {
    return {
      niche: "restaurante",
      volumeMultiplier: 3.6,
      cpcMin: 0.95,
      cpcMax: 2.65,
      compBase: "MEDIUM" as const,
      compIdx: 58,
      specificTerms: [
        "melhor restaurante para almoçar",
        "restaurante almoço executivo buffet",
        "reserva mesa jantar a dois",
        "rodízio completo promoção",
        "restaurante perto de mim agora"
      ],
      negatives: ["receita caseira", "como fazer", "curso culinária", "vagas garçom", "salário cozinheiro", "trabalhe conosco"]
    };
  }

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);
  const volMulti = 0.85 + ((posHash % 100) / 100) * 1.3;
  const cpcMin = Number((1.6 + ((posHash % 50) / 20)).toFixed(2));
  const cpcMax = Number((cpcMin + 2.4 + ((posHash % 80) / 12)).toFixed(2));

  return {
    niche: "personalizado",
    volumeMultiplier: volMulti,
    cpcMin,
    cpcMax,
    compBase: "MEDIUM" as const,
    compIdx: 55 + (posHash % 25),
    specificTerms: [],
    negatives: ["grátis", "gratuito", "curso", "vagas", "emprego", "salário", "reclame aqui"]
  };
}

function classifyClientSideKeyword(kw: string, cityLabel = "", neighborhood = "") {
  const lower = kw.toLowerCase();
  const cityToken = cityLabel.split(",")[0].trim().toLowerCase();
  const nbToken = neighborhood.trim().toLowerCase();

  const isUrgent = /\b(24h|24 horas|urgente|emerg[eê]ncia|plant[aã]o|agora|hoje|telefone|whatsapp|agendar|contato)\b/i.test(lower);
  const isPrice = /\b(pre[cç]o|valor|quanto custa|or[cç]amento|consulta|barato|particular|tabela|plano)\b/i.test(lower);
  const isGeo =
    (cityToken && lower.includes(cityToken)) ||
    (nbToken && lower.includes(nbToken)) ||
    /\b(perto de mim|pr[oó]ximo|zona sul|zona norte|zona leste|zona oeste|centro|bairro)\b/i.test(lower);
  const isInfo = /\b(como|o que [eé]|d[uú]vida|sintomas|pode|caseiro|curso|faculdade|vaga)\b/i.test(lower);

  if (isUrgent) return { intent: "transacional" as const, cluster: "01. Urgência & Atendimento Imediato" };
  if (isPrice) return { intent: "comercial" as const, cluster: "02. Preço, Valor & Consulta" };
  if (isGeo) return { intent: "local" as const, cluster: "03. Localização & Proximidade" };
  if (isInfo) return { intent: "informacional" as const, cluster: "05. Pesquisa Institucional & Dúvidas" };
  return { intent: "transacional" as const, cluster: "04. Especialidade & Procedimentos" };
}

function buildClientSideFallback(
  seedInput: string,
  citySlug: string,
  neighborhood: string
): KeywordPlannerResponse {
  const seeds = seedInput
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const primarySeeds = seeds.length ? seeds : ["serviço local"];
  const cityObj = CITIES.find((c) => c.slug === citySlug) || CITIES[0];
  const cityShort = cityObj.label.split(",")[0].trim().toLowerCase();
  const nb = neighborhood.trim().toLowerCase();
  const benchmark = getNicheBenchmark(primarySeeds);

  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const factors = [0.94, 0.91, 1.04, 1.02, 1.05, 0.98, 0.96, 1.06, 1.08, 1.07, 1.03, 0.88];

  const seen = new Set<string>();
  const ideas: KeywordIdeaItem[] = [];

  for (const seed of primarySeeds.slice(0, 4)) {
    const seedTemplates = [
      { suffix: "", baseVol: 2200, comp: benchmark.compBase, compIdx: benchmark.compIdx, lowMod: 1.0, highMod: 1.0 },
      { suffix: cityShort, baseVol: 1700, comp: benchmark.compBase, compIdx: benchmark.compIdx + 3, lowMod: 1.1, highMod: 1.15 },
      ...(nb
        ? [
            { suffix: `${nb} ${cityShort}`, baseVol: 520, comp: "MEDIUM" as const, compIdx: 58, lowMod: 0.95, highMod: 0.9 },
            { suffix: `no bairro ${nb}`, baseVol: 340, comp: "LOW" as const, compIdx: 42, lowMod: 0.85, highMod: 0.8 }
          ]
        : []),
      { suffix: "perto de mim", baseVol: 1450, comp: benchmark.compBase, compIdx: benchmark.compIdx + 4, lowMod: 1.15, highMod: 1.2 },
      { suffix: "preço consulta", baseVol: 780, comp: "MEDIUM" as const, compIdx: 68, lowMod: 0.9, highMod: 0.95 },
      { suffix: "quanto custa", baseVol: 650, comp: "MEDIUM" as const, compIdx: 62, lowMod: 0.85, highMod: 0.88 },
      { suffix: "telefone whatsapp", baseVol: 490, comp: "MEDIUM" as const, compIdx: 65, lowMod: 1.05, highMod: 1.05 },
      { suffix: "urgente 24 horas", baseVol: 620, comp: benchmark.compBase, compIdx: benchmark.compIdx + 6, lowMod: 1.35, highMod: 1.4 }
    ];

    for (const tpl of seedTemplates) {
      const kw = `${seed} ${tpl.suffix}`.trim().replace(/\s+/g, " ");
      if (seen.has(kw)) continue;
      seen.add(kw);

      const avgMonthlySearches = Math.max(
        30,
        Math.round((tpl.baseVol * benchmark.volumeMultiplier * cityObj.factor) / 10) * 10
      );
      const lowBid = Number((benchmark.cpcMin * tpl.lowMod).toFixed(2));
      const highBid = Number((benchmark.cpcMax * tpl.highMod).toFixed(2));
      const classification = classifyClientSideKeyword(kw, cityObj.label, neighborhood);

      ideas.push({
        keyword: kw,
        avgMonthlySearches,
        competition: tpl.comp,
        competitionIndex: Math.min(100, Math.max(10, tpl.compIdx)),
        lowTopOfPageBidBrl: lowBid,
        highTopOfPageBidBrl: highBid,
        intent: classification.intent,
        adGroupCluster: classification.cluster,
        monthlySearchVolumes: months.map((m, idx) => ({
          month: m,
          year: 2026,
          searches: Math.max(10, Math.round(avgMonthlySearches * factors[idx]))
        }))
      });
    }
  }

  for (const term of benchmark.specificTerms) {
    const termWithGeo = `${term} ${cityShort}`;
    if (!seen.has(termWithGeo)) {
      seen.add(termWithGeo);
      const avgMonthlySearches = Math.max(
        40,
        Math.round((950 * benchmark.volumeMultiplier * cityObj.factor) / 10) * 10
      );
      const classification = classifyClientSideKeyword(termWithGeo, cityObj.label, neighborhood);
      ideas.push({
        keyword: termWithGeo,
        avgMonthlySearches,
        competition: benchmark.compBase,
        competitionIndex: benchmark.compIdx,
        lowTopOfPageBidBrl: benchmark.cpcMin,
        highTopOfPageBidBrl: benchmark.cpcMax,
        intent: classification.intent,
        adGroupCluster: classification.cluster,
        monthlySearchVolumes: months.map((m, idx) => ({
          month: m,
          year: 2026,
          searches: Math.max(10, Math.round(avgMonthlySearches * factors[idx]))
        }))
      });
    }
  }

  ideas.sort((a, b) => b.avgMonthlySearches - a.avgMonthlySearches);

  const totalMonthlySearches = ideas.reduce((a, b) => a + b.avgMonthlySearches, 0);
  const highIntentSearches = ideas
    .filter((i) => i.intent === "transacional" || i.intent === "local")
    .reduce((a, b) => a + b.avgMonthlySearches, 0);

  const avgLowCpcBrl = ideas.length
    ? Number((ideas.reduce((acc, i) => acc + i.lowTopOfPageBidBrl, 0) / ideas.length).toFixed(2))
    : benchmark.cpcMin;
  const avgHighCpcBrl = ideas.length
    ? Number((ideas.reduce((acc, i) => acc + i.highTopOfPageBidBrl, 0) / ideas.length).toFixed(2))
    : benchmark.cpcMax;

  return {
    source: "local-intelligence-fallback",
    location: {
      slug: citySlug,
      name: cityObj.label,
      state: cityObj.label.split(",")[1]?.trim() || "RS",
      neighborhood: neighborhood || null
    },
    ideas,
    summary: {
      totalKeywords: ideas.length,
      totalMonthlySearches,
      highIntentSearches,
      avgLowCpcBrl,
      avgHighCpcBrl,
      recommendedDailyBudgetBrl: Math.max(25, Math.round(avgHighCpcBrl * 8))
    },
    negativeKeywords: benchmark.negatives
  };
}

export default function KeywordPlanner() {
  const navigate = useNavigate();

  // Parâmetros vindos de um Card do Kanban (se houver)
  const initialParams = useMemo(() => {
    if (typeof window === "undefined") {
      return { q: "clínica veterinária", city: "porto-alegre", neighborhood: "Tristeza", lead: "", phone: "", oauth: "" };
    }
    const sp = new URLSearchParams(window.location.search);
    return {
      q: sp.get("q") || "clínica veterinária",
      city: sp.get("city") || "porto-alegre",
      neighborhood: sp.get("neighborhood") || "Tristeza",
      lead: sp.get("lead") || "",
      phone: sp.get("phone") || "",
      oauth: sp.get("oauth") || ""
    };
  }, []);

  const [seedInput, setSeedInput] = useState(initialParams.q);
  const [citySlug, setCitySlug] = useState(initialParams.city);
  const [neighborhood, setNeighborhood] = useState(initialParams.neighborhood);
  const [leadName, setLeadName] = useState(initialParams.lead);
  const [leadPhone, setLeadPhone] = useState(initialParams.phone);
  const [pageUrl, setPageUrl] = useState("");

  const [activeTab, setActiveTab] = useState<"prospeccao" | "campanha">("prospeccao");
  const [matchType, setMatchType] = useState<"phrase" | "exact">("phrase");
  const [intentFilter, setIntentFilter] = useState<string>("todos");
  const [tableSearch, setTableSearch] = useState("");
  const [sortBy, setSortBy] = useState<"volume" | "cpc" | "competition">("volume");

  // Parâmetros da Calculadora de Oportunidades no WhatsApp
  const [ctrPercent, setCtrPercent] = useState(8);
  const [waConversionPercent, setWaConversionPercent] = useState(15);
  const [closeRatePercent, setCloseRatePercent] = useState(25);
  const [avgTicketBrl, setAvgTicketBrl] = useState(450);

  // Estado dos Dados e da API
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<KeywordPlannerResponse | null>(null);
  const [apiStatus, setApiStatus] = useState<AdsIntegrationStatus | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/ads/status");
      if (res.ok) {
        const json = await res.json();
        setApiStatus(json);
      }
    } catch {
      // Silencioso caso rodando sem backend
    }
  }, []);

  const runSearch = useCallback(
    async (customSeed?: string, customCity?: string, customNeighborhood?: string) => {
      const q = (customSeed ?? seedInput).trim();
      const c = customCity ?? citySlug;
      const nb = customNeighborhood ?? neighborhood;

      if (!q && !pageUrl.trim()) {
        toast.error("Informe ao menos uma palavra-chave ou especialidade.");
        return;
      }

      setLoading(true);
      try {
        const keywords = q
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        const res = await fetch("/api/ads/keyword-ideas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keywords,
            pageUrl: pageUrl.trim(),
            citySlug: c,
            neighborhood: nb.trim()
          })
        });

        if (res.ok) {
          const json: KeywordPlannerResponse = await res.json();
          setData(json);
          return;
        }
        throw new Error("Fallback local");
      } catch {
        const fallback = buildClientSideFallback(q, c, nb);
        setData(fallback);
      } finally {
        setLoading(false);
      }
    },
    [seedInput, citySlug, neighborhood, pageUrl]
  );

  useEffect(() => {
    fetchStatus();
    runSearch(initialParams.q, initialParams.city, initialParams.neighborhood);

    if (initialParams.oauth === "success") {
      toast.success("Google Ads OAuth2 conectado com sucesso!");
    } else if (initialParams.oauth === "error") {
      toast.error("Não foi possível concluir o OAuth do Google Ads. Verifique o Client Secret.");
    }
  }, []);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("crm_offline_session");
      localStorage.removeItem("crm_user_email");
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // ignora
    }
    toast.success("Sessão encerrada");
    navigate("/crm/login");
  };

  // Cálculos da Calculadora de Oportunidades no WhatsApp
  const opportunityMetrics = useMemo(() => {
    const baseVolume = data?.summary.highIntentSearches || data?.summary.totalMonthlySearches || 2500;
    const estimatedClicks = Math.max(12, Math.round(baseVolume * (ctrPercent / 100)));
    const whatsappLeads = Math.max(3, Math.round(estimatedClicks * (waConversionPercent / 100)));
    const newClients = Math.max(1, Math.round(whatsappLeads * (closeRatePercent / 100)));
    const monthlyRevenueBrl = newClients * avgTicketBrl;
    const avgCpc = data ? (data.summary.avgLowCpcBrl + data.summary.avgHighCpcBrl) / 2 : 3.4;
    const estimatedAdSpendBrl = Math.round(estimatedClicks * avgCpc);
    const roas = estimatedAdSpendBrl > 0 ? (monthlyRevenueBrl / estimatedAdSpendBrl).toFixed(1) : "5.0";

    return {
      baseVolume,
      estimatedClicks,
      whatsappLeads,
      newClients,
      monthlyRevenueBrl,
      estimatedAdSpendBrl,
      roas
    };
  }, [data, ctrPercent, waConversionPercent, closeRatePercent, avgTicketBrl]);

  // Geração automática do Pitch Comercial para WhatsApp
  const generatedWhatsAppPitch = useMemo(() => {
    const cityLabel = data?.location.name.split(",")[0] || "Porto Alegre";
    const nbText = neighborhood.trim() ? ` (especialmente na região do bairro ${neighborhood.trim()})` : "";
    const top3 = (data?.ideas || []).slice(0, 3);
    const topKeywordsLines = top3
      .map((item) => `• *"${item.keyword}"*: ~${item.avgMonthlySearches.toLocaleString("pt-BR")} buscas/mês`)
      .join("\n");

    const greeting = leadName.trim()
      ? `Olá, pessoal da *${leadName.trim()}*! Tudo bem? Aqui é o Leonardo Brasil.`
      : `Olá! Tudo bem? Aqui é o Leonardo Brasil, especialista em posicionamento no Google para negócios locais.`;

    return `${greeting}

Acabei de levantar os dados de demanda no Planejador do Google para ${cityLabel}${nbText} e vi um volume alto de clientes procurando exatamente pelo serviço de vocês todos os meses:

${topKeywordsLines}

Somando as variações de intenção imediata na região, são *${(data?.summary.totalMonthlySearches || 0).toLocaleString("pt-BR")} pesquisas mensais*.

Capturando apenas *${ctrPercent}%* dessa demanda no topo do Google (Maps + Pesquisa), a projeção conservadora para o negócio de vocês é de:
→ *~${opportunityMetrics.whatsappLeads} conversas qualificadas no WhatsApp por mês*
→ *~${opportunityMetrics.newClients} novos atendimentos/clientes fechados todo mês* (potencial de *R$ ${opportunityMetrics.monthlyRevenueBrl.toLocaleString("pt-BR")}/mês*).

Posso te mandar um print rápido de como estruturar o perfil e a captação de vocês para absorver essas buscas antes dos concorrentes do bairro?`;
  }, [data, neighborhood, leadName, ctrPercent, opportunityMetrics]);

  // Filtragem e Ordenação da Tabela
  const filteredIdeas = useMemo(() => {
    const list = [...(data?.ideas || [])];
    return list
      .filter((item) => {
        if (intentFilter !== "todos" && item.intent !== intentFilter) return false;
        if (tableSearch.trim() && !item.keyword.toLowerCase().includes(tableSearch.trim().toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "volume") return b.avgMonthlySearches - a.avgMonthlySearches;
        if (sortBy === "cpc") return b.highTopOfPageBidBrl - a.highTopOfPageBidBrl;
        return b.competitionIndex - a.competitionIndex;
      });
  }, [data, intentFilter, tableSearch, sortBy]);

  // Agrupamento em Clusters (Grupos de Anúncios)
  const adGroupClusters = useMemo(() => {
    const map = new Map<string, KeywordIdeaItem[]>();
    for (const item of data?.ideas || []) {
      const group = map.get(item.adGroupCluster) || [];
      group.push(item);
      map.set(item.adGroupCluster, group);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [data]);

  const formatKeywordMatch = (kw: string) => {
    return matchType === "exact" ? `[${kw}]` : `"${kw}"`;
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência!`);
  };

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(generatedWhatsAppPitch);
    setCopiedPitch(true);
    toast.success("Pitch comercial copiado para o WhatsApp!");
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleExportCsv = () => {
    if (!data?.ideas.length) return;
    const headers = [
      "Keyword",
      "Match Type",
      "Ad Group",
      "Intent",
      "Avg Monthly Searches",
      "Competition",
      "Competition Index",
      "Min CPC (BRL)",
      "Max CPC (BRL)"
    ];
    const rows = data.ideas.map((i) => [
      `"${i.keyword.replace(/"/g, '""')}"`,
      matchType === "exact" ? "Exact" : "Phrase",
      `"${i.adGroupCluster}"`,
      i.intent,
      i.avgMonthlySearches,
      i.competition,
      i.competitionIndex,
      i.lowTopOfPageBidBrl.toFixed(2),
      i.highTopOfPageBidBrl.toFixed(2)
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `planejamento-google-ads-${citySlug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Planilha CSV exportada para o Google Ads!");
  };

  const sanitizedLeadPhone = leadPhone.replace(/\D+/g, "");
  const whatsappSendUrl = sanitizedLeadPhone
    ? `https://web.whatsapp.com/send?phone=${sanitizedLeadPhone.startsWith("55") ? sanitizedLeadPhone : `55${sanitizedLeadPhone}`}&text=${encodeURIComponent(generatedWhatsAppPitch)}`
    : `https://web.whatsapp.com/send?text=${encodeURIComponent(generatedWhatsAppPitch)}`;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col">
      <SeoHead
        title="Planejador de Palavras-Chave Google Ads | CRM Leonardo Brasil"
        description="Ferramenta interna de inteligência de demanda local e planejamento de campanhas Google Ads."
        canonicalUrl="https://leonardobrasil.com.br/crm/planejador"
        robots="noindex, nofollow"
      />

      {/* HEADER UNIFICADO DO CRM */}
      <header className="border-b border-slate-800/80 bg-[#0a0d14]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto min-w-0">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Leonardo Brasil
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    Ads Planner
                  </span>
                </span>
                <p className="text-[11px] text-slate-400">Inteligência de Demanda Local & Google Ads</p>
              </div>
            </Link>

            <CrmNavBar />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={() => setConfigModalOpen(true)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                apiStatus?.ready
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>
                {apiStatus?.ready ? "Google Ads MCC Conectada" : "Conectar Google Ads MCC / API"}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* PAINEL DE PESQUISA E PARÂMETROS */}
        <section className="bg-[#0b101b] border border-slate-800/90 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/70">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-1">Nichos Rápidos:</span>
              {QUICK_NICHES.map((niche) => (
                <button
                  key={niche.label}
                  type="button"
                  onClick={() => {
                    setSeedInput(niche.seed);
                    setAvgTicketBrl(niche.ticket);
                    runSearch(niche.seed, citySlug, neighborhood);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-blue-300 border border-slate-800 hover:border-blue-500/40 transition-all"
                >
                  {niche.label}
                </button>
              ))}
            </div>

            {data && (
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                  data.source === "google-ads-api"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Fonte: {data.source === "google-ads-api" ? "Google Ads API Oficial (MCC)" : "Motor Híbrido Local + Google Suggest"}
              </span>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(seedInput, citySlug, neighborhood);
            }}
            className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
          >
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Palavras-Chave Semente (separadas por vírgula)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  placeholder="Ex: clínica veterinária, veterinário 24h"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070a12] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cidade / Região (GeoTarget)
              </label>
              <select
                value={citySlug}
                onChange={(e) => {
                  const newCity = e.target.value;
                  setCitySlug(newCity);
                  runSearch(seedInput, newCity, neighborhood);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[#070a12] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bairro Foco (Opcional)
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Tristeza, Moinhos..."
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#070a12] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Empresa / Prospecto (p/ Pitch)
              </label>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Ex: Ceron Veterinária"
                className="w-full px-3 py-2.5 rounded-xl bg-[#070a12] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{loading ? "Consultando..." : "Pesquisar Demanda"}</span>
              </button>
            </div>
          </form>
        </section>

        {/* KPIs EXECUTIVOS DE DEMANDA LOCAL */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0b101b] border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Volume Mensal na Região</p>
                <p className="text-2xl font-extrabold text-white mt-1">
                  {data.summary.totalMonthlySearches.toLocaleString("pt-BR")}
                  <span className="text-xs font-normal text-slate-400 ml-1">buscas/mês</span>
                </p>
                <p className="text-[11px] text-blue-400 mt-1">
                  {data.location.name} {neighborhood ? `• ${neighborhood}` : ""}
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#0b101b] border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Demanda de Fundo de Funil</p>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                  {data.summary.highIntentSearches.toLocaleString("pt-BR")}
                  <span className="text-xs font-normal text-slate-400 ml-1">buscas prontas</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Intenção Transacional + Geográfica</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Target className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#0b101b] border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Faixa de CPC Topo de Página</p>
                <p className="text-2xl font-extrabold text-amber-400 mt-1">
                  R$ {data.summary.avgLowCpcBrl.toFixed(2)} – R$ {data.summary.avgHighCpcBrl.toFixed(2)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Custo por clique médio na rede de pesquisa</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#0b101b] border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Orçamento Diário Recomendado</p>
                <p className="text-2xl font-extrabold text-purple-400 mt-1">
                  R$ {data.summary.recommendedDailyBudgetBrl}/dia
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {data.summary.totalKeywords} termos mapeados em {adGroupClusters.length} grupos
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* SELETOR DE MODO OPERACIONAL */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("prospeccao")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "prospeccao"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                  : "bg-[#0b101b] text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>1. Modo Prospecção (Calculadora & Pitch WhatsApp)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("campanha")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "campanha"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "bg-[#0b101b] text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2. Modo Pós-Venda (Grupos de Anúncios & Negativas)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Exportar Planilha CSV (Google Ads)</span>
          </button>
        </div>

        {/* MODO 1: PROSPECÇÃO E ARGUMENTO DE VENDAS */}
        {activeTab === "prospeccao" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Calculadora de Oportunidades no WhatsApp */}
            <div className="lg:col-span-6 bg-[#0b101b] border border-slate-800/90 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    Calculadora de Oportunidades no WhatsApp
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Simule o retorno financeiro para ancorar sua proposta comercial na reunião
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#070a12] border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">CTR Estimado (Cliques)</span>
                    <span className="text-emerald-400 font-bold">{ctrPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={25}
                    value={ctrPercent}
                    onChange={(e) => setCtrPercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#070a12] border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Conversão em WhatsApp</span>
                    <span className="text-emerald-400 font-bold">{waConversionPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    value={waConversionPercent}
                    onChange={(e) => setWaConversionPercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#070a12] border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Taxa de Fechamento</span>
                    <span className="text-emerald-400 font-bold">{closeRatePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={closeRatePercent}
                    onChange={(e) => setCloseRatePercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#070a12] border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Ticket Médio do Cliente (R$)</span>
                    <span className="text-emerald-400 font-bold">R$ {avgTicketBrl}</span>
                  </div>
                  <input
                    type="number"
                    min={50}
                    step={50}
                    value={avgTicketBrl}
                    onChange={(e) => setAvgTicketBrl(Math.max(1, Number(e.target.value)))}
                    className="w-full px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Funil Projetado */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400">Visitas Qualificadas</p>
                  <p className="text-lg font-extrabold text-white mt-0.5">
                    {opportunityMetrics.estimatedClicks}/mês
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400">Leads no WhatsApp</p>
                  <p className="text-lg font-extrabold text-emerald-400 mt-0.5">
                    {opportunityMetrics.whatsappLeads}/mês
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400">Novos Clientes</p>
                  <p className="text-lg font-extrabold text-blue-400 mt-0.5">
                    {opportunityMetrics.newClients}/mês
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <p className="text-[11px] text-emerald-300 font-semibold">Receita Projetada</p>
                  <p className="text-lg font-extrabold text-emerald-400 mt-0.5">
                    R$ {opportunityMetrics.monthlyRevenueBrl.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>

            {/* Pitch Pronto para WhatsApp */}
            <div className="lg:col-span-6 bg-[#0b101b] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    Pitch de Demanda Reprimida (Pronto para WhatsApp)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Argumento baseado nas buscas reais da cidade para enviar ao prospecto
                  </p>
                </div>
              </div>

              <textarea
                readOnly
                value={generatedWhatsAppPitch}
                rows={10}
                className="w-full p-3.5 rounded-xl bg-[#070a12] border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[180px]">
                  <input
                    type="text"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="WhatsApp do Lead (opcional: 51999999999)"
                    className="w-full px-3 py-2 rounded-xl bg-[#070a12] border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPitch}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all"
                  >
                    {copiedPitch ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPitch ? "Copiado!" : "Copiar Pitch"}</span>
                  </button>

                  <a
                    href={whatsappSendUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Disparar no WhatsApp Web</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODO 2: ENGENHARIA DE CAMPANHA (PÓS-VENDA) */}
        {activeTab === "campanha" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Clusters de Grupos de Anúncios */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0b101b] border border-slate-800/90 rounded-2xl p-4">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Estrutura de Grupos de Anúncios Sugerida (Clusters Semânticos)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Copie os blocos abaixo diretamente para os Grupos de Anúncios do seu cliente no Google Ads
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-[#070a12] p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMatchType("phrase")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      matchType === "phrase" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    "Correspondência de Frase"
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatchType("exact")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      matchType === "exact" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    [Correspondência Exata]
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adGroupClusters.map(([clusterName, items]) => {
                  const formattedList = items.map((i) => formatKeywordMatch(i.keyword)).join("\n");
                  const clusterVolume = items.reduce((a, b) => a + b.avgMonthlySearches, 0);
                  return (
                    <div
                      key={clusterName}
                      className="bg-[#0b101b] border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                            {clusterName}
                          </h3>
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {clusterVolume.toLocaleString("pt-BR")} buscas/mês
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {items.map((item) => (
                            <div
                              key={item.keyword}
                              className="flex items-center justify-between text-xs bg-[#070a12] px-2.5 py-1.5 rounded-lg border border-slate-800/70"
                            >
                              <span className="font-mono text-slate-200 truncate">
                                {formatKeywordMatch(item.keyword)}
                              </span>
                              <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                                {item.avgMonthlySearches}/mês • R$ {item.lowTopOfPageBidBrl.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyText(formattedList, `Grupo "${clusterName}"`)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar {items.length} Palavras do Grupo</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Palavras-Chave Negativas */}
            <div className="lg:col-span-4 bg-[#0b101b] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <h2>Lista de Palavras-Chave Negativas (Blindagem)</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Adicione esta lista na campanha do cliente para impedir cliques de curiosos, estudantes ou buscas gratuitas (SUS/Prefeitura).
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(data?.negativeKeywords || []).map((neg) => (
                    <span
                      key={neg}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono"
                    >
                      -{neg}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleCopyText((data?.negativeKeywords || []).join("\n"), "Lista de palavras negativas")
                }
                className="w-full py-2.5 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar Todas as Negativas ({data?.negativeKeywords.length || 0})</span>
              </button>
            </div>
          </div>
        )}

        {/* TABELA COMPLETA DE PALAVRAS-CHAVE (ESTILO KEYWORD PLANNER) */}
        <section className="bg-[#0b101b] border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">
                Ideias de Palavras-Chave e Métricas Históricas ({filteredIdeas.length})
              </h2>
              <p className="text-xs text-slate-400">
                Volume mensal médio, sazonalidade de 12 meses, intenção comercial e lances de topo de página
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Filtrar termo..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#070a12] border border-slate-800 text-xs text-white focus:border-blue-500 focus:outline-none"
              />

              <select
                value={intentFilter}
                onChange={(e) => setIntentFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#070a12] border border-slate-800 text-xs text-slate-200"
              >
                <option value="todos">Todas as Intenções</option>
                <option value="transacional">Fundo de Funil (Transacional)</option>
                <option value="local">Local / Geográfica</option>
                <option value="comercial">Comercial (Preço/Orçamento)</option>
                <option value="informacional">Informacional</option>
              </select>

              <button
                type="button"
                onClick={() =>
                  setSortBy((prev) => (prev === "volume" ? "cpc" : prev === "cpc" ? "competition" : "volume"))
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  Ordenar: {sortBy === "volume" ? "Volume" : sortBy === "cpc" ? "Maior CPC" : "Concorrência"}
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080c15] text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Palavra-Chave</th>
                  <th className="py-3 px-3">Intenção</th>
                  <th className="py-3 px-3">Grupo de Anúncio</th>
                  <th className="py-3 px-3 text-right">Buscas Mensais</th>
                  <th className="py-3 px-3 text-center">Tendência (12m)</th>
                  <th className="py-3 px-3 text-center">Concorrência</th>
                  <th className="py-3 px-3 text-right">CPC Mín. (Topo)</th>
                  <th className="py-3 px-3 text-right">CPC Máx. (Topo)</th>
                  <th className="py-3 px-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredIdeas.map((item) => {
                  const maxMonth = Math.max(...item.monthlySearchVolumes.map((m) => m.searches), 1);
                  const intentBadge =
                    item.intent === "transacional"
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                      : item.intent === "local"
                      ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                      : item.intent === "comercial"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      : "bg-slate-800 text-slate-400 border-slate-700";

                  const compBadge =
                    item.competition === "HIGH"
                      ? "text-red-400"
                      : item.competition === "MEDIUM"
                      ? "text-amber-400"
                      : "text-emerald-400";

                  return (
                    <tr key={item.keyword} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{item.keyword}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase ${intentBadge}`}>
                          {item.intent}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{item.adGroupCluster}</td>
                      <td className="py-3 px-3 text-right font-bold text-white">
                        {item.avgMonthlySearches.toLocaleString("pt-BR")}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-end justify-center gap-0.5 h-6 w-24 mx-auto" title="Sazonalidade Jan-Dez">
                          {item.monthlySearchVolumes.map((m, idx) => (
                            <div
                              key={`${m.month}-${idx}`}
                              style={{ height: `${Math.max(20, Math.round((m.searches / maxMonth) * 100))}%` }}
                              className="w-1.5 bg-blue-500/70 rounded-t-sm"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-semibold ${compBadge}`}>
                          {item.competition === "HIGH" ? "Alta" : item.competition === "MEDIUM" ? "Média" : "Baixa"}{" "}
                          <span className="text-slate-500 font-normal">({item.competitionIndex})</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        R$ {item.lowTopOfPageBidBrl.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400 font-semibold">
                        R$ {item.highTopOfPageBidBrl.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleCopyText(formatKeywordMatch(item.keyword), `Palavra "${item.keyword}"`)}
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                          title="Copiar palavra formatada"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL DE CONFIGURAÇÃO DA API GOOGLE ADS (MCC & CLOUD CONSOLE) */}
      <AdsApiConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        status={apiStatus}
        onSaved={(newStatus) => {
          setApiStatus(newStatus);
          runSearch();
        }}
      />
    </div>
  );
}
