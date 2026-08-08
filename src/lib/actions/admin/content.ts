"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"];
type TestimonialUpdate = Database["public"]["Tables"]["testimonials"]["Update"];

export type ActionResult = { success: true } | { success: false; error: string };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function revalidateTestimonialPaths() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/kn");
  revalidatePath("/hi");
  revalidatePath("/te");
  revalidatePath("/testimonials");
  revalidatePath("/kn/testimonials");
  revalidatePath("/hi/testimonials");
  revalidatePath("/te/testimonials");
}

function revalidateGalleryPaths() {
  revalidatePath("/admin/settings");
  revalidatePath("/gallery");
  revalidatePath("/kn/gallery");
  revalidatePath("/hi/gallery");
  revalidatePath("/te/gallery");
}

function extensionFor(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function createTestimonial(input: TestimonialInsert): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(input);
  if (error) return { success: false, error: error.message };
  revalidateTestimonialPaths();
  return { success: true };
}

export async function updateTestimonial(id: string, input: TestimonialUpdate): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update(input).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateTestimonialPaths();
  return { success: true };
}

export async function toggleTestimonialPublished(id: string, is_published: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update({ is_published }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateTestimonialPaths();
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateTestimonialPaths();
  return { success: true };
}

export async function uploadGalleryImage(
  file: File,
  category: string,
  caption: string,
): Promise<ActionResult> {
  if (file.size > MAX_IMAGE_BYTES) {
    return { success: false, error: "Image must be smaller than 5 MB." };
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { success: false, error: "Only JPG, PNG or WEBP images are accepted." };
  }

  const supabase = await createClient();
  const path = `${category}/${randomUUID()}.${extensionFor(file)}`;

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return { success: false, error: "Upload failed. Please try again." };

  const { data: publicUrlData } = supabase.storage.from("gallery").getPublicUrl(path);

  const { error: insertError } = await supabase.from("gallery_images").insert({
    image_path: publicUrlData.publicUrl,
    category,
    caption: caption || null,
    is_published: true,
  });
  if (insertError) return { success: false, error: insertError.message };

  revalidateGalleryPaths();
  return { success: true };
}

export async function toggleGalleryPublished(id: string, is_published: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_images").update({ is_published }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateGalleryPaths();
  return { success: true };
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateGalleryPaths();
  return { success: true };
}
