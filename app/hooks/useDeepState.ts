import { useMemo, useRef } from 'react'
import { isEqual } from 'lodash'

export const useDeepState = <T>(obj: T): T => {
  const lastObjRef = useRef<T>()
  return useMemo(() => {
    const lastObj = lastObjRef.current
    if (isEqual(lastObj, obj)) return lastObj
    lastObjRef.current = obj
    return obj
  }, [obj])
}
