import { FC } from 'react'
import RequestsProvider, { useRequests } from 'datas/requests/domain'
import { createContext } from 'utils/createContext'

const useDatasService = () => {
  const {
    dataPoolController: { data: dataPool },
  } = useRequests()

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
