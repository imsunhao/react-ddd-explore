import { useLatest } from 'app/hooks/useLatest'
import { useCallback } from 'react'
import { useImmer } from 'use-immer'
import { createContext } from 'utils/createContext'
import { createRequest } from '../application/createRequest'
import type { RequestFn, RequestID, RequestOptions, RequestStorage } from './types'

export const FAIL_REQUEST = {
  run: () => Promise.reject(),
  stop: () => false,
}

const useRequestsService = () => {
  const [requestStorage, setRequestStorage] = useImmer<RequestStorage>({})

  const requestsRef = useLatest(requestStorage)

  const create = useCallback(
    (id: RequestID, fn: RequestFn, options: RequestOptions = {}) =>
      createRequest({
        id,
        fn,
        options,
        requestsRef,
        setRequestStorage,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const destroy = useCallback(
    (id: RequestID) => {
      if (!requestStorage[id]) return
      setRequestStorage((requestStorage) => {
        delete requestStorage[id]
        return requestStorage
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requestStorage]
  )

  const get = useCallback((id: RequestID) => requestStorage[id] || ({} as undefined), [requestStorage])

  return {
    requestStorage,
    create,
    destroy,
    get,
  }
}
const { Provider: RequestsProvider, createUseContext } = createContext(useRequestsService)
export const useRequests = createUseContext()

export default RequestsProvider
