import { siteConfig } from "@/lib/constants/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.legalName,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line1,
      addressLocality: "Kolar",
      addressRegion: "Karnataka",
      postalCode: "563101",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "State",
      name: "Karnataka",
    },
    sameAs: Object.values(siteConfig.social),
    openingHours: "Mo-Sa 09:00-19:00",
    description:
      "Jyothi Security Services (JSS) provides trained, verified security guards for schools, hospitals, industries, offices, apartments and banks across Karnataka.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
