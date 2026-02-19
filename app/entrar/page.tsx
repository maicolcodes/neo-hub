import Link from "next/link";
import { loginAction } from "@/app/actions";

export const dynamic = "force-dynamic";

export default function EntrarPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string };
}) {
  const error = searchParams?.error ? decodeURIComponent(searchParams.error) : "";

  return (
    <main className="min-h-[100svh] w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            NEO HUB
          </h1>
          <p className="mt-2 text-white/70">Entrar</p>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-100">
            {error}
          </div>
        ) : null}

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={searchParams?.next || ""} />

          <div>
            <input
              name="email"
              type="email"
              required
              placeholder="seuemail@dominio.com"
              className="w-full rounded-2xl bg-white/90 px-4 py-3 text-slate-900 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              required
              placeholder=""
              className="w-full rounded-2xl bg-white/90 px-4 py-3 text-slate-900 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 transition"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/cadastrar"
            className="text-white/70 hover:text-white underline underline-offset-4"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
