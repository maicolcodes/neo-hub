import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const path = request.nextUrl.pathname;
  const nextParam = encodeURIComponent(path + (request.nextUrl.search || ""));

  // 1) Auth
  const { data: { user } } = await supabase.auth.getUser();

  // Rotas "protegidas" (precisa estar logado)
  const isProtected =
    path.startsWith("/painel") ||
    path.startsWith("/painel-orientador") ||
    path.startsWith("/lancar-missao") ||
    path.startsWith("/pos-login");

  if (!user) {
    if (isProtected) {
      return NextResponse.redirect(new URL(`/login?next=${nextParam}`, request.url));
    }
    return response;
  }

  // 2) Logado -> pega role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile as any)?.role as ("aluno" | "orientador" | null);

  // Se ainda NÃO tem role, força /pos-login (MAS NÃO gera loop)
  if (!role && path !== "/pos-login") {
    return NextResponse.redirect(new URL("/pos-login", request.url));
  }

  // Se já tem role e tentar abrir /pos-login, manda pro painel certo
  if (role && path === "/pos-login") {
    return NextResponse.redirect(
      new URL(role === "orientador" ? "/painel-orientador" : "/painel", request.url)
    );
  }

  // Protege cruzamento de painéis
  if (role === "orientador" && path === "/painel") {
    return NextResponse.redirect(new URL("/painel-orientador", request.url));
  }
  if (role === "aluno" && path === "/painel-orientador") {
    return NextResponse.redirect(new URL("/painel", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/painel/:path*", "/painel-orientador/:path*", "/lancar-missao/:path*", "/pos-login"],
};
