import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { postData } from "@/lib/api"; 
import {
  STATUS_IDLE, STATUS_LOADING, STATUS_SUCCEEDED, STATUS_FAILED 
} from "@/constant/status.constants"

const initialState = {
  loading: false,
  status: STATUS_IDLE,
  error: null,
  userInfo: null
}

export const signInRequest = createAsyncThunk('signIn', async (userInfo, { rejectWithValue }) => {
  try {
    const response = await postData('/api/auth/signIn', userInfo)
    return response
  } catch (error) {
    return rejectWithValue({ error: error?.response?.data})
  }
})

export const signInWithGoogleRequest = createAsyncThunk('signInWithGoogle', async (userInfo, { rejectWithValue }) => {
  try {
    const response = await postData('/api/auth/signInWithGoogle', userInfo)
    return response
  } catch (error) {
    return rejectWithValue({ error: error?.response?.data})
  }
})

const handlePending = (state) => {
  state.loading = true
  state.status = STATUS_LOADING
}

const handleFulfilled = (state, action) => {
  state.loading = false
  state.status = STATUS_SUCCEEDED
  state.error = null
  if (action?.payload?.status !== 200) {
    state.error = action.payload
  }
  state.userInfo = action.payload.data
}

const handleRejected = (state, action) => {
  state.loading = false
  state.status = STATUS_FAILED
  state.error = action.payload.error
}

export const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder
      .addCase(signInRequest.pending, handlePending)
      .addCase(signInRequest.fulfilled, handleFulfilled)
      .addCase(signInRequest.rejected, handleRejected)
      .addCase(signInWithGoogleRequest.pending, handlePending)
      .addCase(signInWithGoogleRequest.fulfilled, handleFulfilled)
      .addCase(signInWithGoogleRequest.rejected, handleRejected)
  }
})

export const { signIn } = signInSlice.actions

export default signInSlice.reducer
