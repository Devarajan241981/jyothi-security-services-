import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Server-side Supabase client bound to the current request's cookies.
 * With no signed-in admin session this resolves to the `anon` role (used by
 * the public enquiry/application server actions); with a session it resolves
 * to `authenticated` (used throughout the admin panel).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll is called from a Server Component during render, where
            // cookies can't be written. Safe to ignore when middleware also
            // refreshes the session.
          }
        },
      },
    },
  );
}

/**
 * Public-site variant that tolerates missing Supabase env vars so marketing
 * pages still render before Supabase is configured. Returns null when the
 * env vars are absent; callers must handle the null case.
 */
export async function createPublicClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  return createClient();
}
