import { useWhyDidYouUpdate } from 'ahooks'
import { FC, memo } from 'react'

const Output: FC<{ value: any }> = (props) => {
  useWhyDidYouUpdate('Output', props)
  console.log('页面重新刷新')
  return <div>{JSON.stringify(props.value)}</div>
}

export default memo(Output)
