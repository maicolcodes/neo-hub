import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/painel', '/painel-orientador', '/lancar-missao', '/pos-login']

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

  const path = request.nextUrl.pathname

  const { data: { user } } = await supabase.auth.getUser()

  // A) Se não logado, bloqueia rotas protegidas
  if (!user) {
    if (PROTECTED_PREFIXES.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  // B) Logado: role/area vem de profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, area')
    .eq('id', user.id)
    .maybeSingle()

  const role = (profile?.role ?? null) as ('aluno'|'orientador'|null)
  const area = (profile?.area ?? null) as (string|null)

  // C) Sem role → sempre /pos-login (menos se já estiver em /pos-login)
  if (!role && path !== '/pos-login') {
    if (PROTECTED_PREFIXES.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/pos-login', request.url))
    }
  }

  // D) Se está em /pos-login mas já tem role → manda pro painel certo
  if (path === '/pos-login' && role === 'aluno') {
    return NextResponse.redirect(new URL('/painel', request.url))
  }
  if (path === '/pos-login' && role === 'orientador') {
    return NextResponse.redirect(new URL('/painel-orientador', request.url))
  }

  // E) Role fixo: bloqueios cruzados
  if (path.startsWith('/painel-orientador') && role === 'aluno') {
    return NextResponse.redirect(new URL('/painel', request.url))
  }
  if (path.startsWith('/painel') && role === 'orientador') {
    return NextResponse.redirect(new URL('/painel-orientador', request.url))
  }

  // F) Forçar escolha de área (só depois do role existir)
  if (role === 'aluno' && !area && path !== '/painel/area' && path !== '/painel') {
    // deixa /painel abrir pra mostrar cards de área, mas se tentar outras rotas manda pra área
    if (path.startsWith('/lancar-missao')) {
      return NextResponse.redirect(new URL('/painel/area', request.url))
    }
  }
  if (role === 'orientador' && !area && path !== '/painel-orientador/area' && path !== '/painel-orientador') {
    if (path.startsWith('/lancar-missao')) {
      return NextResponse.redirect(new URL('/painel-orientador/area', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/painel/:path*', '/painel-orientador/:path*', '/lancar-missao/:path*', '/pos-login'],
}
