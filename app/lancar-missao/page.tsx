import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import { criarSolicitacao } from "@/app/actions";

export default async function LancarMissaoPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/lancar-missao");

  return (
    <section className="mx-auto mt-8 max-w-3xl">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Lançar missão</h1>
            <p className="mt-2 text-white/70">Crie uma solicitação para um orientador.</p>
          </div>

          <Link href="/painel" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition">
            Voltar
          </Link>
        </div>

        {searchParams?.error ? (
          <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {searchParams.error}
          </div>
        ) : null}

        <form action={criarSolicitacao} className="mt-8 space-y-3">
          <input
            name="titulo"
            placeholder="Título da solicitação"
            required
            className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white placeholder:text-white/40 outline-none"
          />
          <button className="h-12 w-full rounded-xl bg-blue-600 font-semibold hover:bg-blue-500 transition">
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
