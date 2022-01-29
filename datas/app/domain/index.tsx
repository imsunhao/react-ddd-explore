import type { FC } from 'react'
import RequestsProvider from 'datas/requests/domain'
import { createContext } from 'utils/createContext'

import { useDataPool } from '../application/dataPool'

const useDatasService = () => {
  const dataPool = useDataPool()

  return {
    dataPool,
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
