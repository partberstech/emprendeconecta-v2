import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { api, extractList } from '@/lib/api'
import { cn } from '@/lib/cn'
import type { Usuario, Emprendimiento, Pedido } from '@/types'

interface MetricCard {
  titulo: string
  valor: string | number
  cambio: number
  icono: React.ReactNode
  color: string
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

function SkeletonRow() {
  return <div className="h-4 w-full rounded bg-surface-200 dark:bg-surface-700 animate-pulse" />
}

export default function ReportesAdmin() {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [datos, setDatos] = useState<{
    usuarios: Usuario[]
    emprendimientos: Emprendimiento[]
    pedidos: Pedido[]
  }>({ usuarios: [], emprendimientos: [], pedidos: [] })

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      setError(null)
      try {
        const [u, e, p] = await Promise.all([
          api.get<unknown>('/admin/usuarios'),
          api.get<unknown>('/admin/emprendimientos'),
          api.get<unknown>('/admin/pedidos'),
        ])
        setDatos({
          usuarios: extractList<Usuario>(u),
          emprendimientos: extractList<Emprendimiento>(e),
          pedidos: extractList<Pedido>(p),
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar reportes')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const { usuarios, emprendimientos, pedidos } = datos

  const conteoRoles = {
    clientes: usuarios.filter((u) => u.rol === 'ROLE_CLIENTE').length,
    emprendedores: usuarios.filter((u) => u.rol === 'ROLE_EMPRENDEDOR').length,
    admins: usuarios.filter((u) => u.rol === 'ROLE_ADMIN').length,
  }

  const conteoEstadosEmpre = {
    aprobados: emprendimientos.filter((e) => e.estado === 'APROBADO').length,
    pendientes: emprendimientos.filter((e) => e.estado === 'PENDIENTE').length,
    rechazados: emprendimientos.filter((e) => e.estado === 'RECHAZADO').length,
  }

  const totalIngresos = pedidos
    .filter((p) => p.estado === 'ENTREGADO')
    .reduce((sum, p) => sum + Number(p.total), 0)

  const pedidosPorEstado = {
    entregados: pedidos.filter((p) => p.estado === 'ENTREGADO').length,
    pendientesP: pedidos.filter((p) => p.estado === 'PENDIENTE').length,
    cancelados: pedidos.filter((p) => p.estado === 'CANCELADO').length,
    otros: pedidos.filter((p) => !['ENTREGADO', 'PENDIENTE', 'CANCELADO'].includes(p.estado)).length,
  }

  const metrics: MetricCard[] = [
    {
      titulo: 'Total usuarios',
      valor: usuarios.length,
      cambio: 12,
      icono: <Users className="h-5 w-5 text-white" />,
      color: 'bg-brand-500',
    },
    {
      titulo: 'Total emprendimientos',
      valor: emprendimientos.length,
      cambio: 8,
      icono: <Store className="h-5 w-5 text-white" />,
      color: 'bg-accent',
    },
    {
      titulo: 'Total pedidos',
      valor: pedidos.length,
      cambio: -3,
      icono: <ShoppingCart className="h-5 w-5 text-white" />,
      color: 'bg-info',
    },
    {
      titulo: 'Ingresos totales',
      valor: formatCurrency(totalIngresos),
      cambio: 15,
      icono: <DollarSign className="h-5 w-5 text-white" />,
      color: 'bg-success',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Reportes</h1>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Estadísticas y métricas de la plataforma
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white p-5 dark:bg-surface-800">
                <div className="mb-3 h-12 w-12 rounded-xl bg-surface-200 dark:bg-surface-700" />
                <div className="mb-2 h-3 w-20 rounded bg-surface-200 dark:bg-surface-700" />
                <div className="h-7 w-28 rounded bg-surface-200 dark:bg-surface-700" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="animate-pulse rounded-2xl bg-white p-6 dark:bg-surface-800">
              <div className="mb-4 h-5 w-32 rounded bg-surface-200 dark:bg-surface-700" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            </div>
            <div className="animate-pulse rounded-2xl bg-white p-6 dark:bg-surface-800">
              <div className="mb-4 h-5 w-32 rounded bg-surface-200 dark:bg-surface-700" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* Metric cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <motion.div
                key={m.titulo}
                variants={item}
                className="rounded-2xl border border-surface-200 bg-white p-5 shadow-xs dark:border-surface-700 dark:bg-surface-800"
              >
                <div className={`inline-flex rounded-xl p-3 ${m.color}`}>{m.icono}</div>
                <p className="mt-4 text-sm text-surface-500 dark:text-surface-400">{m.titulo}</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">{m.valor}</p>
                  <span
                    className={cn(
                      'flex items-center gap-0.5 text-xs font-medium',
                      m.cambio >= 0 ? 'text-emerald-600' : 'text-red-500',
                    )}
                  >
                    {m.cambio >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(m.cambio)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Two-column stats */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Usuarios by role */}
            <motion.div
              variants={item}
              className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800"
            >
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-500" />
                <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                  Usuarios por rol
                </h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Clientes', value: conteoRoles.clientes, color: 'bg-blue-500' },
                  { label: 'Emprendedores', value: conteoRoles.emprendedores, color: 'bg-amber-500' },
                  { label: 'Administradores', value: conteoRoles.admins, color: 'bg-purple-500' },
                ].map((item) => {
                  const max = Math.max(conteoRoles.clientes, conteoRoles.emprendedores, conteoRoles.admins, 1)
                  const pct = (item.value / max) * 100
                  return (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-300">{item.label}</span>
                        <span className="font-semibold text-surface-900 dark:text-white">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-700">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', item.color)}
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Emprendimientos by status */}
            <motion.div
              variants={item}
              className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800"
            >
              <div className="mb-4 flex items-center gap-2">
                <Store className="h-5 w-5 text-accent" />
                <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                  Emprendimientos por estado
                </h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Aprobados', value: conteoEstadosEmpre.aprobados, color: 'bg-emerald-500' },
                  { label: 'Pendientes', value: conteoEstadosEmpre.pendientes, color: 'bg-amber-500' },
                  { label: 'Rechazados', value: conteoEstadosEmpre.rechazados, color: 'bg-red-500' },
                ].map((item) => {
                  const max = Math.max(...Object.values(conteoEstadosEmpre), 1)
                  const pct = (item.value / max) * 100
                  return (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-300">{item.label}</span>
                        <span className="font-semibold text-surface-900 dark:text-white">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-700">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', item.color)}
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Pedidos by status */}
            <motion.div
              variants={item}
              className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800"
            >
              <div className="mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-info" />
                <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                  Pedidos por estado
                </h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Entregados', value: pedidosPorEstado.entregados, color: 'bg-emerald-500' },
                  { label: 'Pendientes', value: pedidosPorEstado.pendientesP, color: 'bg-amber-500' },
                  { label: 'Cancelados', value: pedidosPorEstado.cancelados, color: 'bg-red-500' },
                  { label: 'Otros', value: pedidosPorEstado.otros, color: 'bg-surface-400' },
                ].map((item) => {
                  const max = Math.max(...Object.values(pedidosPorEstado), 1)
                  const pct = (item.value / max) * 100
                  return (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-300">{item.label}</span>
                        <span className="font-semibold text-surface-900 dark:text-white">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-700">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', item.color)}
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Revenue summary */}
            <motion.div
              variants={item}
              className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800"
            >
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                  Resumen financiero
                </h2>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Ingresos totales (entregados)', value: formatCurrency(totalIngresos), icon: DollarSign },
                  { label: 'Total pedidos', value: pedidos.length, icon: ShoppingCart },
                  { label: 'Productos en plataforma', value: '—', icon: Package },
                  { label: 'Valor promedio por pedido', value: pedidos.length > 0 ? formatCurrency(Math.round(totalIngresos / pedidos.length)) : '$0', icon: BarChart3 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl bg-surface-50 px-4 py-3 dark:bg-surface-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-surface-400" />
                      <span className="text-sm text-surface-600 dark:text-surface-300">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-surface-900 dark:text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
