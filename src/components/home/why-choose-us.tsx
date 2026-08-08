import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons/icon-map";
import { SectionHeading } from "@/components/shared/section-heading";

const whyItems = [
  { slug: "professionalGuards", icon: "BadgeCheck" },
  { slug: "verifiedPersonnel", icon: "ShieldCheck" },
  { slug: "support247", icon: "Clock3" },
  { slug: "quickDeployment", icon: "Zap" },
] as const;

export function WhyChooseUs() {
  const t = useTranslations("home");
  const tWhy = useTranslations("about.why");

  return (
    <section className="bg-secondary/40 py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading heading={t("whyHeading")} subheading={t("whySubheading")} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((item) => (
            <div
              key={item.slug}
              className="flex flex-col items-center gap-4 rounded-2xl bg-card p-7 text-center shadow-sm ring-1 ring-border"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name={item.icon} className="size-7" />
              </span>
              <h3 className="text-base font-semibold text-foreground">
                {tWhy(`${item.slug}.title` as never)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tWhy(`${item.slug}.description` as never)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
