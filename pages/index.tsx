import { useDatas } from 'datas'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const { dataPool } = useDatas()
  const time = Date.now()
  console.log('页面重新刷新', time)
  return (
    <div>
      Data Pool: {JSON.stringify(dataPool, null, 2)} - {time}
    </div>
  )
}

export default Home
