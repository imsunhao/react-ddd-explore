import { createContext } from 'utils/createContext'
import { useDataPoolController } from '../application/dataPoolController'

const useRequestsService = () => {
  const dataPoolController = useDataPoolController()
  return {
    dataPoolController,
  }
}
const { Provider: RequestsProvider, createUseContext } = createContext(useRequestsService)
export const useRequests = createUseContext()

export default RequestsProvider
