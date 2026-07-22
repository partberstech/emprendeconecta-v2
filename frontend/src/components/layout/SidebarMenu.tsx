import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  Store,
  User,
  ShoppingCart,
  TicketPercent,
  Tags,
  ClipboardList,
  MessageSquare,
  X,
} from 'lucide-react'
import { useAuth } from '@/stores/auth'
import { cn } from '@/lib/cn'
import type { Rol } from '@/types'

// ── Props ──

interface SidebarMenuProps {
  /** Controls mobile overlay visibility. Omit for static sidebar (always visible). */
  isOpen?: boolean
  /** Callback when mobile overlay or close button is clicked. */
  onClose?: () => void
  /** Optional explicit items — overrides role-based auto-items when provided */
  items?: SidebarExplicitItem[]
  /** Optional role override for the header label (ignored when items not provided) */
  role?: string
}

interface SidebarExplicitItem {
  label: string
  path: string
  icon: string
}

// ── Internal item config ──

interface SidebarInternalItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: Rol[]
}

const internalItems: SidebarInternalItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ROLE_ADMIN', 'ROLE_EMPRENDEDOR'],
  },
  {
    label: 'Productos',
    href: '/dashboard/productos',
    icon: Package,
    roles: ['ROLE_ADMIN', 'ROLE_EMPRENDEDOR'],
  },
  {
    label: 'Pedidos',
    href: '/dashboard/pedidos',
    icon: ShoppingBag,
    roles: ['ROLE_ADMIN', 'ROLE_EMPRENDEDOR'],
  },
  {
    label: 'Mi Emprendimiento',
    href: '/dashboard/emprendimiento',
    icon: Store,
    roles: ['ROLE_EMPRENDEDOR'],
  },
  {
    label: 'Usuarios',
    href: '/dashboard/usuarios',
    icon: Users,
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'Reportes',
    href: '/dashboard/reportes',
    icon: BarChart3,
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
    roles: ['ROLE_ADMIN', 'ROLE_EMPRENDEDOR'],
  },
]

// ── String icon → Lucide component map for explicit items ──

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  Store,
  User,
  ShoppingCart,
  TicketPercent,
  Tags,
  ClipboardList,
  MessageSquare,
}

// ── Component ──

export default function SidebarMenu({ isOpen, onClose, items, role }: SidebarMenuProps) {
  const { usuario } = useAuth()
  const isInteractive = isOpen !== undefined

  // Resolve which items to render
  const renderedItems = items
    ? items.map((item) => ({
        label: item.label,
        href: item.path,
        Icon: iconMap[item.icon] || LayoutDashboard,
      }))
    : (() => {
        const userRole = usuario?.rol
        return internalItems
          .filter((item) => !userRole || item.roles.includes(userRole))
          .map((item) => ({ label: item.label, href: item.href, Icon: item.icon }))
      })()

  const displayRole =
    role || (usuario?.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Emprendedor')

  return (
    <>
      {/* Mobile overlay (interactive mode only) */}
      {isInteractive && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
          )}
        </AnimatePresence>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 shrink-0 h-full',
          // Interactive mode: fixed overlay on mobile, static on desktop
          isInteractive
            ? 'fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out md:relative md:z-auto md:translate-x-0'
            : 'relative',
          isInteractive && (isOpen ? 'translate-x-0' : '-translate-x-full'),
        )}
      >
        {/* Mobile header with close (interactive mode only) */}
        {isInteractive && (
          <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700 md:hidden">
            <span className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              EC
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* User info (auth-driven mode only) */}
        {usuario && !items && (
          <div className="px-4 py-4 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3">
              {usuario.fotoUrl ? (
                <img
                  src={usuario.fotoUrl}
                  alt={usuario.nombre}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold text-sm">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                  {usuario.nombre}
                </p>
                <p className="text-xs text-surface-500 truncate">{displayRole}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {renderedItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/dashboard'}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-r-lg transition-colors border-l-4',
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 border-l-brand-500'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 border-l-transparent',
                )
              }
            >
              <item.Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
