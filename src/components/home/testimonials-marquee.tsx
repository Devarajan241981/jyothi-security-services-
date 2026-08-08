"use client";

import { StarRating } from "@/components/shared/star-rating";
import { initialsFor } from "@/lib/utils";
import type { Database } from "@/types/database";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export function TestimonialsMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  // Duplicated so the strip can loop seamlessly at translateX(-50%).
  const loop = [...testimonials, ...testimonials];

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4rem,black_calc(100%-4rem),transparent)]">
      <div className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="flex w-80 shrink-0 flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <StarRating rating={item.rating} />
            <p className="line-clamp-3 text-sm leading-relaxed text-foreground/90">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initialsFor(item.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.role}
                  {item.organization ? ` · ${item.organization}` : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
