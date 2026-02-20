"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function makeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

export default function PosLoginPage() {
  const supabase = useMemo(() => makeSupabase(), []);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      setErrorMsg("");
      const { data: userData, error: uErr } = await supabase.auth.getUser();
      if (uErr || !userData?.user) {
        window.location.href = "/login";
        return;
      }
      setEmail(userData.user.email ?? "");

      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      const r = prof?.role ?? null;
      setRole(r);

      // se já tem role, manda direto
      if (r === "aluno") window.location.href = "/painel";
      if (r === "orientador") window.location.href = "/painel-orientador";

      setLoading(false);
    })();
  }, [supabase]);

  async function choose(nextRole: "aluno" | "orientador") {
    setErrorMsg("");
    setLoading(true);

    const { data: userData, error: uErr } = await supabase.auth.getUser();
    if (uErr || !userData?.user) {
      window.location.href = "/login";
      return;
    }

    const uid = userData.user.id;

    // salva role no profiles
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: uid, role: nextRole }, { onConflict: "id" });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    window.location.href = nextRole === "aluno" ? "/painel" : "/painel-orientador";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-lg rounded-3xl bg-white/5 border border-white/10 p-8">
        <h1 className="text-3xl font-extrabold">NEO HUB</h1>
        <p className="text-slate-300 mt-2">
          {email ? <>Logado como: <span className="text-white">{email}</span></> : "Carregando..."}
        </p>

        {errorMsg ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">{errorMsg}</div>
        ) : null}

        <div className="mt-6">
          <p className="text-slate-200 font-semibold">Selecione seu perfil:</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              disabled={loading}
              onClick={() => choose("aluno")}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-3 font-semibold"
            >
              Sou Aluno
            </button>
            <button
              disabled={loading}
              onClick={() => choose("orientador")}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 px-4 py-3 font-semibold"
            >
              Sou Orientador
            </button>
          </div>

          {role ? (
            <p className="text-slate-400 mt-4">Role atual detectada: <span className="text-white">{role}</span></p>
          ) : (
            <p className="text-slate-400 mt-4">Ainda sem role definida. Escolha acima.</p>
          )}
        </div>
      </div>
    </main>
  );
}
