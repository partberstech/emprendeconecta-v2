import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TicketPercent,
  Plus,
  Pencil,
  Trash2,
  Search,
  Calendar,
  Percent,
  DollarSign,
} from 'lucide-react'
import { api, extractList } from '@/lib/api'
import type { Categoria } from '@/types'
import { Button, Input, Card, CardHeader, CardBody, CardFooter, EmptyState, Modal, Badge } from '@/components/ui'
import { toast } from 'sonner'
import { cn } from '@/lib/cn'

interface Cupon {
  idCupon: number
  codigo: string
  descripcion?: string
  descuento: number
  tipoDescuento: 'PORCENTAJE' | 'MONTO'
  fechaExpiracion: string
  activo: boolean
  categoria?: Categoria
  usoMaximo?: number
  usosActuales?: number
}

function formatearFecha(fecha: string) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function calcularEstado(fechaExpiracion: string, activo: boolean) {
  if (!activo) return { label: 'Inactivo', color: 'error' as const }
  const vencido = new Date(fechaExpiracion) < new Date()
  if (vencido) return { label: 'Vencido', color: 'error' as const }
  return { label: 'Activo', color: 'success' as const }
}

function CuponSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl bg-white p-5 dark:bg-surface-800">
          <div className="mb-2 h-5 w-32 rounded bg-surface-200 dark:bg-surface-700" />
          <div className="mb-1 h-3 w-48 rounded bg-surface-200 dark:bg-surface-700" />
          <div className="h-3 w-24 rounded bg-surface-200 dark:bg-surface-700" />
        </div>
      ))}
    </div>
  )
}

