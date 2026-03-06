import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import { aceitarMissaoAction, signOutAction } from "@/app/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const areas = [
  { id: "humanas", label: "Humanas", emoji: "", desc: "História, Filosofia, Sociologia, Direito..." },
  { id: "exatas", label: "Exatas", emoji: "", desc: "Matemática, Física, Química, Engenharia..." },
  { id: "biologica", label: "Biológicas", emoji: "", desc: "Medicina, Biologia, Farmácia, Nutrição..." },
  { id: "tecnologia", label: "Tecnologia", emoji: "", desc: "TI, Programação, Sistemas, IA..." },
];

function CardMissao({
  missao,
  mostrarBotaoAceitar = false,
}: {
  missao: any;
  mostrarBotaoAceitar?: boolean;
}) {
  return (
    <Link
      href={`/missao/${missao.id}`}
      className="block rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-full">
              {missao.categoria || "Sem categoria"}
            </span>

            <span
              className={`text-xs px-2 py-1 rounded-full border ${
                missao.status === "aberta"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  : missao.status === "em_andamento"
                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                  : "bg-white/10 text-white/70 border-white/15"
              }`}
            >
              {missao.status === "aberta"
                ? "Aberta"
                : missao.status === "em_andamento"
                ? "Em andamento"
                : missao.status}
            </span>

            {missao.prazo && (
              <span className="text-xs text-white/40">
                Prazo: {new Date(missao.prazo).toLocaleDateString("pt-BR")}
              </span>
            )}
          </div>

          <h3 className="font-bold text-lg mb-1">{missao.titulo}</h3>
          <p className="text-white/60 text-sm line-clamp-2">{missao.descricao}</p>
        </div>

        {missao.orcamento && (
          <div className="text-green-400 font-bold text-lg shrink-0">
            R$ {Number(missao.orcamento).toLocaleString("pt-BR")}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
        {mostrarBotaoAceitar ? (
          <form
            action={aceitarMissaoAction}
            onClick={(e) => e.stopPropagation()}
          >
            <input type="hidden" name="missao_id" value={missao.id} />
            <button className="bg-blue-600 hover:bg-blue-500 transition text-white text-sm font-semibold px-5 py-2 rounded-xl">
              Aceitar missão
            </button>
          </form>
        ) : (
          <span className="text-sm text-white/40">Acompanhando esta missão</span>
        )}
      </div>
    </Link>
  );
}

export default async function PainelOrientador({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const ok = sp?.ok;
  const error = sp?.error;

  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login?next=/painel-orientador");

  const { data: profile } = await supabase
    .from("profiles")
    .select("area")
    .eq("id", user.id)
    .single();

  const { data: missoesDisponiveis } = await supabase
    .from("missoes")
    .select("*")
    .eq("status", "aberta")
    .eq("area", profile?.area ?? "")
    .order("created_at", { ascending: false });

  const { data: minhasMissoes } = await supabase
    .from("missoes")
    .select("*")
    .eq("status", "em_andamento")
    .eq("orientador_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#080c14] text-white p-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold">Painel do Orientador</h1>
            <p className="text-white/50 text-sm mt-1">Logado como: {user.email}</p>
          </div>
          <form action={signOutAction}>
            <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">
              Sair
            </button>
          </form>
        </header>

        {ok ? (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-200">
            Missão aceita com sucesso.
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {decodeURIComponent(error)}
          </div>
        ) : null}

        <div className="mb-10">
          <h2 className="text-xl font-bold mb-1">Minha Área de Atuação</h2>
          <p className="text-white/50 text-sm mb-4">Selecione sua área para receber missões compatíveis.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/painel-orientador/area?id=${area.id}`}
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

        <div className="mb-10">
          <h2 className="text-xl font-bold mb-1">Minhas missões em andamento</h2>
          <p className="text-white/50 text-sm mb-4">
            Aqui ficam as missões que você já aceitou e está conduzindo.
          </p>

          {!minhasMissoes || minhasMissoes.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <h3 className="font-bold text-lg mb-2">Nenhuma missão em andamento</h3>
              <p className="text-white/50 text-sm">Quando você aceitar uma missão, ela aparecerá aqui.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {minhasMissoes.map((missao: any) => (
                <CardMissao key={missao.id} missao={missao} />
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Missões disponíveis da minha área</h2>
          <p className="text-white/50 text-sm">
            {profile?.area ? `Mostrando missões abertas de ${profile.area}.` : "Selecione uma área para ver missões compatíveis."}
          </p>
        </div>

        {!profile?.area ? (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-10 text-center">
            <h3 className="font-bold text-lg mb-2">Selecione sua área primeiro</h3>
            <p className="text-white/50 text-sm">Escolha uma área acima para ver as missões compatíveis.</p>
          </div>
        ) : !missoesDisponiveis || missoesDisponiveis.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h3 className="font-bold text-lg mb-2">Nenhuma missão aberta</h3>
            <p className="text-white/50 text-sm">Quando alunos criarem pedidos nessa área, eles aparecerão aqui.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {missoesDisponiveis.map((missao: any) => (
              <CardMissao key={missao.id} missao={missao} mostrarBotaoAceitar />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}