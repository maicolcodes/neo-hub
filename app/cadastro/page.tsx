import Link from "next/link";
import { signUpAction } from "@/app/actions";
import { ArrowRight, GraduationCap, BookMarked } from "lucide-react";

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
    <main className="neo-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black shadow-lg shadow-blue-600/30">
              N
            </div>
            <span className="font-black tracking-wider text-xl">
              NEO <span className="gradient-text-blue italic">HUB</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black mb-1">Criar sua conta</h1>
          <p className="text-white/45 text-sm">Junte-se a centenas de alunos e orientadores.</p>
        </div>

        <div className="neo-card neo-glass p-7">
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-red-200 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signUpAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Nome completo</label>
              <input
                className="neo-input"
                name="nome"
                type="text"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input
                className="neo-input"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Senha</label>
              <input
                className="neo-input"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">Quem é você?</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative cursor-pointer">
                  <input type="radio" name="role" value="aluno" defaultChecked className="sr-only peer" />
                  <div className="peer-checked:border-blue-500 peer-checked:bg-blue-500/10 peer-checked:text-white border border-white/10 bg-white/5 rounded-xl p-4 text-center text-white/60 hover:border-white/20 transition">
                    <GraduationCap className="w-6 h-6 mx-auto mb-2 peer-checked:text-blue-400" />
                    <div className="font-semibold text-sm">Aluno</div>
                    <div className="text-xs mt-0.5 opacity-70">Preciso de orientação</div>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input type="radio" name="role" value="orientador" className="sr-only peer" />
                  <div className="peer-checked:border-purple-500 peer-checked:bg-purple-500/10 peer-checked:text-white border border-white/10 bg-white/5 rounded-xl p-4 text-center text-white/60 hover:border-white/20 transition">
                    <BookMarked className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold text-sm">Orientador</div>
                    <div className="text-xs mt-0.5 opacity-70">Quero orientar alunos</div>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="neo-btn-primary w-full justify-center py-3.5 mt-2">
              Criar conta <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/45">
            Já tem conta?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition font-medium">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}