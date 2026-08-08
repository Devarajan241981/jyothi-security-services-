import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Target, Eye } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Icon } from "@/components/icons/icon-map";

const valueSlugs = ["discipline", "integrity", "trust", "customerSatisfaction"] as const;
const whySlugs = ["professionalGuards", "verifiedPersonnel", "support247", "quickDeployment"] as const;
const whyIcons: Record<(typeof whySlugs)[number], string> = {
  professionalGuards: "BadgeCheck",
  verifiedPersonnel: "ShieldCheck",
  support247: "Clock3",
  quickDeployment: "Zap",
};
const valueIcons: Record<(typeof valueSlugs)[number], string> = {
  discipline: "ShieldCheck",
  integrity: "Scale",
  trust: "Handshake",
  customerSatisfaction: "BadgeCheck",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("heading") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} />
          <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("intro")}
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-site grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Target className="size-6" />
            </span>
            <h3 className="mt-5 text-2xl font-bold text-foreground">
              {t("missionTitle")}
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {t("missionText")}
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent-foreground">
              <Eye className="size-6" />
            </span>
            <h3 className="mt-5 text-2xl font-bold text-foreground">
              {t("visionTitle")}
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {t("visionText")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading heading={t("valuesTitle")} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueSlugs.map((slug) => (
              <div
                key={slug}
                className="flex flex-col items-center gap-4 rounded-2xl bg-card p-7 text-center shadow-sm ring-1 ring-border"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name={valueIcons[slug]} className="size-7" />
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {t(`values.${slug}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`values.${slug}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading heading={t("whyHeading")} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whySlugs.map((slug) => (
              <div
                key={slug}
                className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-7 text-center shadow-sm"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon name={whyIcons[slug]} className="size-7" />
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {t(`why.${slug}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`why.${slug}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
