"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AttendanceStatus } from "@/types/database";

export type ActionResult = { success: true } | { success: false; error: string };

export async function markAttendance(
  guardId: string,
  date: string,
  status: AttendanceStatus,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("attendance")
    .upsert(
      { guard_id: guardId, attendance_date: date, status },
      { onConflict: "guard_id,attendance_date" },
    );

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/attendance");
  return { success: true };
}
