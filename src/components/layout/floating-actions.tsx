"use client";

import { useTranslations } from "next-intl";
import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/constants/site";

export function FloatingActions() {
  const t = useTranslations("common");

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${siteConfig.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsapp")}
        className="flex size-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg ring-4 ring-success/20 transition-transform hover:scale-105"
      >
        <MessageCircle className="size-6" aria-hidden="true" />
      </a>
      <a
        href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
        aria-label={t("callNow")}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20 transition-transform hover:scale-105"
      >
        <Phone className="size-6" aria-hidden="true" />
      </a>
    </div>
  );
}
