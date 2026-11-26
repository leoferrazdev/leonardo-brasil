import type { ProspectLead } from "../types";

/**
 * Retorna a chave de data local no formato YYYY-MM-DD.
 */
export function getLocalDateKey(input?: string | Date): string {
  if (!input) return "";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-CA");
}

/**
 * Contabiliza de forma determinística quantos leads novos foram contatados na data de hoje.
 */
export function countContactedToday(leads: ProspectLead[], referenceDate: Date = new Date()): number {
  const todayKey = getLocalDateKey(referenceDate);
  return leads.filter((lead) => {
    if (lead.contactedAt) {
      return getLocalDateKey(lead.contactedAt) === todayKey;
    }
    return lead.stage === "contatado" && getLocalDateKey(lead.updatedAt) === todayKey;
  }).length;
}
