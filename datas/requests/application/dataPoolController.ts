import { useLatest } from 'app/hooks/useLatest'
import { useEffect, useState } from 'react'
import { fetchData } from 'utils/promise'

export const useDataPoolController = () => {
  const [data, setState] = useState(false)
  const dataRef = useLatest(data)
  useEffect(() => {
    const run = () => {
      console.log('[req]')
      fetchData({})
        .then((data) => {
          if (dataRef.current === data) return
          console.log('[res]')
          setState(data)
        })
        .finally(() => {
          setTimeout(() => run(), 3000)
        })
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    data,
  }
}
