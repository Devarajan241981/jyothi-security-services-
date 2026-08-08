"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setAdminLocale } from "@/lib/actions/admin/locale";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { AdminLocale } from "@/lib/admin-i18n/dictionaries";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { locale } = useAdminDict();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: AdminLocale) {
    if (next === locale || isPending) return;
    startTransition(async () => {
      await setAdminLocale(next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center rounded-full border border-border bg-secondary/50 p-0.5 text-xs font-semibold">
      {(["en", "kn"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          disabled={isPending}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors disabled:opacity-60",
            locale === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
