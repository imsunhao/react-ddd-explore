import React, { FC, useState } from 'react'
import { timer, empty } from 'rxjs'
import { switchMap, mapTo } from 'rxjs/operators'
import { useObservable, useObservableState, useSubscription } from 'observable-hooks'
import { useDatas } from 'datas'
import { useWhyDidYouUpdate } from 'ahooks'

export interface AppProps {
  beacon: string
}

export const App: FC<AppProps> = () => {
  console.log('页面重新刷新', Date.now())
  const { shouldSendBeacon, setShouldSendBeacon, beacon$ } = useDatas()

  const output = useObservableState(beacon$, '')

  useWhyDidYouUpdate('App', { shouldSendBeacon, setShouldSendBeacon, beacon$, output })

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={shouldSendBeacon}
          onChange={(e) => setShouldSendBeacon(e.currentTarget.checked)}
        />
        Should Send Beacon
      </label>
      <p>output: {JSON.stringify(output, null, 2)}</p>
    </>
  )
}
export default App
