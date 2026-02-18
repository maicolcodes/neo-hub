"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// LOGIN
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const next = String(formData.get("next") || "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return redirect("/login?error=invalid");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login?error=invalid");

  // garante profile (caso não exista)
  await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id" });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (next) return redirect(next);

  if (profile?.role === "orientador") return redirect("/painel-orientador");
  return redirect("/painel");
}

// CADASTRO
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return redirect("/cadastrar?error=signup");

  if (data.user) {
    await supabase.from("profiles").upsert({ id: data.user.id, role: "aluno" }, { onConflict: "id" });
  }

  return redirect("/painel");
}

// LOGOUT
export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}

// ALUNO: criar missão
export async function criarMissao(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login?next=/lancar-missao");

  const titulo = String(formData.get("titulo") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();

  if (!titulo) return redirect("/lancar-missao?error=1");

  const { error } = await supabase.from("solicitacoes").insert({
    user_id: user.id,
    titulo,
    descricao: descricao || null,
    status: "aberta",
  });

  if (error) return redirect("/lancar-missao?error=2");
  return redirect("/painel");
}

// ORIENTADOR: aceitar missão
export async function aceitarMissao(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return redirect("/painel-orientador");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login?next=/painel-orientador");

  const { error } = await supabase
    .from("solicitacoes")
    .update({ orientador_id: user.id, status: "em_andamento" })
    .eq("id", id)
    .is("orientador_id", null)
    .eq("status", "aberta");

  if (error) return redirect("/painel-orientador?error=1");
  return redirect("/painel-orientador");
}
