export default function EnvCheck() {
  return (
    <pre style={{ padding: 24 }}>
      URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "FALTA"}{"\n"}
      KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "OK" : "FALTA"}{"\n"}
    </pre>
  );
}
