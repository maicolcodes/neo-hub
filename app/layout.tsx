import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEO HUB — Orientação Acadêmica de Alto Nível',
  description: 'Conectamos alunos a orientadores especializados para TCC, monografias, artigos científicos e muito mais. A evolução é orientada.',
  keywords: 'TCC, orientação acadêmica, monografia, artigo científico, orientador, NEO HUB',
  openGraph: {
    title: 'NEO HUB — Orientação Acadêmica de Alto Nível',
    description: 'Conectamos alunos a orientadores especializados. A evolução é orientada.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
