import { useMemo } from 'react'

export const useMemoEmpty = <T>(factory: () => T) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, [])
}
