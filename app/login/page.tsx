import Link from "next/link";
import { loginAction } from "@/app/actions";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const error = sp?.error;

  return (
    <main className="neo-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black shadow-lg shadow-blue-600/30">
              N
            </div>
            <span className="font-black tracking-wider text-xl">
              NEO <span className="gradient-text-blue italic">HUB</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black mb-1">Bem-vindo de volta</h1>
          <p className="text-white/45 text-sm">Entre para continuar sua jornada acadêmica.</p>
        </div>

        <div className="neo-card neo-glass p-7">
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-red-200 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input
                name="email"
                className="neo-input"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Senha</label>
              <input
                name="password"
                className="neo-input"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="neo-btn-primary w-full justify-center py-3.5 mt-2">
              Entrar <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/45">
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-blue-400 hover:text-blue-300 transition font-medium">
              Criar conta grátis
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}