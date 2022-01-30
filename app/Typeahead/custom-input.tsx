import * as React from 'react'
import { useAppDispatch } from 'store'
import { setState } from 'store/data'

export const CustomInput: React.FC = () => {
  const dispatch = useAppDispatch()

  console.log('Input 页面刷新')

  return (
    <button
      onClick={() =>
        dispatch(
          setState({
            data: 1234,
            loading: true,
          })
        )
      }
    >
      test
    </button>
  )
}
