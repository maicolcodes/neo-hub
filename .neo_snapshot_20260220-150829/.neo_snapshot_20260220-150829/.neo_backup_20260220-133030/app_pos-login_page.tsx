import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";

export default async function PosLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next || "";

  const supabase = await createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) redirect(`/login?next=${encodeURIComponent(next || "/painel")}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  const role = profile?.role || "aluno";

  if (next) redirect(next);

  if (role === "orientador") redirect("/painel-orientador");
  redirect("/painel");
}
