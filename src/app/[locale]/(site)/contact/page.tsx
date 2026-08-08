import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone, MessageCircle, Mail, MapPin, Clock, Siren } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/lib/constants/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("heading") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const infoItems = [
    { Icon: Phone, label: t("phone"), value: siteConfig.phoneDisplay, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
    { Icon: MessageCircle, label: t("whatsapp"), value: siteConfig.phoneDisplay, href: `https://wa.me/${siteConfig.whatsapp}` },
    { Icon: Mail, label: t("email"), value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    {
      Icon: MapPin,
      label: t("address"),
      value: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
    },
    { Icon: Clock, label: t("hours"), value: siteConfig.workingHours.office },
    {
      Icon: Siren,
      label: t("emergency"),
      value: siteConfig.emergencyPhone,
      href: `tel:${siteConfig.emergencyPhone.replace(/\s/g, "")}`,
    },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} subheading={t("subheading")} />

        <div className="mt-12 grid gap-10 lg:grid-cols-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
            {infoItems.map(({ Icon, label, value, href }) => {
              const content = (
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={label}>{content}</div>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {t("mapHeading")}
            </h3>
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="JSS office location map"
                src={siteConfig.mapEmbedSrc}
                width="100%"
                height="360"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-[var(--primary-hover)]"
              >
                <Phone className="size-5" />
                {t("callButton")}
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-success px-6 py-4 text-base font-semibold text-success-foreground shadow-sm transition-colors hover:opacity-90"
              >
                <MessageCircle className="size-5" />
                {t("whatsappButton")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
