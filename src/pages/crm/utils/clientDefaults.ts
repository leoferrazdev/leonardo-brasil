import type {
  ChecklistBeforeStatus,
  ChecklistCurrentStatus,
  ClientPillar,
  ClientServicesScope,
  ImpactLevel,
  WebsiteMode,
} from "../clientTypes";
import type { ProspectLead } from "../types";

export interface ChecklistDraftItem {
  client_id: string;
  pillar: ClientPillar;
  item_key: string;
  category_label: string;
  title: string;
  impact_level: ImpactLevel;
  before_status: ChecklistBeforeStatus;
  before_value: string | null;
  current_status: ChecklistCurrentStatus;
  current_value: string | null;
  sort_order: number;
  completed_at: string | null;
}

export function slugifyClientName(name: string): string {
  return (
    String(name || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64)
      .replace(/-+$/g, "") || "cliente"
  );
}

export function buildDefaultChecklistForScope(
  clientId: string,
  scope: ClientServicesScope,
): ChecklistDraftItem[] {
  const items: Omit<ChecklistDraftItem, "client_id" | "sort_order" | "completed_at">[] = [];

  if (scope.gbp) {
    items.push(
      {
        pillar: "gbp",
        item_key: "gbp_categories_services",
        category_label: "SEO Local & Categorias",
        title: "Categorias principal e secundárias + serviços nativos",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Categorias e serviços secundários ausentes",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_description_seo",
        category_label: "SEO Local",
        title: "Descrição comercial otimizada (bairros e especialidades)",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Descrição genérica ou desatualizada",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_social_profiles",
        category_label: "Cadastro & Redes",
        title: "Vínculo de perfis oficiais de redes sociais (Instagram/Facebook)",
        impact_level: "media",
        before_status: "ausente",
        before_value: "Redes sociais não vinculadas no GBP",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_links_utm_whatsapp",
        category_label: "Conversão & Links",
        title: "Site com UTM + link direto WhatsApp/Agendamento",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Links sem rastreamento ou ausentes",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_photos_facade_logo",
        category_label: "Mídia & Fachada",
        title: "Capa estratégica, logotipo limpo e fotos da fachada/equipe",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Capa inadequada ou ausência de foto externa",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_products_posts_qa",
        category_label: "Vitrine & Atividade",
        title: "Catálogo de Produtos, Posts recentes e Perguntas & Respostas",
        impact_level: "media",
        before_status: "ausente",
        before_value: "Vitrine vazia ou publicações antigas",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "gbp",
        item_key: "gbp_reviews_strategy",
        category_label: "Reputação",
        title: "Respostas estratégicas nas avaliações + link curto 5★",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Avaliações sem resposta ou resposta genérica",
        current_status: "pendente",
        current_value: null,
      },
    );
  }

  if (scope.website) {
    items.push(
      {
        pillar: "website",
        item_key: "site_health_urls_ssl",
        category_label: "Estrutura Site",
        title: "Correção de erros 404, HTTPS ativo e redirecionamentos 301",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "URLs legadas ou arquitetura one-page sem rotas de serviço",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "website",
        item_key: "site_local_seo_cta",
        category_label: "CRO & SEO Local",
        title: "Páginas por serviço + Schema LocalBusiness + botão fixo WhatsApp",
        impact_level: "alta",
        before_status: "ausente",
        before_value: "Sem páginas dedicadas por serviço/bairro ou tracking",
        current_status: "pendente",
        current_value: null,
      },
    );
  }

  if (scope.google_ads) {
    items.push(
      {
        pillar: "google_ads",
        item_key: "ads_hygiene_negatives",
        category_label: "Higiene Ads",
        title: "Desativar aplicação automática + listas de palavras negativas",
        impact_level: "alta",
        before_status: "incorreto",
        before_value: "Termos irrelevantes consumindo orçamento",
        current_status: "pendente",
        current_value: null,
      },
      {
        pillar: "google_ads",
        item_key: "ads_conversion_tracking",
        category_label: "Mensuração Ads",
        title: "Rastreamento de conversões (WhatsApp/Ligar) + extensão de local",
        impact_level: "alta",
        before_status: "incompleto",
        before_value: "Conversões incompletas ou conta desvinculada do GBP",
        current_status: "pendente",
        current_value: null,
      },
    );
  }

  return items.map((item, idx) => ({
    ...item,
    client_id: clientId,
    sort_order: idx + 1,
    completed_at: null,
  }));
}

export interface ClientFormPrefill {
  lead_id?: string;
  name: string;
  slug: string;
  segment: string;
  city: string;
  neighborhood: string;
  address: string;
  whatsapp: string;
  gbp: boolean;
  google_ads: boolean;
  website: boolean;
  website_mode: WebsiteMode;
  gbpMapsUrl: string;
  websiteDomain: string;
}

export function buildPrefillFromLead(lead: ProspectLead): ClientFormPrefill {
  const cleanPhone = String(lead.formattedPhone || lead.phone || "").replace(/\D+/g, "");
  const hasSite = Boolean(lead.siteUrl && lead.siteUrl.trim().length > 0);
  return {
    lead_id: lead.id,
    name: lead.name,
    slug: slugifyClientName(lead.name),
    segment: lead.segment || "Negócio Local",
    city: lead.city || "Porto Alegre",
    neighborhood: lead.neighborhood || "",
    address: lead.address || "",
    whatsapp: cleanPhone ? (cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`) : "",
    gbp: true,
    google_ads: false,
    website: hasSite,
    website_mode: hasSite ? "redesign" : "novo",
    gbpMapsUrl: lead.mapsUrl || "",
    websiteDomain: lead.siteUrl || "",
  };
}
