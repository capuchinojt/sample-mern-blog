import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import userAuthReducer from '@/services/redux/userAuth/userAuthSlice'
import themeReducer from '@/services/redux/theme/themeSlice'
import persistStore from 'redux-persist/es/persistStore'

const persistConfig = {
  key: 'root',
  storage,
  version: 1
}

const rootReducer = combineReducers({
  userAuth: userAuthReducer,
  theme: themeReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})

export const persistor = persistStore(store)
