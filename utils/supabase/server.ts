import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Next pode mudar a API; aqui fica resiliente.
          const all = (cookieStore as any).getAll?.();
          if (Array.isArray(all)) return all;
          return [];
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              (cookieStore as any).set?.(name, value, options);
            }
          } catch {
            // Em alguns contexts (ex: Server Components) set pode ser bloqueado.
            // A autenticação ainda funciona porque o Supabase lida com refresh via requests seguintes.
          }
        },
      },
    }
  );
}
