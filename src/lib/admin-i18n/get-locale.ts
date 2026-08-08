import { cookies } from "next/headers";
import { ADMIN_LOCALE_COOKIE, adminDictionaries, type AdminLocale } from "./dictionaries";

export async function getAdminLocale(): Promise<AdminLocale> {
  const store = await cookies();
  const value = store.get(ADMIN_LOCALE_COOKIE)?.value;
  return value === "kn" ? "kn" : "en";
}

export async function getAdminDictionary() {
  const locale = await getAdminLocale();
  return { locale, dict: adminDictionaries[locale] };
}
