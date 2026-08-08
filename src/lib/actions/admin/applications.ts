"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/types/database";

export type ActionResult = { success: true } | { success: false; error: string };

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("job_applications").update({ status }).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("job_applications").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  return { success: true };
}

export async function getApplicationFileUrl(
  path: string,
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("applications")
    .createSignedUrl(path, 60 * 5);

  if (error || !data) return { error: "Could not generate file link." };
  return { url: data.signedUrl };
}
