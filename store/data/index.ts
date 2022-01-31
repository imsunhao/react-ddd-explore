import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { AppState } from 'store'
import { fetchData } from 'utils/promise'

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
      .addCase(fetchDataAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDataAsync.fulfilled, (state, action) => {
        console.log('on fetchData', action)
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDataAsync.rejected, (state, action) => {
        console.log('on fetchData', action)
        state.loading = false
        state.error = action.error
      })
  },
})

// export const { setState } = slice.actions
export const fetchDataAsync = createAsyncThunk('counter/fetchData', () => fetchData({}))

export const selectCounter = (state: AppState) => state.counter

export default slice.reducer
