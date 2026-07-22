import { create } from 'zustand'

interface UIState {
  isDark: boolean
  toggleDark: () => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useUI = create<UIState>()((set) => ({
  isDark: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  toggleDark: () =>
    set((state) => {
      const next = !state.isDark
      document.documentElement.classList.toggle('dark', next)
      return { isDark: next }
    }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
