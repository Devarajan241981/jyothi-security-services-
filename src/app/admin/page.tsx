import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { dict } = await getAdminDictionary();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalEnquiries,
    todaysEnquiries,
    totalApplications,
    activeGuards,
    totalClients,
    schools,
    industries,
    companies,
    pendingRequests,
    upcomingSalaries,
  ] = await Promise.all([
    supabase.from("enquiries").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .gte("created_at", startOfToday.toISOString()),
    supabase.from("job_applications").select("id", { count: "exact", head: true }),
    supabase
      .from("guards")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("type", "schools"),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("type", "industries"),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("type", "corporateOffices"),
    supabase
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("status", "new"),
    supabase
      .from("salaries")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "pending"),
  ]);

  const s = dict.dashboard.stats;
  const stats = [
    { label: s.totalEnquiries, value: totalEnquiries.count ?? 0, icon: "Inbox", tone: "primary" as const },
    { label: s.todaysEnquiries, value: todaysEnquiries.count ?? 0, icon: "CalendarCheck2", tone: "accent" as const },
    { label: s.totalApplications, value: totalApplications.count ?? 0, icon: "FileUser", tone: "primary" as const },
    { label: s.activeGuards, value: activeGuards.count ?? 0, icon: "Users", tone: "success" as const },
    { label: s.totalClients, value: totalClients.count ?? 0, icon: "Building2", tone: "primary" as const },
    { label: s.schools, value: schools.count ?? 0, icon: "GraduationCap", tone: "muted" as const },
    { label: s.industries, value: industries.count ?? 0, icon: "Factory", tone: "muted" as const },
    { label: s.companies, value: companies.count ?? 0, icon: "Landmark", tone: "muted" as const },
    { label: s.pendingRequests, value: pendingRequests.count ?? 0, icon: "Siren", tone: "accent" as const },
    { label: s.upcomingSalaries, value: upcomingSalaries.count ?? 0, icon: "Wallet", tone: "accent" as const },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.dashboard.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.dashboard.subtitle}</p>

      <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
