export default function Home() {
  return (
    <main className="neo-bg min-h-screen text-white">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-extrabold tracking-tight">
          <span className="text-white">NEO</span>{" "}
          <span className="text-blue-500">HUB</span>
        </div>

        <nav className="flex items-center gap-6">
          <button className="text-xs tracking-[0.25em] text-white/70 hover:text-white transition">
            ENTRAR
          </button>
          <button className="rounded-full bg-white px-5 py-2 text-xs font-semibold tracking-[0.25em] text-black hover:bg-white/90 transition">
            CADASTRAR
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-10 text-center">
        <div className="mb-8">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-[11px] tracking-[0.35em] text-blue-300">
            • SISTEMA DE EVOLUÇÃO ACADÊMICA
          </span>
        </div>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9]"
          style={{ textShadow: "0 14px 50px rgba(0,0,0,.45)" }}
        >
          A EVOLUÇÃO É <br />
          ORIENTADA<span className="text-blue-500">.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-base md:text-lg text-white/60">
          O HUB definitivo onde a demanda intelectual encontra a maestria acadêmica.
          <br />
          Conectamos desafios reais a soluções de alto nível.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-700 transition shadow-[0_10px_30px_rgba(37,99,235,0.35)]">
            Entrar
          </button>
          <button className="rounded-xl border border-white/20 px-8 py-3 font-semibold hover:bg-white/10 transition">
            Cadastrar
          </button>
        </div>
      </section>
    </main>
  );
}
