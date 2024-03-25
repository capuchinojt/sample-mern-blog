import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { postData } from "@/lib/api"; 
import {
  STATUS_IDLE, STATUS_LOADING, STATUS_SUCCEEDED, STATUS_FAILED
} from "@/constant/status.constants"

const initialState = {
  loading: false,
  status: STATUS_IDLE,
  error: null
}

export const addNewUser = createAsyncThunk('signUp/addNewUser', async (userInfo) => {
  const response = await postData('/api/auth/signup', userInfo)
  console.table('signUp/addNewUser', userInfo, response)
  return response
})

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(addNewUser.pending, (state) => {
      state.loading = true
      state.status = STATUS_LOADING
    }).addCase(addNewUser.fulfilled, (state, action) => {
      state.loading = false
      state.status = STATUS_SUCCEEDED
      state.error = null
      if (action?.payload?.error) {
        state.error = action.payload.error
      }
    }).addCase(addNewUser.rejected, (state, action) => {
      state.loading = false
      state.status = STATUS_FAILED
      state.error = action.error
    })
  }
})

export const { signUp } = signUpSlice.actions

export default signUpSlice.reducer
