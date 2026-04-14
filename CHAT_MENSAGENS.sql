-- ===================================================
-- NEO HUB — SQL para o Chat em Tempo Real
-- Execute no Supabase SQL Editor
-- ===================================================

-- Tabela de mensagens do chat por missão
CREATE TABLE IF NOT EXISTS mensagens (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  missao_id  uuid REFERENCES missoes(id) ON DELETE CASCADE NOT NULL,
  autor_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  conteudo   text NOT NULL CHECK (char_length(conteudo) > 0),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index para busca rápida por missão ordenada por data
CREATE INDEX IF NOT EXISTS idx_mensagens_missao_created
  ON mensagens (missao_id, created_at ASC);

-- RLS (Row Level Security)
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;

-- Participantes da missão podem ler mensagens
CREATE POLICY "participantes_podem_ler_mensagens"
  ON mensagens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM missoes m
      WHERE m.id = mensagens.missao_id
        AND (m.aluno_id = auth.uid() OR m.orientador_id = auth.uid())
    )
  );

-- Participantes da missão podem inserir mensagens
CREATE POLICY "participantes_podem_inserir_mensagens"
  ON mensagens FOR INSERT
  WITH CHECK (
    autor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM missoes m
      WHERE m.id = missao_id
        AND (m.aluno_id = auth.uid() OR m.orientador_id = auth.uid())
    )
  );

-- ===================================================
-- Habilitar Realtime na tabela mensagens
-- ===================================================
-- No Supabase Dashboard:
-- Database → Replication → Ativar "mensagens" na lista de tabelas
-- OU execute:
-- ALTER PUBLICATION supabase_realtime ADD TABLE mensagens;
