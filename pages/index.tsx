import { useDatas } from 'datas'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const { dataPool } = useDatas()
  console.log('页面重新刷新')
  return <div>Data Pool: {JSON.stringify(dataPool, null, 2)}</div>
}

export default Home
