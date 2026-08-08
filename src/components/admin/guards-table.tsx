"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GuardFormDialog } from "@/components/admin/guard-form-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteGuard } from "@/lib/actions/admin/guards";
import { GUARD_STATUS_LABELS } from "@/lib/constants/admin";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Guard = Database["public"]["Tables"]["guards"]["Row"];
type Client = Pick<Database["public"]["Tables"]["clients"]["Row"], "id" | "name">;

const statusTone: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
  on_leave: "bg-accent/15 text-accent-foreground",
};

function toCsv(guards: Guard[], clientNameById: Map<string, string>) {
  const headers = [
    "Guard ID", "Name", "Phone", "Company", "Location", "Shift",
    "Languages", "Age", "Experience (yrs)", "Joining Date", "Salary", "Status",
  ];
  const rows = guards.map((g) => [
    g.guard_code,
    g.full_name,
    g.phone,
    g.current_client_id ? clientNameById.get(g.current_client_id) ?? "" : "",
    g.current_location ?? "",
    g.shift,
    g.languages.join("; "),
    g.age ?? "",
    g.experience_years ?? "",
    g.joining_date,
    g.salary ?? "",
    GUARD_STATUS_LABELS[g.status],
  ]);
  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function GuardsTable({ guards, clients }: { guards: Guard[]; clients: Client[] }) {
  const [query, setQuery] = useState("");
  const { dict } = useAdminDict();
  const clientNameById = useMemo(() => new Map(clients.map((c) => [c.id, c.name])), [clients]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guards;
    return guards.filter((g) =>
      [g.full_name, g.phone, g.guard_code, g.current_location, clientNameById.get(g.current_client_id ?? "")]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q)),
    );
  }, [guards, query, clientNameById]);

  function exportCsv() {
    const csv = toCsv(filtered, clientNameById);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jss-guards-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.tables.guards.searchPlaceholder}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={exportCsv}>
            <Download className="size-4" />
            {dict.tables.guards.exportCsv}
          </Button>
          <GuardFormDialog clients={clients} />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.tables.guards.colGuardId}</TableHead>
              <TableHead>{dict.tables.guards.colName}</TableHead>
              <TableHead>{dict.tables.guards.colPhone}</TableHead>
              <TableHead>{dict.tables.guards.colCompany}</TableHead>
              <TableHead>{dict.tables.guards.colLocation}</TableHead>
              <TableHead>{dict.tables.guards.colShift}</TableHead>
              <TableHead>{dict.tables.guards.colStatus}</TableHead>
              <TableHead className="text-right">{dict.tables.guards.colActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  {dict.tables.guards.noGuards}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((guard) => (
                <TableRow key={guard.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/guards/${guard.id}`} className="hover:underline">
                      {guard.guard_code}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/guards/${guard.id}`} className="hover:underline">
                      {guard.full_name}
                    </Link>
                  </TableCell>
                  <TableCell>{guard.phone}</TableCell>
                  <TableCell>
                    {guard.current_client_id ? clientNameById.get(guard.current_client_id) ?? "—" : "—"}
                  </TableCell>
                  <TableCell>{guard.current_location ?? "—"}</TableCell>
                  <TableCell className="capitalize">{dict.labels.shift[guard.shift]}</TableCell>
                  <TableCell>
                    <Badge className={statusTone[guard.status]} variant="secondary">
                      {dict.labels.guardStatus[guard.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <GuardFormDialog guard={guard} clients={clients} />
                      <ConfirmDeleteButton
                        itemLabel={`${guard.full_name}`}
                        onConfirm={() => deleteGuard(guard.id)}
                      />
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
