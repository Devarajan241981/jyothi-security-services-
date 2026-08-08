import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/shared/section-heading";
import { Icon } from "@/components/icons/icon-map";
import { industryItems } from "@/lib/constants/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "industries" });
  return { title: t("heading") };
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("industries");

  return (
    <section className="py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} subheading={t("subheading")} />

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {industryItems.map((industry) => (
            <div
              key={industry.slug}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-4 py-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon name={industry.icon} className="size-7" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {t(`items.${industry.slug}.title`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
