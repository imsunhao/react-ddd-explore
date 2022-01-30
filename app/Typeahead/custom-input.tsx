import { useRequests } from 'datas/requests/domain'
import * as React from 'react'

export const CustomInput: React.FC = () => {
  const { text, onChange } = useRequests()

  console.log('Input 页面刷新')

  return <input className="input" type="text" placeholder="Text input" value={text} onChange={onChange} />
}
