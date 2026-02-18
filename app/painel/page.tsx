import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import { signoutAction } from "@/app/actions";

export default async function PainelAluno() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/painel");

  return (
    <section className="mx-auto mt-8 max-w-3xl">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Painel do Aluno</h1>
            <p className="mt-2 text-white/70">Logado como: <span className="text-white">{user.email}</span></p>
          </div>
          <form action={signoutAction}>
            <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition">
              Sair
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/lancar-missao"
            className="rounded-2xl border border-white/10 bg-black/25 p-5 hover:bg-black/35 transition"
          >
            <div className="text-lg font-semibold">Lançar missão</div>
            <div className="mt-1 text-sm text-white/60">Criar uma solicitação.</div>
            <div className="mt-4 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold">Abrir</div>
          </Link>

          <Link
            href="/painel-orientador"
            className="rounded-2xl border border-white/10 bg-black/25 p-5 hover:bg-black/35 transition"
          >
            <div className="text-lg font-semibold">Painel do orientador</div>
            <div className="mt-1 text-sm text-white/60">Acesso para orientadores.</div>
            <div className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">Abrir</div>
          </Link>
        </div>
      </div>
    </section>
  );
}
