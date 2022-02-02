import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useLatest } from 'app/hooks/useLatest'
import { useObjectMemo } from 'app/hooks/useValues'
import { useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'store'

export interface RequestSliceState<DATA = any, ERROR = any> {
  data: DATA
  error: ERROR
  loading: boolean
  status: REQUEST_STATUS
}

export enum REQUEST_STATUS {
  ready = 'ready',
  polling = 'polling',
  single = 'single',
}

const createRequestSlice = <SliceState extends RequestSliceState, Returned, ThunkArg>(
  name: string,
  createInitialState: () => SliceState,
  fetchDataAsync: AsyncThunk<Returned, ThunkArg, {}>
) => {
  const {
    actions: { setStatus },
    reducer,
  } = createSlice({
    name,
    initialState: createInitialState(),
    reducers: {
      setStatus(state, action: PayloadAction<REQUEST_STATUS>) {
        state.status = action.payload
      },
      // setData(state, action: PayloadAction<SliceState['data']>) {
      //   state.data = action.payload
      // },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchDataAsync.pending, (state) => {
          state.loading = true
        })
        .addCase(fetchDataAsync.fulfilled, (state, action) => {
          state.loading = false
          state.data = action.payload
          state.error = undefined
        })
        .addCase(fetchDataAsync.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload || action.error
        })
    },
  })

  const select = (state: any): RequestSliceState => state[name]
  const selectStatus = (state: any): REQUEST_STATUS => state[name].status

  const usePolling = () => {
    const status = useSelector(selectStatus)
    const dispatch = useAppDispatch()
    const abortFnRef = useRef<() => void>()
    const statusRef = useLatest(status)
    const timerRef = useRef<ReturnType<typeof setTimeout>>()
    const run = useCallback(
      (props: ThunkArg) => {
        const status = statusRef.current
        if (status !== REQUEST_STATUS.ready) return

        dispatch(setStatus(REQUEST_STATUS.polling))
        const fn = () => {
          const promise = dispatch(fetchDataAsync(props))
          abortFnRef.current = () => promise.abort()
          return promise.then((action: any) => {
            if (action.error?.name === 'AbortError') return
            timerRef.current = setTimeout(() => fn(), 1000)
          })
        }

        fn()
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [dispatch]
    )

    const stop = useCallback(() => {
      const status = statusRef.current
      if (status !== REQUEST_STATUS.polling) return

      dispatch(setStatus(REQUEST_STATUS.ready))
      if (abortFnRef.current) abortFnRef.current()
      clearTimeout(timerRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const restart = useCallback((props: ThunkArg) => {
      const status = statusRef.current
      if (status !== REQUEST_STATUS.polling) return
      stop()
      run(props)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const returnValue = useObjectMemo({
      run,
      stop,
      restart,
    })

    // useWhyDidYouUpdate('usePolling', returnValue)
    return returnValue
  }

  const useSingle = () => {
    const status = useSelector(selectStatus)
    const dispatch = useAppDispatch()
    const abortFnRef = useRef<() => void>()
    const statusRef = useLatest(status)

    const run = useCallback(
      (props: ThunkArg) => {
        const status = statusRef.current
        if (status !== REQUEST_STATUS.ready) return Promise.reject({ name: 'RunningError', message: 'Running' })
        dispatch(setStatus(REQUEST_STATUS.single))
        const promise = dispatch(fetchDataAsync(props))
        abortFnRef.current = () => promise.abort()
        return promise
          .then((action: any) => {
            if (action.error) return Promise.reject(action)
            return action.data
          })
          .finally(() => {
            dispatch(setStatus(REQUEST_STATUS.ready))
          })
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [dispatch]
    )

    const stop = useCallback(() => {
      const status = statusRef.current
      if (status !== REQUEST_STATUS.single) return

      dispatch(setStatus(REQUEST_STATUS.ready))
      if (abortFnRef.current) abortFnRef.current()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const returnValue = useObjectMemo({
      run,
      stop,
    })

    // useWhyDidYouUpdate('useSingle', returnValue)
    return returnValue
  }

  const useRequestController = () => {
    const polling = usePolling()
    const single = useSingle()
    const returnValue = useObjectMemo({
      polling,
      single,
    })
    // useWhyDidYouUpdate('useRequestController', returnValue)
    return returnValue
  }

  return {
    reducer,
    select,
    useRequestController,
  }
}

const fetchDataAsync = createAsyncThunk('test/fetch', (args: { a: number }, { rejectWithValue, requestId, signal }) => {
  console.log('fetchData [req]', requestId, args)
  return fetch(`/api/data?requestId=${requestId}`, {
    signal,
  }).then((d) =>
    d.json().then((data) => {
      if (d.status === 200) return Promise.resolve(data)
      return Promise.reject(rejectWithValue(data))
    })
  )
})

export const { reducer, select, useRequestController } = createRequestSlice(
  'test',
  () => ({
    data: undefined,
    error: undefined,
    loading: false,
    status: REQUEST_STATUS.ready,
  }),
  fetchDataAsync
)

export default reducer
