import { create } from 'zustand'
import { THEMES } from '../constants'

interface ThemeState {
  theme: string
  setTheme: (theme: string) => any
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: localStorage.getItem('theme') || THEMES.COFFEE,
  setTheme(theme) {
    localStorage.setItem('theme', theme)
    set({ theme })
  },
}))
