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
  const { promise, reslove } = createPromise<boolean>()

  setTimeout(() => {
    reslove(!!Math.round(Math.random()))
  }, 1000)

  return promise
}
