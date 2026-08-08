"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];

export function GalleryGrid({
  images,
  categoryLabels,
  allLabel,
}: {
  images: GalleryImage[];
  categoryLabels: Record<string, string>;
  allLabel: string;
}) {
  const [active, setActive] = useState<string>("all");

  const categoriesPresent = useMemo(
    () => Array.from(new Set(images.map((img) => img.category))),
    [images],
  );

  const filtered = active === "all" ? images : images.filter((img) => img.category === active);

  return (
    <div>
      {categoriesPresent.length > 1 ? (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {allLabel}
          </button>
          {categoriesPresent.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => setActive(slug)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active === slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {categoryLabels[slug] ?? slug}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {filtered.map((img) => {
          const label = img.caption || categoryLabels[img.category] || img.category;
          return (
            <figure
              key={img.id}
              className="relative w-full break-inside-avoid overflow-hidden rounded-2xl bg-secondary shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded images from Supabase Storage */}
              <img src={img.image_path} alt={label} className="w-full object-cover" loading="lazy" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-black/40 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm">
                {label}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
