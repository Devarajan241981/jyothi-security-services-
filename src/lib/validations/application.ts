import { z } from "zod";
import { languageSlugs } from "@/lib/validations/enquiry";

const indianPhoneRegex = /^[6-9]\d{9}$/;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_UPLOAD_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

export const applicationSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your full name.").max(120),
  age: z
    .number()
    .int()
    .min(18, "Please enter a valid age between 18 and 60.")
    .max(60, "Please enter a valid age between 18 and 60."),
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, "Please enter a valid 10-digit phone number."),
  address: z.string().trim().min(1, "Please enter your complete address.").max(500),
  experience: z.string().trim().max(1000).optional().or(z.literal("")),
  languages: z.array(z.enum(languageSlugs)),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
