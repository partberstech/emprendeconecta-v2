import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { toast } from 'sonner'
import {
  User,
  Save,
  Mail,
  Phone,
  MapPin,
  Camera,
  Loader2,
  LogOut,
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/stores/auth'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'

// ── Schema ──
const perfilSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().max(20, 'Máximo 20 caracteres').optional(),
  direccion: z.string().max(200, 'Máximo 200 caracteres').optional(),
  fotoUrl: z.string().max(500, 'URL muy larga').optional(),
})

type PerfilFormData = z.infer<typeof perfilSchema>

// ── Main ──
export default function PerfilEmprendedor() {
  const { usuario, logout, loadProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
  })

  useEffect(() => {
    if (usuario) {
      reset({
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono ?? '',
        direccion: usuario.direccion ?? '',
        fotoUrl: usuario.fotoUrl ?? '',
      })
      setLoading(false)
    } else {
      // Load profile if not available
      loadProfile().finally(() => setLoading(false))
    }
  }, [usuario])

  async function onSubmit(data: PerfilFormData) {
    setSaving(true)
    try {
      const updated = await api.put<PerfilFormData>('/auth/perfil', {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || null,
        direccion: data.direccion || null,
        fotoUrl: data.fotoUrl || null,
      })
      await loadProfile()
      reset({
        nombre: (updated as any).nombre || data.nombre,
        email: (updated as any).email || data.email,
        telefono: ((updated as any).telefono || data.telefono) ?? '',
        direccion: ((updated as any).direccion || data.direccion) ?? '',
        fotoUrl: ((updated as any).fotoUrl || data.fotoUrl) ?? '',
      })
      toast.success('Perfil actualizado correctamente')
    } catch {
      toast.error('Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Card>
          <div className="flex flex-col items-center mb-6">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-48" />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Mi Perfil</h1>
        <p className="mt-1 text-sm text-surface-500">
          Administra tu información personal
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {usuario?.fotoUrl ? (
                <img
                  src={usuario.fotoUrl}
                  alt={usuario.nombre}
                  className="h-24 w-24 rounded-full object-cover border-4 border-brand-100"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white text-3xl font-bold border-4 border-brand-100">
                  {usuario?.nombre?.charAt(0).toUpperCase() ?? '?'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-surface-200 text-surface-500 shadow-sm">
                <Camera className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-sm font-medium text-surface-900">
              {usuario?.nombre}
            </p>
            <p className="text-xs text-surface-500">{usuario?.email}</p>
          </div>

          <div className="space-y-5">
            {/* Name */}
            <Input
              label="Nombre Completo"
              placeholder="Tu nombre"
              error={errors.nombre?.message}
              icon={<User className="h-4 w-4" />}
              {...register('nombre')}
            />

            {/* Email */}
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              error={errors.email?.message}
              icon={<Mail className="h-4 w-4" />}
              {...register('email')}
            />

            {/* Phone */}
            <Input
              label="Teléfono"
              placeholder="+57 300 123 4567"
              error={errors.telefono?.message}
              icon={<Phone className="h-4 w-4" />}
              {...register('telefono')}
            />

            {/* Address */}
            <Input
              label="Dirección"
              placeholder="Cra 45 #23-12, Medellín"
              error={errors.direccion?.message}
              icon={<MapPin className="h-4 w-4" />}
              {...register('direccion')}
            />

            {/* Photo URL */}
            <Input
              label="URL de Foto de Perfil"
              placeholder="https://ejemplo.com/foto.jpg"
              error={errors.fotoUrl?.message}
              icon={<Camera className="h-4 w-4" />}
              {...register('fotoUrl')}
            />
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-surface-100 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={logout}
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Cerrar Sesión
            </Button>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => usuario && reset({
                  nombre: usuario.nombre,
                  email: usuario.email,
                  telefono: usuario.telefono ?? '',
                  direccion: usuario.direccion ?? '',
                  fotoUrl: usuario.fotoUrl ?? '',
                })}
                disabled={!isDirty || saving}
              >
                Restablecer
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
          </div>
        </Card>
      </form>
    </div>
  )
}
