export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { signupAction } from "@/app/actions";

export default async function CadastrarPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  const error = sp?.error ?? "";

  return (
    <main className="min-h-screen neo-bg text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,.55)]">
        <h1 className="text-3xl font-extrabold tracking-tight">Criar conta</h1>
        <p className="mt-1 text-white/70">Escolha seu papel e finalize.</p>

        <form action={signupAction} className="mt-6 space-y-4">
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

          <div className="space-y-2">
            <label className="text-sm text-white/80">Tipo</label>
            <select name="role" className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none">
              <option value="aluno">Aluno</option>
              <option value="orientador">Orientador</option>
            </select>
          </div>

          <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700 transition">
            Criar conta
          </button>

          {error ? <p className="text-sm text-red-400">Erro: {error}</p> : null}
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-white/70">
          <span>Já tem conta?</span>
          <Link className="text-white hover:underline" href="/login">Entrar</Link>
        </div>
      </div>
    </main>
  );
}
