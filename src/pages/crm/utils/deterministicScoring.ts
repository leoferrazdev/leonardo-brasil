import type {
  DeterministicAuditSignals,
  DeterministicScoreResult,
  ProspectLead,
} from "../types";

/**
 * Resolve o arquétipo comercial do segmento de forma 100% determinística:
 * Tier 1 (20 pts): Alta Urgência & Veterinárias (campeãs empíricas de resposta + Arquétipo 1).
 * Tier 2 (15 pts): Saúde de Alto Ticket (Odontologia).
 * Tier 3 (10 pts): Prestadores de Serviços Locais / Domiciliares (Climatização, Dedetização).
 * Tier 4 (5 pts): Demais nichos (Restaurantes, etc.).
 */
export function resolveArchetypeTier(segment: string): 1 | 2 | 3 | 4 {
  const s = segment.toLowerCase();
  if (
    s.includes("mecânica") ||
    s.includes("mecanica") ||
    s.includes("automot") ||
    s.includes("elétrica") ||
    s.includes("eletrica") ||
    s.includes("bateria") ||
    s.includes("guincho") ||
    s.includes("veterin") ||
    s.includes("chaveiro") ||
    s.includes("desentupidora") ||
    s.includes("encanador")
  ) {
    return 1;
  }
  if (s.includes("odonto") || s.includes("dentista")) {
    return 2;
  }
  if (
    s.includes("climatiza") ||
    s.includes("ar-condicionado") ||
    s.includes("ar condicionado") ||
    s.includes("dedetiz")
  ) {
    return 3;
  }
  return 4;
}

