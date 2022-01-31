import * as React from 'react'
import { useAppDispatch } from 'store'
import { fetchDataAsync } from 'store/data'

export const CustomInput: React.FC = () => {
  const dispatch = useAppDispatch()

  console.log('Input 页面刷新')

  return <button onClick={() => dispatch(fetchDataAsync())}>test</button>
}
