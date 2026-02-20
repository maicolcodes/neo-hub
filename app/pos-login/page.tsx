"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Role = "aluno" | "orientador";

function makeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  return createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

export default function PosLoginPage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string>("");
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const supabase = useMemo(() => makeSupabase(), []);

  useEffect(() => {
    (async () => {
      setMsg("");
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const role = (profile as any)?.role as Role | null;
      setCurrentRole(role);

      // Se já tem role, sai daqui
      if (role === "aluno") window.location.href = "/painel";
      if (role === "orientador") window.location.href = "/painel-orientador";

      setLoading(false);
    })();
  }, [supabase]);

  async function choose(role: Role) {
    setMsg("");
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    if (!uid) { window.location.href = "/login"; return; }

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: uid, role }, { onConflict: "id" });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    window.location.href = role === "orientador" ? "/painel-orientador" : "/painel";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white/5 backdrop-blur border border-white/10 shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-white">Antes de continuar</h1>
        <p className="text-slate-300 mt-2">
          Escolha só o seu papel. (Você pode mudar depois.)
        </p>

        {msg ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">{msg}</div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <button
            onClick={() => choose("aluno")}
            disabled={loading}
            className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-6 text-left disabled:opacity-60"
          >
            <div className="text-xl font-bold text-white">Sou ALUNO</div>
            <div className="text-slate-300 mt-1">Quero pedir orientação e lançar missões (TCC, etc.)</div>
          </button>

          <button
            onClick={() => choose("orientador")}
            disabled={loading}
            className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-6 text-left disabled:opacity-60"
          >
            <div className="text-xl font-bold text-white">Sou ORIENTADOR</div>
            <div className="text-slate-300 mt-1">Quero receber missões da minha área e aceitar alunos</div>
          </button>
        </div>

        <div className="mt-6 text-slate-400 text-sm">
          Role atual no banco: <b>{currentRole ?? "ainda não definido"}</b>
        </div>

        {loading ? <div className="mt-4 text-slate-400">Carregando...</div> : null}
      </div>
    </main>
  );
}
