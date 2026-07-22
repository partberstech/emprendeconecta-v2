import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { cn } from '@/lib/cn'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Correo electrónico inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setErrorGlobal(null)
    try {
      await login(data.email, data.password)
      // Read user from store after successful login
      const { usuario } = useAuth.getState()
      const rol = usuario?.rol?.toLowerCase()
      if (rol === 'emprendedor') navigate('/dashboard')
      else if (rol === 'administrador') navigate('/admin')
      else navigate('/')
    } catch (err) {
      setErrorGlobal(err instanceof Error ? err.message : 'Error al iniciar sesión')
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
          {/* Logo / Title */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Emprende<span className="text-brand-500">Conecta</span>
            </h1>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              Inicia sesión para continuar
            </p>
          </div>

          {/* Global error */}
          {errorGlobal && (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {errorGlobal}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-200">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
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
                <LogIn className="h-4 w-4" />
              )}
              {isLoading ? 'Iniciando sesión…' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-surface-500 dark:text-surface-400">
            ¿No tienes cuenta?{' '}
            <Link
              to="/registro"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