export default function CuponesAdmin() {
  const [cupones, setCupones] = useState<Cupon[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Cupon | null>(null)
  const [form, setForm] = useState({
    codigo: '',
    descripcion: '',
    descuento: 0,
    tipoDescuento: 'PORCENTAJE' as 'PORCENTAJE' | 'MONTO',
    fechaExpiracion: '',
    activo: true,
    usoMaximo: undefined as number | undefined,
  })
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const res = await api.get<unknown>('/admin/cupones')
      setCupones(extractList<Cupon>(res))
    } catch {
      toast.error('Error al cargar cupones')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const openCrear = () => {
    setEditando(null)
    setForm({
      codigo: '',
      descripcion: '',
      descuento: 0,
      tipoDescuento: 'PORCENTAJE',
      fechaExpiracion: '',
      activo: true,
      usoMaximo: undefined,
    })
    setModalOpen(true)
  }

  const openEditar = (cupon: Cupon) => {
    setEditando(cupon)
    setForm({
      codigo: cupon.codigo,
      descripcion: cupon.descripcion ?? '',
      descuento: cupon.descuento,
      tipoDescuento: cupon.tipoDescuento,
      fechaExpiracion: cupon.fechaExpiracion?.split('T')[0] ?? '',
      activo: cupon.activo,
      usoMaximo: cupon.usoMaximo,
    })
    setModalOpen(true)
  }

  const guardar = async () => {
    if (!form.codigo.trim()) {
      toast.error('El código es obligatorio')
      return
    }
    if (form.descuento <= 0) {
      toast.error('El descuento debe ser mayor a 0')
      return
    }
    if (!form.fechaExpiracion) {
      toast.error('La fecha de expiración es obligatoria')
      return
    }

    setGuardando(true)
    try {
      const payload = {
        codigo: form.codigo.trim().toUpperCase(),
        descripcion: form.descripcion.trim() || undefined,
        descuento: form.descuento,
        tipoDescuento: form.tipoDescuento,
        fechaExpiracion: new Date(form.fechaExpiracion).toISOString(),
        activo: form.activo,
        usoMaximo: form.usoMaximo || undefined,
      }

      if (editando) {
        await api.put(`/admin/cupones/${editando.idCupon}`, payload)
        toast.success('Cupón actualizado')
      } else {
        await api.post('/admin/cupones', payload)
        toast.success('Cupón creado')
      }
      setModalOpen(false)
      cargar()
    } catch {
      toast.error(editando ? 'Error al actualizar' : 'Error al crear')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este cupón?')) return
    try {
      await api.delete(`/admin/cupones/${id}`)
      toast.success('Cupón eliminado')
      setCupones((prev) => prev.filter((c) => c.idCupon !== id))
    } catch {
      toast.error('Error al eliminar cupón')
    }
  }

  const toggleActivo = async (cupon: Cupon) => {
    try {
      await api.patch(`/admin/cupones/${cupon.idCupon}/estado`, { activo: !cupon.activo })
      setCupones((prev) =>
        prev.map((c) => (c.idCupon === cupon.idCupon ? { ...c, activo: !c.activo } : c)),
      )
      toast.success(cupon.activo ? 'Cupón desactivado' : 'Cupón activado')
    } catch {
      toast.error('Error al cambiar estado')
    }
  }

  const filtrados = cupones.filter((c) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      c.codigo.toLowerCase().includes(q) ||
      c.descripcion?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Cupones</h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Crea y administra cupones de descuento
          </p>
        </div>
        <Button onClick={openCrear} leftIcon={<Plus className="h-4 w-4" />}>
          Nuevo cupón
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Buscar por código o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-10 pr-4 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500"
        />
      </div>

      {/* Loading */}
      {cargando && (
        <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800">
          <CuponSkeleton />
        </div>
      )}

      {/* Empty */}
      {!cargando && filtrados.length === 0 && (
        <Card>
          <EmptyState
            icon={<TicketPercent className="h-6 w-6" />}
            title={
              busqueda ? 'No se encontraron cupones' : 'No hay cupones creados'
            }
            description={
              busqueda
                ? 'Intenta con otro código o descripción'
                : 'Crea tu primer cupón de descuento para promocionar productos'
            }
            action={
              busqueda
                ? undefined
                : { label: 'Crear cupón', onClick: openCrear }
            }
          />
        </Card>
      )}

      {/* List */}
      {!cargando && filtrados.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtrados.map((cupon, i) => {
              const estado = calcularEstado(cupon.fechaExpiracion, cupon.activo)
              return (
                <motion.div
                  key={cupon.idCupon}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                >
                  <Card className="group">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent dark:bg-accent/20">
                          <TicketPercent className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="rounded-md bg-surface-100 px-2 py-0.5 font-mono text-sm font-bold text-surface-900 dark:bg-surface-700 dark:text-white">
                              {cupon.codigo}
                            </code>
                            <Badge color={estado.color} size="sm">
                              {estado.label}
                            </Badge>
                          </div>
                          {cupon.descripcion && (
                            <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
                              {cupon.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => openEditar(cupon)}
                          className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-700 dark:hover:text-surface-200"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => eliminar(cupon.idCupon)}
                          className="rounded-lg p-1.5 text-surface-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardHeader>

                    <CardBody>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-1.5 text-surface-600 dark:text-surface-300">
                          {cupon.tipoDescuento === 'PORCENTAJE' ? (
                            <Percent className="h-4 w-4 text-brand-500" />
                          ) : (
                            <DollarSign className="h-4 w-4 text-brand-500" />
                          )}
                          <span className="font-medium">
                            {cupon.tipoDescuento === 'PORCENTAJE'
                              ? `${cupon.descuento}%`
                              : `$${cupon.descuento.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                          <Calendar className="h-4 w-4" />
                          Vence: {formatearFecha(cupon.fechaExpiracion)}
                        </div>
                        {cupon.usoMaximo != null && (
                          <span className="text-surface-500 dark:text-surface-400">
                            Usos: {cupon.usosActuales ?? 0}/{cupon.usoMaximo}
                          </span>
                        )}
                      </div>
                    </CardBody>

                    <CardFooter>
                      <button
                        onClick={() => toggleActivo(cupon)}
                        className={cn(
                          'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                          cupon.activo
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400',
                        )}
                      >
                        {cupon.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editando ? 'Editar cupón' : 'Nuevo cupón'}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button loading={guardando} onClick={guardar}>
              {editando ? 'Guardar cambios' : 'Crear cupón'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Código"
            placeholder="Ej: VERANO2024"
            value={form.codigo}
            onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))}
            autoFocus
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Descripción
            </label>
            <textarea
              placeholder="Descripción del cupón (opcional)"
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Tipo de descuento
              </label>
              <select
                value={form.tipoDescuento}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    tipoDescuento: e.target.value as 'PORCENTAJE' | 'MONTO',
                  }))
                }
                className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
              >
                <option value="PORCENTAJE">Porcentaje (%)</option>
                <option value="MONTO">Monto fijo ($)</option>
              </select>
            </div>
            <Input
              label="Descuento"
              type="number"
              min={1}
              placeholder={form.tipoDescuento === 'PORCENTAJE' ? 'Ej: 20' : 'Ej: 5000'}
              value={form.descuento || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, descuento: Number(e.target.value) }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Fecha de expiración
              </label>
              <input
                type="date"
                value={form.fechaExpiracion}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fechaExpiracion: e.target.value }))
                }
                className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-surface-600 dark:bg-surface-800 dark:text-white"
              />
            </div>
            <Input
              label="Uso máximo"
              type="number"
              min={1}
              placeholder="Sin límite si se deja vacío"
              value={form.usoMaximo ?? ''}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  usoMaximo: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
              className="h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-sm text-surface-700 dark:text-surface-300">
              Activo al crear
            </span>
          </label>
        </div>
      </Modal>
    </div>
  )
}
