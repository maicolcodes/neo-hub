"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2 } from "lucide-react";

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
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !area) {
        router.push("/painel");
        return;
      }

      await supabase
        .from("profiles")
        .update({ area })
        .eq("id", user.id);

      router.push("/painel");
    }

    salvar();
  }, [router, area]);

  return (
    <main className="neo-bg-panel min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-white/50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <p className="text-sm">Atualizando sua área...</p>
      </div>
    </main>
  );
}

export default function SelecionarAreaPage() {
  return (
    <Suspense
      fallback={
        <main className="neo-bg-panel min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-white/50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <p className="text-sm">Carregando...</p>
          </div>
        </main>
      }
    >
      <SalvarAreaContent />
    </Suspense>
  );
}