"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type AssignmentInsert = Database["public"]["Tables"]["assignments"]["Insert"];

export type ActionResult = { success: true } | { success: false; error: string };

export async function createAssignment(input: AssignmentInsert): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("assignments").insert(input);
  if (error) return { success: false, error: error.message };

  await supabase
    .from("guards")
    .update({ current_client_id: input.client_id, current_location: input.location ?? null, shift: input.shift })
    .eq("id", input.guard_id);

  revalidatePath("/admin/assignments");
  revalidatePath("/admin/guards");
  return { success: true };
}

export async function updateAssignmentStatus(
  id: string,
  status: Database["public"]["Tables"]["assignments"]["Row"]["status"],
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("assignments").update({ status }).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/assignments");
  return { success: true };
}

export async function deleteAssignment(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("assignments").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/assignments");
  return { success: true };
}
