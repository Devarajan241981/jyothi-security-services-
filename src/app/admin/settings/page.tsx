import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings-form";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { dict } = await getAdminDictionary();

  const [{ data: settings }, { data: images }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase.from("gallery_images").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.settings.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{dict.pages.settings.subtitle}</p>
      </div>

      {settings ? <SettingsForm settings={settings} /> : null}
      <GalleryManager images={images ?? []} />
    </div>
  );
}
