import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/shared/section-heading";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { createPublicClient } from "@/lib/supabase/server";
import { initialsFor } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "testimonials" });
  return { title: t("heading") };
}

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("testimonials");

  const supabase = await createPublicClient();
  const { data: testimonials } = supabase
    ? await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <section className="py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} />

        {testimonials && testimonials.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <TestimonialCard
                key={item.id}
                index={index}
                initials={initialsFor(item.name)}
                name={item.name}
                role={item.role}
                organization={item.organization}
                quote={item.quote}
                rating={item.rating}
              />
            ))}
          </div>
        ) : (
          <p className="mx-auto mt-12 max-w-md text-center text-sm text-muted-foreground">
            {t("empty")}
          </p>
        )}
      </div>
    </section>
  );
}
