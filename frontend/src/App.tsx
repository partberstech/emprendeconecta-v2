import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { useAuth } from '@/stores/auth'
import { useUI } from '@/stores/ui'

import LayoutPublic from '@/components/layout/LayoutPublic'
import LayoutCliente from '@/components/layout/LayoutCliente'
import LayoutEmprendedor from '@/components/layout/LayoutEmprendedor'
import LayoutAdmin from '@/components/layout/LayoutAdmin'

import Home from '@/pages/public/Home'
import Login from '@/pages/public/Login'
import Registro from '@/pages/public/Registro'
import Catalogo from '@/pages/public/Catalogo'
import EmprendimientoDetail from '@/pages/public/EmprendimientoDetail'

import Carrito from '@/pages/customer/Carrito'
import Pedidos from '@/pages/customer/Pedidos'
import PerfilCliente from '@/pages/customer/Perfil'
import MensajesCliente from '@/pages/customer/Mensajes'

import DashboardEmprendedor from '@/pages/entrepreneur/Dashboard'
import Negocio from '@/pages/entrepreneur/Negocio'
import ProductosEmprendedor from '@/pages/entrepreneur/Productos'
import PedidosEmprendedor from '@/pages/entrepreneur/Pedidos'
import MensajesEmprendedor from '@/pages/entrepreneur/Mensajes'
import PerfilEmprendedor from '@/pages/entrepreneur/Perfil'

import DashboardAdmin from '@/pages/admin/Dashboard'
import UsuariosAdmin from '@/pages/admin/Usuarios'
import EmprendimientosAdmin from '@/pages/admin/Emprendimientos'
import CategoriasAdmin from '@/pages/admin/Categorias'
import CuponesAdmin from '@/pages/admin/Cupones'
import ReportesAdmin from '@/pages/admin/Reportes'

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, usuario } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && usuario && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

export default function App() {
  const { loadProfile, token } = useAuth()
  const { isDark } = useUI()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    if (token) loadProfile()
  }, [])

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          {/* ── Public ── */}
          <Route element={<LayoutPublic />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/emprendimiento/:id" element={<EmprendimientoDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Route>

          {/* ── Cliente ── */}
          <Route
            element={
              <ProtectedRoute roles={['ROLE_CLIENTE']}>
                <LayoutCliente />
              </ProtectedRoute>
            }
          >
            <Route path="/cliente/carrito" element={<Carrito />} />
            <Route path="/cliente/pedidos" element={<Pedidos />} />
            <Route path="/cliente/perfil" element={<PerfilCliente />} />
            <Route path="/cliente/mensajes" element={<MensajesCliente />} />
          </Route>

          {/* ── Emprendedor ── */}
          <Route
            element={
              <ProtectedRoute roles={['ROLE_EMPRENDEDOR']}>
                <LayoutEmprendedor />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardEmprendedor />} />
            <Route path="/dashboard/negocio" element={<Negocio />} />
            <Route path="/dashboard/productos" element={<ProductosEmprendedor />} />
            <Route path="/dashboard/pedidos" element={<PedidosEmprendedor />} />
            <Route path="/dashboard/mensajes" element={<MensajesEmprendedor />} />
            <Route path="/dashboard/perfil" element={<PerfilEmprendedor />} />
          </Route>

          {/* ── Admin ── */}
          <Route
            element={
              <ProtectedRoute roles={['ROLE_ADMIN']}>
                <LayoutAdmin />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
            <Route path="/admin/emprendimientos" element={<EmprendimientosAdmin />} />
            <Route path="/admin/categorias" element={<CategoriasAdmin />} />
            <Route path="/admin/cupones" element={<CuponesAdmin />} />
            <Route path="/admin/reportes" element={<ReportesAdmin />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}
