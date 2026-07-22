import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Store,
  Search,
  X,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Star,
} from 'lucide-react'
import { api, extractList } from '@/lib/api'
import { cn } from '@/lib/cn'
import type { Emprendimiento } from '@/types'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import { EmptyState } from '@/components/ui'

const estadoColor = (estado: string) => {
  switch (estado) {
    case 'APROBADO':
      return 'success'
    case 'PENDIENTE':
      return 'accent'
    case 'RECHAZADO':
      return 'error'
    default:
      return 'surface'
  }
}

const estadoLabel = (estado: string) => {
  switch (estado) {
    case 'APROBADO':
      return 'Aprobado'
    case 'PENDIENTE':
      return 'Pendiente'
    case 'RECHAZADO':
      return 'Rechazado'
    default:
      return estado
  }
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 rounded-xl bg-surface-200 dark:bg-surface-700" />
      ))}
    </div>
  )
}

export default function EmprendimientosAdmin() {
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null)
  const [accionando, setAccionando] = useState<number | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await api.get<unknown>('/admin/emprendimientos')
      setEmprendimientos(extractList<Emprendimiento>(res))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar emprendimientos')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    setAccionando(id)
    try {
      await api.patch(`/admin/emprendimientos/${id}/estado`, { estado: nuevoEstado })
      setEmprendimientos((prev) =>
        prev.map((e) =>
          e.idEmprendimiento === id ? { ...e, estado: nuevoEstado } : e,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estado')
    } finally {
      setAccionando(null)
    }
  }

  const filtrados = emprendimientos.filter((e) => {
    if (filtroEstado && e.estado !== filtroEstado) return false
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      e.nombreNegocio.toLowerCase().includes(q) ||
      e.dueno?.nombre?.toLowerCase().includes(q) ||
      e.categoria?.nombreCategoria?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Emprendimientos
        </h1>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Administra y modera los negocios registrados
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, dueño o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-10 pr-10 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-0.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
              aria-label="Limpiar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {[
            { value: null, label: 'Todos' },
            { value: 'PENDIENTE', label: 'Pendientes' },
            { value: 'APROBADO', label: 'Aprobados' },
            { value: 'RECHAZADO', label: 'Rechazados' },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => setFiltroEstado(f.value)}
              className={cn(
                'rounded-xl px-3.5 py-2 text-xs font-medium transition-colors',
                filtroEstado === f.value
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'border border-surface-200 bg-white text-surface-600 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="rounded-lg p-1 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Content */}
      {cargando ? (
        <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800">
          <TableSkeleton />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="rounded-2xl border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-800">
          <EmptyState
            icon={<Store className="h-6 w-6" />}
            title={
              busqueda || filtroEstado
                ? 'No se encontraron emprendimientos'
                : 'No hay emprendimientos registrados'
            }
            description={
              busqueda || filtroEstado
                ? 'Intenta con otros términos o filtros'
                : 'Los emprendimientos aparecerán aquí cuando se registren'
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((empre, i) => (
            <motion.div
              key={empre.idEmprendimiento}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              className="rounded-2xl border border-surface-200 bg-white p-5 transition-all hover:shadow-sm dark:border-surface-700 dark:bg-surface-800"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-surface-900 dark:text-white">
                      {empre.nombreNegocio}
                    </h3>
                    <Badge color={estadoColor(empre.estado)} size="sm">
                      {estadoLabel(empre.estado)}
                    </Badge>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-500 dark:text-surface-400">
                    <span className="flex items-center gap-1">
                      <Store className="h-3.5 w-3.5" />
                      Dueño: {empre.dueno?.nombre ?? '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="rounded bg-surface-100 px-1.5 py-0.5 dark:bg-surface-700">
                        {empre.categoria?.nombreCategoria ?? 'Sin categoría'}
                      </span>
                    </span>
                    {empre.calificacionPromedio != null && empre.calificacionPromedio > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        {empre.calificacionPromedio.toFixed(1)}
                      </span>
                    )}
                    {empre.direccion && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {empre.direccion}
                      </span>
                    )}
                  </div>

                  {empre.descripcion && (
                    <p className="mt-2 line-clamp-2 text-sm text-surface-500 dark:text-surface-400">
                      {empre.descripcion}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {empre.estado === 'PENDIENTE' && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        loading={accionando === empre.idEmprendimiento}
                        onClick={() => cambiarEstado(empre.idEmprendimiento, 'APROBADO')}
                        leftIcon={<CheckCircle className="h-4 w-4" />}
                      >
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={accionando === empre.idEmprendimiento}
                        onClick={() => cambiarEstado(empre.idEmprendimiento, 'RECHAZADO')}
                        leftIcon={<XCircle className="h-4 w-4" />}
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                  {empre.estado === 'APROBADO' && (
                    <Button
                      size="sm"
                      variant="danger"
                      loading={accionando === empre.idEmprendimiento}
                      onClick={() => cambiarEstado(empre.idEmprendimiento, 'RECHAZADO')}
                      leftIcon={<XCircle className="h-4 w-4" />}
                    >
                      Rechazar
                    </Button>
                  )}
                  {empre.estado === 'RECHAZADO' && (
                    <Button
                      size="sm"
                      variant="primary"
                      loading={accionando === empre.idEmprendimiento}
                      onClick={() => cambiarEstado(empre.idEmprendimiento, 'APROBADO')}
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                    >
                      Aprobar
                    </Button>
                  )}
                  <button
                    className="rounded-xl border border-surface-200 p-2.5 text-surface-500 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-700"
                    aria-label="Ver detalle"
                    title="Ver detalle"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
