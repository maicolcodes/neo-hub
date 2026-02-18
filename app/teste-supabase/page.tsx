"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function TesteSupabase() {
  const [status, setStatus] = useState("Testando conexão...");

  useEffect(() => {
    const supabase = createClient();

    async function testar() {
      const { error } = await supabase.from("solicitacoes").select("*").limit(1);

      if (error) setStatus("Erro: " + error.message);
      else setStatus("Conectado ao Supabase com sucesso.");
    }

    testar();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>{status}</h1>
    </div>
  );
}
