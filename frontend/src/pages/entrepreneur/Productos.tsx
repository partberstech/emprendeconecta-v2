import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { toast } from 'sonner'
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Loader2,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/cn'
import type { Producto, Categoria } from '@/types'

// ── Schema ──
const productoSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
  precio: z.number().positive('Debe ser mayor a 0'),
  stockDisponible: z.number().int().min(0, 'No puede ser negativo'),
  idCategoria: z.number().min(1, 'Selecciona una categoría'),
  imagenUrl: z.string().max(500, 'URL muy larga').optional(),
})

type ProductoFormData = z.infer<typeof productoSchema>

const formatearPrecio = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)

// ── Main ──
export default function ProductosEmprendedor() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [prods, cats] = await Promise.all([
        api.get<Producto[]>('/emprendedor/productos'),
        api.get<Categoria[]>('/categorias'),
      ])
      setProductos(Array.isArray(prods) ? prods : [])
      setCategorias(Array.isArray(cats) ? cats : [])
    } catch (err) {
      console.error('Error loading productos', err)
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      stockDisponible: 0,
      idCategoria: undefined as unknown as number,
      imagenUrl: '',
    })
    setModalOpen(true)
  }

  function openEdit(producto: Producto) {
    setEditing(producto)
    reset({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: producto.precio,
      stockDisponible: producto.stockDisponible,
      idCategoria: producto.categoria.idCategoria,
      imagenUrl: producto.imagenUrl ?? '',
    })
    setModalOpen(true)
  }

  async function onSubmit(data: ProductoFormData) {
    setSaving(true)
    try {
      if (editing) {
        const updated = await api.put<Producto>(`/emprendedor/productos/${editing.idProducto}`, data)
        setProductos((prev) =>
          prev.map((p) => (p.idProducto === updated.idProducto ? updated : p))
        )
        toast.success('Producto actualizado')
      } else {
        const created = await api.post<Producto>('/emprendedor/productos', data)
        setProductos((prev) => [...prev, created])
        toast.success('Producto creado')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(editing ? 'Error al actualizar producto' : 'Error al crear producto')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublicacion(producto: Producto) {
    setTogglingId(producto.idProducto)
    try {
      const updated = await api.patch<Producto>(
        `/emprendedor/productos/${producto.idProducto}/publicar`,
        { estadoPublicacion: !producto.estadoPublicacion }
      )
      setProductos((prev) =>
        prev.map((p) => (p.idProducto === updated.idProducto ? updated : p))
      )
      toast.success(updated.estadoPublicacion ? 'Producto publicado' : 'Producto ocultado')
    } catch {
      toast.error('Error al cambiar estado de publicación')
    } finally {
      setTogglingId(null)
    }
  }

  async function eliminarProducto(id: number) {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      await api.delete(`/emprendedor/productos/${id}`)
      setProductos((prev) => prev.filter((p) => p.idProducto !== id))
      toast.success('Producto eliminado')
    } catch {
      toast.error('Error al eliminar producto')
    }
  }

  const filtered = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria.nombreCategoria.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Productos</h1>
          <p className="mt-1 text-sm text-surface-500">
            Gestiona el catálogo de tu negocio
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
          Nuevo Producto
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-surface-300 bg-white pl-10 pr-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:border-brand-500"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden !p-0">
        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Package className="h-7 w-7" />}
            title={search ? 'Sin resultados' : 'No tienes productos'}
            description={
              search
                ? 'Intenta cambiar tu búsqueda'
                : 'Crea tu primer producto para empezar a vender'
            }
            action={
              search ? undefined : { label: 'Crear Producto', onClick: openCreate }
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-surface-500">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-surface-500">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-surface-500">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-surface-500">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-surface-500">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-surface-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filtered.map((producto) => (
                  <tr
                    key={producto.idProducto}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {producto.imagenUrl ? (
                          <img
                            src={producto.imagenUrl}
                            alt={producto.nombre}
                            className="h-12 w-12 rounded-lg object-cover border border-surface-200"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-100 text-surface-400">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-surface-900 truncate max-w-[200px]">
                            {producto.nombre}
                          </p>
                          {producto.descripcion && (
                            <p className="text-xs text-surface-500 truncate max-w-[200px]">
                              {producto.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-surface-900 whitespace-nowrap">
                      {formatearPrecio(producto.precio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        color={producto.stockDisponible > 0 ? 'success' : 'error'}
                        size="sm"
                      >
                        {producto.stockDisponible > 0
                          ? `${producto.stockDisponible} uds.`
                          : 'Sin stock'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600 whitespace-nowrap">
                      {producto.categoria.nombreCategoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        color={producto.estadoPublicacion ? 'success' : 'surface'}
                        size="sm"
                      >
                        {producto.estadoPublicacion ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => togglePublicacion(producto)}
                          disabled={togglingId === producto.idProducto}
                          className={cn(
                            'rounded-lg p-1.5 transition-colors',
                            producto.estadoPublicacion
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-surface-400 hover:bg-surface-100'
                          )}
                          title={producto.estadoPublicacion ? 'Ocultar' : 'Publicar'}
                        >
                          {togglingId === producto.idProducto ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : producto.estadoPublicacion ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openEdit(producto)}
                          className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-brand-600 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto.idProducto)}
                          className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-error transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Producto' : 'Nuevo Producto'}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="producto-form"
              loading={saving}
            >
              {editing ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </>
        }
      >
        <form
          id="producto-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            label="Nombre del Producto"
            placeholder="Ej: Café Artesanal 250g"
            error={errors.nombre?.message}
            {...register('nombre')}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Descripción
            </label>
            <textarea
              {...register('descripcion')}
              rows={3}
              placeholder="Describe el producto..."
              className="flex w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:border-brand-500"
            />
            {errors.descripcion?.message && (
              <p className="mt-1 text-xs text-error">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio (COP)"
              type="number"
              min={0}
              step={100}
              placeholder="0"
              error={errors.precio?.message}
              {...register('precio', { valueAsNumber: true })}
            />
            <Input
              label="Stock"
              type="number"
              min={0}
              step={1}
              placeholder="0"
              error={errors.stockDisponible?.message}
              {...register('stockDisponible', { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Categoría
            </label>
            <select
              {...register('idCategoria', { valueAsNumber: true })}
              className="flex h-10 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:border-brand-500 appearance-none"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombreCategoria}
                </option>
              ))}
            </select>
            {errors.idCategoria?.message && (
              <p className="mt-1 text-xs text-error">{errors.idCategoria.message}</p>
            )}
          </div>

          <Input
            label="URL de Imagen (opcional)"
            placeholder="https://ejemplo.com/imagen.jpg"
            error={errors.imagenUrl?.message}
            {...register('imagenUrl')}
          />
        </form>
      </Modal>
    </div>
  )
}
