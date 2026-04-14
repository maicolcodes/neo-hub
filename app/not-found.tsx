import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="neo-bg min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-12 opacity-60 hover:opacity-100 transition">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black">N</div>
          <span className="font-black tracking-wider text-sm text-white">NEO <span className="text-blue-400 italic">HUB</span></span>
        </Link>

        <div className="animate-fade-up">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <SearchX className="w-10 h-10 text-white/20" />
          </div>

          <div className="text-7xl font-black gradient-text-blue mb-4">404</div>
          <h1 className="text-2xl font-black text-white mb-3">Página não encontrada</h1>
          <p className="text-white/45 text-sm leading-relaxed mb-8">
            Essa missão não existe ou foi removida. Volte ao painel e continue sua jornada.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="neo-btn-primary">
              <ArrowLeft className="w-4 h-4" /> Início
            </Link>
            <Link href="/painel" className="neo-btn-ghost">
              Meu Painel
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
