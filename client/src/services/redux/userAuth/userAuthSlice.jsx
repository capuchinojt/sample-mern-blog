import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userInfo: null
}

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload.data
    }
  }
})

export const { setUserInfo } = userAuthSlice.actions

export default userAuthSlice.reducer
