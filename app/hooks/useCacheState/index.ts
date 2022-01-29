import { useImmer } from 'use-immer'
import { useCallback, useEffect } from 'react'
import { getItem, setItem } from './cache'

export const useCacheState = <T>(key: string): [T, (data: T) => void] => {
  const [cacheData, setData] = useImmer<T>(undefined)
  useEffect(() => {
    if (__SERVER__) return
    getItem(key).then((data) => data && setData(data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setCacheData = useCallback(
    (data: T) => {
      setItem(key, data)
    },
    [key]
  )
  return [cacheData, setCacheData]
}
