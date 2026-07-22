import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Package, Star, Store, ArrowLeft } from 'lucide-react'
import { api, extractList } from '@/lib/api'
import { cn } from '@/lib/cn'
import type { Emprendimiento, Producto } from '@/types'

export default function EmprendimientoDetail() {
  const { id } = useParams<{ id: string }>()
  const [emprendimiento, setEmprendimiento] = useState<Emprendimiento | null>(null)
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      setCargando(true)
      setError(null)
      try {
        const [empRes, prodRes] = await Promise.all([
          api.get<unknown>(`/emprendimientos/${id}`),
          api.get<unknown>(`/emprendimientos/${id}/productos`),
        ])
        setEmprendimiento(empRes as Emprendimiento)
        setProductos(extractList<Producto>(prodRes))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar')
      } finally {
        setCargando(false)
      }
    }
    fetchData()
  }, [id])

  if (cargando) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 h-8 w-72 animate-pulse rounded-lg bg-surface-200 dark:bg-surface-700" />
        <div className="mb-8 h-24 animate-pulse rounded-2xl bg-surface-100 dark:bg-surface-800" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-surface-100 dark:bg-surface-800" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <p className="text-lg font-medium text-red-600 dark:text-red-400">{error}</p>
        <Link
          to="/catalogo"
          className="mt-4 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          Volver al catálogo
        </Link>
      </div>
    )
  }

  if (!emprendimiento) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <Store className="mb-4 h-12 w-12 text-surface-300" />
        <p className="text-lg font-medium text-surface-700 dark:text-surface-200">
          Emprendimiento no encontrado
        </p>
        <Link
          to="/catalogo"
          className="mt-4 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Back link */}
      <Link
        to="/catalogo"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      {/* ── Business Profile ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-surface-200 dark:bg-surface-800 dark:ring-surface-700"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-brand-500 to-purple-600 px-6 py-10 sm:px-10">
          <div className="flex items-center gap-5">
            {/* Logo placeholder */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold text-white backdrop-blur-sm">
              {emprendimiento.nombreNegocio?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0 text-white">
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                {emprendimiento.nombreNegocio}
              </h1>
              {emprendimiento.categoria && (
                <p className="mt-1 text-sm text-white/80">
                  {emprendimiento.categoria.nombreCategoria}
                </p>
              )}
              {emprendimiento.calificacionPromedio != null && emprendimiento.calificacionPromedio > 0 && (
                <div className="mt-2 flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{emprendimiento.calificacionPromedio.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-10">
          {emprendimiento.descripcion && (
            <div className="sm:col-span-2">
              <p className="leading-relaxed text-surface-600 dark:text-surface-300">
                {emprendimiento.descripcion}
              </p>
            </div>
          )}

          {emprendimiento.direccion && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">Dirección</p>
                <p className="text-sm text-surface-500 dark:text-surface-400">{emprendimiento.direccion}</p>
              </div>
            </div>
          )}

          {emprendimiento.telefono && (
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">Teléfono</p>
                <p className="text-sm text-surface-500 dark:text-surface-400">{emprendimiento.telefono}</p>
              </div>
            </div>
          )}

          {emprendimiento.dueno?.email && (
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">Email</p>
                <p className="text-sm text-surface-500 dark:text-surface-400">{emprendimiento.dueno.email}</p>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* ── Products ── */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-surface-900 dark:text-white">
          Productos y Servicios
          <span className="ml-2 text-base font-normal text-surface-500">
            ({productos.length})
          </span>
        </h2>

        {productos.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productos.map((producto, i) => (
              <motion.div
                key={producto.idProducto}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
                <Link
                  to={`/producto/${producto.idProducto}`}
                  className="group block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-surface-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-brand-200 dark:bg-surface-800 dark:ring-surface-700 dark:hover:ring-brand-600"
                >
                  <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-surface-100 dark:bg-surface-700">
                    {producto.imagenUrl ? (
                      <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <Package className="h-10 w-10 text-surface-400" />
                    )}
                  </div>
                  <h3 className="mb-1 truncate font-semibold text-surface-900 dark:text-white">
                    {producto.nombre}
                  </h3>
                  {producto.descripcion && (
                    <p className="mb-2 line-clamp-2 text-xs text-surface-500 dark:text-surface-400">
                      {producto.descripcion}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                      ${Number(producto.precio).toLocaleString()}
                    </span>
                    {producto.calificacionPromedio != null && producto.calificacionPromedio > 0 && (
                      <span className="flex items-center gap-1 text-xs text-accent">
                        ★ {producto.calificacionPromedio.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {producto.stockDisponible != null && (
                    <p
                      className={cn(
                        'mt-2 text-xs',
                        producto.stockDisponible > 0
                          ? 'text-success'
                          : 'text-error',
                      )}
                    >
                      {producto.stockDisponible > 0
                        ? `${producto.stockDisponible} en stock`
                        : 'Agotado'}
                    </p>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-50 px-6 py-20 dark:bg-surface-800/50">
            <Package className="mb-4 h-12 w-12 text-surface-300 dark:text-surface-600" />
            <p className="text-lg font-medium text-surface-700 dark:text-surface-200">
              Este emprendimiento aún no tiene productos publicados.
            </p>
            <p className="mt-1 text-sm text-surface-500">
              Vuelve pronto para ver sus novedades.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
