'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function SelecionarArea() {
  const router = useRouter()
  const params = useSearchParams()
  const area = params.get('id')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function salvar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !area) { router.push('/painel'); return }

      await supabase
        .from('profiles')
        .update({ area })
        .eq('id', user.id)

      router.push('/painel')
    }
    salvar()
  }, [])

  return (
    <main className="min-h-screen bg-[#080c14] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-white/50 text-sm">Salvando sua área...</p>
      </div>
    </main>
  )
}
