import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package,
  ClipboardList,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Pedido } from '@/types'

// ── Types ──
interface DashboardStats {
  productosActivos: number
  pedidosPendientes: number
  ingresosMes: number
  totalVentas: number
}

// ── Helpers ──
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

const formatearPrecio = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)

// ── Stat Card ──
function StatCard({
  icon,
  label,
  value,
  loading,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  loading: boolean
  color: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-surface-500">{label}</p>
          {loading ? (
            <Skeleton className="mt-1 h-7 w-24" />
          ) : (
            <p className="text-2xl font-bold text-surface-900">{value}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

// ── Main ──
export default function DashboardEmprendedor() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pedidosRecientes, setPedidosRecientes] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [statsRes, pedidosRes] = await Promise.all([
        api.get<DashboardStats>('/emprendedor/dashboard/stats'),
        api.get<Pedido[]>('/emprendedor/pedidos?page=0&size=5&sort=fechaCreacion,desc'),
      ])
      setStats(statsRes)
      setPedidosRecientes(Array.isArray(pedidosRes) ? pedidosRes : [])
    } catch (err) {
      console.error('Error loading dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="mt-1 text-sm text-surface-500">
          Resumen de tu actividad emprendedora
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Package className="h-6 w-6 text-white" />}
          label="Productos Activos"
          value={loading ? '—' : String(stats?.productosActivos ?? 0)}
          loading={loading}
          color="bg-brand-500"
        />
        <StatCard
          icon={<ClipboardList className="h-6 w-6 text-white" />}
          label="Pedidos Pendientes"
          value={loading ? '—' : String(stats?.pedidosPendientes ?? 0)}
          loading={loading}
          color="bg-amber-500"
        />
        <StatCard
          icon={<DollarSign className="h-6 w-6 text-white" />}
          label="Ingresos del Mes"
          value={loading ? '—' : formatearPrecio(stats?.ingresosMes ?? 0)}
          loading={loading}
          color="bg-emerald-500"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          label="Total Ventas"
          value={loading ? '—' : String(stats?.totalVentas ?? 0)}
          loading={loading}
          color="bg-violet-500"
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-surface-900">Últimos Pedidos</h2>
          <Link
            to="/dashboard/pedidos"
            className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : pedidosRecientes.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <ClipboardList className="mb-3 h-10 w-10 text-surface-300" />
            <p className="text-sm text-surface-500">No tienes pedidos todavía</p>
            <Link
              to="/dashboard/productos"
              className="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Gestiona tus productos
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {pedidosRecientes.map((pedido) => (
              <motion.div
                key={pedido.idPedido}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-100 text-surface-500 shrink-0">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">
                      Pedido #{pedido.idPedido}
                    </p>
                    <p className="text-xs text-surface-500">
                      {formatearPrecio(pedido.total)} · {pedido.items?.length ?? 0} producto(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge color={estadoColor(pedido.estado)}>{pedido.estado}</Badge>
                  <Link
                    to={`/dashboard/pedidos`}
                    className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          to="/dashboard/productos"
          className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-200"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-surface-900">Productos</p>
            <p className="text-sm text-surface-500">Administrar catálogo</p>
          </div>
        </Link>
        <Link
          to="/dashboard/negocio"
          className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-200"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-surface-900">Mi Negocio</p>
            <p className="text-sm text-surface-500">Editar información</p>
          </div>
        </Link>
        <Link
          to="/dashboard/mensajes"
          className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-200"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-surface-900">Mensajes</p>
            <p className="text-sm text-surface-500">Conversaciones activas</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
