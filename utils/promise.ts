export function createPromise<T = void, J = any>() {
  let reslove: (value: T | PromiseLike<T>) => void
  let reject: (reason?: J) => void
  const promise = new Promise<T>((res, rej) => {
    reslove = res
    reject = rej
  })

  return {
    promise,
    reslove,
    reject,
  }
}

export const fetchData = (props: {}) => {
  const id = Date.now()
  console.log('fetchData [req]', id)
  const { promise, reslove, reject } = createPromise<number>()

  setTimeout(() => {
    const data = Math.round(Math.random())
    if (!data) return reject(data || 'test - error')
    reslove(data)
    console.log('fetchData [res]', id, data)
  }, 1000)

  return promise
}
