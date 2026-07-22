import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, X, Shield, UserCog, ArrowUpDown, Mail, Phone, Users } from 'lucide-react'
import { api, extractList } from '@/lib/api'
import { cn } from '@/lib/cn'
import type { Usuario, Rol } from '@/types'

const ROL_OPTIONS: { value: Rol; label: string }[] = [
  { value: 'ROLE_CLIENTE', label: 'Cliente' },
  { value: 'ROLE_EMPRENDEDOR', label: 'Emprendedor' },
  { value: 'ROLE_ADMIN', label: 'Admin' },
]

const rolBadge = (rol: Rol) => {
  switch (rol) {
    case 'ROLE_ADMIN':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'ROLE_EMPRENDEDOR':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'ROLE_CLIENTE':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    default:
      return 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
  }
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-surface-200 dark:bg-surface-700" />
      ))}
    </div>
  )
}

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [cambiandoRol, setCambiandoRol] = useState<number | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const cargarUsuarios = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await api.get<unknown>('/admin/usuarios')
      setUsuarios(extractList<Usuario>(res))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarUsuarios()
  }, [cargarUsuarios])

  const cambiarRol = async (userId: number, nuevoRol: Rol) => {
    setCambiandoRol(userId)
    try {
      await api.patch(`/admin/usuarios/${userId}/rol`, { rol: nuevoRol })
      setUsuarios((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, rol: nuevoRol } : u)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar rol')
    } finally {
      setCambiandoRol(null)
    }
  }

  const filtrados = usuarios
    .filter((u) => {
      if (!busqueda) return true
      const q = busqueda.toLowerCase()
      return (
        u.nombre.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.rol.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const cmp = a.nombre.localeCompare(b.nombre)
      return sortDir === 'asc' ? cmp : -cmp
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Usuarios</h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Gestiona los usuarios de la plataforma
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
          <Users className="h-4 w-4" />
          <span>
            {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-10 pr-10 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-0.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 rounded-lg p-1 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-800">
        {cargando ? (
          <div className="p-6">
            <TableSkeleton />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <Users className="h-10 w-10 text-surface-300 dark:text-surface-600" />
            <p className="font-medium text-surface-700 dark:text-surface-200">
              {busqueda
                ? 'No se encontraron usuarios con ese criterio'
                : 'No hay usuarios registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-200 text-surface-500 dark:border-surface-700 dark:text-surface-400">
                  <th className="px-6 py-4">
                    <button
                      onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                      className="flex items-center gap-1 font-medium hover:text-surface-700 dark:hover:text-surface-200"
                    >
                      Nombre
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Rol</th>
                  <th className="px-6 py-4 font-medium">Teléfono</th>
                  <th className="px-6 py-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((usuario, i) => (
                  <motion.tr
                    key={usuario.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="border-b border-surface-100 last:border-0 hover:bg-surface-50 dark:border-surface-700 dark:hover:bg-surface-700/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-surface-900 dark:text-white">
                          {usuario.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                        <Mail className="h-3.5 w-3.5" />
                        {usuario.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                          rolBadge(usuario.rol),
                        )}
                      >
                        {ROL_OPTIONS.find((r) => r.value === usuario.rol)?.label ?? usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                        <Phone className="h-3.5 w-3.5" />
                        {usuario.telefono || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-surface-400" />
                        <select
                          value={usuario.rol}
                          onChange={(e) => cambiarRol(usuario.id, e.target.value as Rol)}
                          disabled={cambiandoRol === usuario.id}
                          className={cn(
                            'rounded-lg border border-surface-200 bg-white px-2.5 py-1.5 text-xs font-medium text-surface-700 transition-colors',
                            'focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            'dark:border-surface-600 dark:bg-surface-700 dark:text-surface-200',
                          )}
                        >
                          {ROL_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {cambiandoRol === usuario.id && (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                        )}
                        <button
                          onClick={() => cambiarRol(usuario.id, usuario.rol)}
                          className="rounded-lg p-1.5 text-brand-500 transition-colors hover:bg-brand-50 dark:hover:bg-brand-900/20"
                          aria-label="Guardar rol"
                          title="Guardar cambio de rol"
                        >
                          <UserCog className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
