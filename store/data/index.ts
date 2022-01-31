import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { AppState } from 'store'
import { createPromise } from 'utils/promise'

export interface CounterState {
  data: any
  error: any
  loading: boolean
}

const initialState: CounterState = {
  data: undefined,
  error: undefined,
  loading: false,
}

export const slice = createSlice({
  name: 'counter',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataAsync.pending, (state, action) => {
        console.log('on fetchData pending', action.meta.requestId)
        state.loading = true
      })
      .addCase(fetchDataAsync.fulfilled, (state, action) => {
        console.log('on fetchData fulfilled', action.meta.requestId)
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDataAsync.rejected, (state, action) => {
        console.log('on fetchData rejected', action)
        state.loading = false
        state.error = action.payload || action.error
      })
  },
})

// export const { setState } = slice.actions
export const fetchDataAsync = createAsyncThunk('counter/fetchData', (args, { rejectWithValue }) => {
  const id = Date.now()
  console.log('fetchData [req]', id)
  const { promise, reslove, reject } = createPromise<number>()

  setTimeout(() => {
    const data = Math.round(Math.random())
    if (!data) return reject(rejectWithValue(data || { data: 'test - error' }))
    reslove(data)
    console.log('fetchData [res]', id, data)
  }, 1000)

  return promise
})

export const selectCounter = (state: AppState) => state.counter

export default slice.reducer
