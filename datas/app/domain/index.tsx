import type { FC } from 'react'
import RequestsProvider from 'datas/requests/domain'
import { createContext } from 'utils/createContext'

const useDatasService = () => {
  return {}
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
