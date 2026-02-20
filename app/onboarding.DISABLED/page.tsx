'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<'aluno' | 'orientador' | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleConfirm() {
    if (!selected) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/entrar'); return }

    const { error } = await supabase
      .from('profiles')
      .update({ role: selected })
      .eq('id', user.id)

    if (error) { console.error(error); setLoading(false); return }

    router.push(selected === 'aluno' ? '/painel' : '/painel-orientador')
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo ao NEO HUB</h1>
        <p className="text-slate-400 text-sm mb-10">Como você vai usar a plataforma?</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {(['aluno', 'orientador'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              className={`p-6 rounded-xl border text-left transition-all ${
                selected === role
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <div className="text-3xl mb-3">{role === 'aluno' ? '' : ''}</div>
              <div className="font-semibold capitalize text-sm">{role}</div>
              <div className="text-xs mt-1 opacity-60">
                {role === 'aluno' ? 'Busco orientadores para meu trabalho' : 'Ofereço orientação acadêmica'}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected || loading}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
        >
          {loading ? 'Salvando...' : 'Continuar'}
        </button>
      </div>
    </div>
  )
}
