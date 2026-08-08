import { createClient } from "@/lib/supabase/server";
import { ApplicationsTable } from "@/components/admin/applications-table";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Job Applications" };

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const { dict } = await getAdminDictionary();
  const { data: applications } = await supabase
    .from("job_applications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.applications.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.applications.subtitle}</p>
      <div className="mt-6">
        <ApplicationsTable applications={applications ?? []} />
      </div>
    </div>
  );
}
