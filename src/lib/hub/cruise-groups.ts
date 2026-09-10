import type { CruiseGroup } from "@/types";
import { getHubAdmin } from "./client";
import { isHubConfigured } from "./config";

export async function listHubCruiseGroups(): Promise<CruiseGroup[] | null> {
  if (!isHubConfigured()) return null;
  const { data, error } = await getHubAdmin()
    .from("hub_cruise_groups")
    .select("payload")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[hub] cruise groups list failed", error.message);
    return null;
  }
  return (data ?? []).map((row) => row.payload as CruiseGroup);
}

export async function upsertHubCruiseGroup(
  group: CruiseGroup
): Promise<CruiseGroup | null> {
  if (!isHubConfigured()) return null;
  const { error } = await getHubAdmin()
    .from("hub_cruise_groups")
    .upsert(
      {
        id: group.id,
        payload: group,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  if (error) {
    console.error("[hub] cruise group upsert failed", group.id, error.message);
    return null;
  }
  return group;
}

export async function deleteHubCruiseGroup(id: string): Promise<boolean | null> {
  if (!isHubConfigured()) return null;
  const { error } = await getHubAdmin()
    .from("hub_cruise_groups")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("[hub] cruise group delete failed", id, error.message);
    return null;
  }
  return true;
}

export async function seedHubCruiseGroups(groups: CruiseGroup[]): Promise<void> {
  if (!isHubConfigured() || groups.length === 0) return;
  for (const group of groups) {
    await upsertHubCruiseGroup(group);
  }
}
