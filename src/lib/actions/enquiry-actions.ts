"use server";

import { headers } from "next/headers";
import { enquirySchema } from "@/lib/validations/enquiry";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEnquiryNotification } from "@/lib/email/resend";
import { createClient } from "@/lib/supabase/server";

export type SubmitEnquiryResult =
  | { success: true }
  | { success: false; error: string };

export async function submitEnquiry(
  input: Record<string, unknown>,
): Promise<SubmitEnquiryResult> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  const { allowed } = checkRateLimit(`enquiry:${ip}`);
  if (!allowed) {
    return {
      success: false,
      error: "Too many requests. Please try again in a minute.",
    };
  }

  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  // Honeypot: silently pretend success so bots don't learn anything.
  if (parsed.data.website) {
    return { success: true };
  }

  // Anything below depends on Supabase being reachable and configured. If it
  // isn't (missing env vars, network issue, etc.), fail gracefully instead of
  // throwing — a visitor should never see a crashed page.
  //
  // This goes through the `submit_enquiry` SECURITY DEFINER function rather
  // than a direct `.insert()`. On this project, direct anon inserts via the
  // REST API were rejected with a row-level-security error even with a
  // correct, verified INSERT policy and GRANT in place (reproduced with a
  // fresh, unrelated test table too) — an RPC through a narrowly-scoped
  // function is the documented Postgres/Supabase workaround for that class
  // of issue and is what actually works here.
  try {
    const supabase = await createClient();
    const { data, error: rpcError } = await supabase.rpc("submit_enquiry", {
      p_premises_type: parsed.data.premisesType,
      p_company_name: parsed.data.companyName,
      p_contact_person: parsed.data.contactPerson,
      p_phone: parsed.data.phone,
      p_location: parsed.data.location,
      p_guard_count: parsed.data.guardCount,
      p_guard_type: parsed.data.guardType,
      p_languages: parsed.data.languages,
      p_shift: parsed.data.shift,
      p_email: parsed.data.email || null,
      p_preferred_age: parsed.data.preferredAge || null,
      p_additional_requirements: parsed.data.additionalRequirements || null,
    });

    if (rpcError || !data) {
      console.error("submitEnquiry insert failed:", rpcError);
      return {
        success: false,
        error: "We couldn't save your request. Please call or WhatsApp us directly.",
      };
    }

    // The enquiry is safely stored — email delivery is best-effort from here.
    const emailResult = await sendEnquiryNotification(parsed.data);
    await supabase
      .from("enquiries")
      .update({
        email_sent: emailResult.sent,
        email_error: emailResult.error ?? null,
      })
      .eq("id", data);

    return { success: true };
  } catch (err) {
    console.error("submitEnquiry unexpected error:", err);
    return {
      success: false,
      error: "We couldn't save your request. Please call or WhatsApp us directly.",
    };
  }
}
