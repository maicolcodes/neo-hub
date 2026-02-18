import Link from "next/link";

export default function HomePage() {
  return (
    <main className="neo-bg min-h-screen text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600/90 flex items-center justify-center font-bold">
            N
          </div>
          <div className="text-lg font-extrabold tracking-wide">
            NEO <span className="text-blue-500 italic">HUB</span>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-white/80 hover:text-white transition">
            ENTRAR
          </Link>

          <Link
            href="/cadastrar"
            className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black hover:bg-white/90 transition"
          >
            CADASTRAR
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.2em] text-white/80">
            • SISTEMA DE EVOLUÇÃO ACADÊMICA
          </div>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] md:text-7xl">
            A EVOLUÇÃO É <br />
            ORIENTADA<span className="text-blue-500">.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-white/70 md:text-lg">
            O HUB definitivo onde a demanda intelectual encontra a maestria acadêmica.
            Conectamos desafios reais a soluções de alto nível.
          </p>

          {/* BOTÕES CLICÁVEIS (Link) */}
          <div className="mt-10 flex gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Entrar
            </Link>

            <Link
              href="/cadastrar"
              className="rounded-xl border border-white/20 px-8 py-3 font-semibold hover:bg-white/10 transition"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
