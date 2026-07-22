import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  MessageSquare,
  Send,
  User,
  Search,
  Loader2,
  ChevronLeft,
  Clock,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/cn'
import { useAuth } from '@/stores/auth'

// ── Types ──
interface Conversacion {
  idConversacion: number
  clienteNombre: string
  clienteEmail: string
  ultimoMensaje: string
  fechaUltimoMensaje: string
  noLeidos: number
}

interface Mensaje {
  idMensaje: number
  contenido: string
  fechaEnvio: string
  esEmprendedor: boolean
  emprendedorNombre?: string
  clienteNombre?: string
}

// ── Main ──
export default function MensajesEmprendedor() {
  const { usuario } = useAuth()
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedConv, setSelectedConv] = useState<Conversacion | null>(null)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [texto, setTexto] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConversaciones()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  async function loadConversaciones() {
    setLoadingList(true)
    try {
      const res = await api.get<Conversacion[]>('/emprendedor/mensajes/conversaciones')
      setConversaciones(Array.isArray(res) ? res : [])
    } catch (err) {
      console.error('Error loading conversations', err)
      toast.error('Error al cargar conversaciones')
    } finally {
      setLoadingList(false)
    }
  }

  async function loadMensajes(convId: number) {
    setLoadingMsgs(true)
    try {
      const res = await api.get<Mensaje[]>(`/emprendedor/mensajes/${convId}`)
      setMensajes(Array.isArray(res) ? res : [])
    } catch {
      toast.error('Error al cargar mensajes')
    } finally {
      setLoadingMsgs(false)
    }
  }

  function selectConversacion(conv: Conversacion) {
    setSelectedConv(conv)
    loadMensajes(conv.idConversacion)
    // Mark as read locally
    setConversaciones((prev) =>
      prev.map((c) =>
        c.idConversacion === conv.idConversacion ? { ...c, noLeidos: 0 } : c
      )
    )
    // Focus input after render
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  async function enviarMensaje() {
    if (!texto.trim() || !selectedConv || sending) return
    setSending(true)
    try {
      const msg = await api.post<Mensaje>(
        `/emprendedor/mensajes/${selectedConv.idConversacion}`,
        { contenido: texto.trim() }
      )
      setMensajes((prev) => [...prev, msg])
      setTexto('')
      // Update conversation preview
      setConversaciones((prev) =>
        prev.map((c) =>
          c.idConversacion === selectedConv.idConversacion
            ? {
                ...c,
                ultimoMensaje: texto.trim(),
                fechaUltimoMensaje: new Date().toISOString(),
              }
            : c
        )
      )
    } catch {
      toast.error('Error al enviar mensaje')
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje()
    }
  }

  const filteredConvs = conversaciones.filter(
    (c) =>
      c.clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
      c.clienteEmail.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Mensajes</h1>
        <p className="mt-1 text-sm text-surface-500">
          Conversaciones con tus clientes
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-16rem)] min-h-[500px]">
        {/* ── Sidebar: Conversation List ── */}
        <div className="w-full lg:w-80 shrink-0">
          <Card className="h-full flex flex-col !p-0 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-surface-200">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-surface-300 bg-white pl-9 pr-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:border-brand-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loadingList ? (
                <div className="space-y-2 p-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConvs.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center px-4">
                  <MessageSquare className="mb-2 h-8 w-8 text-surface-300" />
                  <p className="text-sm text-surface-500">
                    {search ? 'Sin resultados' : 'No hay conversaciones'}
                  </p>
                </div>
              ) : (
                filteredConvs.map((conv) => (
                  <button
                    key={conv.idConversacion}
                    onClick={() => selectConversacion(conv)}
                    className={cn(
                      'w-full text-left px-4 py-3 transition-colors border-b border-surface-100 last:border-b-0',
                      selectedConv?.idConversacion === conv.idConversacion
                        ? 'bg-brand-50'
                        : 'hover:bg-surface-50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-surface-900 truncate">
                            {conv.clienteNombre}
                          </p>
                          <span className="text-[10px] text-surface-400 shrink-0">
                            {formatRelativeTime(conv.fechaUltimoMensaje)}
                          </span>
                        </div>
                        <p className="text-xs text-surface-500 truncate mt-0.5">
                          {conv.ultimoMensaje}
                        </p>
                      </div>
                      {conv.noLeidos > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1.5 text-[10px] font-bold text-white shrink-0">
                          {conv.noLeidos}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* ── Chat Area ── */}
        <div className="flex-1 flex flex-col">
          {!selectedConv ? (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-3 h-12 w-12 text-surface-300" />
                <p className="text-sm font-medium text-surface-500">
                  Selecciona una conversación
                </p>
                <p className="text-xs text-surface-400 mt-1">
                  Elige un cliente del listado para ver sus mensajes
                </p>
              </div>
            </Card>
          ) : (
            <Card className="flex-1 flex flex-col !p-0 overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-surface-200 px-4 py-3">
                <button
                  onClick={() => setSelectedConv(null)}
                  className="lg:hidden rounded-lg p-1 text-surface-500 hover:bg-surface-100 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600 shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-surface-900 truncate">
                    {selectedConv.clienteNombre}
                  </p>
                  <p className="text-xs text-surface-500 truncate">
                    {selectedConv.clienteEmail}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex',
                          i % 2 === 0 ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <Skeleton
                          className={cn(
                            'h-10 rounded-2xl',
                            i % 2 === 0 ? 'w-48' : 'w-36'
                          )}
                        />
                      </div>
                    ))}
                  </div>
                ) : mensajes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="mb-2 h-8 w-8 text-surface-300" />
                    <p className="text-sm text-surface-500">
                      No hay mensajes aún
                    </p>
                    <p className="text-xs text-surface-400">
                      Envía el primer mensaje para iniciar la conversación
                    </p>
                  </div>
                ) : (
                  mensajes.map((msg) => (
                    <div
                      key={msg.idMensaje}
                      className={cn(
                        'flex',
                        msg.esEmprendedor ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[75%] rounded-2xl px-4 py-2.5',
                          msg.esEmprendedor
                            ? 'bg-brand-500 text-white rounded-br-md'
                            : 'bg-surface-100 text-surface-900 rounded-bl-md'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.contenido}
                        </p>
                        <p
                          className={cn(
                            'text-[10px] mt-1',
                            msg.esEmprendedor
                              ? 'text-brand-200'
                              : 'text-surface-400'
                          )}
                        >
                          {new Date(msg.fechaEnvio).toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-surface-200 p-3">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe un mensaje..."
                    disabled={sending}
                    className="flex-1 h-10 rounded-xl border border-surface-300 bg-white px-4 py-2 text-sm text-surface-900 placeholder:text-surface-400 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:border-brand-500 disabled:opacity-50"
                  />
                  <button
                    onClick={enviarMensaje}
                    disabled={!texto.trim() || sending}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Helper ──
function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diffMs = now - date
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'ahora'
  if (diffMin < 60) return `${diffMin}m`
  if (diffHour < 24) return `${diffHour}h`
  if (diffDay < 7) return `${diffDay}d`
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
  })
}
