import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Icon } from "@/components/icons/icon-map";
import { industryItems } from "@/lib/constants/site";

export function IndustriesPreview() {
  const t = useTranslations("home");
  const tIndustries = useTranslations("industries.items");
  const tc = useTranslations("common");

  return (
    <section className="py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading
          heading={t("industriesHeading")}
          subheading={t("industriesSubheading")}
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {industryItems.map((industry) => (
            <div
              key={industry.slug}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-3 py-6 text-center shadow-sm transition-colors hover:border-primary/30"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon name={industry.icon} className="size-5" />
              </span>
              <span className="text-sm font-medium text-foreground">
                {tIndustries(`${industry.slug}.title` as never)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/industries">
              {tc("viewAll")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
