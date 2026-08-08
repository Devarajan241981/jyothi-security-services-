import { createClient } from "@/lib/supabase/server";
import { GuardsTable } from "@/components/admin/guards-table";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Security Guards" };

export default async function AdminGuardsPage() {
  const supabase = await createClient();
  const { dict } = await getAdminDictionary();

  const [{ data: guards }, { data: clients }] = await Promise.all([
    supabase.from("guards").select("*").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name").order("name"),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.guards.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.guards.subtitle}</p>
      <div className="mt-6">
        <GuardsTable guards={guards ?? []} clients={clients ?? []} />
      </div>
    </div>
  );
}
