'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { ArrowLeft, FileText, BookOpen, Pen, FileSearch, AlignLeft, Calendar, DollarSign, Loader2, ChevronDown } from 'lucide-react'

const categorias = [
  'TCC',
  'Monografia',
  'Artigo Científico',
  'Dissertação',
  'Revisão ABNT',
  'Relatório Técnico',
  'Projeto de Pesquisa',
  'Outro',
]

const categoriaIcons: Record<string, React.ReactNode> = {
  'TCC': <FileText className="w-4 h-4" />,
  'Monografia': <BookOpen className="w-4 h-4" />,
  'Artigo Científico': <Pen className="w-4 h-4" />,
  'Dissertação': <FileSearch className="w-4 h-4" />,
}

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
    if (!user) { router.push('/login'); return }

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
    <main className="neo-bg-panel min-h-screen text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 neo-glass">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black">N</div>
            <span className="font-black tracking-wider text-sm">NEO <span className="text-blue-400 italic">HUB</span></span>
          </Link>
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-white/50 hover:text-white transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 tracking-widest mb-4">
            NOVA MISSÃO
          </div>
          <h1 className="text-3xl font-black mb-2">Lançar Missão</h1>
          <p className="text-white/45 text-sm">Descreva o que você precisa e encontre o orientador ideal para o seu projeto.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="neo-card p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
              <FileText className="w-4 h-4 text-blue-400" />
              Título da missão *
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handle}
              required
              placeholder="Ex: Orientação para TCC sobre inteligência artificial aplicada à medicina"
              className="neo-input"
            />
          </div>

          {/* Categoria */}
          <div className="neo-card p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Categoria *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {['TCC', 'Monografia', 'Artigo Científico', 'Dissertação'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, categoria: cat })}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    form.categoria === cat
                      ? 'border-blue-500 bg-blue-500/15 text-blue-300'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <select
                name="categoria"
                value={form.categoria}
                onChange={handle}
                required
                className="neo-select pr-10 appearance-none"
              >
                <option value="" disabled>Ou selecione outra categoria...</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Descrição */}
          <div className="neo-card p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
              <AlignLeft className="w-4 h-4 text-green-400" />
              Descrição *
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handle}
              required
              placeholder="Descreva em detalhes o que você precisa: tema, estágio atual, dificuldades, expectativas..."
              rows={5}
              className="neo-input resize-none"
            />
            <p className="text-white/30 text-xs mt-2">
              Quanto mais detalhes, mais precisa será a proposta do orientador.
            </p>
          </div>

          {/* Prazo + Orçamento */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="neo-card p-5">
              <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                <Calendar className="w-4 h-4 text-orange-400" />
                Prazo desejado
              </label>
              <input
                type="date"
                name="prazo"
                value={form.prazo}
                onChange={handle}
                className="neo-input"
              />
            </div>
            <div className="neo-card p-5">
              <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                <DollarSign className="w-4 h-4 text-green-400" />
                Orçamento (R$)
              </label>
              <input
                type="number"
                name="orcamento"
                value={form.orcamento}
                onChange={handle}
                placeholder="0,00"
                min="0"
                step="0.01"
                className="neo-input"
              />
            </div>
          </div>

          {/* Erro */}
          {erro && (
            <div className="rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-red-200 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> {erro}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="neo-btn-primary w-full py-4 text-base justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Publicando missão...</>
            ) : (
              <>Publicar Missão</>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
