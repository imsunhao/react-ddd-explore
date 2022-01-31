import * as React from 'react'
import { useFetchDataPolling } from 'store/data'

export const CustomInput: React.FC = () => {
  const { run, stop } = useFetchDataPolling()

  console.log('Input 页面刷新')

  return (
    <>
      <button onClick={() => run()}>polling</button>
      <button onClick={() => stop()}>stop</button>
    </>
  )
}
