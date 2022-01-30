import { useState } from 'react'
import { createContext } from 'utils/createContext'
import { useObservableCallback, useSubscription, pluckCurrentTargetValue } from 'observable-hooks'

const useRequestsService = () => {
  const [text, updateText] = useState('')

  const [onChange, textChange$] = useObservableCallback<string, React.FormEvent<HTMLInputElement>>(
    pluckCurrentTargetValue
  )
  useSubscription(textChange$, updateText)

  return { text, onChange }
}
const { Provider: RequestsProvider, createUseContext } = createContext(useRequestsService)
export const useRequests = createUseContext()

export default RequestsProvider
