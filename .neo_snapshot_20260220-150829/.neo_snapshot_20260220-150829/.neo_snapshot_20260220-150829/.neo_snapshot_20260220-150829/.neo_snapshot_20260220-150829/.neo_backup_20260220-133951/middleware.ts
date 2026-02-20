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

  
    param($m)
    $block = $m.Value
    # insere /pos-login no mesmo guard de painel/lancar-missao
    $block -replace "if \(path\.startsWith\('/painel'\) \|\| path\.startsWith\('/lancar-missao'\)\)", "if (path.startsWith('/painel') || path.startsWith('/lancar-missao') || path.startsWith('/pos-login'))"
  
    return supabaseResponse
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role

  // Se não tem role no profiles, força escolher em /pos-login
  if (!role && (path.startsWith('/painel') || path.startsWith('/painel-orientador') || path.startsWith('/lancar-missao'))) {
    return NextResponse.redirect(new URL('/pos-login', request.url))
  }

  // Se já tem role e está em /pos-login, manda pro painel certo
  if (path === '/pos-login' && role === 'orientador') {
    return NextResponse.redirect(new URL('/painel-orientador', request.url))
  }
  if (path === '/pos-login' && role === 'aluno') {
    return NextResponse.redirect(new URL('/painel', request.url))
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
  matcher: ['/painel', '/painel-orientador', '/lancar-missao/:path*'],
}

