// Métricas en vivo de Meta Ads para el CRM.
// Usa META_ADS_TOKEN. Consulta las campañas ACTIVAS (GET /campaigns excluye las
// eliminadas) con sus insights, así el panel refleja solo lo que está corriendo.

const AD_ACCOUNT = "act_801039936287201";
const GRAPH = "https://graph.facebook.com/v21.0";

export interface AdsCampaign {
  name: string;
  status: string;
  spend: number;
  reach: number;
  impressions: number;
  clicks: number;
  linkClicks: number;
  messages: number;
}

export interface AdsMetrics {
  ok: boolean;
  error?: string;
  spend: number;
  reach: number;
  impressions: number;
  clicks: number;
  linkClicks: number;
  messages: number;
  campaigns: AdsCampaign[];
}

interface Action {
  action_type: string;
  value: string;
}
interface InsightRow {
  spend?: string;
  reach?: string;
  impressions?: string;
  clicks?: string;
  inline_link_clicks?: string;
  actions?: Action[];
}
interface CampRow {
  name: string;
  effective_status: string;
  insights?: { data?: InsightRow[] };
}
interface CampResponse {
  data?: CampRow[];
  error?: { message: string };
}

const n = (v?: string): number => (v ? Number(v) : 0);

// Suma las conversaciones de mensajería iniciadas (métrica de Click-to-WhatsApp).
function messagesFrom(actions?: Action[]): number {
  if (!actions) return 0;
  return actions
    .filter(
      (a) =>
        a.action_type.includes("messaging_conversation_started") ||
        a.action_type === "onsite_conversion.total_messaging_connection",
    )
    .reduce((s, a) => s + n(a.value), 0);
}

function labelStatus(s: string): string {
  const map: Record<string, string> = {
    ACTIVE: "Activa",
    PAUSED: "Pausada",
    IN_PROCESS: "En revisión",
    PENDING_REVIEW: "En revisión",
    WITH_ISSUES: "Con problemas",
    CAMPAIGN_PAUSED: "Pausada",
    ADSET_PAUSED: "Pausada",
  };
  return map[s] ?? s;
}

export async function getAdsMetrics(): Promise<AdsMetrics> {
  const empty: AdsMetrics = {
    ok: false,
    spend: 0,
    reach: 0,
    impressions: 0,
    clicks: 0,
    linkClicks: 0,
    messages: 0,
    campaigns: [],
  };

  const token = process.env.META_ADS_TOKEN;
  if (!token) return { ...empty, error: "Falta META_ADS_TOKEN en el servidor." };

  try {
    const fields =
      "name,effective_status,insights.date_preset(maximum){spend,reach,impressions,clicks,inline_link_clicks,actions}";
    const url = `${GRAPH}/${AD_ACCOUNT}/campaigns?fields=${encodeURIComponent(fields)}&limit=50&access_token=${token}`;
    const res = await fetch(url, { cache: "no-store" });
    const json: CampResponse = await res.json();
    if (json.error) return { ...empty, error: json.error.message };

    const campaigns: AdsCampaign[] = (json.data ?? []).map((c) => {
      const row = c.insights?.data?.[0] ?? {};
      return {
        name: c.name,
        status: labelStatus(c.effective_status),
        spend: n(row.spend),
        reach: n(row.reach),
        impressions: n(row.impressions),
        clicks: n(row.clicks),
        linkClicks: n(row.inline_link_clicks),
        messages: messagesFrom(row.actions),
      };
    });

    const tot = campaigns.reduce(
      (a, c) => ({
        spend: a.spend + c.spend,
        reach: a.reach + c.reach,
        impressions: a.impressions + c.impressions,
        clicks: a.clicks + c.clicks,
        linkClicks: a.linkClicks + c.linkClicks,
        messages: a.messages + c.messages,
      }),
      { spend: 0, reach: 0, impressions: 0, clicks: 0, linkClicks: 0, messages: 0 },
    );

    return { ok: true, ...tot, campaigns };
  } catch (e) {
    return { ...empty, error: e instanceof Error ? e.message : "Error consultando Meta." };
  }
}
