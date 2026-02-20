"use client";

import React, { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function safeJson(v: any) {
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
}

export default function DebugAuthPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anon) {
      setOut("FALTAM VARIÁVEIS NO .env.local (ou na Vercel):\n- NEXT_PUBLIC_SUPABASE_URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY");
      return null;
    }
    return createClient(url, anon);
  }, []);

  async function run(fn: () => Promise<any>) {
    setLoading(true);
    try {
      const r = await fn();
      setOut(safeJson(r));
    } catch (e: any) {
      setOut("EXCEPTION:\n" + (e?.message ?? String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <h1 className="text-3xl font-extrabold">NEO HUB  Debug Auth</h1>
        <p className="text-slate-300">
          <b>CADASTRO</b> = Sign Up  <b>LOGIN</b> = Sign In. Aqui aparece o erro REAL do Supabase.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="space-y-2">
            <label>Email</label>
            <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
              value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="voce@exemplo.com" />
          </div>

          <div className="space-y-2">
            <label>Senha</label>
            <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
              value={senha} onChange={(e) => setSenha(e.target.value)} type="password" placeholder="mínimo 6 caracteres" />
          </div>

          <div className="flex flex-wrap gap-3">
            <button disabled={loading || !supabase}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-3 font-semibold"
              onClick={() => run(async () => {
                const origin = window.location.origin;
                const { data, error } = await supabase!.auth.signUp({
                  email,
                  password: senha,
                  options: { emailRedirectTo: origin + "/login" },
                });
                return { acao: "CADASTRO (signUp)", data, error };
              })}
            >{loading ? "..." : "Testar CADASTRO"}</button>

            <button disabled={loading || !supabase}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 px-4 py-3 font-semibold"
              onClick={() => run(async () => {
                const { data, error } = await supabase!.auth.signInWithPassword({ email, password: senha });
                return { acao: "LOGIN (signInWithPassword)", data, error };
              })}
            >{loading ? "..." : "Testar LOGIN"}</button>

            <button disabled={loading || !supabase}
              className="rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-60 px-4 py-3 font-semibold"
              onClick={() => run(async () => {
                const { data, error } = await supabase!.auth.getSession();
                return { acao: "getSession", data, error };
              })}
            >{loading ? "..." : "Ver SESSION"}</button>

            <button disabled={loading || !supabase}
              className="rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-60 px-4 py-3 font-semibold"
              onClick={() => run(async () => {
                const { error } = await supabase!.auth.signOut();
                return { acao: "signOut", error };
              })}
            >{loading ? "..." : "SIGN OUT"}</button>
          </div>

          <p className="text-slate-300 text-sm">
            Se no cadastro aparecer <b>data.user</b> e <b>data.session = null</b>, isso é normal quando o Supabase exige confirmação de email.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <h2 className="font-bold mb-2">Saída (resultado bruto)</h2>
          <pre className="whitespace-pre-wrap text-sm">{out || "Sem saída ainda."}</pre>
        </div>
      </div>
    </main>
  );
}

