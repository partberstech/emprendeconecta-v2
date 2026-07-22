import { Outlet } from 'react-router-dom'
import SidebarMenu from './SidebarMenu'
import Navbar from './Navbar'

export default function LayoutEmprendedor() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <SidebarMenu
          role="emprendedor"
          items={[
            { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
            { label: 'Mi Negocio', path: '/dashboard/negocio', icon: 'Store' },
            { label: 'Productos', path: '/dashboard/productos', icon: 'Package' },
            { label: 'Pedidos', path: '/dashboard/pedidos', icon: 'ClipboardList' },
            { label: 'Mensajes', path: '/dashboard/mensajes', icon: 'MessageSquare' },
            { label: 'Perfil', path: '/dashboard/perfil', icon: 'User' },
          ]}
        />
        <main className="flex-1 p-4 md:p-8 bg-surface-50 dark:bg-surface-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