export function parseMonthlySearchVolume(volStr?: string): number {
  if (!volStr) return 0;
  const digits = volStr.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

/**
 * Motor Determinístico Puro de Pontuação de Prospecção (0 a 100 pontos).
 * Zero subjetividade: entradas binárias e numéricas sempre geram a mesma saída.
 */
export function calculateDeterministicScore(
  signals: DeterministicAuditSignals
): DeterministicScoreResult {
  // Bloqueio rígido do Critério P: Top 3 não é prospectado ativamente
  if (!signals.observedPosition || signals.observedPosition <= 3) {
    return {
      score: 0,
      tier: "D",
      classLabel: "Classe D (Top 3 - Inelegível)",
      priorityTag: "Inelegível (Critério P)",
      eligible: false,
      breakdown: {
        positionPts: 0,
        archetypePts: 0,
        technicalPts: 0,
        channelDemandPts: 0,
        signalsTriggered: ["Top 3 (Bloqueado pelo Critério P)"],
      },
    };
  }

  // 1. Pontuação de Posição no Maps (máx. 20 pts)
  const positionPts =
    signals.observedPosition <= 5
      ? 20
      : signals.observedPosition <= 10
        ? 15
        : 10;

  // 2. Pontuação de Arquétipo / Prioridade Empírica (máx. 20 pts)
  const archetypePts =
    signals.archetypeTier === 1
      ? 20
      : signals.archetypeTier === 2
        ? 15
        : signals.archetypeTier === 3
          ? 10
          : 5;

  // 3. Sinais Técnicos Auditáveis (máx. 50 pts)
  let technicalPts = 0;
  const signalsTriggered: string[] = [
    `Posição ${signals.observedPosition}º (+${positionPts})`,
    `Arquétipo Nível ${signals.archetypeTier} (+${archetypePts})`,
  ];

  if (signals.divergenciaD) {
    technicalPts += 15;
    signalsTriggered.push("D: Divergência Cadastral (+15)");
  }
  if (signals.falhaCanalWhatsApp) {
    technicalPts += 15;
    signalsTriggered.push("WA: Sem WhatsApp direto no Maps (+15)");
  }
  if (signals.semCatalogoOuNaoReivindicado) {
    technicalPts += 10;
    signalsTriggered.push("U/C: Sem Catálogo ou Não Reivindicado (+10)");
  }
  if (signals.horarioOuReviewsSemResposta) {
    technicalPts += 5;
    signalsTriggered.push("H/R: Horário Oculto ou Reviews s/ Resposta (+5)");
  }
  if (signals.linkQuebradoL) {
    technicalPts += 5;
    signalsTriggered.push("L: Link/Site Quebrado ou Ausente (+5)");
  }

  // 4. Canal WhatsApp + Demanda de Mercado (máx. 10 pts)
  let channelDemandPts = 0;
  if (signals.whatsappConfirmed) {
    channelDemandPts = signals.monthlySearchVolume >= 1500 ? 10 : 5;
    signalsTriggered.push(
      `Canal WA + Demanda ${signals.monthlySearchVolume >= 1500 ? ">=1.5k" : "<1.5k"} (+${channelDemandPts})`
    );
  }

  const totalScore = Math.min(
    100,
    positionPts + archetypePts + technicalPts + channelDemandPts
  );

  let tier: "A" | "B" | "C" | "D" = "D";
  let priorityTag = "Baixa Prioridade";

  if (totalScore >= 75) {
    tier = "A";
    priorityTag = "Prioridade Imediata Hoje";
  } else if (totalScore >= 60) {
    tier = "B";
    priorityTag = "Alta Qualificação";
  } else if (totalScore >= 40) {
    tier = "C";
    priorityTag = "Fila Secundária";
  }

  return {
    score: totalScore,
    tier,
    classLabel: `Classe ${tier} (${totalScore} pts)`,
    priorityTag,
    eligible: true,
    breakdown: {
      positionPts,
      archetypePts,
      technicalPts,
      channelDemandPts,
      signalsTriggered,
    },
  };
}

/**
 * Extrai sinais determinísticos para leads legados (Rodadas 02 e 03) sem sobrescrever leads
 * que já carregam `deterministicSignals` auditados diretamente (Rodada 04+).
 */
export function resolveLeadScore(lead: ProspectLead): DeterministicScoreResult {
  if (lead.stage === "perdido_invalido") {
    return {
      score: 0,
      tier: "D",
      classLabel: "Descartado (0 pts)",
      priorityTag: "Contato Inválido",
      eligible: false,
      breakdown: {
        positionPts: 0,
        archetypePts: 0,
        technicalPts: 0,
        channelDemandPts: 0,
        signalsTriggered: ["Descartado na triagem de canal"],
      },
    };
  }

  if (lead.deterministicSignals) {
    return calculateDeterministicScore(lead.deterministicSignals);
  }

  const issue = (lead.opportunityIssue || "").toLowerCase();
  const canal = (lead.canalStatus || "").toLowerCase();

  const inferred: DeterministicAuditSignals = {
    observedPosition: lead.observedPosition || 4,
    archetypeTier: resolveArchetypeTier(lead.segment),
    divergenciaD:
      issue.includes("divergência") ||
      issue.includes("divergentes") ||
      issue.includes("marca fechado") ||
      issue.includes("marca 24h") ||
      issue.includes("incorretamente"),
    falhaCanalWhatsApp:
      issue.includes("whatsapp") ||
      issue.includes("ligação") ||
      issue.includes("oculto") ||
      issue.includes("noturno") ||
      canal.includes("fixo"),
    semCatalogoOuNaoReivindicado:
      issue.includes("catálogo") ||
      issue.includes("reivindicar") ||
      issue.includes("categoria") ||
      issue.includes("confundido") ||
      issue.includes("cardápio") ||
      issue.includes("especialidades"),
    horarioOuReviewsSemResposta:
      issue.includes("avaliações") ||
      issue.includes("sem resposta") ||
      issue.includes("horário") ||
      issue.includes("desatualizado"),
    linkQuebradoL:
      !lead.siteUrl ||
      issue.includes("404") ||
      issue.includes("quebrado") ||
      issue.includes("sem site"),
    whatsappConfirmed: lead.whatsappConfirmed,
    monthlySearchVolume: parseMonthlySearchVolume(lead.monthlySearches),
  };

  return calculateDeterministicScore(inferred);
}
