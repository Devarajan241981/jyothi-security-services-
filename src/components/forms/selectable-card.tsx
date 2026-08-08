"use client";

import { Check } from "lucide-react";
import { Icon } from "@/components/icons/icon-map";
import { cn } from "@/lib/utils";

export function SelectableCard({
  label,
  icon,
  selected,
  onClick,
  compact = false,
}: {
  label: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-center rounded-xl border-2 bg-card text-center transition-all hover:border-primary/40",
        compact ? "gap-2 px-2 py-3.5" : "gap-2.5 px-4 py-5",
        selected ? "border-primary bg-secondary shadow-sm" : "border-border",
      )}
    >
      {selected ? (
        <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-2.5" />
        </span>
      ) : null}
      {icon ? (
        <span
          className={cn(
            "flex items-center justify-center rounded-lg",
            compact ? "size-9" : "size-11",
            selected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary",
          )}
        >
          <Icon name={icon} className={compact ? "size-4" : "size-5"} />
        </span>
      ) : null}
      <span className={cn("font-medium text-foreground", compact ? "text-xs" : "text-sm")}>
        {label}
      </span>
    </button>
  );
}
