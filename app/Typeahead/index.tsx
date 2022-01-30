import * as React from 'react'
import { CustomInput } from './custom-input'
import Output from './output'

function App() {
  console.log('App 页面刷新')

  return (
    <section style={{ margin: 20 }}>
      <div className="container">
        <CustomInput />
        <Output />
      </div>
    </section>
  )
}

export default App
