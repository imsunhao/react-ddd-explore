import { createUseRequest } from 'datas/requests/application/createUseRequest'
import { useRequestGetters } from 'datas/requests/application/getters'
import { RequestKey } from 'datas/requests/domain/constants'
import { useEffect, useMemo } from 'react'
import { createPromise } from 'utils/promise'

const fetchData = (props: {}) => {
  const { promise, reslove } = createPromise<boolean>()

  setTimeout(() => {
    reslove(!!Math.round(Math.random()))
  }, 3000)

  return promise
}

const useDataRequest = createUseRequest(RequestKey.dataPool, fetchData, {
  useCache: true,
})

export const useDataPoolController = () => {
  const { createPolling, createRequest, data, loading, polling } = useDataRequest()
  const query = useMemo(() => ({}), [])

  useEffect(() => {
    const { run, stop } = createPolling(query)
    run(5 * 1000)
    return () => {
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, createPolling])

  const { run, stop } = createRequest(query)

  return {
    data,
    loading,
    polling,
    run,
    stop,
  }
}

export type UseDataPoolController = ReturnType<typeof useDataPoolController>

export const useDataPool = () => {
  const { data } = useRequestGetters(RequestKey.dataPool)
  return data
}
