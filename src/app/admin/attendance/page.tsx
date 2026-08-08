import { createClient } from "@/lib/supabase/server";
import { AttendanceSheet } from "@/components/admin/attendance-sheet";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";
import type { AttendanceStatus } from "@/types/database";

export const metadata = { title: "Attendance" };

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ?? new Date().toISOString().slice(0, 10);

  const supabase = await createClient();
  const { dict } = await getAdminDictionary();
  const [{ data: guards }, { data: attendance }] = await Promise.all([
    supabase
      .from("guards")
      .select("id, full_name, guard_code, status")
      .eq("status", "active")
      .order("full_name"),
    supabase.from("attendance").select("guard_id, status").eq("attendance_date", date),
  ]);

  const attendanceByGuard = new Map<string, AttendanceStatus>(
    (attendance ?? []).map((a) => [a.guard_id, a.status]),
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.attendance.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.attendance.subtitle}</p>
      <div className="mt-6">
        <AttendanceSheet date={date} guards={guards ?? []} attendanceByGuard={attendanceByGuard} />
      </div>
    </div>
  );
}
