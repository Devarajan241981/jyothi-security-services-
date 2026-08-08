import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/shared/section-heading";
import { Icon } from "@/components/icons/icon-map";
import { trainingItems } from "@/lib/constants/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "training" });
  return { title: t("heading") };
}

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("training");

  return (
    <section className="py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} subheading={t("intro")} />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trainingItems.map((item) => (
            <div
              key={item.slug}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon name={item.icon} className="size-6" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {t(`items.${item.slug}.title`)}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${item.slug}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
