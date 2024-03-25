import { createSlice } from "@reduxjs/toolkit"
import { themeTypes } from '@/constant/style.constants'

const { DARK, LIGHT } = themeTypes
const initialState = {
  theme: LIGHT
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === LIGHT ? DARK : LIGHT
    }
  }
})

export const {toggleTheme} = themeSlice.actions

export default themeSlice.reducer
