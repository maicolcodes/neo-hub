import "./globals.css";

export const metadata = {
  title: "NEO HUB",
  description: "Conectando alunos e orientadores",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen neo-bg text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          {children}
          <footer className="mt-16 text-xs text-white/35">
             {new Date().getFullYear()} NEO HUB
          </footer>
        </div>
      </body>
    </html>
  );
}
