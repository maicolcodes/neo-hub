'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function SelecionarAreaOrientador() {
  const router = useRouter()
  const params = useSearchParams()
  const area = params.get('id')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function salvar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !area) { router.push('/painel-orientador'); return }

      await supabase
        .from('profiles')
        .update({ area })
        .eq('id', user.id)

      router.push('/painel-orientador')
    }
    salvar()
  }, [])

  return (
    <main className="min-h-screen bg-[#080c14] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-4xl mb-4"></div>
        <p className="text-white/50 text-sm">Salvando sua área...</p>
      </div>$ErrorActionPreference="Stop"

if (-not (Test-Path "package.json")) { throw "Rode na raiz do projeto (onde existe package.json)." }

function BackupFile([string]$path){
  if (Test-Path $path) {
    $bakDir = ".neo_backup_" + (Get-Date -Format "yyyyMMdd-HHmmss")
    New-Item -ItemType Directory -Path $bakDir -Force | Out-Null
    $dest = Join-Path $bakDir ($path -replace "[:\\\/]","_")
    Copy-Item $path $dest -Force
    Write-Host "Backup: $path -> $dest" -ForegroundColor DarkYellow
  }
}
function WriteUtf8([string]$path,[string]$content){
  New-Item -ItemType Directory -Path (Split-Path $path) -Force | Out-Null
  Set-Content -Path $path -Value $content -Encoding UTF8
  Write-Host "Escrevi: $path" -ForegroundColor Green
}

# Detecta app root
$appRoot = $null
if (Test-Path "src\app") { $appRoot = "src\app" }
elseif (Test-Path "app") { $appRoot = "app" }
else { throw "Não achei src/app nem app. Seu projeto não está no App Router." }

# Paths
$mwPath = if (Test-Path "middleware.ts") { "middleware.ts" } elseif (Test-Path "src\middleware.ts") { "src\middleware.ts" } else { "middleware.ts" }
$loginPath = Join-Path $appRoot "login\page.tsx"
$posLoginPath = Join-Path $appRoot "pos-login\page.tsx"

BackupFile $mwPath
BackupFile $loginPath
BackupFile $posLoginPath

# 1) middleware.ts (LIMPO, sem loop)
$middleware = @'
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
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const path = request.nextUrl.pathname;

  // Rotas públicas
  const isPublic =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/cadastrar") ||
    path.startsWith("/cadastro") ||
    path.startsWith("/entrar");

  // Rotas que exigem login
  const isProtected =
    path.startsWith("/painel") ||
    path.startsWith("/painel-orientador") ||
    path.startsWith("/lancar-missao") ||
    path.startsWith("/pos-login");

  const { data: { user } } = await supabase.auth.getUser();

  // 1) Não logado tentando rota protegida -> login
  if (!user && isProtected) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // 2) Logado: se está em rota protegida, valida role no profiles
  if (user && isProtected) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = (profile as any)?.role as ("aluno" | "orientador" | null) ?? null;

    // Se NÃO tem role ainda, força /pos-login (mas evita loop se já está lá)
    if (!role && path !== "/pos-login") {
      return NextResponse.redirect(new URL("/pos-login", request.url));
    }

    // Se já tem role e está em /pos-login, manda pro painel correto
    if (path === "/pos-login" && role === "aluno") {
      return NextResponse.redirect(new URL("/painel", request.url));
    }
    if (path === "/pos-login" && role === "orientador") {
      return NextResponse.redirect(new URL("/painel-orientador", request.url));
    }

    // Guardas de painel por role
    if (path.startsWith("/painel-orientador") && role === "aluno") {
      return NextResponse.redirect(new URL("/painel", request.url));
    }
    if (path.startsWith("/painel") && !path.startsWith("/painel-orientador") && role === "orientador") {
      return NextResponse.redirect(new URL("/painel-orientador", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/painel/:path*", "/painel-orientador/:path*", "/lancar-missao/:path*", "/pos-login"],
};
'@

WriteUtf8 $mwPath $middleware

# 2) login/page.tsx (CLIENT; após login manda pra /pos-login)
$login = @'
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

function makeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  return createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = useMemo(() => {
    try { return makeSupabase(); }
    catch (e: any) { setErrorMsg(e?.message ?? "Erro ao iniciar Supabase."); return null; }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) { setErrorMsg(error.message); return; }
      // Sempre vai pro portão (pos-login). O middleware decide o destino final.
      window.location.href = "/pos-login";
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Erro inesperado no login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/5 backdrop-blur border border-white/10 shadow-2xl p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">NEO HUB</h1>
          <p className="text-slate-300 mt-2">Entre com email e senha.</p>
        </div>

        {errorMsg ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">{errorMsg}</div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-200 mb-2">Email</label>
            <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
          </div>

          <div>
            <label className="block text-slate-200 mb-2">Senha</label>
            <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              value={senha} onChange={(e) => setSenha(e.target.value)} type="password" autoComplete="current-password" required />
          </div>

          <button disabled={loading} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 transition" type="submit">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-slate-300">
          <span>Não tem conta?</span>
          <Link className="underline hover:text-white" href="/cadastrar">Criar conta</Link>
        </div>
      </div>
    </main>
  );
}
'@

WriteUtf8 $loginPath $login

# 3) pos-login/page.tsx (CLIENT; escolhe role e área; dá opção "pular")
$posLogin = @'
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Role = "aluno" | "orientador";
type Area = "humanas" | "exatas" | "biologicas" | "tecnologia";

const AREAS: { id: Area; titulo: string; desc: string }[] = [
  { id: "humanas", titulo: "Humanas", desc: "História, Filosofia, Sociologia, Direito..." },
  { id: "exatas", titulo: "Exatas", desc: "Matemática, Física, Química, Engenharias..." },
  { id: "biologicas", titulo: "Biológicas", desc: "Medicina, Biologia, Farmácia, Nutrição..." },
  { id: "tecnologia", titulo: "Tecnologia", desc: "TI, Programação, Sistemas, IA..." },
];

function makeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  return createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

export default function PosLoginPage() {
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [step, setStep] = useState<"role" | "area">("role");
  const [msg, setMsg] = useState<string>("");

  const supabase = useMemo(() => makeSupabase(), []);

  useEffect(() => {
    (async () => {
      setMsg("");
      setLoading(true);
      const { data: s } = await supabase.auth.getSession();
      const session = s.session;
      if (!session?.user) {
        window.location.href = "/login";
        return;
      }
      const id = session.user.id;
      setUid(id);

      const { data: prof } = await supabase
        .from("profiles")
        .select("role, area")
        .eq("id", id)
        .maybeSingle();

      const r = (prof as any)?.role ?? null;
      const a = (prof as any)?.area ?? null;

      if (r === "aluno" || r === "orientador") {
        setRole(r);
        setStep("area");
      }
      if (a) setArea(a);

      setLoading(false);
    })();
  }, [supabase]);

  async function saveRole(nextRole: Role) {
    if (!uid) return;
    setMsg("");
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: uid, role: nextRole }, { onConflict: "id" });
    if (error) {
      setMsg("Erro ao salvar role no profiles: " + error.message);
      setLoading(false);
      return;
    }
    setRole(nextRole);
    setStep("area");
    setLoading(false);
  }

  async function saveArea(nextArea: Area | null) {
    if (!uid || !role) return;
    setMsg("");
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ area: nextArea })
      .eq("id", uid);

    if (error) {
      setMsg("Erro ao salvar área: " + error.message);
      setLoading(false);
      return;
    }

    // destino final
    window.location.href = role === "orientador" ? "/painel-orientador" : "/painel";
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="opacity-80">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white/5 backdrop-blur border border-white/10 shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-extrabold">Configuração rápida</h1>
        <p className="text-slate-300 mt-2">1 minuto e você segue o fluxo certo (aluno/orientador).</p>

        {msg ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">{msg}</div>
        ) : null}

        {step === "role" ? (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Você é:</h2>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => saveRole("aluno")}
                className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold">
                Sou ALUNO
              </button>
              <button onClick={() => saveRole("orientador")}
                className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold">
                Sou ORIENTADOR
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Sua área (pode pular):</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {AREAS.map((a) => (
                <button key={a.id} onClick={() => saveArea(a.id)}
                  className="text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10">
                  <div className="font-bold">{a.titulo}</div>
                  <div className="text-sm text-white/60 mt-1">{a.desc}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={() => saveArea(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10">
                Pular por enquanto
              </button>
              <button onClick={() => { setStep("role"); setRole(null); }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10">
                Voltar e trocar papel
              </button>
            </div>

            {area ? (
              <p className="mt-3 text-sm text-white/50">Área atual salva: <b>{area}</b></p>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
'@

WriteUtf8 $posLoginPath $posLogin

Write-Host "`nOK. Agora rode o dev de novo:" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor Cyan
    </main>
  )
