import { NextApiRequest, NextApiResponse } from 'next'
import { createPromise } from 'utils/promise'

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const requestId: string = _req.query.requestId as any
  const { promise, reslove, reject } = createPromise<number>()

  setTimeout(() => {
    const number = Math.random()
    const data = Math.round(number)
    if (!data) return reject({ number })
    reslove(data)
  }, 3000)

  return promise
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((data) => {
      res.status(400).json(data)
    })
    .finally(() => {
      console.log('fetchData [res]', requestId)
    })
}

export default handler
