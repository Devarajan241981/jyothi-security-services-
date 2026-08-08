import { z } from "zod";

export const premisesTypes = [
  "school",
  "college",
  "hospital",
  "industry",
  "factory",
  "office",
  "warehouse",
  "apartment",
  "bank",
  "hotel",
  "constructionSite",
  "shoppingMall",
  "other",
] as const;

export const guardTypes = ["male", "female", "both"] as const;
export const shiftTypes = ["day", "night", "both"] as const;
export const languageSlugs = ["kannada", "english", "hindi", "telugu", "tamil"] as const;

const indianPhoneRegex = /^[6-9]\d{9}$/;

export const enquirySchema = z.object({
  premisesType: z.enum(premisesTypes, {
    message: "Please select who needs security.",
  }),
  companyName: z.string().trim().min(1, "Please enter your organisation's name.").max(200),
  contactPerson: z.string().trim().min(1, "Please enter a contact person's name.").max(120),
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, "Please enter a valid 10-digit phone number."),
  email: z
    .union([z.literal(""), z.string().trim().email("Please enter a valid email address.")])
    .optional(),
  location: z.string().trim().min(1, "Please enter the premises location.").max(300),
  guardCount: z.number().int().min(1).max(500),
  guardType: z.enum(guardTypes, { message: "Please select a preferred guard type." }),
  preferredAge: z.string().trim().max(60).optional().or(z.literal("")),
  languages: z.array(z.enum(languageSlugs)),
  shift: z.enum(shiftTypes, { message: "Please select a preferred shift." }),
  additionalRequirements: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot field: real visitors never fill this in. Bots that
  // autofill every input will, and we silently drop the submission.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
