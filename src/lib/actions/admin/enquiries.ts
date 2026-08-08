"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EnquiryStatus } from "@/types/database";

export type ActionResult = { success: true } | { success: false; error: string };

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { success: true };
}

// Soft delete: archives the enquiry instead of destroying it, so its phone
// number stays reachable later if JSS expands into that area.
export async function deleteEnquiry(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { success: true };
}

export async function restoreEnquiry(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").update({ deleted_at: null }).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { success: true };
}

export async function permanentlyDeleteEnquiry(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { success: true };
}
