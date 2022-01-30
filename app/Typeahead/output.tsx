import { useWhyDidYouUpdate } from 'ahooks'
import { useDatas } from 'datas'
import { useObservableState } from 'observable-hooks'
import { FC } from 'react'

const Output: FC = () => {
  const { props } = useDatas()

  console.log('Output 页面刷新')
  useWhyDidYouUpdate('Output', props)

  return <div>{JSON.stringify(props)}</div>
}

export default Output
