import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

/**
 * Cliente Supabase para Server Components / Route Handlers (App Router)
 */
export function createServerSupabase() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anon = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const cookieStore = cookies() as any;

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        // Next pode variar a API de cookies entre versões
        if (typeof cookieStore.getAll === "function") return cookieStore.getAll();
        return [];
      },
      setAll(cookiesToSet) {
        // Em Server Components, set pode falhar em algumas situações (ex: render)
        // Mas para login/logout via Server Action geralmente funciona.
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (typeof cookieStore.set === "function") cookieStore.set(name, value, options);
          });
        } catch {
          // ignore
        }
      },
    },
  });
}

/**
 * Alias para compatibilidade com imports antigos:
 * import { createClient } from "@/utils/supabase/server"
 */
export function createClient() {
  return createServerSupabase();
}
