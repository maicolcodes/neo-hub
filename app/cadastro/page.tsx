import Link from "next/link";
import { signUpAction } from "@/app/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CadastroPage({
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
          <p className="text-slate-300 mt-2">Crie sua conta.</p>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">
            {decodeURIComponent(error)}
          </div>
        ) : null}

        <form action={signUpAction} className="space-y-4">
          <div>
            <label className="block text-slate-200 mb-2">Nome</label>
            <input
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              name="nome"
              type="text"
              required
            />
          </div>

          <div>
            <label className="block text-slate-200 mb-2">Email</label>
            <input
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-slate-200 mb-2">Senha</label>
            <input
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-slate-200 mb-2">Perfil</label>
            <select
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              name="role"
              defaultValue="aluno"
            >
              <option value="aluno">Aluno</option>
              <option value="orientador">Orientador</option>
            </select>
          </div>

          <button
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 transition"
            type="submit"
          >
            Criar conta
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-slate-300">
          <span>Já tem conta?</span>
          <Link className="underline hover:text-white" href="/login">
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}