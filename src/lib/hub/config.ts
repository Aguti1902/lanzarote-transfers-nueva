export type HubSiteId = "transfers" | "tours" | "experience";

/** Valor por defecto de esta web. Las otras dos usan el suyo. */
export const DEFAULT_HUB_SITE_ID: HubSiteId = "transfers";
export const DEFAULT_HUB_SITE_LABEL = "Lanzarote Transfers";

const SITE_LABELS: Record<HubSiteId, string> = {
  transfers: "Lanzarote Transfers",
  tours: "Lanzarote Tours",
  experience: "Lanzarote Experience Tours",
};

function normalizeSiteId(value: string | undefined): HubSiteId {
  const raw = (value || "").trim().toLowerCase();
  if (raw === "transfers" || raw === "tours" || raw === "experience") {
    return raw;
  }
  return DEFAULT_HUB_SITE_ID;
}

export function isHubConfigured(): boolean {
  return Boolean(
    process.env.HUB_SUPABASE_URL && process.env.HUB_SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getHubSiteId(): HubSiteId {
  return normalizeSiteId(
    process.env.HUB_SITE_ID || process.env.NEXT_PUBLIC_HUB_SITE_ID
  );
}

export function getHubSiteLabel(siteId = getHubSiteId()): string {
  const custom = process.env.HUB_SITE_LABEL?.trim();
  if (custom && siteId === getHubSiteId()) return custom;
  return SITE_LABELS[siteId] || DEFAULT_HUB_SITE_LABEL;
}
