import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import { signoutAction } from "@/app/actions";

export default async function PainelOrientador() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/painel-orientador");

  return (
    <section className="mx-auto mt-8 max-w-3xl">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Painel do Orientador</h1>
            <p className="mt-2 text-white/70">Logado como: <span className="text-white">{user.email}</span></p>
            <p className="mt-3 text-white/60 text-sm">
              Hoje: só acesso e interface. Próximos dias: solicitações + aceitar + chat + pagamento.
            </p>
          </div>
          <form action={signoutAction}>
            <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition">
              Sair
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
