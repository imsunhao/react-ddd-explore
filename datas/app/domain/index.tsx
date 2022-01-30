import { FC, useState } from 'react'
import RequestsProvider, { useRequests } from 'datas/requests/domain'
import { createContext } from 'utils/createContext'
import { useObservable, useObservableState } from 'observable-hooks'
import { switchMap, catchError, debounceTime, from, map, of, startWith } from 'rxjs'
import { fetchData } from 'utils/promise'

const useDatasService = () => {
  const { text } = useRequests()
  const status$ = useObservable(
    (inputs$) =>
      inputs$.pipe(
        debounceTime(1000),
        // distinctUntilChanged((a, b) => a[0] === b[0]),
        switchMap(([text]) =>
          text
            ? from(fetchData(text)).pipe(
                map((suggests) => ({
                  loading: false,
                  data: suggests,
                })),
                catchError((e) =>
                  of({
                    loading: false,
                    error: e,
                  })
                ),
                startWith({
                  loading: true,
                })
              )
            : of({
                loading: false,
              })
        )
      ),
    [text]
  )
  const props: any = useObservableState(status$, {
    loading: false,
  })
  console.log('useDatasService', props)

  return { props }
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
