import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { postData } from "../../lib/api"

const initialState = {
}

export const addNewUser = createAsyncThunk('signUp/addNewUser', async (userInfo) => {
  console.table('signUp/addNewUser', userInfo)
  const response = await postData('/api/auth/signup', userInfo)
  return response
})

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder.addCase(addNewUser.fulfilled, (state, action) => {
      state.signUp.push(action.payload)
    })
  }
})

export const { signUp } = signUpSlice.actions

export default signUpSlice.reducer
