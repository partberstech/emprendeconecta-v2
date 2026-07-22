import { Outlet } from 'react-router-dom'
import SidebarMenu from './SidebarMenu'
import Navbar from './Navbar'

export default function LayoutAdmin() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <SidebarMenu
          role="admin"
          items={[
            { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
            { label: 'Usuarios', path: '/admin/usuarios', icon: 'Users' },
            { label: 'Emprendimientos', path: '/admin/emprendimientos', icon: 'Store' },
            { label: 'Categorías', path: '/admin/categorias', icon: 'Tags' },
            { label: 'Cupones', path: '/admin/cupones', icon: 'TicketPercent' },
            { label: 'Reportes', path: '/admin/reportes', icon: 'BarChart3' },
          ]}
        />
        <main className="flex-1 p-4 md:p-8 bg-surface-50 dark:bg-surface-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
