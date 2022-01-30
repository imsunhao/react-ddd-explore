import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState } from 'store'

export interface CounterState {
  data: any
  loading: boolean
}

const initialState: CounterState = {
  data: undefined,
  loading: false,
}

export const slice = createSlice({
  name: 'counter',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setState: (state, action: PayloadAction<CounterState>) => {
      const { data, loading } = action.payload
      state.data = data
      state.loading = loading
    },
  },
})

export const { setState } = slice.actions

export const selectCounter = (state: AppState) => state.counter

export default slice.reducer
