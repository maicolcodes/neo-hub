"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

function makeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local (ou na Vercel).");
  return createClient(url, anon);
}

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const supabase = useMemo(() => {
    try { return makeSupabase(); }
    catch (e: any) { setErrorMsg(e?.message ?? "Erro ao iniciar Supabase."); return null; }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setOkMsg("");
    if (!supabase) return;

    setLoading(true);
    try {
      const origin = window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { emailRedirectTo: origin + "/login" },
      });

      if (error) {
        console.error("SIGNUP_ERROR:", error);
        setErrorMsg(error.message);
        return;
      }

      // Confirmação de email ligada => user criado, session = null (NORMAL)
      if (data?.user && !data?.session) {
        setOkMsg("Conta criada! Confirme seu email (inbox/spam) e depois faça login.");
        return;
      }

      // Se vier sessão (raro se confirmação estiver desligada)
      if (data?.session) {
        setOkMsg("Conta criada e sessão iniciada! Vá para a página inicial.");
        return;
      }

      setOkMsg("Conta criada. Se não recebeu email, confira a configuração do provider no Supabase.");
    } catch (err: any) {
      console.error("SIGNUP_EXCEPTION:", err);
      setErrorMsg(err?.message ?? "Erro inesperado no cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/5 backdrop-blur border border-white/10 shadow-2xl p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">NEO HUB</h1>
          <p className="text-slate-300 mt-2">Crie sua conta com email e senha.</p>
        </div>

        {errorMsg ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-100">{errorMsg}</div>
        ) : null}

        {okMsg ? (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-100">
            {okMsg}{" "}
            <span className="block mt-2">
              <Link className="underline" href="/login">Ir para Login</Link>
            </span>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-200 mb-2">Email</label>
            <input
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-slate-200 mb-2">Senha</label>
            <input
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type="password"
              autoComplete="new-password"
              placeholder="mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 transition"
            type="submit"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-slate-300">
          <span>Já tem conta?</span>
          <Link className="underline hover:text-white" href="/login">Entrar</Link>
        </div>
      </div>
    </main>
  );
}
