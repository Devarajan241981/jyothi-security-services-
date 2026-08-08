"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
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
import { createAssignment } from "@/lib/actions/admin/assignments";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Guard = Pick<Database["public"]["Tables"]["guards"]["Row"], "id" | "full_name" | "guard_code">;
type Client = Pick<Database["public"]["Tables"]["clients"]["Row"], "id" | "name">;

export function AssignmentFormDialog({ guards, clients }: { guards: Guard[]; clients: Client[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { dict } = useAdminDict();
  const t = dict.tables.assignments;

  const [form, setForm] = useState({
    guard_id: "",
    client_id: "",
    shift: "day",
    location: "",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.guard_id || !form.client_id) {
      toast.error(t.selectGuardError);
      return;
    }
    startTransition(async () => {
      const result = await createAssignment({
        guard_id: form.guard_id,
        client_id: form.client_id,
        shift: form.shift as Database["public"]["Tables"]["assignments"]["Row"]["shift"],
        location: form.location || null,
        start_date: form.start_date,
        end_date: form.end_date || null,
      });

      if (result.success) {
        toast.success(t.assignmentCreated);
        setOpen(false);
        setForm({ guard_id: "", client_id: "", shift: "day", location: "", start_date: new Date().toISOString().slice(0, 10), end_date: "" });
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          {t.assignGuard}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.assignGuardToClient}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.guardLabel}</Label>
            <Select value={form.guard_id} onValueChange={(v) => set("guard_id", v)}>
              <SelectTrigger><SelectValue placeholder={dict.common.selectGuard} /></SelectTrigger>
              <SelectContent>
                {guards.map((g) => (
                  <SelectItem key={g.id} value={g.id}>{g.full_name} ({g.guard_code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.companyLabel}</Label>
            <Select value={form.client_id} onValueChange={(v) => set("client_id", v)}>
              <SelectTrigger><SelectValue placeholder={dict.common.selectClient} /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.colShift}</Label>
            <Select value={form.shift} onValueChange={(v) => set("shift", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="day">{dict.labels.shift.day}</SelectItem>
                <SelectItem value="night">{dict.labels.shift.night}</SelectItem>
                <SelectItem value="both">{dict.labels.shift.both}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.location}</Label>
            <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.startDate}</Label>
            <Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.endDate}</Label>
            <Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {t.createAssignment}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
