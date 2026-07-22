import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Usuario } from '@/types'
import { api } from '@/lib/api'

interface AuthState {
  usuario: Usuario | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { nombre: string; email: string; password: string; rol: string }) => Promise<void>
  logout: () => void
  loadProfile: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await api.post<{ token: string; usuario: Usuario }>('/auth/login', { email, password })
          localStorage.setItem('token', res.token)
          set({ usuario: res.usuario, token: res.token, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          const res = await api.post<{ token: string; usuario: Usuario }>('/auth/registro', data)
          localStorage.setItem('token', res.token)
          set({ usuario: res.usuario, token: res.token, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ usuario: null, token: null, isAuthenticated: false })
      },

      loadProfile: async () => {
        try {
          const usuario = await api.get<Usuario>('/auth/perfil')
          set({ usuario, isAuthenticated: true })
        } catch {
          set({ usuario: null, token: null, isAuthenticated: false })
          localStorage.removeItem('token')
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, usuario: state.usuario, isAuthenticated: state.isAuthenticated }),
    }
  )
)
