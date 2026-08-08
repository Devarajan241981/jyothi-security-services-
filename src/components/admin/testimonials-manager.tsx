"use client";

import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { TestimonialFormDialog } from "@/components/admin/testimonial-form-dialog";
import { StarRating } from "@/components/shared/star-rating";
import { deleteTestimonial, toggleTestimonialPublished } from "@/lib/actions/admin/content";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const { dict } = useAdminDict();
  const tr = dict.tables.testimonials;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{tr.heading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{tr.description}</p>
        </div>
        <TestimonialFormDialog />
      </div>

      <div className="mt-5 space-y-3">
        {testimonials.length === 0 ? (
          <p className="text-sm text-muted-foreground">{tr.noTestimonials}</p>
        ) : (
          testimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <span className="text-sm text-muted-foreground">
                    {item.role}
                    {item.organization ? ` · ${item.organization}` : ""}
                  </span>
                </div>
                <StarRating rating={item.rating} className="mt-1.5" />
                <p className="mt-1.5 text-sm text-muted-foreground">&ldquo;{item.quote}&rdquo;</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Switch
                  checked={item.is_published}
                  onCheckedChange={async (checked) => {
                    const result = await toggleTestimonialPublished(item.id, checked);
                    if (!result.success) toast.error(result.error);
                  }}
                />
                <TestimonialFormDialog testimonial={item} />
                <ConfirmDeleteButton itemLabel={item.name} onConfirm={() => deleteTestimonial(item.id)} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
