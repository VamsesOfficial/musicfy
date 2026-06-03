import { create } from 'zustand'
import { User, UserLibrary } from '@/lib/types'

interface UserStore {
  user: User | null
  isAuthenticated: boolean
  library: UserLibrary | null
  setUser: (user: User | null) => void
  setLibrary: (library: UserLibrary | null) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  library: null,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
  }),

  setLibrary: (library) => set({ library }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
    library: null,
  }),
}))
