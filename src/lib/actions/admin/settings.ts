"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type SettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];

export type ActionResult = { success: true } | { success: false; error: string };

export async function updateSiteSettings(input: SettingsUpdate): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update(input).eq("id", 1);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/settings");
  return { success: true };
}
