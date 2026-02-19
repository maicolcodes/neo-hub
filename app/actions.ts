'use server'

import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/utils/supabase/server'

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=Email%20ou%20senha%20inválidos')
  }

  redirect('/pos-login')
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createServerSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/cadastrar?error=Erro%20ao%20criar%20conta')
  }

  redirect('/login')
}

export async function signOutAction() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function criarMissao(formData: FormData) {
  const titulo = String(formData.get('titulo') ?? '').trim()

  if (!titulo) {
    redirect('/lancar-missao?error=Informe%20um%20título')
  }

  const supabase = await createServerSupabase()
  const { data: auth } = await supabase.auth.getUser()

  if (!auth?.user) {
    redirect('/login')
  }

  await supabase.from('solicitacoes').insert({
    titulo,
    user_id: auth.user.id,
    status: 'pendente',
  })

  redirect('/painel')
}
