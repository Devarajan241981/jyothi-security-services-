import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <section className="py-16 sm:py-20">
      <div className="container-site grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-6 rounded-3xl bg-primary p-8 text-white sm:p-10">
          <div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
              <ShieldCheck className="size-6" />
            </span>
            <h3 className="mt-5 text-2xl font-bold sm:text-3xl">
              {t("ctaHeading")}
            </h3>
            <p className="mt-3 max-w-md text-white/85">{t("ctaSubheading")}</p>
          </div>
          <Button asChild size="lg" variant="secondary" className="w-fit gap-2 bg-white text-primary hover:bg-white/90">
            <Link href="/request-guards">
              {tc("requestGuards")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-3xl bg-[#0f1a2b] p-8 text-white sm:p-10">
          <div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/20 text-accent">
              <Users className="size-6" />
            </span>
            <h3 className="mt-5 text-2xl font-bold sm:text-3xl">
              {t("joinHeading")}
            </h3>
            <p className="mt-3 max-w-md text-slate-300">{t("joinSubheading")}</p>
          </div>
          <Button
            asChild
            size="lg"
            className="w-fit gap-2 bg-accent text-accent-foreground hover:bg-[var(--accent-hover)]"
          >
            <Link href="/join-our-team">
              {t("joinCta")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
