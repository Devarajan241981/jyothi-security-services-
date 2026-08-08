import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("termsTitle") };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className="py-16 sm:py-24">
      <div className="container-site max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          {t("termsTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("lastUpdated", { date: new Date().toLocaleDateString(locale) })}
        </p>
        <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-sm leading-relaxed text-accent-foreground/90">
          {t("placeholder")}
        </div>
      </div>
    </section>
  );
}
