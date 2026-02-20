"use client";
import React, { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "../../lib/supabase-browser";

export default function DebugAuthPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [out, setOut] = useState("carregando...");

  useEffect(() => {
    (async () => {
      const s = await supabase.auth.getSession();
      const u = await supabase.auth.getUser();
      setOut(JSON.stringify({ session: s.data.session, sessionError: s.error, user: u.data.user, userError: u.error }, null, 2));
    })();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Debug Auth</h1>
      <pre className="whitespace-pre-wrap bg-black/40 border border-white/10 p-4 rounded-xl text-sm">{out}</pre>
    </main>
  );
}
