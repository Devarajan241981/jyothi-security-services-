"use client";

import { createContext, useContext } from "react";
import type { AdminDictionary, AdminLocale } from "./dictionaries";

const AdminIntlContext = createContext<{ locale: AdminLocale; dict: AdminDictionary } | null>(
  null,
);

export function AdminIntlProvider({
  locale,
  dict,
  children,
}: {
  locale: AdminLocale;
  dict: AdminDictionary;
  children: React.ReactNode;
}) {
  return (
    <AdminIntlContext.Provider value={{ locale, dict }}>{children}</AdminIntlContext.Provider>
  );
}

export function useAdminDict() {
  const ctx = useContext(AdminIntlContext);
  if (!ctx) throw new Error("useAdminDict must be used within AdminIntlProvider");
  return ctx;
}
