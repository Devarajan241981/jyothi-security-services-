"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { locales, localeLabels, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();

  // A full navigation (not the Next.js client router) so every Server
  // Component re-renders with the new locale's messages immediately —
  // client-side transitions were leaving stale, previous-locale content
  // on screen until a manual refresh.
  function switchLocale(nextLocale: Locale) {
    const currentPath = window.location.pathname;
    const basePath =
      currentPath.replace(new RegExp(`^/(${locales.join("|")})(?=/|$)`), "") || "/";
    const suffix = basePath === "/" ? "" : basePath;
    const target = `/${nextLocale}${suffix}`.replace(/\/+$/, "") || "/";

    const search = window.location.search ?? "";
    const hash = window.location.hash ?? "";

    window.location.assign(`${target}${search}${hash}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border-border"
          aria-label={t("selectLanguage")}
        >
          <Languages className="size-4" />
          <span className="hidden sm:inline">{localeLabels[locale as Locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            className={cn(l === locale && "font-semibold text-primary")}
            onSelect={() => switchLocale(l)}
          >
            {localeLabels[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
