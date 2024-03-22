import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { postData } from "@/lib/api"; 
import {
  STATUS_IDLE, STATUS_LOADING, STATUS_SUCCEEDED, STATUS_FAILED 
} from "@/services/constant/status.constants"

const initialState = {
  loading: false,
  status: STATUS_IDLE,
  error: null,
  userInfo: {}
}

export const signInRequest = createAsyncThunk('signIn', async (userInfo, { rejectWithValue }) => {
  try {
    const response = await postData('/api/auth/signIn', userInfo)
    console.table('signInRequest - success', userInfo, response)
    return response
  } catch (error) {
    console.table('signInRequest - error', error?.response?.data)
    return rejectWithValue({ error: error?.response?.data})
  }
})

export const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(signInRequest.pending, (state) => {
      state.loading = true
      state.status = STATUS_LOADING
    }).addCase(signInRequest.fulfilled, (state, action) => {
      console.log('signInRequest.fulfilled - state: ', state)
      console.log('signInRequest.fulfilled - action: ', action)
      state.loading = false
      state.status = STATUS_SUCCEEDED
      state.error = null
      if (action?.payload?.status !== 200) {
        state.error = action.payload
      }
      state.userInfo = action.payload.data
    }).addCase(signInRequest.rejected, (state, action) => {
      console.log('signInRequest.rejected - state: ', state)
      console.log('signInRequest.rejected - action: ', action)
      state.loading = false
      state.status = STATUS_FAILED
      state.error = action.payload.error
    })
  }
})

export const { signIn } = signInSlice.actions

export default signInSlice.reducer
