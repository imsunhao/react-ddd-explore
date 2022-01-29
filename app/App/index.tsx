import { createContext } from 'utils/createContext'

export function useAppService() {
  return {}
}

export const { Context, Provider: APP, createUseContext } = createContext(useAppService)
export const useApp = createUseContext()
export default APP
