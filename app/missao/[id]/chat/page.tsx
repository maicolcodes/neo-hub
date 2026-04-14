'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { ArrowLeft, Send, Loader2, MessageSquare, User } from 'lucide-react'

type Message = {
  id: string
  conteudo: string
  autor_id: string
  created_at: string
  autor_nome?: string
}

export default function ChatMissao({ params }: { params: Promise<{ id: string }> }) {
  const [missaoId, setMissaoId] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [mensagens, setMensagens] = useState<Message[]>([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [loading, setLoading] = useState(true)
  const [missaoTitulo, setMissaoTitulo] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    params.then(p => setMissaoId(p.id))
  }, [params])

  useEffect(() => {
    if (!missaoId) return

    async function init() {
      setLoading(true)

      // Auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      // Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('nome')
        .eq('id', user.id)
        .single()
      setUserName(profile?.nome || user.email?.split('@')[0] || 'Você')

      // Missão
      const { data: missao } = await supabase
        .from('missoes')
        .select('titulo')
        .eq('id', missaoId)
        .single()
      setMissaoTitulo(missao?.titulo || 'Missão')

      // Mensagens existentes
      const { data: msgs } = await supabase
        .from('mensagens')
        .select('id, conteudo, autor_id, created_at')
        .eq('missao_id', missaoId)
        .order('created_at', { ascending: true })

      setMensagens(msgs ?? [])
      setLoading(false)

      // Realtime subscription
      const channel = supabase
        .channel(`chat:${missaoId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'mensagens', filter: `missao_id=eq.${missaoId}` },
          (payload) => {
            setMensagens(prev => {
              const exists = prev.some(m => m.id === payload.new.id)
              if (exists) return prev
              return [...prev, payload.new as Message]
            })
          }
        )
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    }

    init()
  }, [missaoId])

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!texto.trim() || enviando || !missaoId || !userId) return
    setEnviando(true)

    const conteudo = texto.trim()
    setTexto('')

    await supabase.from('mensagens').insert({
      missao_id: missaoId,
      autor_id: userId,
      conteudo,
    })

    setEnviando(false)
  }

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  function formatDate(ts: string) {
    const d = new Date(ts)
    const today = new Date()
    if (d.toDateString() === today.toDateString()) return 'Hoje'
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
  }

  // Group by date
  const grouped: { date: string; msgs: Message[] }[] = []
  for (const m of mensagens) {
    const d = formatDate(m.created_at)
    const last = grouped[grouped.length - 1]
    if (last && last.date === d) {
      last.msgs.push(m)
    } else {
      grouped.push({ date: d, msgs: [m] })
    }
  }

  return (
    <main className="neo-bg-panel flex flex-col h-screen">
      {/* Header */}
      <header className="shrink-0 border-b border-white/5 neo-glass px-4 py-3 flex items-center gap-3">
        <Link href={`/missao/${missaoId}`} className="text-white/50 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate">{missaoTitulo || 'Chat da Missão'}</div>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Chat em tempo real
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : mensagens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-white/20" />
            </div>
            <p className="font-bold text-white/50 mb-1">Nenhuma mensagem ainda</p>
            <p className="text-white/30 text-sm">Seja o primeiro a enviar uma mensagem!</p>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-white/30 text-xs font-medium">{group.date}</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {group.msgs.map((msg, i) => {
                const isMe = msg.autor_id === userId
                const prevMsg = group.msgs[i - 1]
                const isSameAuthor = prevMsg?.autor_id === msg.autor_id
                const showAvatar = !isSameAuthor

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''} ${isSameAuthor ? 'mt-0.5' : 'mt-3'}`}
                  >
                    {/* Avatar */}
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isMe ? 'bg-blue-600' : 'bg-purple-600'
                    } ${!showAvatar ? 'opacity-0' : ''}`}>
                      {isMe ? userName[0]?.toUpperCase() : <User className="w-3.5 h-3.5" />}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[72%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-tr-sm'
                          : 'bg-white/8 border border-white/8 text-white/90 rounded-tl-sm'
                      }`}>
                        {msg.conteudo}
                      </div>
                      <span className="text-white/25 text-[10px] mt-1 px-1">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/5 bg-white/2 backdrop-blur px-4 py-4">
        <form onSubmit={enviar} className="flex gap-3 max-w-3xl mx-auto">
          <input
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="neo-input flex-1"
            autoComplete="off"
            disabled={enviando}
          />
          <button
            type="submit"
            disabled={enviando || !texto.trim()}
            className="neo-btn-primary px-4 py-3 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </main>
  )
}
