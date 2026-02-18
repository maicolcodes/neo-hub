"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";

function safeNext(next: string | null) {
  if (!next) return null;
  // só aceita caminhos internos
  if (!next.startsWith("/")) return null;
  // evita loop/rotas sensíveis se quiser (opcional)
  if (next.startsWith("/entrar")) return null;
  return next;
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nextRaw = formData.get("next");
  const next = safeNext(nextRaw ? String(nextRaw) : null);

  if (!email || !password) {
    redirect(`/entrar?error=${encodeURIComponent("Preencha email e senha.")}${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data?.user) {
    redirect(`/entrar?error=${encodeURIComponent(error?.message || "Falha no login.")}${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  const userId = data.user.id;

  // Busca role no profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  // Se tiver ?next=..., respeita. Senão decide por role
  const target =
    next ??
    (profile?.role === "orientador" ? "/painel-orientador" : "/painel");

  redirect(target);
}
