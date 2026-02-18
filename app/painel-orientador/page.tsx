import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

type SearchParams = {
  error?: string;
  next?: string;
};

export default async function PainelOrientadorPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const error = sp?.error ?? "";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não estiver logado  manda pro login respeitando next
  if (!user) redirect(`/login?next=${encodeURIComponent("/painel-orientador")}`);

  // Garante que é orientador
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "orientador") {
    redirect(`/painel?error=${encodeURIComponent("nao_autorizado")}`);
  }

  return (
    <main style={{ padding: 24 }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
          Painel do Orientador
        </h1>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <Link href="/lancar-missao">Ver solicitações</Link>
          <Link href="/sair">Sair</Link>
        </div>
      </header>

      {error ? (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #f33",
            color: "#ff8a8a",
            maxWidth: 520,
          }}
        >
          Erro: {error}
        </div>
      ) : null}

      <div style={{ marginTop: 18, opacity: 0.9 }}>
        Logado como: <b>{user.email}</b>
      </div>

      <section style={{ marginTop: 24, maxWidth: 900 }}>
        <p style={{ opacity: 0.9 }}>
          Aqui vai entrar a lista de solicitações para aceitar/negociar e o chat
          (próximo passo).
        </p>
      </section>
    </main>
  );
}
