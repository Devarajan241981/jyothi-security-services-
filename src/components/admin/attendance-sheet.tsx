"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InlineStatusSelect } from "@/components/admin/inline-status-select";
import { markAttendance } from "@/lib/actions/admin/attendance";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { AttendanceStatus, Database } from "@/types/database";

type Guard = Pick<Database["public"]["Tables"]["guards"]["Row"], "id" | "full_name" | "guard_code" | "status">;

export function AttendanceSheet({
  date,
  guards,
  attendanceByGuard,
}: {
  date: string;
  guards: Guard[];
  attendanceByGuard: Map<string, AttendanceStatus>;
}) {
  const router = useRouter();
  const { dict } = useAdminDict();
  const t = dict.tables.attendance;
  const statusOptions = [
    { value: "present" as const, label: dict.labels.attendanceStatus.present },
    { value: "absent" as const, label: dict.labels.attendanceStatus.absent },
    { value: "leave" as const, label: dict.labels.attendanceStatus.leave },
    { value: "late" as const, label: dict.labels.attendanceStatus.late },
  ];

  return (
    <div>
      <div className="max-w-xs space-y-1.5">
        <Label>{t.date}</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => router.push(`/admin/attendance?date=${e.target.value}`)}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.colGuardId}</TableHead>
              <TableHead>{t.colName}</TableHead>
              <TableHead>{t.colStatus}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                  {t.noActiveGuards}
                </TableCell>
              </TableRow>
            ) : (
              guards.map((guard) => (
                <TableRow key={guard.id}>
                  <TableCell className="font-medium">{guard.guard_code}</TableCell>
                  <TableCell>{guard.full_name}</TableCell>
                  <TableCell>
                    <InlineStatusSelect
                      value={attendanceByGuard.get(guard.id) ?? "present"}
                      options={statusOptions}
                      onChange={(status) => markAttendance(guard.id, date, status)}
                    />
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
