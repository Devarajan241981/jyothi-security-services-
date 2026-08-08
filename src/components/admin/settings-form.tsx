"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSettings } from "@/lib/actions/admin/settings";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export function SettingsForm({ settings }: { settings: Settings }) {
  const [isPending, startTransition] = useTransition();
  const { dict } = useAdminDict();
  const t = dict.tables.settings;
  const [form, setForm] = useState({
    company_name: settings.company_name,
    logo_path: settings.logo_path ?? "",
    contact_numbers: (settings.contact_numbers ?? []).join(", "),
    emergency_number: settings.emergency_number ?? "",
    emails: (settings.emails ?? []).join(", "),
    whatsapp_number: settings.whatsapp_number ?? "",
    office_address: settings.office_address ?? "",
    facebook: settings.social_media?.facebook ?? "",
    instagram: settings.social_media?.instagram ?? "",
    linkedin: settings.social_media?.linkedin ?? "",
    youtube: settings.social_media?.youtube ?? "",
    hero_images: (settings.hero_images ?? []).join("\n"),
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateSiteSettings({
        company_name: form.company_name,
        logo_path: form.logo_path || null,
        contact_numbers: form.contact_numbers.split(",").map((s) => s.trim()).filter(Boolean),
        emergency_number: form.emergency_number || null,
        emails: form.emails.split(",").map((s) => s.trim()).filter(Boolean),
        whatsapp_number: form.whatsapp_number || null,
        office_address: form.office_address || null,
        social_media: {
          facebook: form.facebook,
          instagram: form.instagram,
          linkedin: form.linkedin,
          youtube: form.youtube,
        },
        hero_images: form.hero_images.split("\n").map((s) => s.trim()).filter(Boolean),
      });

      if (result.success) toast.success(t.settingsSaved);
      else toast.error(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label>{t.companyName}</Label>
        <Input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>{t.logoUrl}</Label>
        <Input value={form.logo_path} onChange={(e) => set("logo_path", e.target.value)} placeholder="https://…" />
      </div>
      <div className="space-y-1.5">
        <Label>{t.contactNumbers}</Label>
        <Input value={form.contact_numbers} onChange={(e) => set("contact_numbers", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>{t.emergencyNumber}</Label>
        <Input value={form.emergency_number} onChange={(e) => set("emergency_number", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>{t.emails}</Label>
        <Input value={form.emails} onChange={(e) => set("emails", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>{t.whatsappNumber}</Label>
        <Input value={form.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)} />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>{t.officeAddress}</Label>
        <Textarea value={form.office_address} onChange={(e) => set("office_address", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>{t.facebookUrl}</Label>
        <Input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>{t.instagramUrl}</Label>
        <Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>{t.linkedinUrl}</Label>
        <Input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>{t.youtubeUrl}</Label>
        <Input value={form.youtube} onChange={(e) => set("youtube", e.target.value)} />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>{t.heroImages}</Label>
        <Textarea
          value={form.hero_images}
          onChange={(e) => set("hero_images", e.target.value)}
          className="min-h-24"
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {t.saveSettings}
        </Button>
      </div>
    </form>
  );
}
