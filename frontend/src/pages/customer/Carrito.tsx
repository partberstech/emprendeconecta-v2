import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  ArrowLeft,
  CreditCard,
  Store,
} from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/stores/cart'
import { useAuth } from '@/stores/auth'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'

function SkeletonCartItem() {
  return (
    <div className="flex animate-pulse gap-4 rounded-xl border border-surface-200 bg-white p-4">
      <Skeleton className="h-20 w-20 rounded-xl" />
      <div className="flex flex-1 flex-col justify-between gap-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export default function Carrito() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [checkingOut, setCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para realizar el pedido')
      navigate('/login')
      return
    }

    if (items.length === 0) {
      toast.error('El carrito está vacío')
      return
    }

    setCheckingOut(true)
    try {
      const payload = {
        items: items.map((i) => ({
          idProducto: i.idProducto,
          cantidad: i.cantidad,
        })),
      }
      await api.post('/pedidos', payload)
      clearCart()
      toast.success('¡Pedido realizado con éxito!')
      navigate('/cliente/pedidos')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al procesar el pedido',
      )
    } finally {
      setCheckingOut(false)
    }
  }

  const handleQuantityChange = (productId: number, delta: number) => {
    const item = items.find((i) => i.idProducto === productId)
    if (!item) return
    const newQty = item.cantidad + delta
    if (newQty <= 0) {
      removeItem(productId)
      toast.info('Producto eliminado del carrito')
    } else {
      updateQuantity(productId, newQty)
    }
  }

  const handleRemove = (productId: number, nombre: string) => {
    removeItem(productId)
    toast.success(`${nombre} eliminado del carrito`)
  }

  const total = totalPrice()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          icon={<ShoppingCart className="h-6 w-6" />}
          title="Tu carrito está vacío"
          description="Agrega productos desde el catálogo para empezar tu pedido."
          action={{
            label: 'Ver catálogo',
            onClick: () => navigate('/catalogo'),
          }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Tu Carrito
          </h1>
          <p className="mt-0.5 text-sm text-surface-500">
            {items.length} producto{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/catalogo"
          className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Seguir comprando
        </Link>
      </div>

      {/* Items grouped by emprendimiento */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.idProducto}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
              className="flex gap-4 rounded-xl border border-surface-200 bg-white p-4 shadow-xs transition-all hover:shadow-sm"
            >
              {/* Image */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-100">
                {item.imagenUrl ? (
                  <img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-surface-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <h3 className="truncate font-semibold text-surface-900">
                    {item.nombre}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-surface-500">
                    <Store className="h-3 w-3" />
                    {item.nombreNegocio}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-1 rounded-lg border border-surface-200 bg-surface-50 p-0.5">
                    <button
                      onClick={() => handleQuantityChange(item.idProducto, -1)}
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                        item.cantidad <= 1
                          ? 'text-error hover:bg-error/10'
                          : 'text-surface-600 hover:bg-surface-200',
                      )}
                      aria-label="Reducir cantidad"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="flex h-7 min-w-[2rem] items-center justify-center text-sm font-semibold text-surface-900 tabular-nums">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.idProducto, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-surface-600 transition-colors hover:bg-surface-200"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap text-sm font-bold text-surface-900">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemove(item.idProducto, item.nombre)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 transition-colors hover:bg-error/10 hover:text-error"
                      aria-label={`Eliminar ${item.nombre}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary + Checkout */}
      <div className="mt-8 rounded-xl border border-surface-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-base text-surface-600">Total</span>
          <span className="text-2xl font-bold text-surface-900">
            ${total.toLocaleString()}
          </span>
        </div>
        <p className="mt-1 text-right text-xs text-surface-400">
          Impuestos incluidos
        </p>

        <Button
          className="mt-4 w-full"
          size="lg"
          loading={checkingOut}
          onClick={handleCheckout}
          leftIcon={<CreditCard className="h-4 w-4" />}
        >
          Realizar Pedido
        </Button>
      </div>
    </div>
  )
}
