import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ItemCarrito } from '@/types'
import { api } from '@/lib/api'

interface CartState {
  items: ItemCarrito[]
  addItem: (item: ItemCarrito) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
  // Future: sync with backend
  syncWithBackend: () => Promise<void>
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existing = items.find((i) => i.idProducto === item.idProducto)
        if (existing) {
          set({
            items: items.map((i) =>
              i.idProducto === item.idProducto
                ? { ...i, cantidad: i.cantidad + item.cantidad }
                : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.idProducto !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.idProducto === productId ? { ...i, cantidad: quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),

      totalPrice: () =>
        get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),

      syncWithBackend: async () => {
        try {
          // Future: POST /api/v1/carrito/sync
        } catch {
          // Silent fail for now
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
