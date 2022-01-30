import { FC, useState } from 'react'
import RequestsProvider, { useRequests } from 'datas/requests/domain'
import { createContext } from 'utils/createContext'
import { useObservable, useObservableState, useSubscription } from 'observable-hooks'
import { switchMap, timer, mapTo, empty } from 'rxjs'
import { fetchData } from 'utils/promise'

const sendBeacon = (beacon: string) => fetchData(beacon)
const props = {
  beacon: {
    a: '12345',
  },
}

const useDatasService = () => {
  const [shouldSendBeacon, setShouldSendBeacon] = useState(false)

  const beacon$ = useObservable(
    (inputs$) =>
      inputs$.pipe(
        // auto-cancelation
        switchMap(([shouldSendBeacon, beacon]) => (shouldSendBeacon ? timer(1000).pipe(mapTo(beacon)) : empty()))
      ),
    [shouldSendBeacon, props.beacon.a]
  )

  useSubscription(beacon$, sendBeacon)

  return {
    shouldSendBeacon,
    setShouldSendBeacon,
    beacon$,
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
