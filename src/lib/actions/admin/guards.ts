"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type GuardInsert = Database["public"]["Tables"]["guards"]["Insert"];

export type ActionResult = { success: true } | { success: false; error: string };

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

async function nextGuardCode(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { count } = await supabase.from("guards").select("id", { count: "exact", head: true });
  const next = (count ?? 0) + 1;
  return `JSS-${String(next).padStart(4, "0")}`;
}

export async function createGuard(input: Omit<GuardInsert, "guard_code">): Promise<ActionResult> {
  const supabase = await createClient();
  const guard_code = await nextGuardCode(supabase);

  const { error } = await supabase.from("guards").insert({ ...input, guard_code });
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/guards");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateGuard(id: string, input: Partial<GuardInsert>): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("guards").update(input).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/guards");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteGuard(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("guards").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/guards");
  revalidatePath("/admin");
  return { success: true };
}

function extensionFor(file: File) {
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  return "jpg";
}

export async function uploadGuardDocument(
  guardId: string,
  field: "aadhaar_path" | "photo_path",
  file: File,
): Promise<ActionResult> {
  if (file.size > MAX_UPLOAD_BYTES) {
    return { success: false, error: "File must be smaller than 5 MB." };
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { success: false, error: "Only PDF, JPG or PNG files are accepted." };
  }

  const supabase = await createClient();
  const folder = field === "aadhaar_path" ? "aadhaar" : "photo";
  const path = `${guardId}/${folder}/${randomUUID()}.${extensionFor(file)}`;

  const { error: uploadError } = await supabase.storage
    .from("guards")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return { success: false, error: "Upload failed. Please try again." };

  const update = field === "aadhaar_path" ? { aadhaar_path: path } : { photo_path: path };
  const { error: updateError } = await supabase.from("guards").update(update).eq("id", guardId);
  if (updateError) return { success: false, error: updateError.message };

  revalidatePath(`/admin/guards/${guardId}`);
  revalidatePath("/admin/guards");
  return { success: true };
}

export async function getGuardDocumentUrl(
  path: string,
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("guards").createSignedUrl(path, 60 * 5);
  if (error || !data) return { error: "Could not generate file link." };
  return { url: data.signedUrl };
}
