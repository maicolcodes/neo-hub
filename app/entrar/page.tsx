import { login } from "../auth/actions";

type SP = { next?: string; error?: string };

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const next = sp?.next ?? "";
  const error = sp?.error ?? "";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: 28,
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 6 }}>
          Entrar
        </h1>
        <p style={{ opacity: 0.75, marginBottom: 18 }}>
          Acesse com seu email e senha.
        </p>

        {error ? (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(255,0,0,0.35)",
              color: "#ff6b6b",
              background: "rgba(255,0,0,0.06)",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        ) : null}

        <form action={login} style={{ display: "grid", gap: 12 }}>
          <input type="hidden" name="next" value={next} />

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 14, opacity: 0.85 }}>Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="voce@exemplo.com"
              style={{
                height: 46,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                padding: "0 14px",
                color: "white",
                outline: "none",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 14, opacity: 0.85 }}>Senha</span>
            <input
              name="password"
              type="password"
              required
              placeholder=""
              style={{
                height: 46,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                padding: "0 14px",
                color: "white",
                outline: "none",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              height: 48,
              borderRadius: 14,
              border: 0,
              background: "#1f5eff",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
              marginTop: 6,
            }}
          >
            Entrar
          </button>

          <a
            href="/cadastrar"
            style={{
              display: "block",
              textAlign: "center",
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.14)",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
              marginTop: 6,
              opacity: 0.9,
            }}
          >
            Criar conta
          </a>
        </form>
      </div>
    </main>
  );
}
