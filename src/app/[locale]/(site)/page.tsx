import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { StatsSection } from "@/components/home/stats-section";
import { ServicesPreview } from "@/components/home/services-preview";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { IndustriesPreview } from "@/components/home/industries-preview";
import { TestimonialsPreview } from "@/components/home/testimonials-preview";
import { CtaSection } from "@/components/home/cta-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <StatsSection />
      <ServicesPreview />
      <WhyChooseUs />
      <IndustriesPreview />
      <TestimonialsPreview />
      <CtaSection />
    </>
  );
}
