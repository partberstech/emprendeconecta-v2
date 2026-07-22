import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api, extractList } from '@/lib/api'
import { cn } from '@/lib/cn'
import type { Categoria, Producto, PaginatedResponse } from '@/types'

const ITEMS_PER_PAGE = 12

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-4 dark:bg-surface-800">
      <div className="mb-4 aspect-square rounded-xl bg-surface-200 dark:bg-surface-700" />
      <div className="mb-2 h-4 w-3/4 rounded bg-surface-200 dark:bg-surface-700" />
      <div className="mb-4 h-3 w-1/2 rounded bg-surface-200 dark:bg-surface-700" />
      <div className="h-6 w-1/3 rounded bg-surface-200 dark:bg-surface-700" />
    </div>
  )
}

export default function Catalogo() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paginaActual, setPaginaActual] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPaginaActual(0)
    }, 350)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setCargando(true)
      setError(null)
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.get<unknown>('/categorias'),
          api.get<unknown>('/productos', { page: paginaActual, size: ITEMS_PER_PAGE }),
        ])
        setCategorias(extractList<Categoria>(catsRes))
        setProductos(extractList<Producto>(prodsRes))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar')
      } finally {
        setCargando(false)
      }
    }
    fetchData()
  }, [paginaActual])

  // Client-side filtering (could also be server-side)
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      if (categoriaActiva !== null && p.categoria?.idCategoria !== categoriaActiva) return false
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase()
        const matchName = p.nombre?.toLowerCase().includes(q)
        const matchDesc = p.descripcion?.toLowerCase().includes(q)
        if (!matchName && !matchDesc) return false
      }
      return true
    })
  }, [productos, categoriaActiva, debouncedSearch])

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE))
  const paginatedProductos = productosFiltrados.slice(
    paginaActual * ITEMS_PER_PAGE,
    (paginaActual + 1) * ITEMS_PER_PAGE,
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  const handleCategoryClick = useCallback((id: number | null) => {
    setCategoriaActiva(prev => (prev === id ? null : id))
    setPaginaActual(0)
  }, [])

  const limpiarFiltros = useCallback(() => {
    setSearch('')
    setDebouncedSearch('')
    setCategoriaActiva(null)
    setPaginaActual(0)
  }, [])

  const hayFiltros = search || categoriaActiva !== null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
          Catálogo{' '}
          <span className="text-brand-500">de Productos</span>
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Explora productos de emprendedores locales
        </p>
      </div>

      {/* Search bar + mobile filter toggle */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-11 pr-4 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setDebouncedSearch('') }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors lg:hidden',
            sidebarOpen
              ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
              : 'border-surface-200 bg-white text-surface-600 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300',
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </button>
      </div>

      <div className="flex gap-8">
        {/* ── Sidebar Filters ── */}
        <aside
          className={cn(
            'shrink-0 lg:block lg:w-64',
            sidebarOpen ? 'fixed inset-0 z-50 block bg-black/40 lg:static lg:z-auto lg:bg-transparent' : 'hidden',
          )}
        >
          <div
            className={cn(
              'h-full overflow-y-auto rounded-2xl bg-white p-6 shadow-lg ring-1 ring-surface-200 lg:shadow-none lg:ring-0 dark:bg-surface-800 dark:ring-surface-700',
              sidebarOpen ? 'fixed right-0 top-0 w-80 max-w-[85vw]' : 'lg:static lg:w-auto',
            )}
          >
            {/* Mobile header */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <span className="font-semibold text-surface-900 dark:text-white">Filtros</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1 text-surface-500 hover:text-surface-700 dark:hover:text-surface-200"
                aria-label="Cerrar filtros"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Categorías
            </h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleCategoryClick(null)}
                className={cn(
                  'rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all',
                  categoriaActiva === null
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700',
                )}
              >
                Todas
              </button>
              {categorias.map(cat => (
                <button
                  key={cat.idCategoria}
                  onClick={() => handleCategoryClick(cat.idCategoria)}
                  className={cn(
                    'rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all',
                    categoriaActiva === cat.idCategoria
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700',
                  )}
                >
                  {cat.nombreCategoria}
                </button>
              ))}
            </div>

            {hayFiltros && (
              <button
                onClick={limpiarFiltros}
                className="mt-6 w-full rounded-xl border border-surface-200 py-2.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-700"
              >
                Limpiar filtros
              </button>
            )}

            {/* Overlay close for mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 -z-10 bg-black/20 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-hidden
              />
            )}
          </div>
        </aside>

        {/* ── Products Grid ── */}
        <div className="min-w-0 flex-1">
          {/* Results count */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-surface-500 dark:text-surface-400">
              {hayFiltros
                ? `${productosFiltrados.length} resultado${productosFiltrados.length !== 1 ? 's' : ''}`
                : `${productos.length} producto${productos.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Loading */}
          {cargando && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {!cargando && error && (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-red-50 px-6 py-16 text-center dark:bg-red-900/10">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Empty */}
          {!cargando && !error && productosFiltrados.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl bg-surface-50 px-6 py-20 dark:bg-surface-800/50"
            >
              <Package className="mb-4 h-12 w-12 text-surface-300 dark:text-surface-600" />
              <p className="text-lg font-medium text-surface-700 dark:text-surface-200">
                {hayFiltros
                  ? 'No encontramos productos con esos filtros.'
                  : 'No hay productos disponibles en este momento.'}
              </p>
              <p className="mt-1 text-sm text-surface-500">
                {hayFiltros ? 'Intenta con otros términos o categorías.' : 'Vuelve pronto para ver novedades.'}
              </p>
              {hayFiltros && (
                <button
                  onClick={limpiarFiltros}
                  className="mt-6 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                >
                  Limpiar filtros
                </button>
              )}
            </motion.div>
          )}

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            {!cargando && !error && productosFiltrados.length > 0 && (
              <motion.div
                key={paginaActual + '-' + categoriaActiva + '-' + debouncedSearch}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {paginatedProductos.map((producto, i) => (
                  <motion.div
                    key={producto.idProducto}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
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
                      <p className="mb-1 truncate text-xs text-surface-500 dark:text-surface-400">
                        {producto.emprendimiento?.nombreNegocio ?? ''}
                      </p>
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
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Pagination ── */}
          {totalPaginas > 1 && !cargando && !error && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPaginaActual(prev => Math.max(0, prev - 1))}
                disabled={paginaActual === 0}
                className="flex items-center gap-1 rounded-xl border border-surface-200 px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-700"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPaginas, 7) }, (_, i) => {
                  let pageIndex: number
                  if (totalPaginas <= 7) {
                    pageIndex = i
                  } else if (paginaActual <= 3) {
                    pageIndex = i
                  } else if (paginaActual >= totalPaginas - 4) {
                    pageIndex = totalPaginas - 7 + i
                  } else {
                    pageIndex = paginaActual - 3 + i
                  }
                  return (
                    <button
                      key={pageIndex}
                      onClick={() => setPaginaActual(pageIndex)}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-colors',
                        paginaActual === pageIndex
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700',
                      )}
                    >
                      {pageIndex + 1}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPaginaActual(prev => Math.min(totalPaginas - 1, prev + 1))}
                disabled={paginaActual >= totalPaginas - 1}
                className="flex items-center gap-1 rounded-xl border border-surface-200 px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-700"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
