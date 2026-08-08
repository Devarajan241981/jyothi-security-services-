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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createGuard, updateGuard } from "@/lib/actions/admin/guards";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Guard = Database["public"]["Tables"]["guards"]["Row"];
type Client = Pick<Database["public"]["Tables"]["clients"]["Row"], "id" | "name">;

export function GuardFormDialog({
  guard,
  clients,
}: {
  guard?: Guard;
  clients: Client[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = !!guard;
  const { dict } = useAdminDict();
  const t = dict.tables.guards;

  const [form, setForm] = useState({
    full_name: guard?.full_name ?? "",
    phone: guard?.phone ?? "",
    gender: guard?.gender ?? "male",
    age: guard?.age?.toString() ?? "",
    languages: guard?.languages?.join(", ") ?? "",
    experience_years: guard?.experience_years?.toString() ?? "",
    address: guard?.address ?? "",
    joining_date: guard?.joining_date ?? new Date().toISOString().slice(0, 10),
    salary: guard?.salary?.toString() ?? "",
    shift: guard?.shift ?? "day",
    current_client_id: guard?.current_client_id ?? "",
    current_location: guard?.current_location ?? "",
    status: guard?.status ?? "active",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        full_name: form.full_name,
        phone: form.phone,
        gender: form.gender as Guard["gender"],
        age: form.age ? Number(form.age) : null,
        languages: form.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        experience_years: form.experience_years ? Number(form.experience_years) : null,
        address: form.address || null,
        joining_date: form.joining_date,
        salary: form.salary ? Number(form.salary) : null,
        shift: form.shift as Guard["shift"],
        current_client_id: form.current_client_id || null,
        current_location: form.current_location || null,
        status: form.status as Guard["status"],
      };

      const result = isEdit
        ? await updateGuard(guard!.id, payload)
        : await createGuard(payload);

      if (result.success) {
        toast.success(isEdit ? t.guardUpdated : t.guardAdded);
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
            {t.addNew}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? t.editTitle : t.addTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.fullName}</Label>
            <Input required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.phoneNumber}</Label>
            <Input required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{dict.pages.guardProfile.fields.age}</Label>
            <Input type="number" value={form.age} onChange={(e) => set("age", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{dict.pages.guardProfile.fields.gender}</Label>
            <Select value={form.gender} onValueChange={(v) => set("gender", v as typeof form.gender)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{dict.labels.gender.male}</SelectItem>
                <SelectItem value="female">{dict.labels.gender.female}</SelectItem>
                <SelectItem value="other">{dict.labels.gender.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.experienceYears}</Label>
            <Input type="number" step="0.5" value={form.experience_years} onChange={(e) => set("experience_years", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.languagesCsv}</Label>
            <Input value={form.languages} onChange={(e) => set("languages", e.target.value)} placeholder="Kannada, English, Hindi" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.address}</Label>
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.currentCompany}</Label>
            <Select value={form.current_client_id} onValueChange={(v) => set("current_client_id", v)}>
              <SelectTrigger><SelectValue placeholder={dict.common.unassigned} /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.currentLocation}</Label>
            <Input value={form.current_location} onChange={(e) => set("current_location", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{dict.tables.assignments.colShift}</Label>
            <Select value={form.shift} onValueChange={(v) => set("shift", v as typeof form.shift)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="day">{dict.labels.shift.day}</SelectItem>
                <SelectItem value="night">{dict.labels.shift.night}</SelectItem>
                <SelectItem value="both">{dict.labels.shift.both}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{dict.common.status}</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as typeof form.status)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{dict.labels.guardStatus.active}</SelectItem>
                <SelectItem value="inactive">{dict.labels.guardStatus.inactive}</SelectItem>
                <SelectItem value="on_leave">{dict.labels.guardStatus.on_leave}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.joiningDate}</Label>
            <Input type="date" value={form.joining_date} onChange={(e) => set("joining_date", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.salaryMonthly}</Label>
            <Input type="number" value={form.salary} onChange={(e) => set("salary", e.target.value)} />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {isEdit ? dict.common.saveChanges : t.addNew}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
