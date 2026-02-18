export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { login } from "@/app/actions";

type SP = { next?: string; error?: string };

export default async function LoginPage({
  searchParams,
}: {
  // Next 16 (Turbopack) trata searchParams como Promise em alguns cenários
  searchParams?: Promise<SP> | SP;
}) {
  const sp = (await (searchParams as any)) as SP | undefined;

  const next = sp?.next ?? "/painel";
  const error = sp?.error ?? "";

  return (
    <main className="neo-bg min-h-screen text-white flex items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-black/20 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <h1 className="text-3xl font-extrabold">Entrar</h1>
        <p className="mt-2 text-white/70">Acesse com seu email e senha.</p>

        <form action={login} className="mt-8 space-y-5">
          <input type="hidden" name="next" value={next} />

          <div className="space-y-2">
            <label className="text-sm text-white/70">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Senha</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl bg-black/20 px-4 py-3 text-white outline-none border border-white/10"
              placeholder=""
            />
          </div>

          <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-700 transition">
            Entrar
          </button>

          {error ? (
            <p className="text-sm text-red-400">Erro: {error}</p>
          ) : null}

          <div className="pt-2">
            <Link
              href="/cadastrar"
              className="block w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center font-semibold hover:bg-white/10 transition"
            >
              Criar conta
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
