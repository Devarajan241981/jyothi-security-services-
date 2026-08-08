import { createClient } from "@/lib/supabase/server";
import { SalariesTable } from "@/components/admin/salaries-table";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Salary" };

export default async function AdminSalaryPage() {
  const supabase = await createClient();
  const { dict } = await getAdminDictionary();

  const [{ data: salaries }, { data: guards }] = await Promise.all([
    supabase.from("salaries").select("*").order("salary_month", { ascending: false }),
    supabase.from("guards").select("id, full_name, guard_code, salary").order("full_name"),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.salary.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.salary.subtitle}</p>
      <div className="mt-6">
        <SalariesTable salaries={salaries ?? []} guards={guards ?? []} />
      </div>
    </div>
  );
}
