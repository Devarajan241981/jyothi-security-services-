"use client";

import { usePathname } from "@/i18n/navigation";
import { Footer } from "@/components/layout/footer";

// Distraction-free flows: no footer while filling out a form, so the wizard
// card can use the full remaining viewport height without competing for space.
const NO_FOOTER_PATHS = ["/request-guards", "/join-our-team"];

export function FooterGate() {
  const pathname = usePathname();
  if (NO_FOOTER_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }
  return <Footer />;
}
