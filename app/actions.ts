"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";

function safeNext(next: FormDataEntryValue | null) {
  if (!next) return null;
  const n = String(next);
  // só aceitamos caminhos internos
  if (!n.startsWith("/")) return null;
  if (n.startsWith("//")) return null;
  return n;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email e senha são obrigatórios")}${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent("Email ou senha inválidos")}${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  redirect(next ?? "/pos-login");
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "aluno");

  if (!email || !password) {
    redirect(`/cadastrar?error=${encodeURIComponent("Email e senha são obrigatórios")}`);
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/cadastrar?error=${encodeURIComponent("Não foi possível criar a conta")}#${encodeURIComponent(error.message)}`);
  }

  const userId = data.user?.id;
  if (userId) {
    await supabase.from("profiles").upsert({ id: userId, role }, { onConflict: "id" });
  }

  redirect("/login");
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/login");
}
