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

  // se não está logado, manda pro /login (não /entrar)
  if (!user) {
    if (path.startsWith('/painel') || path.startsWith('/lancar-missao') || path.startsWith('/painel-orientador') || path.startsWith('/pos-login')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  // busca role no profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role

  // se role ainda não foi definido, força /pos-login
  if (!role && (path === '/painel' || path === '/painel-orientador' || path.startsWith('/lancar-missao'))) {
    return NextResponse.redirect(new URL('/pos-login', request.url))
  }

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
