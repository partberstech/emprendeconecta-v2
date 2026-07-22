import { Outlet } from 'react-router-dom'
import SidebarMenu from './SidebarMenu'
import Navbar from './Navbar'

export default function LayoutCliente() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <SidebarMenu
          role="cliente"
          items={[
            { label: 'Mi Perfil', path: '/cliente/perfil', icon: 'User' },
            { label: 'Mis Pedidos', path: '/cliente/pedidos', icon: 'Package' },
            { label: 'Carrito', path: '/cliente/carrito', icon: 'ShoppingCart' },
            { label: 'Mensajes', path: '/cliente/mensajes', icon: 'MessageSquare' },
          ]}
        />
        <main className="flex-1 p-4 md:p-8 bg-surface-50 dark:bg-surface-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
