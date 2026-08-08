"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Phone, ShieldCheck } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { navLinks, siteConfig } from "@/lib/constants/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { AccessibilityToolbar } from "@/components/layout/accessibility-toolbar";
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hidden = useHideOnScroll();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur transition-transform duration-300 supports-[backdrop-filter]:bg-background/80",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="container-wide">
        {/* Row 1: logo + actions. Fixed height, never wraps. */}
        <div className="flex h-18 items-center justify-between gap-3 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold tracking-tight text-foreground">
                JSS
              </span>
              <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">
                Jyothi Security Services
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 xl:flex">
            <AccessibilityToolbar />
            <LanguageSwitcher />
            <Button asChild variant="ghost" size="sm" className="shrink-0 gap-2">
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                <Phone className="size-4" />
                <span className="whitespace-nowrap">{tc("callNow")}</span>
              </a>
            </Button>
            <Button asChild size="sm" className="shrink-0 gap-2">
              <Link href="/request-guards">
                <span className="whitespace-nowrap">{tc("requestGuards")}</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <AccessibilityToolbar />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label={tc("openMenu")}>
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    JSS
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                  {navLinks.map((link) => (
                    <Link
                      key={link.slug}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-secondary hover:text-primary"
                    >
                      {t(link.slug as never)}
                    </Link>
                  ))}
                </nav>
                <div className="mt-4 flex flex-col gap-2 px-4">
                  <LanguageSwitcher />
                  <Button asChild className="gap-2">
                    <Link href="/request-guards" onClick={() => setOpen(false)}>
                      {tc("requestGuards")}
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" className="gap-2">
                    <Link href="/join-our-team" onClick={() => setOpen(false)}>
                      {tc("joinTeam")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="gap-2">
                    <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                      <Phone className="size-4" />
                      {tc("callNow")}
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Row 2: primary nav. Its own row so growth is vertical (wraps to a
            new line if the window is narrow) instead of squeezing row 1. */}
        <nav
          className="hidden flex-wrap items-center justify-center gap-1 border-t border-border/70 py-1.5 xl:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.slug}
                href={link.href}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary",
                  isActive && "bg-secondary text-primary",
                )}
              >
                {t(link.slug as never)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
