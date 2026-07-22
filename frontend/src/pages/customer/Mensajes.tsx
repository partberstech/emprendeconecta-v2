import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  ChevronRight,
  User,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { api, extractList } from '@/lib/api'
import { cn } from '@/lib/cn'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'

// ── Types (local, matches API shape) ──
interface Conversacion {
  idConversacion: number
  nombreContacto: string
  ultimoMensaje: string
  fechaUltimoMensaje: string
  noLeidos: number
  fotoContacto?: string
}

// ── Skeleton ──
function SkeletonConversacion() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-xl border border-surface-200 bg-white p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  )
}

// ── Main Component ──
export default function MensajesCliente() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversaciones = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<unknown>('/mensajes/conversaciones')
      setConversaciones(extractList<Conversacion>(res))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mensajes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversaciones()
  }, [])

  // ── Loading ──
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="mb-6 h-4 w-56" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonConversacion key={i} />
          ))}
        </div>
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          icon={<AlertCircle className="h-6 w-6" />}
          title="Error al cargar mensajes"
          description={error}
          action={{
            label: 'Reintentar',
            onClick: fetchConversaciones,
          }}
        />
      </div>
    )
  }

  // ── Empty ──
  if (conversaciones.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          icon={<MessageSquare className="h-6 w-6" />}
          title="No tienes conversaciones"
          description="Cuando te comuniques con un emprendedor, tus mensajes aparecerán aquí."
        />
      </div>
    )
  }

  // ── List ──
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Mensajes</h1>
        <p className="mt-0.5 text-sm text-surface-500">
          {conversaciones.length} conversación
          {conversaciones.length !== 1 ? 'es' : ''}
        </p>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {conversaciones.map((conv, i) => (
            <motion.button
              key={conv.idConversacion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl border border-surface-200 bg-white p-4 text-left shadow-xs',
                'transition-all hover:border-brand-200 hover:shadow-sm',
                conv.noLeidos > 0 && 'border-brand-200 bg-brand-50/30',
              )}
              // Future: navigate to conversation detail
              onClick={() => {
                // navigate(`/cliente/mensajes/${conv.idConversacion}`)
              }}
            >
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-100 text-surface-500">
                {conv.fotoContacto ? (
                  <img
                    src={conv.fotoContacto}
                    alt={conv.nombreContacto}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'truncate text-sm font-semibold',
                      conv.noLeidos > 0
                        ? 'text-surface-900'
                        : 'text-surface-800',
                    )}
                  >
                    {conv.nombreContacto}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] text-surface-400">
                    <Clock className="h-3 w-3" />
                    {new Date(conv.fechaUltimoMensaje).toLocaleDateString(
                      'es-ES',
                      {
                        day: 'numeric',
                        month: 'short',
                      },
                    )}
                  </span>
                </div>

                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      'truncate text-sm',
                      conv.noLeidos > 0
                        ? 'font-medium text-surface-700'
                        : 'text-surface-500',
                    )}
                  >
                    {conv.ultimoMensaje}
                  </p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {conv.noLeidos > 0 && (
                      <Badge color="brand" size="sm">
                        {conv.noLeidos}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-surface-300" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
