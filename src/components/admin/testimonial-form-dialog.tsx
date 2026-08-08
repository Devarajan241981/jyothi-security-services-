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
import { StarRatingInput } from "@/components/admin/star-rating-input";
import { createTestimonial, updateTestimonial } from "@/lib/actions/admin/content";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export function TestimonialFormDialog({ testimonial }: { testimonial?: Testimonial }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = !!testimonial;
  const { dict } = useAdminDict();
  const t = dict.tables.testimonials;

  const [form, setForm] = useState({
    name: testimonial?.name ?? "",
    role: testimonial?.role ?? "",
    organization: testimonial?.organization ?? "",
    quote: testimonial?.quote ?? "",
    rating: testimonial?.rating ?? 5,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        name: form.name,
        role: form.role,
        organization: form.organization || null,
        quote: form.quote,
        rating: form.rating,
      };

      const result = isEdit
        ? await updateTestimonial(testimonial!.id, payload)
        : await createTestimonial({ ...payload, is_published: false });

      if (result.success) {
        toast.success(isEdit ? t.testimonialUpdated : t.testimonialAdded);
        setOpen(false);
        if (!isEdit) setForm({ name: "", role: "", organization: "", quote: "", rating: 5 });
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
            {t.addTestimonial}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? t.editTestimonial : t.addTestimonial}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{t.name}</Label>
            <Input required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t.role}</Label>
            <Input required value={form.role} onChange={(e) => set("role", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.organization}</Label>
            <Input value={form.organization} onChange={(e) => set("organization", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.quote}</Label>
            <Textarea required value={form.quote} onChange={(e) => set("quote", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>{t.rating}</Label>
            <StarRatingInput value={form.rating} onChange={(rating) => set("rating", rating)} />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {isEdit ? dict.common.saveChanges : t.addTestimonial}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
