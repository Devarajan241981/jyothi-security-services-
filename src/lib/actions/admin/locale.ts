"use server";

import { cookies } from "next/headers";
import { ADMIN_LOCALE_COOKIE, type AdminLocale } from "@/lib/admin-i18n/dictionaries";

export async function setAdminLocale(locale: AdminLocale) {
  const store = await cookies();
  store.set(ADMIN_LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
