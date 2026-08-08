import { createClient } from "@/lib/supabase/server";
import { ClientsTable } from "@/components/admin/clients-table";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Clients" };

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { dict } = await getAdminDictionary();

  const [{ data: clients }, { data: guards }] = await Promise.all([
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    supabase.from("guards").select("current_client_id"),
  ]);

  const guardCountByClient = new Map<string, number>();
  for (const g of guards ?? []) {
    if (!g.current_client_id) continue;
    guardCountByClient.set(g.current_client_id, (guardCountByClient.get(g.current_client_id) ?? 0) + 1);
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.clients.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.clients.subtitle}</p>
      <div className="mt-6">
        <ClientsTable clients={clients ?? []} guardCountByClient={guardCountByClient} />
      </div>
    </div>
  );
}
