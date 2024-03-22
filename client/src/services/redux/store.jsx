import { configureStore } from '@reduxjs/toolkit'

import signUpReducer from '@/services/redux/signUp/signUpSlice'
import signInReducer from '@/services/redux/signIn/signInSlice'

export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    signIn: signInReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})