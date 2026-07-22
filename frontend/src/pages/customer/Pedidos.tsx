import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  ChevronDown,
  ChevronUp,
  Clock,
  Receipt,
  AlertCircle,
} from 'lucide-react'
import { api, extractList } from '@/lib/api'
import { cn } from '@/lib/cn'
import type { Pedido, DetallePedido } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

// ── Status config ──
const STATUS_MAP: Record<
  string,
  { label: string; color: 'brand' | 'success' | 'accent' | 'info' | 'error' | 'surface' }
> = {
  PENDIENTE: { label: 'Pendiente', color: 'accent' },
  CONFIRMADO: { label: 'Confirmado', color: 'info' },
  EN_PREPARACION: { label: 'En preparación', color: 'info' },
  ENVIADO: { label: 'Enviado', color: 'brand' },
  ENTREGADO: { label: 'Entregado', color: 'success' },
  CANCELADO: { label: 'Cancelado', color: 'error' },
}

function getStatusConfig(estado: string) {
  return STATUS_MAP[estado] ?? { label: estado, color: 'surface' as const }
}

// ── Skeleton ──
function SkeletonPedido() {
  return (
    <div className="animate-pulse rounded-xl border border-surface-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  )
}

// ── Detail row ──
function DetalleRow({ detalle }: { detalle: DetallePedido }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-surface-900">{detalle.nombre}</p>
        <p className="text-xs text-surface-500">
          {detalle.cantidad} x ${Number(detalle.precioUnitario).toLocaleString()}
        </p>
      </div>
      <span className="ml-4 whitespace-nowrap font-semibold text-surface-800">
        ${Number(detalle.subtotal).toLocaleString()}
      </span>
    </div>
  )
}

// ── Main Component ──
export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const fetchPedidos = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<unknown>('/pedidos/mis-pedidos')
      setPedidos(extractList<Pedido>(res))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPedidos()
  }, [])

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="mb-2 h-7 w-40" />
        <Skeleton className="mb-6 h-4 w-56" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonPedido key={i} />
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
          title="Error al cargar pedidos"
          description={error}
          action={{
            label: 'Reintentar',
            onClick: fetchPedidos,
          }}
        />
      </div>
    )
  }

  // ── Empty ──
  if (pedidos.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title="No tienes pedidos aún"
          description="Tus pedidos aparecerán aquí una vez que realices tu primera compra."
          action={{
            label: 'Ir al catálogo',
            onClick: () => (window.location.href = '/catalogo'),
          }}
        />
      </div>
    )
  }

  // ── List ──
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Mis Pedidos</h1>
        <p className="mt-0.5 text-sm text-surface-500">
          {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {pedidos.map((pedido) => {
            const isExpanded = expandedId === pedido.idPedido
            const status = getStatusConfig(pedido.estado)

            return (
              <motion.div
                key={pedido.idPedido}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  'rounded-xl border border-surface-200 bg-white shadow-xs transition-all',
                  isExpanded && 'ring-1 ring-brand-200',
                )}
              >
                {/* Header — clickable to expand */}
                <button
                  onClick={() => toggleExpand(pedido.idPedido)}
                  className="flex w-full items-center justify-between p-5 text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-surface-400" />
                      <span className="font-semibold text-surface-900">
                        Pedido #{pedido.idPedido}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-surface-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(pedido.fechaCreacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <Badge color={status.color} size="md">
                      {status.label}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-surface-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-surface-400" />
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-surface-100 px-5 pb-5 pt-3">
                        {/* Items */}
                        <div className="divide-y divide-surface-100">
                          {pedido.items?.map((detalle) => (
                            <DetalleRow key={detalle.idDetalle} detalle={detalle} />
                          ))}
                        </div>

                        {/* Total */}
                        <div className="mt-3 flex items-center justify-between border-t border-surface-200 pt-3">
                          <span className="text-sm font-semibold text-surface-700">
                            Total
                          </span>
                          <span className="text-lg font-bold text-surface-900">
                            ${Number(pedido.total).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
