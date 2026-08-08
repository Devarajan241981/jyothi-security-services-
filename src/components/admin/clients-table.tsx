"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientFormDialog } from "@/components/admin/client-form-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteClientRecord } from "@/lib/actions/admin/clients";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Client = Database["public"]["Tables"]["clients"]["Row"];

export function ClientsTable({
  clients,
  guardCountByClient,
}: {
  clients: Client[];
  guardCountByClient: Map<string, number>;
}) {
  const [query, setQuery] = useState("");
  const { dict } = useAdminDict();
  const t = dict.tables.clients;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      [c.name, c.contact_person, c.phone, c.location]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q)),
    );
  }, [clients, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="pl-9"
          />
        </div>
        <ClientFormDialog />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.colName}</TableHead>
              <TableHead>{t.colType}</TableHead>
              <TableHead>{t.colContactPerson}</TableHead>
              <TableHead>{t.colPhone}</TableHead>
              <TableHead>{t.colAssignedGuards}</TableHead>
              <TableHead>{t.colStatus}</TableHead>
              <TableHead className="text-right">{t.colActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  {t.noClients}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{dict.labels.clientType[client.type as keyof typeof dict.labels.clientType] ?? client.type}</TableCell>
                  <TableCell>{client.contact_person ?? "—"}</TableCell>
                  <TableCell>{client.phone ?? "—"}</TableCell>
                  <TableCell>{guardCountByClient.get(client.id) ?? 0}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={client.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}
                    >
                      {client.status === "active" ? dict.common.active : dict.common.inactive}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <ClientFormDialog client={client} />
                      <ConfirmDeleteButton
                        itemLabel={client.name}
                        onConfirm={() => deleteClientRecord(client.id)}
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
