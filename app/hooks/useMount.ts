/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'

/**
 * Only in client side
 */
export const useMount = (mount: () => void) => {
  useEffect(() => {
    if (__SERVER__) return
    mount()
  }, [])
}
