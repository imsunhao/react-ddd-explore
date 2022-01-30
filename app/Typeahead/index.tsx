import * as React from 'react'
import { CustomInput } from './custom-input'
import { InputTimeAgo } from './input-time-ago'
import { Suggests } from './Suggests'
import { Warning } from './Warning'
import { wikipedia } from './api'

function App() {
  const [text, updateText] = React.useState('')

  return (
    <section style={{ margin: 20 }}>
      <div className="container">
        <CustomInput text={text} onChange={updateText} />
        <InputTimeAgo text={text} />
        <Suggests text={text} fetchFunc={wikipedia} />
        <Warning />
      </div>
    </section>
  )
}

export default App
