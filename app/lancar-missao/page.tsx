'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const categorias = ['TCC', 'Monografia', 'Artigo Científico', 'Dissertação', 'Revisão ABNT', 'Outro']

export default function LancarMissao() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    titulo: '', descricao: '', categoria: '', prazo: '', orcamento: ''
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/entrar'); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('area')
      .eq('id', user.id)
      .single()

    const { error } = await supabase.from('missoes').insert({
      aluno_id: user.id,
      titulo: form.titulo,
      descricao: form.descricao || null,
      categoria: form.categoria || null,
      prazo: form.prazo || null,
      orcamento: form.orcamento ? Number(form.orcamento) : null,
      area: profile?.area || null,
      status: 'aberta'
    })

    if (error) { setErro('Erro ao criar missão. Tente novamente.'); setLoading(false); return }
    router.push('/painel?ok=1')
  }

  return (
    <main className="min-h-screen bg-[#080c14] text-white p-6">
      <div className="mx-auto max-w-xl">
        <button onClick={() => router.back()} className="text-white/40 text-sm mb-8 hover:text-white transition">
           Voltar
        </button>

        <h1 className="text-3xl font-extrabold mb-2">Lançar Missão</h1>
        <p className="text-white/50 text-sm mb-8">Descreva o que você precisa e encontre o orientador ideal.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Título *</label>
            <input
              name="titulo" value={form.titulo} onChange={handle} required
              placeholder="Ex: TCC sobre inteligência artificial"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Categoria *</label>
            <select
              name="categoria" value={form.categoria} onChange={handle} required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
            >
              <option value="" disabled>Selecione uma categoria</option>
              {categorias.map(c => <option key={c} value={c} className="bg-[#0d1420]">{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">Descrição *</label>
            <textarea
              name="descricao" value={form.descricao} onChange={handle} required
              placeholder="Descreva em detalhes o que você precisa..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/60 mb-2 block">Prazo</label>
              <input
                type="date" name="prazo" value={form.prazo} onChange={handle}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-2 block">Orçamento (R$)</label>
              <input
                type="number" name="orcamento" value={form.orcamento} onChange={handle}
                placeholder="0,00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Lançar Missão'}
          </button>
        </form>
      </div>
    </main>
  )
}
