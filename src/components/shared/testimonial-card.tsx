import { Quote } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { StarRating } from "@/components/shared/star-rating";

const palette = [
  "bg-primary/10 text-primary",
  "bg-accent/15 text-accent-foreground",
  "bg-success/10 text-success",
];

export function TestimonialCard({
  name,
  role,
  organization,
  quote,
  rating,
  initials,
  index = 0,
}: {
  name: string;
  role: string;
  organization?: string | null;
  quote: string;
  rating?: number;
  initials: string;
  index?: number;
}) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <Quote className="size-8 text-primary/25" />
        {rating ? <StarRating rating={rating} /> : null}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-foreground/90">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Avatar>
          <AvatarFallback className={palette[index % palette.length]}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">
            {role}
            {organization ? ` · ${organization}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
