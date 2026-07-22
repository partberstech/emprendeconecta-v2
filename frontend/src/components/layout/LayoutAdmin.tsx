import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarMenu from './SidebarMenu'
import Navbar from './Navbar'

export default function LayoutAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuToggle={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-8 bg-surface-50 dark:bg-surface-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
