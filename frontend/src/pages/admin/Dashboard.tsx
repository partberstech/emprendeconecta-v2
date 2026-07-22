import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { api, extractList } from '@/lib/api'
import type { Usuario, Emprendimiento, Pedido } from '@/types'

interface StatsCard {
  label: string
  value: string | number
  change: number
  icon: React.ReactNode
  color: string
}

interface DashboardStats {
  totalUsuarios: number
  totalEmprendimientos: number
  totalPedidos: number
  ingresosTotales: number
  usuariosNuevos: number
  emprendimientosPendientes: number
}

function StatCard({ label, value, change, icon, color }: StatsCard) {
  const isPositive = change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-surface-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            isPositive
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
              : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-surface-500 dark:text-surface-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </motion.div>
  )
}

interface RecentItem {
  type: 'usuario' | 'emprendimiento' | 'pedido'
  id: number
  label: string
  secondary: string
  date: string
  status?: string
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 dark:bg-surface-800">
            <div className="mb-3 h-12 w-12 rounded-xl bg-surface-200 dark:bg-surface-700" />
            <div className="mb-2 h-3 w-20 rounded bg-surface-200 dark:bg-surface-700" />
            <div className="h-7 w-28 rounded bg-surface-200 dark:bg-surface-700" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white p-6 dark:bg-surface-800">
        <div className="mb-4 h-5 w-40 rounded bg-surface-200 dark:bg-surface-700" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-surface-200 dark:bg-surface-700" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DashboardAdmin() {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsuarios: 0,
    totalEmprendimientos: 0,
    totalPedidos: 0,
    ingresosTotales: 0,
    usuariosNuevos: 0,
    emprendimientosPendientes: 0,
  })
  const [recientes, setRecientes] = useState<RecentItem[]>([])

  useEffect(() => {
    const cargarDashboard = async () => {
      setCargando(true)
      setError(null)
      try {
        const [usersRes, empreRes, pedidosRes] = await Promise.all([
          api.get<unknown>('/admin/usuarios'),
          api.get<unknown>('/admin/emprendimientos'),
          api.get<unknown>('/admin/pedidos'),
        ])

        const usuarios = extractList<Usuario>(usersRes)
        const emprendimientos = extractList<Emprendimiento>(empreRes)
        const pedidos = extractList<Pedido>(pedidosRes)

        const ingresos = pedidos.reduce(
          (sum, p) => sum + (p.estado === 'ENTREGADO' ? Number(p.total) : 0),
          0,
        )

        setStats({
          totalUsuarios: usuarios.length,
          totalEmprendimientos: emprendimientos.length,
          totalPedidos: pedidos.length,
          ingresosTotales: ingresos,
          usuariosNuevos: usuarios.filter(
            (u) =>
              new Date().getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000,
          ).length,
          emprendimientosPendientes: emprendimientos.filter(
            (e) => e.estado === 'PENDIENTE',
          ).length,
        })

        // Build recent items list
        const recientesList: RecentItem[] = [
          ...usuarios.slice(0, 3).map((u) => ({
            type: 'usuario' as const,
            id: u.id,
            label: u.nombre,
            secondary: u.email,
            date: '',
          })),
          ...emprendimientos.slice(0, 3).map((e) => ({
            type: 'emprendimiento' as const,
            id: e.idEmprendimiento,
            label: e.nombreNegocio,
            secondary: e.estado,
            date: '',
            status: e.estado,
          })),
          ...pedidos.slice(0, 3).map((p) => ({
            type: 'pedido' as const,
            id: p.idPedido,
            label: `Pedido #${p.idPedido}`,
            secondary: `$${Number(p.total).toLocaleString()}`,
            date: p.fechaCreacion,
            status: p.estado,
          })),
        ].slice(0, 8)

        setRecientes(recientesList)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar dashboard')
      } finally {
        setCargando(false)
      }
    }
    cargarDashboard()
  }, [])

  const cards: StatsCard[] = [
    {
      label: 'Usuarios',
      value: stats.totalUsuarios,
      change: 12,
      icon: <Users className="h-5 w-5 text-white" />,
      color: 'bg-brand-500',
    },
    {
      label: 'Emprendimientos',
      value: stats.totalEmprendimientos,
      change: 8,
      icon: <Store className="h-5 w-5 text-white" />,
      color: 'bg-accent',
    },
    {
      label: 'Pedidos',
      value: stats.totalPedidos,
      change: -3,
      icon: <ShoppingCart className="h-5 w-5 text-white" />,
      color: 'bg-info',
    },
    {
      label: 'Ingresos',
      value: `$${stats.ingresosTotales.toLocaleString()}`,
      change: 15,
      icon: <DollarSign className="h-5 w-5 text-white" />,
      color: 'bg-success',
    },
  ]

  const statusColor = (status?: string) => {
    switch (status) {
      case 'ACTIVO':
      case 'APROBADO':
      case 'ENTREGADO':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'PENDIENTE':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'RECHAZADO':
      case 'CANCELADO':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
    }
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case 'usuario':
        return <UserPlus className="h-4 w-4 text-brand-500" />
      case 'emprendimiento':
        return <Store className="h-4 w-4 text-accent" />
      case 'pedido':
        return <Package className="h-4 w-4 text-info" />
      default:
        return null
    }
  }

  if (cargando) return <DashboardSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-red-50 px-6 py-20 text-center dark:bg-red-900/10">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Resumen general de la plataforma
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800"
        >
          <div className="rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
            <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Usuarios nuevos (7 días)
            </p>
            <p className="text-xl font-bold text-surface-900 dark:text-white">
              +{stats.usuariosNuevos}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-4 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800"
        >
          <div className="rounded-xl bg-red-100 p-3 dark:bg-red-900/30">
            <Store className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Emprendimientos pendientes
            </p>
            <p className="text-xl font-bold text-surface-900 dark:text-white">
              {stats.emprendimientosPendientes}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Recent records table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-800"
      >
        <div className="border-b border-surface-200 px-6 py-4 dark:border-surface-700">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            Últimos registros
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-surface-100 text-surface-500 dark:border-surface-700 dark:text-surface-400">
                <th className="px-6 py-3 font-medium">Tipo</th>
                <th className="px-6 py-3 font-medium">Nombre</th>
                <th className="px-6 py-3 font-medium">Detalle</th>
                <th className="px-6 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((item) => (
                <tr
                  key={`${item.type}-${item.id}`}
                  className="border-b border-surface-100 last:border-0 hover:bg-surface-50 dark:border-surface-700 dark:hover:bg-surface-700/50"
                >
                  <td className="px-6 py-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-700">
                      {typeIcon(item.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">
                    {item.label}
                  </td>
                  <td className="px-6 py-4 text-surface-500 dark:text-surface-400">
                    {item.secondary}
                  </td>
                  <td className="px-6 py-4">
                    {item.status && (
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(item.status)}`}
                      >
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
