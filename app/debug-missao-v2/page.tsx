"use client";

import React, { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function makeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  return createClient(url, anon);
}

function safe(v: any) {
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
}

function normalizeDate(input: string) {
  const s = (input || "").trim();
  if (!s) return null;

  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // dd/mm/yyyy -> yyyy-mm-dd
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const dd = m[1], mm = m[2], yyyy = m[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  return s; // devolve como veio (pra ver o erro real)
}

export default function DebugMissaoV2() {
  const supabase = useMemo(() => makeSupabase(), []);

  const [table, setTable] = useState("missoes");
  const [ownerField, setOwnerField] = useState("aluno_id");
  const [includeOwner, setIncludeOwner] = useState(true);

  const [titulo, setTitulo] = useState("TCC IA Generativas");
  const [categoria, setCategoria] = useState("TCC");
  const [descricao, setDescricao] = useState("teste");
  const [prazo, setPrazo] = useState("20/06/2026");
  const [orcamento, setOrcamento] = useState("1000");

  const [extraJson, setExtraJson] = useState("{}");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function verAuth() {
    setLoading(true);
    try {
      const s = await supabase.auth.getSession();
      const u = await supabase.auth.getUser();
      setOut(safe({ action: "auth", session: s, user: u }));
    } finally {
      setLoading(false);
    }
  }

  async function testarInsert() {
    setLoading(true);
    setOut("");
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u?.user?.id ?? null;

      let extra: any = {};
      try { extra = JSON.parse(extraJson || "{}"); }
      catch { setOut("JSON inválido em Campos extras."); return; }

      const payload: any = {
        titulo,
        categoria,
        descricao,
        prazo: normalizeDate(prazo),
        orcamento: orcamento === "" ? null : Number(orcamento),
        ...extra,
      };

      if (includeOwner && uid) payload[ownerField] = uid;

      const { data, error } = await supabase
        .from(table)
        .insert([payload])
        .select()
        .single();

      setOut(safe({ action: "insert", table, payload, data, error }));
    } catch (e: any) {
      setOut("EXCEPTION:\n" + (e?.message ?? String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-extrabold">Debug Missão v2</h1>
        <p className="text-slate-300">Mostra o erro REAL do Supabase + payload enviado.</p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-200">Tabela</label>
              <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
                value={table} onChange={(e)=>setTable(e.target.value)} />
            </div>

            <div>
              <label className="block mb-1 text-slate-200">Coluna do dono (RLS)</label>
              <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
                value={ownerField} onChange={(e)=>setOwnerField(e.target.value)} />
              <label className="mt-2 flex items-center gap-2 text-slate-300 text-sm">
                <input type="checkbox" checked={includeOwner} onChange={(e)=>setIncludeOwner(e.target.checked)} />
                Incluir dono automaticamente (auth.getUser().id)
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-200">Título</label>
              <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
                value={titulo} onChange={(e)=>setTitulo(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 text-slate-200">Categoria</label>
              <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
                value={categoria} onChange={(e)=>setCategoria(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-200">Descrição</label>
            <textarea className="w-full min-h-[90px] rounded-xl bg-white/10 border border-white/10 px-4 py-3"
              value={descricao} onChange={(e)=>setDescricao(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-200">Prazo</label>
              <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
                value={prazo} onChange={(e)=>setPrazo(e.target.value)} placeholder="20/06/2026 ou 2026-06-20" />
            </div>
            <div>
              <label className="block mb-1 text-slate-200">Orçamento</label>
              <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3"
                value={orcamento} onChange={(e)=>setOrcamento(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-200">Campos extras (JSON)</label>
            <textarea className="w-full min-h-[110px] rounded-xl bg-white/10 border border-white/10 px-4 py-3 font-mono text-sm"
              value={extraJson} onChange={(e)=>setExtraJson(e.target.value)} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button disabled={loading}
              className="rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-60 px-4 py-3 font-semibold"
              onClick={verAuth}>
              {loading ? "..." : "Ver auth (user/session)"}
            </button>

            <button disabled={loading}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-3 font-semibold"
              onClick={testarInsert}>
              {loading ? "..." : "Testar INSERT"}
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
