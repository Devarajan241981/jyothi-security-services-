"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Phone, MessageCircle, ArrowRight, BadgeCheck, Clock3, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { HeroIllustration } from "@/components/home/hero-illustration";
import { siteConfig } from "@/lib/constants/site";

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");

  const badges = [
    { Icon: BadgeCheck, label: t("trustBadge1") },
    { Icon: Clock3, label: t("trustBadge2") },
    { Icon: Zap, label: t("trustBadge3") },
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container-site grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            {t("eyebrow")}
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
            <br />
            <span className="text-primary">{t("titleLine3")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {badges.map(({ Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium text-primary"
              >
                <Icon className="size-4" />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/request-guards">
                {t("ctaPrimary")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/join-our-team">{t("ctaSecondary")}</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone className="size-4" />
              </span>
              {tc("callNow")}
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-success"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-success/10 text-success">
                <MessageCircle className="size-4" />
              </span>
              {tc("whatsapp")}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}
