import { useDatas } from 'datas'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const { dataPool } = useDatas()
  return <div>Data Pool: {JSON.stringify(dataPool, null, 2)}</div>
}

export default Home
