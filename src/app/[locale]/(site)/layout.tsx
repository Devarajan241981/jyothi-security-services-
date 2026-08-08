import { Navbar } from "@/components/layout/navbar";
import { FooterGate } from "@/components/layout/footer-gate";
import { FloatingActions } from "@/components/layout/floating-actions";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <FooterGate />
      <FloatingActions />
    </>
  );
}
