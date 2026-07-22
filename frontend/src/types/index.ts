// ── User & Auth ──
export type Rol = 'ROLE_CLIENTE' | 'ROLE_EMPRENDEDOR' | 'ROLE_ADMIN'

export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: Rol
  telefono?: string
  direccion?: string
  fotoUrl?: string
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegistroRequest {
  nombre: string
  email: string
  password: string
  rol: Rol
  telefono?: string
}

// ── Categories ──
export interface Categoria {
  idCategoria: number
  nombreCategoria: string
  descripcion?: string
}

// ── Products ──
export interface Producto {
  idProducto: number
  nombre: string
  descripcion?: string
  precio: number
  stockDisponible: number
  imagenUrl?: string
  estadoPublicacion: boolean
  categoria: Categoria
  emprendimiento: EmprendimientoResumen
  calificacionPromedio?: number
}

export interface EmprendimientoResumen {
  idEmprendimiento: number
  nombreNegocio: string
}

// ── Cart ──
export interface ItemCarrito {
  idProducto: number
  nombre: string
  precio: number
  imagenUrl?: string
  cantidad: number
  emprendimientoId: number
  nombreNegocio: string
}

// ── Orders ──
export interface Pedido {
  idPedido: number
  fechaCreacion: string
  estado: string
  total: number
  items: DetallePedido[]
}

export interface DetallePedido {
  idDetalle: number
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

// ── Emprendimiento ──
export interface Emprendimiento {
  idEmprendimiento: number
  nombreNegocio: string
  descripcion?: string
  direccion?: string
  latitud?: number
  longitud?: number
  telefono?: string
  estado: string
  categoria: Categoria
  dueno: Usuario
  productos: Producto[]
  calificacionPromedio?: number
}

// ── API Generic ──
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
