import { FC } from 'react'
import { useAppSelector } from 'store'
import { selectCounter } from 'store/data'

const Output: FC = () => {
  const props = useAppSelector(selectCounter)
  console.log('Output 页面刷新')

  return <div>{JSON.stringify(props)}</div>
}

export default Output
