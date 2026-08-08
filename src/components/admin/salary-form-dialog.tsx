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
import { createSalary } from "@/lib/actions/admin/salaries";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Guard = Pick<Database["public"]["Tables"]["guards"]["Row"], "id" | "full_name" | "guard_code" | "salary">;

export function SalaryFormDialog({ guards }: { guards: Guard[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { dict } = useAdminDict();
  const t = dict.tables.salary;

  const today = new Date();
  const [form, setForm] = useState({
    guard_id: "",
    salary_month: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`,
    base_salary: "",
    bonus: "0",
    deduction: "0",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.guard_id) {
      toast.error(t.selectGuardError);
      return;
    }
    startTransition(async () => {
      const result = await createSalary({
        guard_id: form.guard_id,
        salary_month: form.salary_month,
        base_salary: Number(form.base_salary) || 0,
        bonus: Number(form.bonus) || 0,
        deduction: Number(form.deduction) || 0,
      });

      if (result.success) {
        toast.success(t.recordAdded);
        setOpen(false);
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
          {t.addRecord}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.addRecord}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.guard}</Label>
            <Select
              value={form.guard_id}
              onValueChange={(v) => {
                set("guard_id", v);
                const guard = guards.find((g) => g.id === v);
                if (guard?.salary) set("base_salary", String(guard.salary));
              }}
            >
              <SelectTrigger><SelectValue placeholder={dict.common.selectGuard} /></SelectTrigger>
              <SelectContent>
                {guards.map((g) => (
                  <SelectItem key={g.id} value={g.id}>{g.full_name} ({g.guard_code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.month}</Label>
            <Input type="date" value={form.salary_month} onChange={(e) => set("salary_month", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.baseSalary}</Label>
            <Input type="number" value={form.base_salary} onChange={(e) => set("base_salary", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.bonus}</Label>
            <Input type="number" value={form.bonus} onChange={(e) => set("bonus", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.deduction}</Label>
            <Input type="number" value={form.deduction} onChange={(e) => set("deduction", e.target.value)} />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {t.saveRecord}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
