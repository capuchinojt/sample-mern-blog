import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { themeTypes } from '@/constant/style.constants'

const { DARK, LIGHT } = themeTypes

export const commonStore = create(
  persist(
    (set, get) => ({
      theme: LIGHT,
      toggleTheme: () => set({theme: get().theme === LIGHT ? DARK : LIGHT}),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  )
)