"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";

function safeNext(next: FormDataEntryValue | null) {
  if (!next) return null;
  const s = String(next).trim();
  if (!s) return null;
  // só permite caminho interno
  if (!s.startsWith("/")) return null;
  // evita open-redirect básico
  if (s.startsWith("//")) return null;
  return s;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  const supabase = await createServerSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent("Email ou senha inválidos")}${next ? `&next=${encodeURIComponent(next)}` : ""}`);

  const userId = data.user?.id;
  if (!userId) redirect(`/login?error=${encodeURIComponent("Sessão inválida. Tente novamente.")}`);

  // Decide destino por role (profiles.role). Se não existir, assume aluno.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const role = profile?.role ?? "aluno";

  if (next) redirect(next);
  if (role === "orientador") redirect("/painel-orientador");
  redirect("/painel");
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "aluno");

  const supabase = await createServerSupabase();

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) redirect(`/cadastrar?error=${encodeURIComponent(error.message)}`);

  const userId = data.user?.id;
  if (userId) {
    // garante profile
    await supabase.from("profiles").upsert({ id: userId, role }, { onConflict: "id" });
  }

  redirect("/login");
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function criarMissao(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) redirect("/lancar-missao?error=Informe%20um%20t%C3%ADtulo");

  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) redirect("/login?next=/lancar-missao");

  const { error } = await supabase
    .from("solicitacoes")
    .insert({ user_id: user.id, titulo, status: "pendente" });

  if (error) redirect(`/lancar-missao?error=${encodeURIComponent(error.message)}`);

  redirect("/painel?ok=1");
}
