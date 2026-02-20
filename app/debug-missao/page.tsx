"use client";

import React, { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function makeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  return createClient(url, anon);
}

function safe(v: any) { try { return JSON.stringify(v, null, 2); } catch { return String(v); } }

export default function DebugMissaoPage() {
  const [titulo, setTitulo] = useState("Missão teste");
  const [descricao, setDescricao] = useState("Criada pelo aluno");
  const [alunoId, setAlunoId] = useState(""); // opcional: se vazio, usa auth.user.id
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = useMemo(() => {
    try { return makeSupabase(); }
    catch (e: any) { setOut("ERRO INIT SUPABASE:\\n" + (e?.message ?? String(e))); return null; }
  }, []);

  async function showUser() {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      setOut(safe({ action: "getUser", data, error }));
    } finally { setLoading(false); }
  }

  async function insertMissao() {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id ?? null;

      const payload: any = {
        titulo,
        descricao,
      };

      // Se sua tabela exige aluno_id/user_id, preenche automaticamente
      const effectiveAlunoId = (alunoId || uid || "").trim();
      if (effectiveAlunoId) payload.aluno_id = effectiveAlunoId;

      const { data, error } = await supabase
        .from("missoes")
        .insert([payload])      // <- array pra evitar erro de formato
        .select()
        .single();

      setOut(safe({
        action: "insert missoes",
        payload,
        data,
        error
      }));
    } catch (e: any) {
      setOut("EXCEPTION:\\n" + (e?.message ?? String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-extrabold">Debug Missão (insert em missoes)</h1>
        <p className="text-slate-300">Isso vai mostrar o erro REAL do Supabase (message/details/hint/code).</p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
          <div className="space-y-1">
            <label className="text-slate-200">Título</label>
            <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
              value={titulo} onChange={(e)=>setTitulo(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-slate-200">Descrição</label>
            <textarea className="w-full min-h-[90px] rounded-xl bg-white/10 border border-white/10 px-4 py-3"
              value={descricao} onChange={(e)=>setDescricao(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-slate-200">aluno_id (opcional)</label>
            <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
              placeholder="se vazio, usa o usuário logado (auth.getUser().id)"
              value={alunoId} onChange={(e)=>setAlunoId(e.target.value)} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button disabled={loading || !supabase}
              className="rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-60 px-4 py-3 font-semibold"
              onClick={showUser}>
              {loading ? "..." : "Ver usuário atual"}
            </button>

            <button disabled={loading || !supabase}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-3 font-semibold"
              onClick={insertMissao}>
              {loading ? "..." : "Criar missão (insert)"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <h2 className="font-bold mb-2">Saída</h2>
          <pre className="whitespace-pre-wrap text-sm">{out || "Sem saída ainda."}</pre>
        </div>
      </div>
    </main>
  );
}
