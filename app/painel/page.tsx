export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions";

export default async function PainelAluno({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const sp = await searchParams;
  const ok = sp?.ok === "1";

  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login?next=/painel");

  return (
    <main className="min-h-screen neo-bg text-white p-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Painel do Aluno</h1>
            <p className="text-white/70">Logado como: {user.email}</p>
          </div>

          <form action={signOutAction}>
            <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:bg-white/10 transition">
              Sair
            </button>
          </form>
        </header>

        {ok ? (
          <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-green-200">
            Missão enviada com sucesso 
          </div>
        ) : null}

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link href="/lancar-missao" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
            <h2 className="text-xl font-bold">Lançar missão</h2>
            <p className="mt-1 text-white/70">Crie uma solicitação para ser atendida por um orientador.</p>
          </Link>

          <Link href="/painel-orientador" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
            <h2 className="text-xl font-bold">Painel do orientador</h2>
            <p className="mt-1 text-white/70">Acesso para contas com role = orientador.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
