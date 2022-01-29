import { isEqual } from 'lodash'
import { FAIL_REQUEST } from '../domain'
import { getItem, setItem } from '../domain/cache'
import type { CreatePolling, CreateRequest, CreateRequestProps, RequestCore, RequestCoreUpdates } from '../domain/types'

const getUpdateMethod =
  <K extends keyof RequestCore, T extends RequestCore[K]>(key: K, { setRequestStorage, id }: CreateRequestProps) =>
  (value: T) =>
    setRequestStorage((requestStorage) => {
      if (requestStorage[id]) {
        requestStorage[id][key] = value
      }
    })

const getCreateRequestMethod =
  ({ id, fn, requestsRef, options }: CreateRequestProps, { setLoading, setData }: RequestCoreUpdates): CreateRequest =>
  (query) => {
    if (__SERVER__) return FAIL_REQUEST

    const stop = () => {
      setLoading(false)
      return true
    }
    const run = () => {
      if (requestsRef.current[id]?.loading) return Promise.reject()
      setLoading(true)
      console.log(fn.name, '[req]', query)
      return fn(query)
        .then((data: any) => {
          if (!requestsRef.current[id].loading) return Promise.reject()
          if (isEqual(data, requestsRef.current[id].data)) return
          if (options.useCache) setItem(id, data)
          console.log(fn.name, '[res]', { data, oldData: requestsRef.current[id].data })
          setData(data)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    return {
      run,
      stop,
    }
  }

const getCreatePollingMethod =
  (
    { id, requestsRef }: CreateRequestProps,
    { setPolling }: RequestCoreUpdates,
    createRequest: CreateRequest
  ): CreatePolling =>
  (query: any) => {
    if (__SERVER__ || requestsRef.current[id]?.polling) return FAIL_REQUEST
    const request = createRequest(query)
    const run = (timeout: number) => {
      request.run().finally(() => {
        const timer = setTimeout(() => run(timeout), timeout)
        setPolling(timer)
      })
    }
    const stop = () => {
      if (!requestsRef.current[id]) return false
      clearTimeout(requestsRef.current[id].polling)
      setPolling(undefined)
      request.stop()
      return true
    }
    return {
      run,
      stop,
    }
  }

export const createRequest = (props: CreateRequestProps) => {
  const { id, options, requestsRef, setRequestStorage } = props
  const setLoading = getUpdateMethod('loading', props)
  const setData = getUpdateMethod('data', props)
  const setPolling = getUpdateMethod('polling', props)
  const requestCoreUpdates = {
    setLoading,
    setData,
    setPolling,
  }
  const createRequest = getCreateRequestMethod(props, requestCoreUpdates)
  const requestCore: RequestCore = {
    ...requestCoreUpdates,
    id,
    loading: false,
    data: undefined,
    polling: undefined,
    createRequest,
    createPolling: getCreatePollingMethod(props, requestCoreUpdates, createRequest),
  }
  setRequestStorage((requestStorage) => {
    requestStorage[id] = requestCore
    return requestStorage
  })

  if (options.useCache && !__SERVER__) {
    getItem(id).then((data) => {
      if (!requestsRef.current[id] || requestsRef.current[id].data) return
      requestCore.setData(data)
    })
  }

  return requestCore
}
