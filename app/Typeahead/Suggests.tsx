import { useObservableState, useObservable } from 'observable-hooks'
import * as React from 'react'
import { map, distinctUntilChanged, switchMap, catchError, startWith, tap, debounceTime } from 'rxjs/operators'
import { of, timer, Observable, interval, from } from 'rxjs'
import { useWhyDidYouUpdate } from 'ahooks'
import { fetchData } from 'utils/promise'

export type SuggestsList = boolean

export type SuggestsFetcher = (text: string) => Observable<SuggestsList>

export interface SuggestsProps {
  text: string
}

const defaultState = {
  loading: false,
  data: undefined as any,
  error: undefined as any,
}

/** Reusable Suggests Component */
export const Suggests: React.FC<SuggestsProps> = (props) => {
  const { text } = props

  const data$ = useObservable(
    (inputs$) => {
      inputs$.subscribe({
        next: (x) => console.log('got value ' + x),
        error: (err) => console.error('something wrong occurred: ' + err),
        complete: () => console.log('done'),
      })
      return inputs$
    },
    [text]
  )

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
            : of(defaultState)
        )
      ),
    [text]
  )

  const output = useObservableState(status$, () => defaultState)
  useWhyDidYouUpdate('Suggests', output)
  return <div>{JSON.stringify(output)}</div>
}
