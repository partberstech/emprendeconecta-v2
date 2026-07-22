import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tags, Plus, Pencil, Trash2, X, Search } from 'lucide-react'
import { api, extractList } from '@/lib/api'
import type { Categoria } from '@/types'
import { Button, Input, Card, CardHeader, CardBody, EmptyState, Modal } from '@/components/ui'
import { toast } from 'sonner'

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [formNombre, setFormNombre] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const res = await api.get<unknown>('/categorias')
      setCategorias(extractList<Categoria>(res))
    } catch {
      toast.error('Error al cargar categorías')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const openCrear = () => {
    setEditando(null)
    setFormNombre('')
    setFormDesc('')
    setModalOpen(true)
  }

  const openEditar = (cat: Categoria) => {
    setEditando(cat)
    setFormNombre(cat.nombreCategoria)
    setFormDesc(cat.descripcion ?? '')
    setModalOpen(true)
  }

  const guardar = async () => {
    if (!formNombre.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }
    setGuardando(true)
    try {
      if (editando) {
        await api.put(`/categorias/${editando.idCategoria}`, {
          nombreCategoria: formNombre.trim(),
          descripcion: formDesc.trim() || undefined,
        })
        toast.success('Categoría actualizada')
      } else {
        await api.post('/categorias', {
          nombreCategoria: formNombre.trim(),
          descripcion: formDesc.trim() || undefined,
        })
        toast.success('Categoría creada')
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
    if (!window.confirm('¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return
    try {
      await api.delete(`/categorias/${id}`)
      toast.success('Categoría eliminada')
      setCategorias((prev) => prev.filter((c) => c.idCategoria !== id))
    } catch {
      toast.error('Error al eliminar categoría')
    }
  }

  const filtradas = categorias.filter((c) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      c.nombreCategoria.toLowerCase().includes(q) ||
      c.descripcion?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Categorías</h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Administra las categorías de productos y emprendimientos
          </p>
        </div>
        <Button onClick={openCrear} leftIcon={<Plus className="h-4 w-4" />}>
          Nueva categoría
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Buscar categorías..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-10 pr-4 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500"
        />
      </div>

      {/* Loading */}
      {cargando && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-white p-6 dark:bg-surface-800"
            >
              <div className="mb-2 h-5 w-3/4 rounded bg-surface-200 dark:bg-surface-700" />
              <div className="h-3 w-full rounded bg-surface-200 dark:bg-surface-700" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!cargando && filtradas.length === 0 && (
        <Card>
          <EmptyState
            icon={<Tags className="h-6 w-6" />}
            title={
              busqueda
                ? 'No se encontraron categorías'
                : 'No hay categorías creadas'
            }
            description={
              busqueda
                ? 'Intenta con otro término de búsqueda'
                : 'Crea tu primera categoría para organizar los productos'
            }
            action={
              busqueda
                ? undefined
                : { label: 'Crear categoría', onClick: openCrear }
            }
          />
        </Card>
      )}

      {/* Grid */}
      {!cargando && filtradas.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtradas.map((cat, i) => (
              <motion.div
                key={cat.idCategoria}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
              >
                <Card className="group relative h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                        <Tags className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-surface-900 dark:text-white">
                        {cat.nombreCategoria}
                      </h3>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openEditar(cat)}
                        className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-700 dark:hover:text-surface-200"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => eliminar(cat.idCategoria)}
                        className="rounded-lg p-1.5 text-surface-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardBody>
                    {cat.descripcion ? (
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {cat.descripcion}
                      </p>
                    ) : (
                      <p className="text-sm italic text-surface-400 dark:text-surface-500">
                        Sin descripción
                      </p>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editando ? 'Editar categoría' : 'Nueva categoría'}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button loading={guardando} onClick={guardar}>
              {editando ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            placeholder="Ej: Alimentación, Tecnología..."
            value={formNombre}
            onChange={(e) => setFormNombre(e.target.value)}
            autoFocus
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Descripción
            </label>
            <textarea
              placeholder="Breve descripción de la categoría (opcional)"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
