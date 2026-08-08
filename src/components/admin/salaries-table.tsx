"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalaryFormDialog } from "@/components/admin/salary-form-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { InlineStatusSelect } from "@/components/admin/inline-status-select";
import { deleteSalary, updateSalaryPaymentStatus } from "@/lib/actions/admin/salaries";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Salary = Database["public"]["Tables"]["salaries"]["Row"];
type Guard = Pick<Database["public"]["Tables"]["guards"]["Row"], "id" | "full_name" | "guard_code" | "salary">;

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function SalariesTable({ salaries, guards }: { salaries: Salary[]; guards: Guard[] }) {
  const { dict, locale } = useAdminDict();
  const dateLocale = locale === "kn" ? "kn-IN" : "en-IN";
  const t = dict.tables.salary;
  const statusOptions = [
    { value: "pending" as const, label: dict.labels.salaryStatus.pending },
    { value: "paid" as const, label: dict.labels.salaryStatus.paid },
  ];
  const guardById = useMemo(() => new Map(guards.map((g) => [g.id, g])), [guards]);

  return (
    <div>
      <div className="flex justify-end">
        <SalaryFormDialog guards={guards} />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.colGuard}</TableHead>
              <TableHead>{t.colMonth}</TableHead>
              <TableHead>{t.colBase}</TableHead>
              <TableHead>{t.colBonus}</TableHead>
              <TableHead>{t.colDeduction}</TableHead>
              <TableHead>{t.colNet}</TableHead>
              <TableHead>{t.colStatus}</TableHead>
              <TableHead className="text-right">{t.colActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  {t.noSalaryRecords}
                </TableCell>
              </TableRow>
            ) : (
              salaries.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    {guardById.get(s.guard_id)?.full_name ?? "—"}
                  </TableCell>
                  <TableCell>
                    {new Date(s.salary_month).toLocaleDateString(dateLocale, { month: "long", year: "numeric" })}
                  </TableCell>
                  <TableCell>{currency.format(s.base_salary)}</TableCell>
                  <TableCell>{currency.format(s.bonus)}</TableCell>
                  <TableCell>{currency.format(s.deduction)}</TableCell>
                  <TableCell className="font-semibold">{currency.format(s.net_salary)}</TableCell>
                  <TableCell>
                    <InlineStatusSelect
                      value={s.payment_status}
                      options={statusOptions}
                      onChange={(status) => updateSalaryPaymentStatus(s.id, status)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <ConfirmDeleteButton itemLabel={guardById.get(s.guard_id)?.full_name ?? ""} onConfirm={() => deleteSalary(s.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
