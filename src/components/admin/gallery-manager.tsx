"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import {
  deleteGalleryImage,
  toggleGalleryPublished,
  uploadGalleryImage,
} from "@/lib/actions/admin/content";
import { galleryCategories } from "@/lib/constants/site";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import type { Database } from "@/types/database";

type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [isPending, startTransition] = useTransition();
  const { dict } = useAdminDict();
  const t = dict.tables.gallery;
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>(galleryCategories[0].slug);
  const [caption, setCaption] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error(t.selectImageError);
      return;
    }
    startTransition(async () => {
      const result = await uploadGalleryImage(file, category, caption);
      if (result.success) {
        toast.success(t.imageAdded);
        setFile(null);
        setCaption("");
        if (inputRef.current) inputRef.current.value = "";
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">{t.heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>

      <form onSubmit={handleAdd} className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label>{t.imageFile}</Label>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full cursor-pointer rounded-lg border border-border text-sm text-muted-foreground file:mr-3 file:cursor-pointer file:border-0 file:border-r file:border-border file:bg-secondary file:px-3.5 file:py-2.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/70"
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t.category}</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {galleryCategories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>{c.slug}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{t.caption}</Label>
          <Input value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            {t.addImage}
          </Button>
        </div>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground">{t.noImages}</p>
        ) : (
          images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded images from Supabase Storage */}
              <img src={img.image_path} alt={img.caption ?? img.category} className="h-28 w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="truncate text-xs text-muted-foreground">{img.category}</span>
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={img.is_published}
                    onCheckedChange={async (checked) => {
                      const result = await toggleGalleryPublished(img.id, checked);
                      if (!result.success) toast.error(result.error);
                    }}
                  />
                  <ConfirmDeleteButton itemLabel="image" onConfirm={() => deleteGalleryImage(img.id)} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
