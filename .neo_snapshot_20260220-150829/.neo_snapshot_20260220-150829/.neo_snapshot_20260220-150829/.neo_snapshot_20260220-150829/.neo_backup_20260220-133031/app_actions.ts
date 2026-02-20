'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'

type FormData = { get(key: string): FormDataEntryValue | null }

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data?.user) redirect('/login?error=Email%20ou%20senha%20invalidos')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  redirect(profile?.role === 'orientador' ? '/painel-orientador' : '/painel')
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const role = String(formData.get('role') ?? 'aluno')

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) redirect('/cadastrar?error=Falha%20ao%20criar%20conta')

  const userId = data.user?.id
  if (userId) {
    await supabase.from('profiles').upsert({ id: userId, role }, { onConflict: 'id', ignoreDuplicates: true })
  }

  redirect('/login')
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function criarMissaoAction(formData: FormData) {
  const titulo = String(formData.get('titulo') ?? '').trim()
  const descricao = String(formData.get('descricao') ?? '').trim()
  const categoria = String(formData.get('categoria') ?? '').trim()
  const prazo = String(formData.get('prazo') ?? '').trim()
  const orcamento = formData.get('orcamento')

  if (!titulo) redirect('/lancar-missao?error=Informe%20um%20titulo')

  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const userId = auth?.user?.id

  if (!userId) redirect('/login?error=Faça%20login%20novamente')

  const { data: profile } = await supabase
    .from('profiles').select('area').eq('id', userId).single()

  const { error } = await supabase.from('missoes').insert({
    titulo, descricao: descricao || null, categoria: categoria || null,
    prazo: prazo || null, orcamento: orcamento ? Number(orcamento) : null,
    aluno_id: userId, area: profile?.area || null, status: 'aberta'
  })

  if (error) redirect('/lancar-missao?error=Falha%20ao%20criar%20missao')
  redirect('/painel?ok=1')
}
