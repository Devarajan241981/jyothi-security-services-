import { createClient } from "@/lib/supabase/server";
import { AssignmentsTable } from "@/components/admin/assignments-table";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Assignments" };

export default async function AdminAssignmentsPage() {
  const supabase = await createClient();
  const { dict } = await getAdminDictionary();

  const [{ data: assignments }, { data: guards }, { data: clients }] = await Promise.all([
    supabase.from("assignments").select("*").order("start_date", { ascending: false }),
    supabase.from("guards").select("id, full_name, guard_code").order("full_name"),
    supabase.from("clients").select("id, name").order("name"),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.assignments.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.assignments.subtitle}</p>
      <div className="mt-6">
        <AssignmentsTable
          assignments={assignments ?? []}
          guards={guards ?? []}
          clients={clients ?? []}
        />
      </div>
    </div>
  );
}
