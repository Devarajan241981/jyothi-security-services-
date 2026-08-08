"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type SalaryInsert = Database["public"]["Tables"]["salaries"]["Insert"];

export type ActionResult = { success: true } | { success: false; error: string };

export async function createSalary(input: SalaryInsert): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("salaries").insert(input);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/salary");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateSalaryPaymentStatus(
  id: string,
  payment_status: Database["public"]["Tables"]["salaries"]["Row"]["payment_status"],
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("salaries")
    .update({
      payment_status,
      payment_date: payment_status === "paid" ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/salary");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteSalary(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("salaries").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/salary");
  revalidatePath("/admin");
  return { success: true };
}
