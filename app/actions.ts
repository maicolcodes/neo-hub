"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";

function safeNext(formData: FormData) {
  const next = String(formData.get("next") || "");
  if (!next) return null;
  if (!next.startsWith("/")) return null;
  if (next.startsWith("//")) return null;
  if (next.startsWith("/entrar")) return null;
  return next;
}

export async function login(formData: FormData) {
  const supabase = await createServerSupabase();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = safeNext(formData) || "/painel";

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/entrar?error=${encodeURIComponent("Credenciais inválidas")}&next=${encodeURIComponent(next)}`);

  redirect(next);
}

export async function signup(formData: FormData) {
  const supabase = await createServerSupabase();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = safeNext(formData) || "/painel";

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) redirect(`/cadastrar?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);

  redirect(next);
}

export async function signoutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/entrar");
}

export async function criarSolicitacao(formData: FormData) {
  const supabase = await createServerSupabase();

  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) redirect("/lancar-missao?error=" + encodeURIComponent("Informe um título."));

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/lancar-missao");

  const { error } = await supabase
    .from("solicitacoes")
    .insert({ user_id: user.id, titulo, status: "aberta" });

  if (error) redirect("/lancar-missao?error=" + encodeURIComponent(error.message));

  redirect("/painel");
}
