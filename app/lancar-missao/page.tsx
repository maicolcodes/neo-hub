export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import { criarMissao } from "@/app/actions";

export default async function LancarMissaoPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  const error = sp?.error ?? "";

  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login?next=/lancar-missao");

  return (
    <main className="min-h-screen neo-bg text-white p-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Lançar Missão</h1>
            <p className="text-white/70">Crie uma solicitação para ser atendida por um orientador.</p>
          </div>

          <Link className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:bg-white/10 transition" href="/painel">
            Voltar
          </Link>
        </header>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <form action={criarMissao} className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              name="titulo"
              className="flex-1 rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none"
              placeholder="Título da solicitação"
              required
            />
            <button className="rounded-xl bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-700 transition">
              Enviar
            </button>
          </form>

          {error ? (
            <p className="mt-4 text-sm text-red-400">Erro: {error}</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
