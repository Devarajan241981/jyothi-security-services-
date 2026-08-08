import { useTranslations } from "next-intl";
import { statItems } from "@/lib/constants/site";
import { Icon } from "@/components/icons/icon-map";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { SectionHeading } from "@/components/shared/section-heading";

export function StatsSection() {
  const t = useTranslations("stats");

  return (
    <section className="bg-[#0f1a2b] py-16 sm:py-20">
      <div className="container-site">
        <SectionHeading
          heading={t("heading")}
          subheading={t("subheading")}
          className="[&_h2]:text-white [&_p]:text-slate-400"
        />

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-7">
          {statItems.map((stat) => (
            <div
              key={stat.slug}
              className="flex flex-col items-center gap-3 rounded-2xl bg-white/5 px-4 py-6 text-center ring-1 ring-white/10"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-accent">
                <Icon name={stat.icon} className="size-5" />
              </span>
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                className="text-2xl font-extrabold text-white sm:text-3xl"
              />
              <span className="text-xs font-medium text-slate-400 sm:text-sm">
                {t(stat.slug as never)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
