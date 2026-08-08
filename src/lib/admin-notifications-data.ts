import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

const EMPTY_RESULT = {
  notifications: [] as Notification[],
  unreadCount: 0,
  attendanceReminderCount: 0,
  salaryReminderCount: 0,
};

// Defensive by design: this runs on every admin page load, so a missing
// `notifications` table (e.g. before that migration has been run yet) or any
// other unexpected failure here must never take down the whole admin panel.
export async function getAdminNotificationData() {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = `${today.slice(0, 7)}-01`;

    const [
      { data: notifications },
      { data: activeGuards },
      { data: todayAttendance },
      { data: monthSalaries },
    ] = await Promise.all([
      supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase.from("guards").select("id").eq("status", "active"),
      supabase.from("attendance").select("guard_id").eq("attendance_date", today),
      supabase.from("salaries").select("guard_id").eq("salary_month", monthStart),
    ]);

    const markedToday = new Set((todayAttendance ?? []).map((a) => a.guard_id));
    const paidThisMonth = new Set((monthSalaries ?? []).map((s) => s.guard_id));

    const attendanceReminderCount = (activeGuards ?? []).filter(
      (g) => !markedToday.has(g.id),
    ).length;
    const salaryReminderCount = (activeGuards ?? []).filter(
      (g) => !paidThisMonth.has(g.id),
    ).length;

    const unreadCount =
      (notifications ?? []).filter((n) => !n.is_read).length +
      (attendanceReminderCount > 0 ? 1 : 0) +
      (salaryReminderCount > 0 ? 1 : 0);

    return {
      notifications: notifications ?? [],
      unreadCount,
      attendanceReminderCount,
      salaryReminderCount,
    };
  } catch (err) {
    console.error("getAdminNotificationData failed:", err);
    return EMPTY_RESULT;
  }
}
