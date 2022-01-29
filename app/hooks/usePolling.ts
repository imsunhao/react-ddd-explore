import { useState, useCallback, useEffect } from 'react'
import { useLatest } from 'app/hooks/useLatest'
import { useObjectMemo } from 'app/hooks/useValues'

export const usePolling = (
  fn: () => {
    fetch: () => Promise<any>
    cancel: () => void
  },
  ms?: number
) => {
  const fnRef = useLatest(fn)
  const [count, setCount] = useState(0)
  const [time, setTime] = useState(0)
  const next = useCallback(() => time && setCount((count) => (count > 1000 ? 0 : count + 1)), [time])
  const start = useCallback((ms: number) => !time && setTime(ms), [time])
  const stop = useCallback(() => time && setTime(0), [time])

  useEffect(() => {
    if (!time) return
    const fn = fnRef.current
    const { fetch, cancel } = fn()
    let timer: any
    let isCanceled = false
    fetch().finally(() => {
      if (isCanceled) return
      timer = setTimeout(next, time)
    })

    return () => {
      isCanceled = true
      clearTimeout(timer)
      cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, count])

  useEffect(() => {
    if (__SERVER__) return
    if (ms) start(ms)
    return () => {
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnValue = useObjectMemo({ stop, start, next })

  return returnValue
}
