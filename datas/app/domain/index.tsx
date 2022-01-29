import { FC, useEffect, useState } from 'react'
import RequestsProvider from 'datas/requests/domain'
import { createContext } from 'utils/createContext'

import { fetchData } from '../application/dataPool'
import { useLatest } from 'app/hooks/useLatest'

const useDatasService = () => {
  const [dataPool, setState] = useState(false)
  const dataPoolRef = useLatest(dataPool)
  useEffect(() => {
    const run = () => {
      console.log('[req]')
      fetchData({})
        .then((data) => {
          if (dataPoolRef.current === data) return
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


  const [dataPool2, setState2] = useState(false)
  const dataPoolRef2 = useLatest(dataPool)
  useEffect(() => {
    const run = () => {
      console.log('[req] - 2')
      fetchData({})
        .then((data) => {
          if (dataPoolRef2.current === data) return
          console.log('[res] - 2')
          setState2(data)
        })
        .finally(() => {
          setTimeout(() => run(), 1000)
        })
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    dataPool,
    dataPool2,
  }
}
const { Provider: DatasProvider, createUseContext } = createContext(useDatasService)
export const createUseDataContext = createUseContext

const Provider: FC = ({ children }) => {
  return (
    <RequestsProvider>
      <DatasProvider>{children}</DatasProvider>
    </RequestsProvider>
  )
}

export default Provider
