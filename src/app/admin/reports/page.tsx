import { createClient } from "@/lib/supabase/server";
import { EnquiriesTrendChart, DistributionPieChart } from "@/components/admin/reports-charts";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Reports" };

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { dict, locale } = await getAdminDictionary();
  const dateLocale = locale === "kn" ? "kn-IN" : "en-IN";

  const since = new Date();
  since.setDate(since.getDate() - 13);

  const [{ data: enquiries }, { data: guards }, { data: applications }] = await Promise.all([
    supabase.from("enquiries").select("created_at").gte("created_at", since.toISOString()),
    supabase.from("guards").select("status"),
    supabase.from("job_applications").select("status"),
  ]);

  const trendMap = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    trendMap.set(d.toLocaleDateString(dateLocale, { day: "2-digit", month: "short" }), 0);
  }
  for (const e of enquiries ?? []) {
    const key = new Date(e.created_at).toLocaleDateString(dateLocale, { day: "2-digit", month: "short" });
    trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
  }
  const trendData = Array.from(trendMap, ([day, count]) => ({ day, count }));

  const guardStatusCounts = new Map<string, number>();
  for (const g of guards ?? []) {
    guardStatusCounts.set(g.status, (guardStatusCounts.get(g.status) ?? 0) + 1);
  }
  const guardStatusData = Array.from(guardStatusCounts, ([name, value]) => ({
    name: dict.labels.guardStatus[name as keyof typeof dict.labels.guardStatus] ?? name,
    value,
  }));

  const applicationStatusCounts = new Map<string, number>();
  for (const a of applications ?? []) {
    applicationStatusCounts.set(a.status, (applicationStatusCounts.get(a.status) ?? 0) + 1);
  }
  const applicationStatusData = Array.from(applicationStatusCounts, ([name, value]) => ({
    name: dict.labels.applicationStatus[name as keyof typeof dict.labels.applicationStatus] ?? name,
    value,
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.reports.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.reports.subtitle}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">{dict.pages.reports.enquiriesTrend}</h2>
          <div className="mt-2">
            <EnquiriesTrendChart data={trendData} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">{dict.pages.reports.guardsByStatus}</h2>
          <div className="mt-2">
            <DistributionPieChart data={guardStatusData} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">{dict.pages.reports.applicationsByStatus}</h2>
          <div className="mt-2">
            <DistributionPieChart data={applicationStatusData} />
          </div>
        </div>
      </div>
    </div>
  );
}
