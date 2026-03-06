"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

function SalvarAreaContent() {
  const router = useRouter();
  const params = useSearchParams();
  const area = params.get("id");

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function salvar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !area) {
        router.push("/painel-orientador");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ area })
        .eq("id", user.id);

      if (error) {
        router.push("/painel-orientador");
        return;
      }

      router.push("/painel-orientador");
    }

    salvar();
  }, [router, area]);

  return (
    <main className="min-h-screen bg-[#080c14] flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-white/50 text-sm">Salvando sua área...</p>
      </div>
    </main>
  );
}

export default function SelecionarAreaOrientadorPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#080c14] flex items-center justify-center text-white">
          <div className="text-center">
            <p className="text-white/50 text-sm">Carregando...</p>
          </div>
        </main>
      }
    >
      <SalvarAreaContent />
    </Suspense>
  );
}