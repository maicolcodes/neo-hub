import Link from "next/link";
import { loginAction } from "@/app/actions";

export const dynamic = "force-dynamic";

type SP = { error?: string; next?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const errorMsg = sp?.error ? decodeURIComponent(sp.error) : null;
  const next = sp?.next ? sp.next : "";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">NEO HUB</h1>
        <p className="mt-2 text-white/70">Acesse com seu email e senha.</p>

        {errorMsg && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {errorMsg}
          </div>
        )}

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />

          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              name="email"
              type="email"
              placeholder="voce@exemplo.com"
              required
              className="mt-2 w-full rounded-xl bg-white/90 text-slate-900 placeholder-slate-500 px-4 py-3 outline-none ring-1 ring-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Senha</label>
            <input
              name="password"
              type="password"
              placeholder="********"
              required
              className="mt-2 w-full rounded-xl bg-white/10 text-white placeholder-white/30 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold py-3"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-white/70">
          <span>Não tem conta?</span>
          <Link className="text-white hover:text-white/90 underline" href="/cadastrar">
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
