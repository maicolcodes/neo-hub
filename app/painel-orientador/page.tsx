export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions";

export default async function PainelOrientador() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login?next=/painel-orientador");

  return (
    <main className="min-h-screen neo-bg text-white p-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Painel do Orientador</h1>
            <p className="text-white/70">Logado como: {user.email}</p>
          </div>

          <form action={signOutAction}>
            <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:bg-white/10 transition">
              Sair
            </button>
          </form>
        </header>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold">Próximo passo</h2>
          <p className="mt-2 text-white/70">
            Aqui entra a lista de solicitações pendentes (tabela <code className="text-white">solicitacoes</code>) e a ação de aceitar
            (status <code className="text-white">em_andamento</code> + <code className="text-white">orientador_id</code>).
          </p>
        </div>
      </div>
    </main>
  );
}
