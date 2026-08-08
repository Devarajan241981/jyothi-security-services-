"use server";

import { headers } from "next/headers";
import { randomUUID } from "crypto";
import {
  applicationSchema,
  MAX_UPLOAD_BYTES,
  ACCEPTED_UPLOAD_TYPES,
} from "@/lib/validations/application";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendApplicationNotification } from "@/lib/email/resend";
import { createClient } from "@/lib/supabase/server";

export type SubmitApplicationResult =
  | { success: true }
  | { success: false; error: string };

function extensionFor(file: File) {
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  return "jpg";
}

async function uploadIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File | null,
  folder: string,
): Promise<{ path: string | null; error?: string }> {
  if (!file || file.size === 0) return { path: null };

  if (file.size > MAX_UPLOAD_BYTES) {
    return { path: null, error: "File must be smaller than 5 MB." };
  }
  if (!ACCEPTED_UPLOAD_TYPES.includes(file.type)) {
    return { path: null, error: "Only PDF, JPG or PNG files are accepted." };
  }

  const path = `${folder}/${randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage.from("applications").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return { path: null, error: "File upload failed. Please try again." };
  return { path };
}

export async function submitApplication(
  formData: FormData,
): Promise<SubmitApplicationResult> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  const { allowed } = checkRateLimit(`application:${ip}`);
  if (!allowed) {
    return {
      success: false,
      error: "Too many requests. Please try again in a minute.",
    };
  }

  const languages = formData.getAll("languages").map(String);

  const parsed = applicationSchema.safeParse({
    fullName: formData.get("fullName"),
    age: Number(formData.get("age")),
    phone: formData.get("phone"),
    address: formData.get("address"),
    experience: formData.get("experience") ?? "",
    languages,
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  if (parsed.data.website) {
    return { success: true };
  }

  // Anything below depends on Supabase being reachable and configured. If it
  // isn't (missing env vars, network issue, etc.), fail gracefully instead of
  // throwing — an applicant should never see a crashed page.
  try {
    const supabase = await createClient();
    const applicantId = randomUUID();

    const aadhaarFile = formData.get("aadhaar");

    const aadhaarUpload = await uploadIfPresent(
      supabase,
      aadhaarFile instanceof File ? aadhaarFile : null,
      `${applicantId}/aadhaar`,
    );
    if (aadhaarUpload.error) {
      return { success: false, error: aadhaarUpload.error };
    }

    // Goes through the submit_job_application SECURITY DEFINER function —
    // see the comment in enquiry-actions.ts for why a direct .insert() isn't
    // used here.
    const { data, error: rpcError } = await supabase.rpc("submit_job_application", {
      p_full_name: parsed.data.fullName,
      p_age: parsed.data.age,
      p_phone: parsed.data.phone,
      p_address: parsed.data.address,
      p_experience: parsed.data.experience || null,
      p_languages: parsed.data.languages,
      p_aadhaar_path: aadhaarUpload.path,
    });

    if (rpcError || !data) {
      return {
        success: false,
        error: "We couldn't save your application. Please call or WhatsApp us directly.",
      };
    }

    const emailResult = await sendApplicationNotification(parsed.data);
    await supabase
      .from("job_applications")
      .update({
        email_sent: emailResult.sent,
        email_error: emailResult.error ?? null,
      })
      .eq("id", data);

    return { success: true };
  } catch {
    return {
      success: false,
      error: "We couldn't save your application. Please call or WhatsApp us directly.",
    };
  }
}
