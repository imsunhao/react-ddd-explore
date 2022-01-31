import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useCallback, useRef } from 'react'

import { AppState, useAppDispatch } from 'store'

export interface CounterState {
  data: any
  error: any
  loading: boolean
  status: string
}

const initialState: CounterState = {
  data: undefined,
  error: undefined,
  loading: false,
  status: 'init',
}

export const slice = createSlice({
  name: 'counter',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataAsync.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchDataAsync.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDataAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error
      })
  },
})

export const { setStatus } = slice.actions
export const fetchDataAsync = createAsyncThunk('counter/fetchData', (args, { rejectWithValue, requestId, signal }) => {
  console.log('fetchData [req]', requestId)
  return fetch(`/api/data?requestId=${requestId}`, {
    signal,
  }).then((d) =>
    d.json().then((data) => {
      if (d.status === 200) return Promise.resolve(data)
      return Promise.reject(rejectWithValue(data))
    })
  )
})

export const useFetchDataPolling = () => {
  const dispatch = useAppDispatch()
  const abortFnRef = useRef<() => void>()
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const run = useCallback(() => {
    dispatch(setStatus('polling'))
    const fn = () => {
      const promise = dispatch(fetchDataAsync())
      abortFnRef.current = () => promise.abort()
      return promise.then((action: any) => {
        if (action.error?.name === 'AbortError') return
        timerRef.current = setTimeout(() => fn(), 1000)
      })
    }

    fn()
  }, [dispatch])

  const stop = useCallback(() => {
    dispatch(setStatus('ready'))
    if (abortFnRef.current) abortFnRef.current()
    clearTimeout(timerRef.current)
  }, [dispatch])

  return {
    run,
    stop,
  }
}

export const selectCounter = (state: AppState) => state.counter

export default slice.reducer
