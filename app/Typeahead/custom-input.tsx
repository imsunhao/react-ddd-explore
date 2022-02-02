import * as React from 'react'
import { useRequestController } from 'store/data'

export const CustomInput: React.FC = () => {
  const { single, polling } = useRequestController()

  console.log('Input 页面刷新')

  return (
    <>
      <div>
        <p>single</p>
        <p>
          <button
            onClick={() =>
              single
                .run({ a: 1234 })
                .then((data) => {
                  console.log('success', data)
                })
                .catch((e) => {
                  console.log('error', e)
                })
            }
          >
            run
          </button>
          <button onClick={() => single.stop()}>stop</button>
        </p>
      </div>
      <div>
        <p>polling</p>
        <p>
          <button onClick={() => polling.run({ a: 6666 })}>run</button>
          <button onClick={() => polling.stop()}>stop</button>
        </p>
      </div>
    </>
  )
}
