import type { Updater } from 'use-immer'
export type CreateRequestProps = {
  id: RequestID
  fn: RequestFn
  options: RequestOptions
  requestsRef: MutableRefObject<RequestStorage>
  setRequestStorage: Updater<RequestStorage>
}
export type CreateRequest<Props = any> = (query: Props) => {
  run: () => any
  stop: () => boolean
}
export type CreatePolling<Props = any> = (query: Props) => {
  run: (time: number) => any
  stop: () => boolean
}
export type RequestCoreUpdates = {
  setLoading: (value: boolean) => void
  setData: (value: any) => void
  setPolling: (value: ReturnType<typeof setTimeout>) => void
}
export type RequestCore<Props = any, ReturnValue = any> = RequestCoreUpdates & {
  id: RequestID
  loading: boolean
  data: Awaited<ReturnValue>
  polling: ReturnType<typeof setTimeout>
  createRequest: CreateRequest<Props>
  createPolling: CreatePolling<Props>
}

export type RequestID = string
export type RequestFn<Props = any, ReturnValue = any> = (props: Props) => ReturnValue
export type RequestStorage = Record<RequestID, RequestCore>
export type RequestOptions = {
  useCache?: boolean
}

import type { RequestKey } from './constants'
type GetRequesetId = (key: RequestKey) => RequestID
type RequestGettersAttr = 'data' | 'loading' | 'polling'
type PickRequestGetters<T extends Record<RequestGettersAttr, any>> = Pick<T, RequestGettersAttr>

import type { UseDataPoolController } from 'datas/app/application/dataPool'
type RequestGettersMap = {
  [RequestKey.dataPool]: PickRequestGetters<UseDataPoolController>
}

export type RequestGetters = <Key extends RequestKey>(key: Key, getRequesetId?: GetRequesetId) => RequestGettersMap[Key]
