"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClientRecord, updateClientRecord } from "@/lib/actions/admin/clients";
import { CLIENT_TYPES } from "@/lib/constants/admin";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Client = Database["public"]["Tables"]["clients"]["Row"];

export function ClientFormDialog({ client }: { client?: Client }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = !!client;
  const { dict } = useAdminDict();
  const t = dict.tables.clients;

  const [form, setForm] = useState({
    name: client?.name ?? "",
    type: client?.type ?? CLIENT_TYPES[0],
    contact_person: client?.contact_person ?? "",
    phone: client?.phone ?? "",
    email: client?.email ?? "",
    address: client?.address ?? "",
    location: client?.location ?? "",
    contract_start: client?.contract_start ?? "",
    contract_end: client?.contract_end ?? "",
    status: client?.status ?? "active",
    notes: client?.notes ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        name: form.name,
        type: form.type,
        contact_person: form.contact_person || null,
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
        location: form.location || null,
        contract_start: form.contract_start || null,
        contract_end: form.contract_end || null,
        status: form.status as Client["status"],
        notes: form.notes || null,
      };

      const result = isEdit
        ? await updateClientRecord(client!.id, payload)
        : await createClientRecord(payload);

      if (result.success) {
        toast.success(isEdit ? t.clientUpdated : t.clientAdded);
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="size-4" />
            {t.addClient}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? t.editClient : t.addClient}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.name}</Label>
            <Input required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.type}</Label>
            <Select value={form.type} onValueChange={(v) => set("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CLIENT_TYPES.map((ct) => (
                  <SelectItem key={ct} value={ct}>{dict.labels.clientType[ct]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{dict.common.status}</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as typeof form.status)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{dict.common.active}</SelectItem>
                <SelectItem value="inactive">{dict.common.inactive}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.contactPerson}</Label>
            <Input value={form.contact_person} onChange={(e) => set("contact_person", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.phone}</Label>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.email}</Label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.address}</Label>
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.location}</Label>
            <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div />
          <div className="space-y-1.5">
            <Label>{t.contractStart}</Label>
            <Input type="date" value={form.contract_start} onChange={(e) => set("contract_start", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.contractEnd}</Label>
            <Input type="date" value={form.contract_end} onChange={(e) => set("contract_end", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.notes}</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {isEdit ? dict.common.saveChanges : t.addClient}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
