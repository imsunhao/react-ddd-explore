import { useWhyDidYouUpdate } from 'ahooks'
// import { useDeepState } from 'app/hooks/useDeepState'
import { useDatas } from 'datas'
import { useObservableState } from 'observable-hooks'
import * as React from 'react'
import { CustomInput } from './custom-input'
import Output from './output'

function App() {
  const { status$ } = useDatas()
  const output: any = useObservableState(status$, {
    loading: false,
  })
  // const data = useDeepState(output.data)
  useWhyDidYouUpdate('App', output)

  return (
    <section style={{ margin: 20 }}>
      <div className="container">
        <CustomInput />
        <Output value={output} />
      </div>
    </section>
  )
}

export default App
