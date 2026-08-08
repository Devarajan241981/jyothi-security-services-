import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons";
import { Link } from "@/i18n/navigation";
import {
  navLinks,
  serviceItems,
  industryItems,
  languageOptions,
  siteConfig,
} from "@/lib/constants/site";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tServices = useTranslations("services.items");
  const tIndustries = useTranslations("industries.items");
  const tLang = useTranslations("requestForm.languages");

  const year = new Date().getFullYear();
  const featuredServices = serviceItems.slice(0, 6);
  const featuredIndustries = industryItems.slice(0, 6);

  return (
    <footer className="border-t border-border bg-[#0f1a2b] text-slate-200">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <span className="text-lg font-bold text-white">
              JSS <span className="font-normal text-slate-400">| Jyothi Security Services</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {t("description")}
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { href: siteConfig.social.facebook, Icon: FacebookIcon, label: "Facebook" },
              { href: siteConfig.social.instagram, Icon: InstagramIcon, label: "Instagram" },
              { href: siteConfig.social.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
              { href: siteConfig.social.youtube, Icon: YoutubeIcon, label: "YouTube" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("quickLinks")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {navLinks.map((link) => (
              <li key={link.slug}>
                <Link href={link.href} className="hover:text-white">
                  {tNav(link.slug as never)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("servicesHeading")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {featuredServices.map((s) => (
              <li key={s.slug}>
                <Link href="/services" className="hover:text-white">
                  {tServices(`${s.slug}.title` as never)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("industriesHeading")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {featuredIndustries.map((i) => (
              <li key={i.slug}>
                <Link href="/industries" className="hover:text-white">
                  {tIndustries(`${i.slug}.title` as never)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="text-sm text-slate-400">
              <p className="text-white">{siteConfig.phoneDisplay}</p>
              <p>{t("contactHeading")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="text-sm text-slate-400">
              <p className="text-white">{siteConfig.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="text-sm text-slate-400">
              <p className="text-white">{siteConfig.address.line1}</p>
              <p>{siteConfig.address.line2}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              {t("languagesHeading")}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {languageOptions
                .map((l) => tLang(l.slug as never))
                .join(" · ")}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <p>{t("copyright", { year })}</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-white">
              {t("privacyPolicy")}
            </Link>
            <Link href="/terms" className="hover:text-white">
              {t("terms")}
            </Link>
            <Link href="/admin/login" className="hover:text-white">
              {t("adminLogin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
