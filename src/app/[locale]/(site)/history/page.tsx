import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/shared/section-heading";
import { Icon } from "@/components/icons/icon-map";
import { historyMilestones } from "@/lib/constants/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "history" });
  return { title: t("heading") };
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("history");

  return (
    <section className="py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} subheading={t("intro")} />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div
            className="absolute left-6 top-0 h-full w-px bg-border sm:left-1/2 sm:-translate-x-1/2"
            aria-hidden="true"
          />
          <ol className="space-y-10">
            {historyMilestones.map((milestone, idx) => (
              <li
                key={milestone.slug}
                className="relative flex flex-col gap-4 pl-16 sm:grid sm:grid-cols-2 sm:gap-10 sm:pl-0"
              >
                <div
                  className={
                    idx % 2 === 0
                      ? "sm:col-start-1 sm:row-start-1 sm:text-right"
                      : "sm:col-start-2 sm:row-start-1"
                  }
                >
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground">
                      {t(`milestones.${milestone.slug}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t(`milestones.${milestone.slug}.description`)}
                    </p>
                  </div>
                </div>

                <span
                  className="absolute left-0 top-0 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md sm:left-1/2 sm:-translate-x-1/2"
                  aria-hidden="true"
                >
                  <Icon name={milestone.icon} className="size-5" />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
