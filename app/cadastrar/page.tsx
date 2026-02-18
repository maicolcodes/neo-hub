import { signup } from "@/app/actions";

export default function CadastroPage() {
  return (
    <main className="neo-bg min-h-screen flex items-center justify-center">
      <form
        action={signup}
        className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl"
      >
        <h1 className="text-2xl font-bold mb-6">Criar conta</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full mb-4 p-3 rounded-lg bg-white/10"
        />

        <input
          name="password"
          type="password"
          placeholder="Senha"
          required
          className="w-full mb-4 p-3 rounded-lg bg-white/10"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 py-3 rounded-lg"
        >
          Criar conta
        </button>
      </form>
    </main>
  );
}
