import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isHubConfigured } from "./config";

let hubClient: SupabaseClient | null = null;

export function getHubAdmin(): SupabaseClient {
  const url = process.env.HUB_SUPABASE_URL;
  const key = process.env.HUB_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Hub no configurado. Define HUB_SUPABASE_URL y HUB_SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  if (!hubClient) {
    hubClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return hubClient;
}

export { isHubConfigured };
