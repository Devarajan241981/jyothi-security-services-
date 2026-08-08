import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { GuardFormDialog } from "@/components/admin/guard-form-dialog";
import { GuardDocumentCard } from "@/components/admin/guard-document-card";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Guard Profile" };

const statusTone: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
  on_leave: "bg-accent/15 text-accent-foreground",
};

const attendanceTone: Record<string, string> = {
  present: "bg-success/10 text-success",
  absent: "bg-destructive/10 text-destructive",
  leave: "bg-accent/15 text-accent-foreground",
  late: "bg-secondary text-primary",
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function GuardProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { dict, locale } = await getAdminDictionary();
  const dateLocale = locale === "kn" ? "kn-IN" : "en-IN";
  const p = dict.pages.guardProfile;

  const [{ data: guard }, { data: clients }] = await Promise.all([
    supabase.from("guards").select("*").eq("id", id).single(),
    supabase.from("clients").select("id, name").order("name"),
  ]);

  if (!guard) notFound();

  const [{ data: attendance }, { data: salaries }, { data: assignments }] = await Promise.all([
    supabase
      .from("attendance")
      .select("*")
      .eq("guard_id", id)
      .order("attendance_date", { ascending: false })
      .limit(14),
    supabase
      .from("salaries")
      .select("*")
      .eq("guard_id", id)
      .order("salary_month", { ascending: false })
      .limit(6),
    supabase
      .from("assignments")
      .select("*, clients(name)")
      .eq("guard_id", id)
      .order("start_date", { ascending: false })
      .limit(10),
  ]);

  const clientName = clients?.find((c) => c.id === guard.current_client_id)?.name;

  return (
    <div>
      <Link
        href="/admin/guards"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {p.backToGuards}
      </Link>

      <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{guard.full_name}</h1>
            <Badge variant="secondary" className={statusTone[guard.status]}>
              {dict.labels.guardStatus[guard.status]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {guard.guard_code} · {guard.phone}
            {clientName ? ` · ${p.deployedAt} ${clientName}` : ""}
          </p>
        </div>
        <GuardFormDialog guard={guard} clients={clients ?? []} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">{p.profileDetails}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <Field label={p.fields.age} value={guard.age ?? "—"} />
            <Field label={p.fields.gender} value={dict.labels.gender[guard.gender]} />
            <Field label={p.fields.experience} value={guard.experience_years ? `${guard.experience_years} yrs` : "—"} />
            <Field label={p.fields.languages} value={guard.languages.join(", ") || "—"} />
            <Field label={p.fields.shift} value={dict.labels.shift[guard.shift]} />
            <Field label={p.fields.joiningDate} value={guard.joining_date} />
            <Field label={p.fields.location} value={guard.current_location ?? "—"} />
            <Field label={p.fields.salary} value={guard.salary ? currency.format(guard.salary) : "—"} />
            <Field label={p.fields.aadhaarNo} value={guard.aadhaar_number ?? "—"} />
            <Field label={p.fields.address} value={guard.address ?? "—"} className="col-span-2 sm:col-span-3" />
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">{p.documents}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{p.documentsHint}</p>
          <div className="mt-4 space-y-3">
            <GuardDocumentCard guardId={id} field="aadhaar_path" label={p.aadhaarCard} path={guard.aadhaar_path} />
            <GuardDocumentCard guardId={id} field="photo_path" label={p.photograph} path={guard.photo_path} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">{p.recentAttendance}</h2>
          <div className="mt-3 space-y-2">
            {attendance && attendance.length > 0 ? (
              attendance.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{a.attendance_date}</span>
                  <Badge variant="secondary" className={attendanceTone[a.status]}>
                    {dict.labels.attendanceStatus[a.status]}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{p.noAttendance}</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">{p.salaryHistory}</h2>
          <div className="mt-3 space-y-2">
            {salaries && salaries.length > 0 ? (
              salaries.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(s.salary_month).toLocaleDateString(dateLocale, {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-medium text-foreground">{currency.format(s.net_salary)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{p.noSalary}</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">{p.assignmentHistory}</h2>
          <div className="mt-3 space-y-2">
            {assignments && assignments.length > 0 ? (
              assignments.map((a) => (
                <div key={a.id} className="text-sm">
                  <p className="font-medium text-foreground">
                    {(a as unknown as { clients: { name: string } | null }).clients?.name ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.start_date} → {a.end_date ?? p.ongoing} · {dict.labels.shift[a.shift]}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{p.noAssignments}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}
