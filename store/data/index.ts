import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useLatest } from 'app/hooks/useLatest'
import { useCallback, useRef } from 'react'

import { AppState, useAppDispatch, useAppSelector } from 'store'

export interface CounterState {
  data: any
  error: any
  loading: boolean
  status: string
}

enum REQUEST_STATUS {
  init = 'init',
  ready = 'ready',
  polling = 'polling',
  single = 'single',
}

const initialState: CounterState = {
  data: undefined,
  error: undefined,
  loading: false,
  status: REQUEST_STATUS.init,
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

export const selectCounter = (state: AppState) => state.counter
export const selectStatus = (state: AppState) => state.counter.status

export default slice.reducer

export const useFetchDataPolling = () => {
  const status = useAppSelector(selectStatus)
  const dispatch = useAppDispatch()
  const abortFnRef = useRef<() => void>()
  const statusRef = useLatest(status)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const run = useCallback(() => {
    const status = statusRef.current
    if (status !== REQUEST_STATUS.ready) return

    dispatch(setStatus(REQUEST_STATUS.polling))
    const fn = () => {
      const promise = dispatch(fetchDataAsync())
      abortFnRef.current = () => promise.abort()
      return promise.then((action: any) => {
        if (action.error?.name === 'AbortError') return
        timerRef.current = setTimeout(() => fn(), 1000)
      })
    }

    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const stop = useCallback(() => {
    const status = statusRef.current
    if (status === REQUEST_STATUS.init) return

    dispatch(setStatus(REQUEST_STATUS.ready))
    if (abortFnRef.current) abortFnRef.current()
    clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return {
    run,
    stop,
  }
}
