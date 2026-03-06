import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const areas = [
  { id: "humanas", label: "Humanas", emoji: "", desc: "História, Filosofia, Sociologia, Direito..." },
  { id: "exatas", label: "Exatas", emoji: "", desc: "Matemática, Física, Química, Engenharia..." },
  { id: "biologica", label: "Biológicas", emoji: "", desc: "Medicina, Biologia, Farmácia, Nutrição..." },
  { id: "tecnologia", label: "Tecnologia", emoji: "", desc: "TI, Programação, Sistemas, IA..." },
];

export default async function PainelAluno() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login?next=/painel");

  const { data: profile } = await supabase
    .from("profiles")
    .select("area")
    .eq("id", user.id)
    .single();

  const { data: missoes } = await supabase
    .from("missoes")
    .select("*")
    .eq("aluno_id", user.id)
    .order("created_at", { ascending: false });

  const orientadorIds = Array.from(
    new Set((missoes ?? []).map((m: any) => m.orientador_id).filter(Boolean))
  );

  let orientadoresMap: Record<string, string> = {};

  if (orientadorIds.length > 0) {
    const { data: orientadores } = await supabase
      .from("profiles")
      .select("id, nome")
      .in("id", orientadorIds);

    orientadoresMap = Object.fromEntries(
      (orientadores ?? []).map((o: any) => [o.id, o.nome || o.id])
    );
  }

  return (
    <main className="min-h-screen bg-[#080c14] text-white p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold">Painel do Aluno</h1>
            <p className="text-white/50 text-sm mt-1">Logado como: {user.email}</p>
          </div>
          <form action={signOutAction}>
            <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">
              Sair
            </button>
          </form>
        </header>

        <div className="mb-10">
          <h2 className="text-xl font-bold mb-1">Minha Área</h2>
          <p className="text-white/50 text-sm mb-4">Escolha sua área para encontrar orientadores especializados.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/painel/area?id=${area.id}`}
                className={`p-4 rounded-xl border text-center transition-all hover:scale-105 ${
                  profile?.area === area.id
                    ? "border-blue-500 bg-blue-500/15 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
                }`}
              >
                <div className="text-3xl mb-2">{area.emoji}</div>
                <div className="font-bold text-sm">{area.label}</div>
                <div className="text-xs text-white/40 mt-1 leading-tight">{area.desc}</div>
                {profile?.area === area.id && <div className="mt-2 text-xs text-blue-300">Selecionada</div>}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <Link href="/lancar-missao" className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-8 hover:bg-blue-500/15 transition">
            <h3 className="text-xl font-bold mb-2">Nova Missão</h3>
            <p className="text-white/60">Crie uma solicitação de orientação</p>
          </Link>

          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-8">
            <h3 className="text-xl font-bold mb-2">Abrir Chat</h3>
            <p className="text-white/60">Converse com seu orientador</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Minhas Missões</h2>
            <p className="text-white/50 text-sm">Acompanhe seus pedidos de orientação.</p>
          </div>
          <Link href="/lancar-missao" className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 font-semibold transition">
            + Nova
          </Link>
        </div>

        {!missoes || missoes.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h3 className="font-bold text-lg mb-2">Nenhuma missão ainda</h3>
            <p className="text-white/50 text-sm">Crie sua primeira missão para começar.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {missoes.map((missao: any) => (
              <Link
                key={missao.id}
                href={`/missao/${missao.id}`}
                className="block rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          missao.status === "aberta"
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            : missao.status === "em_andamento"
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            : missao.status === "entregue"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-white/10 text-white/70 border-white/15"
                        }`}
                      >
                        {missao.status === "aberta"
                          ? "Aberta"
                          : missao.status === "em_andamento"
                          ? "Em andamento"
                          : missao.status === "entregue"
                          ? "Entregue"
                          : missao.status}
                      </span>

                      <span className="text-white/50 text-sm">{missao.categoria || "Sem categoria"}</span>

                      {missao.prazo && (
                        <span className="text-white/50 text-sm">
                          Prazo: {new Date(missao.prazo).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-lg mb-1">{missao.titulo}</h3>
                    <p className="text-white/60 text-sm mb-3">{missao.descricao}</p>

                    {missao.status === "em_andamento" && missao.orientador_id ? (
                      <div className="text-sm text-blue-300">
                        Orientador responsável: {orientadoresMap[missao.orientador_id] || "Orientador não identificado"}
                      </div>
                    ) : null}
                  </div>

                  {missao.orcamento && (
                    <div className="text-green-400 font-bold text-lg shrink-0">
                      R$ {Number(missao.orcamento).toLocaleString("pt-BR")}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}