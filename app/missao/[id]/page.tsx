import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MissaoDetalhePage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) redirect("/login");

  const { data: missao } = await supabase
    .from("missoes")
    .select("*")
    .eq("id", id)
    .single();

  if (!missao) {
    redirect("/painel");
  }

  const podeVer =
    missao.aluno_id === user.id ||
    missao.orientador_id === user.id;

  if (!podeVer) {
    redirect("/painel");
  }

  let orientadorNome: string | null = null;
  if (missao.orientador_id) {
    const { data: orientador } = await supabase
      .from("profiles")
      .select("nome")
      .eq("id", missao.orientador_id)
      .single();

    orientadorNome = orientador?.nome ?? null;
  }

  let destinoVolta = "/painel";
  if (missao.orientador_id === user.id) {
    destinoVolta = "/painel-orientador";
  }

  return (
    <main className="min-h-screen bg-[#080c14] text-white p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Detalhe da Missão</h1>
            <p className="text-white/50 text-sm mt-1">
              Visualização completa da missão
            </p>
          </div>

          <Link
            href={destinoVolta}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            Voltar
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
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

                <span className="text-xs bg-white/10 text-white/70 border border-white/10 px-2 py-1 rounded-full">
                  {missao.area || "Sem área"}
                </span>

                <span className="text-xs bg-white/10 text-white/70 border border-white/10 px-2 py-1 rounded-full">
                  {missao.categoria || "Sem categoria"}
                </span>
              </div>

              <h2 className="text-2xl font-bold">{missao.titulo}</h2>
            </div>

            {missao.orcamento && (
              <div className="text-green-400 font-bold text-xl">
                R$ {Number(missao.orcamento).toLocaleString("pt-BR")}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="text-xs uppercase tracking-wide text-white/40 mb-1">Prazo</div>
              <div className="text-white">
                {missao.prazo
                  ? new Date(missao.prazo).toLocaleDateString("pt-BR")
                  : "Não informado"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="text-xs uppercase tracking-wide text-white/40 mb-1">Orientador responsável</div>
              <div className="text-white">
                {orientadorNome || (missao.orientador_id ? "Orientador vinculado" : "Ainda não aceitou")}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 p-5 mb-6">
            <div className="text-xs uppercase tracking-wide text-white/40 mb-2">Descrição</div>
            <div className="text-white/80 whitespace-pre-wrap">
              {missao.descricao || "Sem descrição detalhada."}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="text-sm text-white/70">
              Esta tela será a base para os próximos passos do fluxo:
              entrega, conclusão e comunicação entre aluno e orientador.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}