import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { criarMissao } from "@/app/actions";

export default async function LancarMissaoPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/lancar-missao");

  const error = searchParams?.error;

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Lançar missão</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Crie uma solicitação para um orientador aceitar.
      </p>

      {error ? (
        <div style={{ marginTop: 14, padding: 12, borderRadius: 12, border: "1px solid #f33" }}>
          Erro ao enviar. Tente novamente.
        </div>
      ) : null}

      <form action={criarMissao} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Título
          <input name="titulo" placeholder="Ex: Lista de exercícios de cálculo" style={{ padding: 12, borderRadius: 12 }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Descrição (opcional)
          <textarea name="descricao" placeholder="Explique o que precisa, prazo, detalhes..." rows={5} style={{ padding: 12, borderRadius: 12 }} />
        </label>

        <button type="submit" style={{ padding: 12, borderRadius: 12, fontWeight: 800 }}>
          Enviar
        </button>
      </form>
    </main>
  );
}
