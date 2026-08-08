"use client";

import { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { InlineStatusSelect } from "@/components/admin/inline-status-select";
import {
  deleteApplication,
  getApplicationFileUrl,
  updateApplicationStatus,
} from "@/lib/actions/admin/applications";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants/admin";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { ApplicationStatus, Database } from "@/types/database";

type Application = Database["public"]["Tables"]["job_applications"]["Row"];

function FileLink({ path, label }: { path: string | null; label: string }) {
  if (!path) return <span className="text-xs text-muted-foreground">—</span>;

  return (
    <Button
      variant="link"
      size="sm"
      className="h-auto gap-1 p-0 text-xs"
      onClick={async () => {
        const result = await getApplicationFileUrl(path);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        window.open(result.url, "_blank", "noopener,noreferrer");
      }}
    >
      <FileText className="size-3.5" />
      {label}
    </Button>
  );
}

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  const [query, setQuery] = useState("");
  const { dict, locale } = useAdminDict();
  const dateLocale = locale === "kn" ? "kn-IN" : "en-IN";
  const t = dict.tables.applications;
  const statusOptions = (Object.keys(APPLICATION_STATUS_LABELS) as ApplicationStatus[]).map(
    (value) => ({ value, label: dict.labels.applicationStatus[value] }),
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((a) =>
      [a.full_name, a.phone, a.address].filter(Boolean).some((f) => f!.toLowerCase().includes(q)),
    );
  }, [applications, query]);

  return (
    <div>
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="pl-9"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.colApplied}</TableHead>
              <TableHead>{t.colName}</TableHead>
              <TableHead>{t.colAge}</TableHead>
              <TableHead>{t.colPhone}</TableHead>
              <TableHead>{t.colLanguages}</TableHead>
              <TableHead>{t.colAadhaar}</TableHead>
              <TableHead>{t.colStatus}</TableHead>
              <TableHead className="text-right">{t.colActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  {t.noApplications}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(application.created_at).toLocaleDateString(dateLocale)}
                  </TableCell>
                  <TableCell className="font-medium">{application.full_name}</TableCell>
                  <TableCell>{application.age}</TableCell>
                  <TableCell>{application.phone}</TableCell>
                  <TableCell className="max-w-40 truncate">
                    {application.languages.join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <FileLink path={application.aadhaar_path} label={t.viewFile} />
                  </TableCell>
                  <TableCell>
                    <InlineStatusSelect
                      value={application.status}
                      options={statusOptions}
                      onChange={(status) => updateApplicationStatus(application.id, status)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <ConfirmDeleteButton
                        itemLabel={application.full_name}
                        onConfirm={() => deleteApplication(application.id)}
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
