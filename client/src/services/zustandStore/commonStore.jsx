import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { themeTypes } from '@/constant/style.constants'
import { toggleTheme } from "@/utils/theme"

const { LIGHT } = themeTypes

export const commonStore = create(
  persist(
    (set, get) => ({
      theme: LIGHT,
      toggleTheme: () => set({theme: toggleTheme(get().theme)}),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  )
)