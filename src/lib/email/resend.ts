import { Resend } from "resend";
import { siteConfig } from "@/lib/constants/site";
import type { EnquiryInput } from "@/lib/validations/enquiry";
import type { ApplicationInput } from "@/lib/validations/application";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromAddress = process.env.RESEND_FROM_EMAIL ?? "JSS Website <onboarding@resend.dev>";
const notifyAddress = process.env.NOTIFY_EMAIL ?? siteConfig.email;

type EmailResult = { sent: boolean; error?: string };

function row(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "";
  return `<tr><td style="padding:6px 12px;color:#5b6b82;font-size:13px;">${label}</td><td style="padding:6px 12px;color:#0f1a2b;font-size:14px;font-weight:600;">${value}</td></tr>`;
}

function wrapEmail(title: string, bodyRows: string) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
    <div style="background:#0b5ed7;padding:20px 24px;border-radius:12px 12px 0 0;">
      <p style="color:#ffffff;font-size:18px;font-weight:700;margin:0;">JSS — ${title}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
      ${bodyRows}
    </table>
  </div>`;
}

export async function sendEnquiryNotification(
  enquiry: EnquiryInput,
): Promise<EmailResult> {
  if (!resend) {
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const html = wrapEmail(
      "New Security Guard Request",
      [
        row("Premises Type", enquiry.premisesType),
        row("Organisation", enquiry.companyName),
        row("Contact Person", enquiry.contactPerson),
        row("Phone", enquiry.phone),
        row("Email", enquiry.email),
        row("Location", enquiry.location),
        row("Guards Needed", enquiry.guardCount),
        row("Guard Type", enquiry.guardType),
        row("Preferred Age", enquiry.preferredAge),
        row("Languages", enquiry.languages?.join(", ")),
        row("Shift", enquiry.shift),
        row("Additional Requirements", enquiry.additionalRequirements),
      ].join(""),
    );

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: notifyAddress,
      subject: `New guard request from ${enquiry.companyName}`,
      html,
    });

    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Unknown email error" };
  }
}

export async function sendApplicationNotification(
  application: ApplicationInput,
): Promise<EmailResult> {
  if (!resend) {
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const html = wrapEmail(
      "New Job Application",
      [
        row("Full Name", application.fullName),
        row("Age", application.age),
        row("Phone", application.phone),
        row("Address", application.address),
        row("Experience", application.experience),
        row("Languages", application.languages?.join(", ")),
      ].join(""),
    );

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: notifyAddress,
      subject: `New guard job application from ${application.fullName}`,
      html,
    });

    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Unknown email error" };
  }
}
