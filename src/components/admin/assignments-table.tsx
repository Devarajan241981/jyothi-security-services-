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
import { AssignmentFormDialog } from "@/components/admin/assignment-form-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { InlineStatusSelect } from "@/components/admin/inline-status-select";
import { deleteAssignment, updateAssignmentStatus } from "@/lib/actions/admin/assignments";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
type Guard = Pick<Database["public"]["Tables"]["guards"]["Row"], "id" | "full_name" | "guard_code">;
type Client = Pick<Database["public"]["Tables"]["clients"]["Row"], "id" | "name">;

export function AssignmentsTable({
  assignments,
  guards,
  clients,
}: {
  assignments: Assignment[];
  guards: Guard[];
  clients: Client[];
}) {
  const { dict } = useAdminDict();
  const t = dict.tables.assignments;
  const statusOptions = [
    { value: "active" as const, label: dict.labels.assignmentStatus.active },
    { value: "completed" as const, label: dict.labels.assignmentStatus.completed },
    { value: "cancelled" as const, label: dict.labels.assignmentStatus.cancelled },
  ];
  const guardById = useMemo(() => new Map(guards.map((g) => [g.id, g])), [guards]);
  const clientById = useMemo(() => new Map(clients.map((c) => [c.id, c])), [clients]);

  return (
    <div>
      <div className="flex justify-end">
        <AssignmentFormDialog guards={guards} clients={clients} />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.colGuard}</TableHead>
              <TableHead>{t.colClient}</TableHead>
              <TableHead>{t.colShift}</TableHead>
              <TableHead>{t.colLocation}</TableHead>
              <TableHead>{t.colStart}</TableHead>
              <TableHead>{t.colEnd}</TableHead>
              <TableHead>{t.colStatus}</TableHead>
              <TableHead className="text-right">{t.colActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  {t.noAssignments}
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">
                    {guardById.get(a.guard_id)?.full_name ?? "—"}
                  </TableCell>
                  <TableCell>{clientById.get(a.client_id)?.name ?? "—"}</TableCell>
                  <TableCell className="capitalize">{dict.labels.shift[a.shift]}</TableCell>
                  <TableCell>{a.location ?? "—"}</TableCell>
                  <TableCell>{a.start_date}</TableCell>
                  <TableCell>{a.end_date ?? "—"}</TableCell>
                  <TableCell>
                    <InlineStatusSelect
                      value={a.status}
                      options={statusOptions}
                      onChange={(status) => updateAssignmentStatus(a.id, status)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <ConfirmDeleteButton
                        itemLabel={guardById.get(a.guard_id)?.full_name ?? ""}
                        onConfirm={() => deleteAssignment(a.id)}
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
