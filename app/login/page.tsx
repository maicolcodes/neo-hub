"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar() {
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
      return;
    }

    // se tiver ?next=
    const next = searchParams.get("next");

    if (next) {
      router.push(next);
    } else {
      router.push("/painel");
    }
  }

  return (
    <main className="neo-bg min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-black/40 rounded-2xl backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-6">Entrar</h1>

        <input
          className="w-full mb-4 p-3 rounded-lg bg-white text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 rounded-lg bg-white text-black"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={entrar}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
        >
          Entrar
        </button>

        {erro && <p className="mt-4 text-red-400">{erro}</p>}
      </div>
    </main>
  );
}
