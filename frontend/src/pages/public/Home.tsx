import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Store, Users, MapPin, ShoppingBag, Sparkles, ArrowRight, PackageSearch } from 'lucide-react'
import { api, extractList } from '@/lib/api'
import type { Categoria, Emprendimiento } from '@/types'

const CATEGORY_ICONS: Record<string, { icon: typeof Store; color: string }> = {
  Alimentos: { icon: ShoppingBag, color: '#f59e0b' },
  Artesanías: { icon: Sparkles, color: '#ec4899' },
  Artesania: { icon: Sparkles, color: '#ec4899' },
  Ropa: { icon: Store, color: '#8b5cf6' },
  Tecnología: { icon: PackageSearch, color: '#3b82f6' },
  Tecnologia: { icon: PackageSearch, color: '#3b82f6' },
  Hogar: { icon: Store, color: '#10b981' },
  Servicios: { icon: Users, color: '#f97316' },
}

const DEFAULT_ICON = { icon: Store, color: '#6366f1' }

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' as const, staggerChildren: 0.08 },
}

export default function Home() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cercanos, setCercanos] = useState<Emprendimiento[]>([])
  const [errorCercanos, setErrorCercanos] = useState<string | null>(null)
  const [loadingCercanos, setLoadingCercanos] = useState(false)

  useEffect(() => {
    api.get<unknown>('/categorias')
      .then(res => setCategorias(extractList<Categoria>(res)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    setLoadingCercanos(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await api.get<unknown>('/emprendimientos/cercanos', {
            latitud: coords.latitude,
            longitud: coords.longitude,
            radio_km: 10,
          })
          setCercanos(extractList<Emprendimiento>(res))
        } catch (err) {
          setErrorCercanos(err instanceof Error ? err.message : 'Error al cargar')
        } finally {
          setLoadingCercanos(false)
        }
      },
      () => {
        setLoadingCercanos(false)
        setErrorCercanos('No se pudo obtener tu ubicación')
      },
    )
  }, [])

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600 px-4 py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.2)_0%,transparent_60%)]" />

        <motion.div
          className="relative mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4" />
            Comunidad de emprendedores locales
          </motion.div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Apoya el Emprendimiento{' '}
            <span className="text-accent">Local</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
            Descubre productos y servicios únicos creados por emprendedores de tu comunidad.
            Conecta, apoya y crece junto a ellos.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/catalogo"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-brand-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <ShoppingBag className="h-5 w-5" />
              Explorar Catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/registro"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
            >
              Únete como Emprendedor
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Categories ── */}
      <section className="px-4 py-20">
        <motion.div className="mx-auto max-w-6xl" {...fadeUp}>
          <h2 className="mb-2 text-center text-3xl font-bold text-surface-900 dark:text-white">
            Categorías
          </h2>
          <p className="mb-12 text-center text-surface-500 dark:text-surface-400">
            Explora productos por categoría
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categorias.map((cat, i) => {
              const meta = CATEGORY_ICONS[cat.nombreCategoria] || DEFAULT_ICON
              const Icon = meta.icon
              return (
                <motion.div
                  key={cat.idCategoria}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={`/catalogo?categoria=${cat.nombreCategoria?.toLowerCase()}`}
                    className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-surface-200 transition-all hover:scale-105 hover:shadow-lg hover:ring-brand-200 dark:bg-surface-800 dark:ring-surface-700 dark:hover:ring-brand-600"
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl transition-colors group-hover:text-white"
                      style={{
                        backgroundColor: `${meta.color}15`,
                        color: meta.color,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-center text-sm font-medium text-surface-700 dark:text-surface-200">
                      {cat.nombreCategoria}
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* ── Nearby Entrepreneurs ── */}
      {loadingCercanos && (
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 h-8 w-64 animate-pulse rounded-lg bg-surface-200 dark:bg-surface-700" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-surface-100 dark:bg-surface-800" />
              ))}
            </div>
          </div>
        </section>
      )}

      {!loadingCercanos && cercanos.length > 0 && (
        <section className="bg-surface-50 px-4 py-20 dark:bg-surface-900/50">
          <motion.div className="mx-auto max-w-6xl" {...fadeUp}>
            <div className="mb-2 flex items-center justify-center gap-2 text-3xl font-bold text-surface-900 dark:text-white">
              <MapPin className="h-7 w-7 text-brand-500" />
              Emprendimientos Cerca de Ti
            </div>
            <p className="mb-12 text-center text-surface-500 dark:text-surface-400">
              Los más cercanos a tu ubicación actual
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cercanos.map((emp, i) => (
                <motion.div
                  key={emp.idEmprendimiento}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Link
                    to={`/emprendimiento/${emp.idEmprendimiento}`}
                    className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-surface-200 transition-all hover:scale-[1.02] hover:shadow-md hover:ring-brand-200 dark:bg-surface-800 dark:ring-surface-700 dark:hover:ring-brand-600"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                      <Store className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-surface-900 dark:text-white">
                        {emp.nombreNegocio}
                      </p>
                      <p className="truncate text-sm text-surface-500 dark:text-surface-400">
                        {emp.categoria?.nombreCategoria ?? 'Emprendimiento'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {errorCercanos && !loadingCercanos && (
        <section className="bg-surface-50 px-4 py-12 dark:bg-surface-900/50">
          <div className="mx-auto max-w-6xl text-center">
            <MapPin className="mx-auto mb-3 h-8 w-8 text-surface-400" />
            <p className="text-sm text-surface-500">{errorCercanos}</p>
          </div>
        </section>
      )}

      {/* ── Info Cards ── */}
      <section className="px-4 py-20">
        <motion.div className="mx-auto max-w-6xl" {...stagger}>
          <h2 className="mb-2 text-center text-3xl font-bold text-surface-900 dark:text-white">
            ¿Por qué EmprendeConecta?
          </h2>
          <p className="mb-12 text-center text-surface-500 dark:text-surface-400">
            Una plataforma pensada para todos
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: ShoppingBag,
                title: 'Para Clientes',
                desc: 'Encuentra productos únicos, apoya a emprendedores locales y recibe tus pedidos directamente.',
                color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
              },
              {
                icon: Store,
                title: 'Para Emprendedores',
                desc: 'Gestiona tu negocio, publica tus productos y llega a más clientes desde una plataforma simple.',
                color: 'text-brand-600 bg-brand-100 dark:bg-brand-900/30',
              },
              {
                icon: Users,
                title: 'Comunidad',
                desc: 'Forma parte de una red que impulsa el crecimiento económico local y la innovación.',
                color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
              },
            ].map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-surface-200 transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-surface-800 dark:ring-surface-700"
                >
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-surface-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="leading-relaxed text-surface-500 dark:text-surface-400">
                    {card.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
