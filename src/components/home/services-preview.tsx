import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/shared/service-card";
import { serviceItems } from "@/lib/constants/site";

export function ServicesPreview() {
  const t = useTranslations("home");
  const tServices = useTranslations("services.items");
  const tc = useTranslations("common");
  const featured = serviceItems.slice(0, 8);

  return (
    <section className="py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading
          heading={t("servicesHeading")}
          subheading={t("servicesSubheading")}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service) => (
            <ServiceCard
              key={service.slug}
              icon={service.icon}
              title={tServices(`${service.slug}.title` as never)}
              description={tServices(`${service.slug}.description` as never)}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/services">
              {tc("viewAll")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
