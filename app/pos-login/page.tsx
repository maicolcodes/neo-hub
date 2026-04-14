"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { GraduationCap, BookMarked, Loader2, AlertCircle } from "lucide-react";

type Role = "aluno" | "orientador";

function makeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Variáveis de ambiente ausentes.");
  return createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

export default function PosLoginPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const supabase = useMemo(() => makeSupabase(), []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.href = "/login"; return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const role = (profile as any)?.role as Role | null;
      if (role === "aluno") { window.location.href = "/painel"; return; }
      if (role === "orientador") { window.location.href = "/painel-orientador"; return; }

      setLoading(false);
    })();
  }, [supabase]);

  async function choose(role: Role) {
    setMsg("");
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    if (!uid) { window.location.href = "/login"; return; }

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: uid, role }, { onConflict: "id" });

    if (error) {
      setMsg("Erro ao salvar. Tente novamente.");
      setSaving(false);
      return;
    }

    window.location.href = role === "orientador" ? "/painel-orientador" : "/painel";
  }

  if (loading) {
    return (
      <main className="neo-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm">Verificando sua conta...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="neo-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black shadow-lg shadow-blue-600/30">
              N
            </div>
            <span className="font-black tracking-wider text-xl text-white">
              NEO <span className="gradient-text-blue italic">HUB</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Bem-vindo ao NEO HUB!</h1>
          <p className="text-white/50 text-sm">
            Só um passo antes de começar — qual é o seu papel na plataforma?
          </p>
        </div>

        {msg && (
          <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-red-200 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {msg}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Aluno */}
          <button
            onClick={() => choose("aluno")}
            disabled={saving}
            className="neo-card border border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 hover:bg-blue-500/10 p-7 text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-lg font-black text-white mb-2">Sou Aluno</div>
            <div className="text-white/50 text-sm leading-relaxed">
              Preciso de orientação para meu TCC, monografia, artigo ou outro projeto acadêmico.
            </div>
            <div className="mt-4 text-blue-400 text-xs font-semibold">
              Publicar missões →
            </div>
          </button>

          {/* Orientador */}
          <button
            onClick={() => choose("orientador")}
            disabled={saving}
            className="neo-card border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 hover:bg-purple-500/10 p-7 text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BookMarked className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-lg font-black text-white mb-2">Sou Orientador</div>
            <div className="text-white/50 text-sm leading-relaxed">
              Tenho expertise acadêmica e quero ajudar alunos na minha área de conhecimento.
            </div>
            <div className="mt-4 text-purple-400 text-xs font-semibold">
              Aceitar missões →
            </div>
          </button>
        </div>

        {saving && (
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Salvando sua escolha...
          </div>
        )}

        <p className="text-center text-white/25 text-xs mt-4">
          Você pode mudar de papel a qualquer momento nas configurações.
        </p>
      </div>
    </main>
  );
}
