import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { navLinks } from "@/lib/constants/site";
import { siteConfig } from "@/lib/constants/site";

const staticPaths = [
  ...navLinks.map((l) => l.href),
  "/request-guards",
  "/join-our-team",
  "/privacy-policy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const uniquePaths = Array.from(new Set(staticPaths));

  return uniquePaths.map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${siteConfig.url}/${locale}${path === "/" ? "" : path}`,
        ]),
      ),
    },
  }));
}
