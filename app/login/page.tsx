export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { loginAction } from "@/app/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const sp = await searchParams;
  const error = sp?.error ?? "";
  const next = sp?.next ?? "";

  return (
    <main className="min-h-screen neo-bg text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,.55)]">
        <h1 className="text-3xl font-extrabold tracking-tight">Entrar</h1>
        <p className="mt-1 text-white/70">Acesse com seu email e senha.</p>

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />

          <div className="space-y-2">
            <label className="text-sm text-white/80">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl bg-white text-black px-4 py-3 outline-none"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Senha</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none"
              placeholder=""
            />
          </div>

          <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700 transition">
            Entrar
          </button>

          {error ? <p className="text-sm text-red-400">Erro: {error}</p> : null}
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-white/70">
          <span>Não tem conta?</span>
          <Link className="text-white hover:underline" href="/cadastrar">Criar conta</Link>
        </div>
      </div>
    </main>
  );
}
