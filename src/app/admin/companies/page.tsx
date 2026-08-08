import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/icons/icon-map";
import { CLIENT_TYPES } from "@/lib/constants/admin";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Companies" };

const typeIcons: Record<(typeof CLIENT_TYPES)[number], string> = {
  schools: "GraduationCap",
  colleges: "BookOpen",
  hospitals: "HeartPulse",
  factories: "Cog",
  industries: "Factory",
  corporateOffices: "Building2",
  warehouses: "Warehouse",
  banks: "Landmark",
  hotels: "BedDouble",
  retailStores: "Store",
  shoppingMalls: "ShoppingBag",
  constructionCompanies: "HardHat",
  residentialCommunities: "Home",
  governmentOffices: "Landmark",
};

export default async function AdminCompaniesPage() {
  const supabase = await createClient();
  const { dict } = await getAdminDictionary();
  const { data: clients } = await supabase.from("clients").select("type, status");

  const counts = new Map<string, { total: number; active: number }>();
  for (const c of clients ?? []) {
    const entry = counts.get(c.type) ?? { total: 0, active: 0 };
    entry.total += 1;
    if (c.status === "active") entry.active += 1;
    counts.set(c.type, entry);
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.companies.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {dict.pages.companies.subtitle}{" "}
        <Link href="/admin/clients" className="text-primary underline">{dict.nav.clients}</Link>{" "}
        {dict.pages.companies.subtitleSuffix}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {CLIENT_TYPES.map((type) => {
          const entry = counts.get(type) ?? { total: 0, active: 0 };
          return (
            <div key={type} className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:gap-4 sm:p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary sm:size-11">
                <Icon name={typeIcons[type]} className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xl font-bold text-foreground sm:text-2xl">{entry.total}</p>
                <p className="text-xs font-medium break-words text-muted-foreground">
                  {dict.labels.clientType[type]} · {entry.active} {dict.pages.companies.activeCount}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
