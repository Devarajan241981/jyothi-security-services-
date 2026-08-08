"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { success: true } | { success: false; error: string };

export async function markNotificationRead(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function clearAllNotifications(): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("notifications").delete().not("id", "is", null);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin", "layout");
  return { success: true };
}
