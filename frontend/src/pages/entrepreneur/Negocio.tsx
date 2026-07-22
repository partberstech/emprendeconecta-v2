import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { toast } from 'sonner'
import {
  Store,
  Save,
  MapPin,
  Phone,
  FileText,
  Building2,
  Loader2,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Emprendimiento, Categoria } from '@/types'

// ── Schema ──
const negocioSchema = z.object({
  nombreNegocio: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
  direccion: z.string().max(200, 'Máximo 200 caracteres').optional(),
  telefono: z.string().max(20, 'Máximo 20 caracteres').optional(),
  idCategoria: z.number().min(1, 'Selecciona una categoría'),
})

type NegocioFormData = z.infer<typeof negocioSchema>

// ── Main ──
export default function Negocio() {
  const [emprendimiento, setEmprendimiento] = useState<Emprendimiento | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<NegocioFormData>({
    resolver: zodResolver(negocioSchema),
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [emp, cats] = await Promise.all([
        api.get<Emprendimiento>('/emprendedor/negocio'),
        api.get<Categoria[]>('/categorias'),
      ])
      setEmprendimiento(emp)
      setCategorias(Array.isArray(cats) ? cats : [])
      reset({
        nombreNegocio: emp.nombreNegocio,
        descripcion: emp.descripcion ?? '',
        direccion: emp.direccion ?? '',
        telefono: emp.telefono ?? '',
        idCategoria: emp.categoria.idCategoria,
      })
    } catch (err) {
      console.error('Error loading negocio data', err)
      toast.error('Error al cargar datos del negocio')
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: NegocioFormData) {
    setSaving(true)
    try {
      const updated = await api.put<Emprendimiento>('/emprendedor/negocio', {
        nombreNegocio: data.nombreNegocio,
        descripcion: data.descripcion || null,
        direccion: data.direccion || null,
        telefono: data.telefono || null,
        categoria: { idCategoria: data.idCategoria },
      })
      setEmprendimiento(updated)
      reset({
        nombreNegocio: updated.nombreNegocio,
        descripcion: updated.descripcion ?? '',
        direccion: updated.direccion ?? '',
        telefono: updated.telefono ?? '',
        idCategoria: updated.categoria.idCategoria,
      })
      toast.success('Negocio actualizado correctamente')
    } catch (err) {
      toast.error('Error al actualizar el negocio')
    } finally {
      setSaving(false)
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <div className="space-y-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-48" />
          </div>
        </Card>
      </div>
    )
  }

  // ── Empty (no emprendimiento created yet) ──
  if (!emprendimiento) {
    return (
      <EmptyState
        icon={<Store className="h-7 w-7" />}
        title="No tienes un negocio registrado"
        description="Crea tu emprendimiento para empezar a vender"
        action={{ label: 'Crear Negocio', onClick: () => loadData() }}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Mi Negocio</h1>
        <p className="mt-1 text-sm text-surface-500">
          Administra la información de tu emprendimiento
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900">
                  Información del Negocio
                </h2>
                <p className="text-xs text-surface-500">
                  Los cambios se guardarán al enviar el formulario
                </p>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-5">
            {/* Business Name */}
            <Input
              label="Nombre del Negocio"
              placeholder="Ej: Café Artesanal La Esquina"
              error={errors.nombreNegocio?.message}
              icon={<Store className="h-4 w-4" />}
              {...register('nombreNegocio')}
            />

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Descripción
              </label>
              <textarea
                {...register('descripcion')}
                rows={4}
                placeholder="Describe tu negocio, productos o servicios..."
                className="flex w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:border-brand-500"
              />
              {errors.descripcion?.message && (
                <p className="mt-1 text-xs text-error">{errors.descripcion.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Categoría
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <select
                  {...register('idCategoria', { valueAsNumber: true })}
                  className="flex h-10 w-full rounded-lg border border-surface-300 bg-white pl-10 pr-3 py-2 text-sm text-surface-900 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:border-brand-500 appearance-none"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombreCategoria}
                    </option>
                  ))}
                </select>
              </div>
              {errors.idCategoria?.message && (
                <p className="mt-1 text-xs text-error">{errors.idCategoria.message}</p>
              )}
            </div>

            {/* Address */}
            <Input
              label="Dirección"
              placeholder="Ej: Cra 45 #23-12, Medellín"
              error={errors.direccion?.message}
              icon={<MapPin className="h-4 w-4" />}
              {...register('direccion')}
            />

            {/* Phone */}
            <Input
              label="Teléfono"
              placeholder="Ej: +57 300 123 4567"
              error={errors.telefono?.message}
              icon={<Phone className="h-4 w-4" />}
              {...register('telefono')}
            />
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-surface-100 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => loadData()}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={saving}
              disabled={!isDirty}
              leftIcon={!saving ? <Save className="h-4 w-4" /> : undefined}
            >
              Guardar Cambios
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
