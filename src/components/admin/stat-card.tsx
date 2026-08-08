import { Icon } from "@/components/icons/icon-map";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  tone = "primary",
}: {
  label: string;
  value: number | string;
  icon: string;
  tone?: "primary" | "accent" | "success" | "muted";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent-foreground",
    success: "bg-success/10 text-success",
    muted: "bg-secondary text-muted-foreground",
  };

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:gap-4 sm:p-5">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11",
          tones[tone],
        )}
      >
        <Icon name={icon} className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-bold text-foreground sm:text-2xl">{value}</p>
        <p className="text-xs font-medium break-words text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
