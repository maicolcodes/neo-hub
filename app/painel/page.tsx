import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions";
import Link from "next/link";
import {
  PlusCircle, MessageSquare, BookOpen, Calculator, Microscope, Cpu,
  Clock, CheckCircle2, AlertCircle, LogOut, User, ChevronRight,
  TrendingUp, Zap
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const areas = [
  { id: "humanas",    label: "Humanas",    icon: BookOpen,    color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40", desc: "História, Filosofia, Sociologia, Direito..." },
  { id: "exatas",     label: "Exatas",     icon: Calculator,  color: "text-blue-400",  bg: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40",   desc: "Matemática, Física, Química, Engenharia..." },
  { id: "biologica",  label: "Biológicas", icon: Microscope,  color: "text-green-400", bg: "bg-green-500/10 border-green-500/20 hover:border-green-500/40", desc: "Medicina, Biologia, Farmácia, Nutrição..." },
  { id: "tecnologia", label: "Tecnologia", icon: Cpu,         color: "text-purple-400",bg: "bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40",desc: "TI, Programação, Sistemas, IA..." },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    aberta:       { label: "Aberta",       cls: "badge badge-aberta",    icon: <Zap className="w-3 h-3" /> },
    em_andamento: { label: "Em andamento", cls: "badge badge-andamento", icon: <Clock className="w-3 h-3" /> },
    entregue:     { label: "Entregue",     cls: "badge badge-entregue",  icon: <CheckCircle2 className="w-3 h-3" /> },
    concluida:    { label: "Concluída",    cls: "badge badge-concluida", icon: <CheckCircle2 className="w-3 h-3" /> },
  };
  const s = map[status] ?? { label: status, cls: "badge", icon: null };
  return <span className={s.cls}>{s.icon}{s.label}</span>;
}

export default async function PainelAluno() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login?next=/painel");

  const { data: profile } = await supabase
    .from("profiles")
    .select("area, nome")
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
      (orientadores ?? []).map((o: any) => [o.id, o.nome || "Orientador"])
    );
  }

  const abertas      = (missoes ?? []).filter((m: any) => m.status === "aberta").length;
  const andamento    = (missoes ?? []).filter((m: any) => m.status === "em_andamento").length;
  const concluidas   = (missoes ?? []).filter((m: any) => m.status === "concluida").length;
  const displayName  = profile?.nome || user.email?.split("@")[0] || "Aluno";

  return (
    <main className="neo-bg-panel text-white">
      {/* ─── SIDEBAR/HEADER ──────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/5 neo-glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black">N</div>
            <span className="font-black tracking-wider text-sm">NEO <span className="text-blue-400 italic">HUB</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/perfil" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition">
              <User className="w-4 h-4" />
              <span className="hidden md:block">{displayName}</span>
            </Link>
            <form action={signOutAction}>
              <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition">
                <LogOut className="w-4 h-4" />
                <span className="hidden md:block">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* ─── GREETING ──────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-1">
            Olá, {displayName.split(" ")[0]} 👋
          </h1>
          <p className="text-white/45 text-sm">Bem-vindo ao seu painel de missões.</p>
        </div>

        {/* ─── STATS ─────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Abertas",      value: abertas,    color: "text-blue-400",  icon: Zap },
            { label: "Em andamento", value: andamento,  color: "text-yellow-400",icon: Clock },
            { label: "Concluídas",   value: concluidas, color: "text-green-400", icon: CheckCircle2 },
          ].map((stat) => (
            <div key={stat.label} className="neo-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/50 text-xs font-medium">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* ─── ÁREA + NOVA MISSÃO ─────────────── */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          {/* Área */}
          <div className="md:col-span-3">
            <h2 className="font-bold text-lg mb-1">Minha Área</h2>
            <p className="text-white/45 text-xs mb-4">Escolha sua área para encontrar orientadores especializados.</p>
            <div className="grid grid-cols-2 gap-3">
              {areas.map((area) => (
                <Link
                  key={area.id}
                  href={`/painel/area?id=${area.id}`}
                  className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] flex items-center gap-3 ${area.bg} ${
                    profile?.area === area.id ? "ring-1 ring-blue-500/40" : ""
                  }`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center`}>
                    <area.icon className={`w-4 h-4 ${area.color}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{area.label}</div>
                    {profile?.area === area.id && (
                      <div className="text-[10px] text-blue-300 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Selecionada
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link
              href="/lancar-missao"
              className="neo-card neo-card-blue border border-blue-500/25 p-6 flex-1 flex flex-col justify-between group hover:scale-[1.01] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mb-4">
                <PlusCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Nova Missão</h3>
                <p className="text-white/50 text-sm">Crie uma solicitação de orientação</p>
              </div>
              <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold mt-4">
                Criar agora <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <div className="neo-card border border-purple-500/20 p-6 flex-1 flex flex-col justify-between opacity-70">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Chat</h3>
                <p className="text-white/50 text-sm">Converse com seu orientador via uma Missão</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MISSÕES ─────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-xl">Minhas Missões</h2>
            <p className="text-white/45 text-sm mt-0.5">Acompanhe seus pedidos de orientação.</p>
          </div>
          <Link href="/lancar-missao" className="neo-btn-primary text-sm py-2.5 px-5">
            <PlusCircle className="w-4 h-4" /> Nova
          </Link>
        </div>

        {!missoes || missoes.length === 0 ? (
          <div className="neo-card p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-7 h-7 text-white/30" />
            </div>
            <h3 className="font-bold text-lg mb-2">Nenhuma missão ainda</h3>
            <p className="text-white/40 text-sm mb-6">Crie sua primeira missão e conecte-se a um orientador especializado.</p>
            <Link href="/lancar-missao" className="neo-btn-primary">
              <PlusCircle className="w-4 h-4" /> Criar primeira missão
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {(missoes as any[]).map((missao) => (
              <Link
                key={missao.id}
                href={`/missao/${missao.id}`}
                className="neo-card neo-card-blue p-5 md:p-6 flex items-start justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <StatusBadge status={missao.status} />
                    {missao.categoria && (
                      <span className="badge bg-white/5 border border-white/10 text-white/50">
                        {missao.categoria}
                      </span>
                    )}
                    {missao.prazo && (
                      <span className="flex items-center gap-1 text-white/40 text-xs">
                        <Clock className="w-3 h-3" />
                        {new Date(missao.prazo).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base mb-1 truncate">{missao.titulo}</h3>
                  {missao.descricao && (
                    <p className="text-white/50 text-sm line-clamp-1">{missao.descricao}</p>
                  )}
                  {missao.status === "em_andamento" && missao.orientador_id && (
                    <p className="text-blue-300 text-xs mt-2 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Orientador: {orientadoresMap[missao.orientador_id] || "—"}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {missao.orcamento && (
                    <div className="text-green-400 font-bold text-base">
                      R$ {Number(missao.orcamento).toLocaleString("pt-BR")}
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}