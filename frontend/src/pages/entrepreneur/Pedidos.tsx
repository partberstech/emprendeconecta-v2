import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/cn'
import type { Pedido, DetallePedido } from '@/types'

// ── Estado helpers ──
const ESTADOS = ['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'] as const

const estadoSiguiente: Record<string, string> = {
  PENDIENTE: 'CONFIRMADO',
  CONFIRMADO: 'ENVIADO',
  ENVIADO: 'ENTREGADO',
}

const estadoColor = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE':
      return 'accent' as const
    case 'CONFIRMADO':
      return 'info' as const
    case 'ENVIADO':
      return 'brand' as const
    case 'ENTREGADO':
      return 'success' as const
    case 'CANCELADO':
      return 'error' as const
    default:
      return 'surface' as const
  }
}

const estadoIcon = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE':
      return Clock
    case 'CONFIRMADO':
      return PackageCheck
    case 'ENVIADO':
      return Truck
    case 'ENTREGADO':
      return CheckCircle2
    case 'CANCELADO':
      return XCircle
    default:
      return ClipboardList
  }
}

const formatearPrecio = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)

// ── Main ──
export default function PedidosEmprendedor() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [changingEstado, setChangingEstado] = useState<number | null>(null)

  useEffect(() => {
    loadPedidos()
  }, [])

  async function loadPedidos() {
    setLoading(true)
    try {
      const res = await api.get<Pedido[]>('/emprendedor/pedidos?sort=fechaCreacion,desc')
      setPedidos(Array.isArray(res) ? res : [])
    } catch (err) {
      console.error('Error loading pedidos', err)
      toast.error('Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  async function cambiarEstado(pedido: Pedido, nuevoEstado: string) {
    setChangingEstado(pedido.idPedido)
    try {
      const updated = await api.patch<Pedido>(
        `/emprendedor/pedidos/${pedido.idPedido}/estado`,
        { estado: nuevoEstado }
      )
      setPedidos((prev) =>
        prev.map((p) => (p.idPedido === updated.idPedido ? updated : p))
      )
      toast.success(`Pedido #${pedido.idPedido} → ${nuevoEstado}`)
    } catch {
      toast.error('Error al cambiar estado del pedido')
    } finally {
      setChangingEstado(null)
    }
  }

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Card>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Pedidos Recibidos</h1>
        <p className="mt-1 text-sm text-surface-500">
          Gestiona los pedidos de tus clientes
        </p>
      </div>

      {pedidos.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-7 w-7" />}
          title="No tienes pedidos todavía"
          description="Cuando tus clientes realicen compras, los pedidos aparecerán aquí"
        />
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido, idx) => {
            const Icon = estadoIcon(pedido.estado)
            const siguiente = estadoSiguiente[pedido.estado]
            const isExpanded = expandedId === pedido.idPedido

            return (
              <motion.div
                key={pedido.idPedido}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  className={cn(
                    'transition-all',
                    pedido.estado === 'PENDIENTE' && 'ring-2 ring-amber-200'
                  )}
                >
                  {/* Header row */}
                  <div
                    className="flex cursor-pointer items-center justify-between gap-4"
                    onClick={() => toggleExpand(pedido.idPedido)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl shrink-0',
                          pedido.estado === 'PENDIENTE' && 'bg-amber-100 text-amber-600',
                          pedido.estado === 'CONFIRMADO' && 'bg-blue-100 text-blue-600',
                          pedido.estado === 'ENVIADO' && 'bg-brand-100 text-brand-600',
                          pedido.estado === 'ENTREGADO' && 'bg-emerald-100 text-emerald-600',
                          pedido.estado === 'CANCELADO' && 'bg-red-100 text-red-600',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-surface-900">
                          Pedido #{pedido.idPedido}
                        </p>
                        <p className="text-xs text-surface-500">
                          {new Date(pedido.fechaCreacion).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <p className="text-lg font-bold text-surface-900 hidden sm:block">
                        {formatearPrecio(pedido.total)}
                      </p>
                      <Badge color={estadoColor(pedido.estado)}>{pedido.estado}</Badge>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-surface-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-surface-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 border-t border-surface-100 pt-4 space-y-4">
                          {/* Items */}
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase text-surface-500">
                              Productos
                            </p>
                            <div className="divide-y divide-surface-100 rounded-lg border border-surface-200">
                              {pedido.items?.map((item) => (
                                <div
                                  key={item.idDetalle}
                                  className="flex items-center justify-between px-4 py-2.5"
                                >
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-surface-900">
                                      {item.nombre}
                                    </p>
                                    <p className="text-xs text-surface-500">
                                      Cant: {item.cantidad} × {formatearPrecio(item.precioUnitario)}
                                    </p>
                                  </div>
                                  <p className="text-sm font-medium text-surface-900">
                                    {formatearPrecio(item.subtotal)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Total */}
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-surface-900">Total</p>
                            <p className="text-lg font-bold text-brand-600">
                              {formatearPrecio(pedido.total)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap items-center gap-2 border-t border-surface-100 pt-4">
                            {siguiente ? (
                              <Button
                                size="sm"
                                onClick={() => cambiarEstado(pedido, siguiente)}
                                loading={changingEstado === pedido.idPedido}
                                leftIcon={<PackageCheck className="h-4 w-4" />}
                              >
                                Avanzar a {siguiente}
                              </Button>
                            ) : null}

                            {pedido.estado !== 'CANCELADO' && pedido.estado !== 'ENTREGADO' && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => cambiarEstado(pedido, 'CANCELADO')}
                                loading={changingEstado === pedido.idPedido}
                                leftIcon={<XCircle className="h-4 w-4" />}
                                disabled={changingEstado === pedido.idPedido}
                              >
                                Cancelar Pedido
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
