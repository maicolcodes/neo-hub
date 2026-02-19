// app/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/utils/supabase/server';

/**
 * PADRAO:
 * - loginAction
 * - signupAction
 * - signOutAction
 * - criarMissaoAction
 *
 * As paginas devem importar SEMPRE daqui:
 * import { loginAction } from '@/app/actions';
 */

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) redirect('/login?error=Email%20e%20senha%20obrigatorios');

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect('/login?error=Email%20ou%20senha%20invalidos');
  redirect('/pos-login');
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const role = String(formData.get('role') ?? 'aluno');

  if (!email || !password) redirect('/cadastrar?error=Email%20e%20senha%20obrigatorios');

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) redirect('/cadastrar?error=Falha%20ao%20criar%20conta');

  const userId = data.user?.id;
  if (userId) {
    // garante profile
    await supabase.from('profiles').upsert({ id: userId, role }, { onConflict: 'id' });
  }

  redirect('/login');
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function criarMissaoAction(formData: FormData) {
  const titulo = String(formData.get('titulo') ?? '').trim();

  if (!titulo) redirect('/lancar-missao?error=Informe%20um%20titulo');

  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth?.user?.id;

  if (!userId) redirect('/login?error=Faça%20login%20novamente');

  // Ajuste para sua tabela real (se for diferente, me fale o nome/colunas)
  const { error } = await supabase.from('missoes').insert({
    titulo,
    criado_por: userId
  });

  if (error) redirect('/lancar-missao?error=Falha%20ao%20criar%20missao');

  redirect('/painel');
}
