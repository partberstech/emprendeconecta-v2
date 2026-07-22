import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { User, Save, AlertCircle, Mail, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/auth'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

interface PerfilFormData {
  nombre: string
  email: string
  telefono: string
  direccion: string
}

export default function PerfilCliente() {
  const { usuario, loadProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PerfilFormData>({
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
    },
  })

  // Load profile on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setFetchError(null)
      try {
        await loadProfile()
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Error al cargar perfil')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Populate form when usuario changes
  useEffect(() => {
    if (usuario) {
      reset({
        nombre: usuario.nombre ?? '',
        email: usuario.email ?? '',
        telefono: usuario.telefono ?? '',
        direccion: usuario.direccion ?? '',
      })
    }
  }, [usuario, reset])

  const onSubmit = async (data: PerfilFormData) => {
    setSaving(true)
    try {
      await api.put('/auth/perfil', {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || null,
        direccion: data.direccion || null,
      })
      await loadProfile()
      toast.success('Perfil actualizado correctamente')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al actualizar perfil',
      )
    } finally {
      setSaving(false)
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="mb-8 h-4 w-64" />
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-1.5 h-3 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="mt-6 h-10 w-40 rounded-lg" />
        </div>
      </div>
    )
  }

  // ── Error loading profile ──
  if (fetchError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <EmptyState
          icon={<AlertCircle className="h-6 w-6" />}
          title="Error al cargar perfil"
          description={fetchError}
          action={{
            label: 'Reintentar',
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    )
  }

  // ── Form ──
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Mi Perfil</h1>
        <p className="mt-0.5 text-sm text-surface-500">
          Administra tu información personal
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Avatar placeholder */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <User className="h-7 w-7" />
          </div>
          <div>
            <p className="font-semibold text-surface-900">
              {usuario?.nombre ?? 'Usuario'}
            </p>
            <p className="text-sm text-surface-500">{usuario?.email}</p>
          </div>
        </div>

        <Input
          label="Nombre completo"
          placeholder="Tu nombre"
          icon={<User className="h-4 w-4" />}
          error={errors.nombre?.message}
          {...register('nombre', {
            required: 'El nombre es obligatorio',
            minLength: {
              value: 2,
              message: 'El nombre debe tener al menos 2 caracteres',
            },
          })}
        />

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'El correo es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo electrónico inválido',
            },
          })}
        />

        <Input
          label="Teléfono"
          type="tel"
          placeholder="+52 55 1234 5678"
          icon={<Phone className="h-4 w-4" />}
          error={errors.telefono?.message}
          {...register('telefono')}
        />

        <Input
          label="Dirección"
          placeholder="Calle, número, colonia, ciudad"
          icon={<MapPin className="h-4 w-4" />}
          error={errors.direccion?.message}
          {...register('direccion')}
        />

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            loading={saving}
            disabled={!isDirty}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Guardar Cambios
          </Button>
          {!isDirty && (
            <span className="text-xs text-surface-400">
              No hay cambios pendientes
            </span>
          )}
        </div>
      </motion.form>
    </div>
  )
}
