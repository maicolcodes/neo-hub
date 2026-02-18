import { signup } from "@/app/actions";

export default async function CadastrarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const error = sp?.error || "";
  const next = sp?.next || "";

  return (
    <main className="min-h-[70vh] grid place-items-center">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <h1 className="text-3xl font-extrabold tracking-tight">Criar conta</h1>
        <p className="mt-2 text-white/70">Email e senha.</p>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <form action={signup} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />

          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white placeholder:text-white/40 outline-none"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Senha"
            className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white placeholder:text-white/40 outline-none"
          />

          <button className="h-12 w-full rounded-xl bg-blue-600 font-semibold hover:bg-blue-500 transition">
            Criar conta
          </button>
        </form>

        <a href="/entrar" className="mt-5 block text-center text-sm text-white/70 hover:text-white">
          Voltar para entrar
        </a>
      </div>
    </main>
  );
}
