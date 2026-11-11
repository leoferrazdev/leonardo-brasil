import type { ProspectLead } from "../types";

export const FOLLOW_UP_CNPJ_DATA = {
  razaoSocial: "LEONARDO FERRAZ DA SILVA BRASIL",
  cnpj: "65.993.728/0001-07",
  pixKey: "65.993.728/0001-07",
} as const;

export function buildDefaultFollowUpMessage(lead: ProspectLead): string {
  const shortName = lead.name.split(" - ")[0].trim() || lead.name;
  const keywordPart = lead.searchKeyword
    ? `para "${lead.searchKeyword}"${lead.monthlySearches ? ` (~${lead.monthlySearches} buscas/mês)` : ""}`
    : `na região de ${lead.neighborhood}`;
  const positionPart = lead.observedPosition
    ? `em *${lead.observedPosition}º lugar* `
    : "";
  const localRef = lead.address
    ? lead.address.split(" - ")[0].trim()
    : lead.neighborhood || "o seu endereço";

  return [
    `Oi! Tudo bem? Passando aqui para retomar a conversa sobre o perfil da empresa *${shortName}* no Google Maps.`,
    ``,
    `A ficha segue ${positionPart}${keywordPart}, ainda fora dos 3 primeiros resultados que concentram os cliques no celular. Com a implantação completa (*R$ 497,00* à vista no Pix ou *2x de R$ 250,00*, 100% pontual e sem mensalidade, entregue em 3 a 5 dias úteis), um único cliente novo vindo do Top 3 já paga todo o ajuste.`,
    ``,
    `Para você fechar com 100% de segurança e transparência:`,
    `• *Pagamento no meu CNPJ:* realizado direto na conta bancária jurídica de *${FOLLOW_UP_CNPJ_DATA.razaoSocial}* (*CNPJ ${FOLLOW_UP_CNPJ_DATA.cnpj}*), sendo a *chave Pix o próprio CNPJ ${FOLLOW_UP_CNPJ_DATA.pixKey}*;`,
    `• *Chamada de vídeo antes do pagamento:* se você preferir validar tudo olhando olho no olho antes do Pix, eu faço uma chamada de vídeo rápida mostrando os pontos na tela;`,
    `• *Visita presencial:* e, em último caso, como atendo em ${lead.city || "Porto Alegre"}, posso ir pessoalmente até ${localRef} para alinhar os detalhes e fechar negócio.`,
    ``,
    `Como prefere seguir hoje: iniciar direto pelo WhatsApp, fazer uma chamada de vídeo rápida ou prefere que eu passe aí?`,
  ].join("\n");
}

export function resolveFollowUpMessage(lead: ProspectLead): string {
  const custom = lead.blocoFollowUp?.trim();
  return custom ? custom : buildDefaultFollowUpMessage(lead);
}
