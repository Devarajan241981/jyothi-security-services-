"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];

export type ActionResult = { success: true } | { success: false; error: string };

export async function createClientRecord(input: ClientInsert): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").insert(input);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/clients");
  revalidatePath("/admin/companies");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateClientRecord(
  id: string,
  input: Partial<ClientInsert>,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").update(input).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/clients");
  revalidatePath("/admin/companies");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteClientRecord(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/clients");
  revalidatePath("/admin/companies");
  revalidatePath("/admin");
  return { success: true };
}
