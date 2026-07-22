import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { cn } from '@/lib/cn'
import type { Rol } from '@/types'

const registroSchema = z
  .object({
    nombre: z
      .string()
      .min(1, 'El nombre es obligatorio')
      .max(100, 'Máximo 100 caracteres'),
    email: z
      .string()
      .min(1, 'El correo es obligatorio')
      .email('Correo electrónico inválido'),
    password: z
      .string()
      .min(6, 'Mínimo 6 caracteres')
      .max(50, 'Máximo 50 caracteres'),
    confirmarPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),
    telefono: z
      .string()
      .max(20, 'Máximo 20 caracteres')
      .optional()
      .or(z.literal('')),
    rol: z.enum(['ROLE_CLIENTE', 'ROLE_EMPRENDEDOR']),
  })
  .refine(data => data.password === data.confirmarPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarPassword'],
  })

type RegistroFormData = z.infer<typeof registroSchema>

export default function Registro() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      rol: 'ROLE_CLIENTE',
      telefono: '',
    },
  })

  const onSubmit = async (data: RegistroFormData) => {
    setErrorGlobal(null)
    try {
      await registerUser({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rol: data.rol,
        telefono: data.telefono || undefined,
      })
      navigate('/')
    } catch (err) {
      setErrorGlobal(err instanceof Error ? err.message : 'Error al registrarse')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 shadow-xl ring-1 ring-surface-200 dark:ring-surface-700 sm:p-10">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Emprende<span className="text-brand-500">Conecta</span>
            </h1>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              Crea tu cuenta gratis
            </p>
          </div>

          {/* Global error */}
          {errorGlobal && (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {errorGlobal}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-200">
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                {...register('nombre')}
                className={cn(
                  'w-full rounded-xl border bg-white px-4 py-3 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:outline-none focus:ring-2 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500',
                  errors.nombre
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20'
                    : 'border-surface-200 focus:border-brand-400 focus:ring-brand-500/20 dark:border-surface-700',
                )}
              />
              {errors.nombre && (
                <p className="mt-1.5 text-xs text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-200">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@correo.cl"
                {...register('email')}
                className={cn(
                  'w-full rounded-xl border bg-white px-4 py-3 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:outline-none focus:ring-2 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500',
                  errors.email
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20'
                    : 'border-surface-200 focus:border-brand-400 focus:ring-brand-500/20 dark:border-surface-700',
                )}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-200">
                Teléfono <span className="text-surface-400">(opcional)</span>
              </label>
              <input
                id="telefono"
                type="tel"
                placeholder="+56 9 1234 5678"
                {...register('telefono')}
                className={cn(
                  'w-full rounded-xl border bg-white px-4 py-3 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:outline-none focus:ring-2 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500',
                  errors.telefono
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20'
                    : 'border-surface-200 focus:border-brand-400 focus:ring-brand-500/20 dark:border-surface-700',
                )}
              />
              {errors.telefono && (
                <p className="mt-1.5 text-xs text-red-500">{errors.telefono.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-200">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  {...register('password')}
                  className={cn(
                    'w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:outline-none focus:ring-2 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500',
                    errors.password
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20'
                      : 'border-surface-200 focus:border-brand-400 focus:ring-brand-500/20 dark:border-surface-700',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmarPassword" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-200">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmarPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repite la contraseña"
                  {...register('confirmarPassword')}
                  className={cn(
                    'w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:outline-none focus:ring-2 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-500',
                    errors.confirmarPassword
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20'
                      : 'border-surface-200 focus:border-brand-400 focus:ring-brand-500/20 dark:border-surface-700',
                  )}
                />
              </div>
              {errors.confirmarPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.confirmarPassword.message}</p>
              )}
            </div>

            {/* Role selector */}
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-surface-700 dark:text-surface-200">
                Tipo de cuenta
              </legend>
              <div className="flex gap-3">
                {[
                  { value: 'ROLE_CLIENTE' as const, label: 'Cliente', desc: 'Quiero comprar' },
                  { value: 'ROLE_EMPRENDEDOR' as const, label: 'Emprendedor', desc: 'Quiero vender' },
                ].map(option => (
                  <label
                    key={option.value}
                    className={cn(
                      'flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl border-2 px-4 py-3 text-center transition-all',
                      // We handle checked state via the form, but can't easily get current value here
                      // So we rely on the hidden radio + styling with peer
                    )}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="peer sr-only"
                      {...register('rol')}
                    />
                    <span className="text-sm font-semibold text-surface-900 peer-checked:text-brand-600 dark:text-white dark:peer-checked:text-brand-400">
                      {option.label}
                    </span>
                    <span className="text-xs text-surface-500 peer-checked:text-brand-500 dark:peer-checked:text-brand-400">
                      {option.desc}
                    </span>
                    <div
                      className={cn(
                        'mt-1 h-2 w-2 rounded-full border-2 border-surface-300 transition-colors peer-checked:border-brand-500 peer-checked:bg-brand-500 dark:border-surface-600 dark:peer-checked:border-brand-400 dark:peer-checked:bg-brand-400',
                      )}
                    />
                  </label>
                ))}
              </div>
              {errors.rol && (
                <p className="mt-1.5 text-xs text-red-500">{errors.rol.message}</p>
              )}
            </fieldset>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isLoading ? 'Creando cuenta…' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-surface-500 dark:text-surface-400">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
