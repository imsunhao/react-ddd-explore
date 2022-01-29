import { useMemo } from 'react'

import { useRequests } from 'datas/requests/domain'
import type { RequestGetters } from '../domain/types'

export const useRequestGetters: RequestGetters = (key, getRequesetId = (key) => key) => {
  const requests = useRequests()
  const id = getRequesetId(key)
  const requestStorage: any = useMemo(() => requests.get(id), [requests, id])
  return requestStorage
}
