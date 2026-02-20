import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1) Se NÃO está logado: bloqueia rotas protegidas
  if (!user) {
    if (
      path.startsWith('/painel') ||
      path.startsWith('/painel-orientador') ||
      path.startsWith('/lancar-missao') ||
      path.startsWith('/pos-login')
    ) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  // 2) Logado: busca role no profiles (o que manda no app)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = profile?.role as ('aluno' | 'orientador' | null | undefined)

  // 3) Se NÃO tem role ainda e está tentando acessar rotas do app: força escolher perfil
  if (!role && (
    path.startsWith('/painel') ||
    path.startsWith('/painel-orientador') ||
    path.startsWith('/lancar-missao')
  )) {
    return NextResponse.redirect(new URL('/pos-login', request.url))
  }

  // 4) Se já tem role e está em /pos-login, manda pro painel correto
  if (path === '/pos-login' && role === 'orientador') {
    return NextResponse.redirect(new URL('/painel-orientador', request.url))
  }
  if (path === '/pos-login' && role === 'aluno') {
    return NextResponse.redirect(new URL('/painel', request.url))
  }

  // 5) Proteções cruzadas
  if (path === '/painel' && role === 'orientador') {
    return NextResponse.redirect(new URL('/painel-orientador', request.url))
  }
  if (path === '/painel-orientador' && role === 'aluno') {
    return NextResponse.redirect(new URL('/painel', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/painel', '/painel-orientador', '/lancar-missao/:path*', '/pos-login'],
}

