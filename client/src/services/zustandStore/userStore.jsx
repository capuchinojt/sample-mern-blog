import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const userInfoStore = create(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (res) => set({userInfo: res?.data}),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  )
)