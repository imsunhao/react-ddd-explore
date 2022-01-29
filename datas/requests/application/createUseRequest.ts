import { useUnmount } from 'app/hooks/useUnmount'

import { useRequests } from '../domain'
import type { RequestID, RequestCore, RequestOptions } from '../domain/types'

export const createUseRequest = <Props, ReturnValue extends Promise<any>>(
  id: RequestID,
  fn: (p: Props) => ReturnValue,
  options: RequestOptions = {}
) => {
  const useRequestCore = (): RequestCore<Props, ReturnValue> => {
    const { requestStorage, create, destroy } = useRequests()
    useUnmount(() => destroy(id))

    if (requestStorage[id]) {
      return requestStorage[id]
    } else {
      return create(id, fn, options)
    }
  }
  return useRequestCore
}
