import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Kannada } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { createClient } from "@/lib/supabase/server";
import { getAdminNotificationData } from "@/lib/admin-notifications-data";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";
import { AdminIntlProvider } from "@/lib/admin-i18n/provider";
import "../globals.css";
import "./admin.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const notoKannada = Noto_Sans_Kannada({
  variable: "--font-noto-kannada",
  subsets: ["kannada"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "JSS Admin", template: "%s | JSS Admin" },
  robots: { index: false, follow: false },
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "JSS Admin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/admin/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/admin/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/admin/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f1a2b",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { locale, dict } = await getAdminDictionary();

  if (!user) {
    return (
      <html lang={locale} className={`${inter.variable} ${notoKannada.variable} h-full antialiased`}>
        <body className="min-h-full bg-background text-foreground">
          <AdminIntlProvider locale={locale} dict={dict}>
            {children}
            <Toaster richColors position="top-center" />
          </AdminIntlProvider>
        </body>
      </html>
    );
  }

  const { notifications, unreadCount, attendanceReminderCount, salaryReminderCount } =
    await getAdminNotificationData();

  return (
    <html lang={locale} className={`${inter.variable} ${notoKannada.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <AdminIntlProvider locale={locale} dict={dict}>
          <div className="grid min-h-screen lg:grid-cols-[16rem_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-0 h-screen">
                <AdminSidebar />
              </div>
            </aside>
            <div className="flex min-h-screen min-w-0 flex-col">
              <AdminTopbar
                email={user.email}
                notifications={notifications}
                unreadCount={unreadCount}
                attendanceReminderCount={attendanceReminderCount}
                salaryReminderCount={salaryReminderCount}
              />
              <main className="min-w-0 flex-1 p-3 sm:p-6 lg:p-8">{children}</main>
            </div>
          </div>
          <Toaster richColors position="top-center" />
        </AdminIntlProvider>
      </body>
    </html>
  );
}
