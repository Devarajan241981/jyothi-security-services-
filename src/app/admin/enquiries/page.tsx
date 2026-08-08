import { createClient } from "@/lib/supabase/server";
import { EnquiriesTable } from "@/components/admin/enquiries-table";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Enquiries" };

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  const { dict } = await getAdminDictionary();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.enquiries.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.enquiries.subtitle}</p>
      <div className="mt-6">
        <EnquiriesTable enquiries={enquiries ?? []} />
      </div>
    </div>
  );
}
