import { createContext } from 'utils/createContext'

import { useControllers } from './controllers'

export function useAppService() {
  const controllers = useControllers()

  return {
    controllers,
  }
}

export const { Context, Provider: APP, createUseContext } = createContext(useAppService)
export const useApp = createUseContext()
export default APP
