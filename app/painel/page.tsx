import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/actions";

export default async function PainelAluno() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/painel");

  const { data: minhas } = await supabase
    .from("solicitacoes")
    .select("id,titulo,descricao,status,created_at,orientador_id")
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Painel do Aluno</h1>
          <p style={{ opacity: 0.8 }}>Logado como: {user.email}</p>
        </div>

        <form action={signout}>
          <button style={{ padding: "10px 14px", borderRadius: 10 }}>Sair</button>
        </form>
      </header>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link href="/lancar-missao" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #333" }}>
          Lançar missão
        </Link>
      </div>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Minhas missões</h2>

        <div style={{ display: "grid", gap: 12 }}>
          {(minhas || []).map((m) => (
            <div key={m.id} style={{ border: "1px solid #333", borderRadius: 14, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <strong>{m.titulo}</strong>
                <span>{m.status}</span>
              </div>
              {m.descricao ? <p style={{ marginTop: 8, opacity: 0.85 }}>{m.descricao}</p> : null}
              <p style={{ marginTop: 8, opacity: 0.7, fontSize: 12 }}>
                {m.orientador_id ? " Orientador aceitou" : " Aguardando orientador"}
              </p>
            </div>
          ))}

          {!minhas?.length ? <p style={{ opacity: 0.8 }}>Você ainda não lançou nenhuma missão.</p> : null}
        </div>
      </section>
    </main>
  );
}
