import Link from "next/link";
import { loginAction } from "@/app/actions";

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/5 backdrop-blur border border-white/10 shadow-2xl p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">NEO HUB</h1>
          <p className="text-slate-300 mt-2">Entre com seu email e senha.</p>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">
            {decodeURIComponent(error)}
          </div>
        ) : null}

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-slate-200 mb-2">Email</label>
            <input
              name="email"
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-slate-200 mb-2">Senha</label>
            <input
              name="password"
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              type="password"
              autoComplete="current-password"
              minLength={6}
              required
            />
          </div>

          <button
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 transition"
            type="submit"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-slate-300">
          <span>Não tem conta?</span>
          <Link className="underline hover:text-white" href="/cadastro">
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}