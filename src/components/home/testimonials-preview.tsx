import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/section-heading";
import { TestimonialsMarquee } from "@/components/home/testimonials-marquee";
import { createClient } from "@/lib/supabase/server";

export async function TestimonialsPreview() {
  const t = await getTranslations("home");

  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="overflow-hidden bg-secondary/40 py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading
          heading={t("testimonialsHeading")}
          subheading={t("testimonialsSubheading")}
        />
      </div>

      <div className="mt-12">
        <TestimonialsMarquee testimonials={testimonials} />
      </div>
    </section>
  );
}
