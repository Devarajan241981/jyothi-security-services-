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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCalendarEvent } from "@/lib/actions/admin/calendar";
import { useAdminDict } from "@/lib/admin-i18n/provider";

export function EventFormDialog({ defaultDate }: { defaultDate: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { dict } = useAdminDict();
  const t = dict.tables.calendar;
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: defaultDate,
    event_type: "meeting",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createCalendarEvent({
        title: form.title,
        description: form.description || null,
        event_date: form.event_date,
        event_type: form.event_type as "assignment" | "salary" | "meeting" | "important",
      });
      if (result.success) {
        toast.success(t.eventAdded);
        setOpen(false);
        setForm({ title: "", description: "", event_date: defaultDate, event_type: "meeting" });
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
          {t.addEvent}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.addCalendarEvent}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-1.5">
            <Label>{t.titleField}</Label>
            <Input required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.date}</Label>
            <Input type="date" value={form.event_date} onChange={(e) => set("event_date", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.type}</Label>
            <Select value={form.event_type} onValueChange={(v) => set("event_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">{dict.labels.eventType.meeting}</SelectItem>
                <SelectItem value="assignment">{dict.labels.eventType.assignment}</SelectItem>
                <SelectItem value="salary">{dict.labels.eventType.salary}</SelectItem>
                <SelectItem value="important">{dict.labels.eventType.important}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.description}</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {t.saveEvent}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
