import { useDatas } from 'datas'
import { useObservableCallback, useSubscription, pluckCurrentTargetValue } from 'observable-hooks'
import * as React from 'react'

export const CustomInput: React.FC = () => {
  const { text, updateText } = useDatas()
  const [onChange, textChange$] = useObservableCallback<string, React.FormEvent<HTMLInputElement>>(
    pluckCurrentTargetValue
  )

  useSubscription(textChange$, updateText)

  return <input className="input" type="text" placeholder="Text input" value={text} onChange={onChange} />
}
