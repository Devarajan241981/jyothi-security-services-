"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type EventInsert = Database["public"]["Tables"]["calendar_events"]["Insert"];

export type ActionResult = { success: true } | { success: false; error: string };

export async function createCalendarEvent(input: EventInsert): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("calendar_events").insert(input);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/calendar");
  return { success: true };
}

export async function deleteCalendarEvent(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("calendar_events").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/calendar");
  return { success: true };
}
