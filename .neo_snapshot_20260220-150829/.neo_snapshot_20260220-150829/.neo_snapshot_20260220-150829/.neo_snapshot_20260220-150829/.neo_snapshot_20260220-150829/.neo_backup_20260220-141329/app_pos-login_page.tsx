"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase-browser";

type Role = "aluno" | "orientador";

export default function PosLoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  async function go() {
    setErr("");
    setLoading(true);

    const { data: s } = await supabase.auth.getSession();
    if (!s.session) {
      router.replace("/entrar");
      return;
    }

    const { data: u, error: uerr } = await supabase.auth.getUser();
    if (uerr || !u.user) {
      router.replace("/entrar");
      return;
    }

    setEmail(u.user.email ?? "");

    // role vem do BANCO (profiles), porque o middleware usa profiles.role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", u.user.id)
      .maybeSingle();

    const role = (profile as any)?.role ?? null;

    if (role === "orientador") { router.replace("/painel-orientador"); return; }
    if (role === "aluno") { router.replace("/painel"); return; }

    setLoading(false);
  }

  async function choose(role: Role) {
    setErr("");
    setLoading(true);

    const { data: u, error: uerr } = await supabase.auth.getUser();
    if (uerr || !u.user) { router.replace("/entrar"); return; }

    // Cria/atualiza profiles com a role escolhida
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: u.user.id, role }, { onConflict: "id" });

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    router.replace(role === "orientador" ? "/painel-orientador" : "/painel");
  }

  useEffect(() => { go(); }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/5 border border-white/10 p-8 space-y-4">
        <h1 className="text-2xl font-extrabold">Escolha seu perfil</h1>
        <p className="text-slate-300 text-sm">
          Logado como <span className="text-white font-semibold">{email || "..."}</span>
        </p>

        {loading ? (
          <p className="text-slate-300">Carregando...</p>
        ) : (
          <>
            {err ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">
                {err}
              </div>
            ) : null}

            <button onClick={() => choose("aluno")}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold py-3">
              Sou ALUNO
            </button>

            <button onClick={() => choose("orientador")}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold py-3">
              Sou ORIENTADOR
            </button>
          </>
        )}
      </div>
    </main>
  );
}
