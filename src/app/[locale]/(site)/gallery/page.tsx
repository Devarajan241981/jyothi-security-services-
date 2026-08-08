import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/shared/section-heading";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { galleryCategories } from "@/lib/constants/site";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return { title: t("heading") };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");

  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const categoryLabels = Object.fromEntries(
    galleryCategories.map((c) => [c.slug, t(`categories.${c.slug}`)]),
  );

  return (
    <section className="py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} />

        {images && images.length > 0 ? (
          <GalleryGrid images={images} categoryLabels={categoryLabels} allLabel={t("filterAll")} />
        ) : (
          <p className="mx-auto mt-12 max-w-md text-center text-sm text-muted-foreground">
            {t("empty")}
          </p>
        )}
      </div>
    </section>
  );
}
