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

import type { UseReservesDataController } from 'datas/contract/application/reservesData'
import type { UseUserReservesDataController } from 'datas/contract/application/userReservesData'
import type { UseWalletBalanceController } from 'datas/contract/application/walletData'
type RequestGettersMap = {
  [RequestKey.reservesData]: PickRequestGetters<UseReservesDataController>
  [RequestKey.userReservesData]: PickRequestGetters<UseUserReservesDataController>
  [RequestKey.walletBalanceData]: PickRequestGetters<UseWalletBalanceController>
  [RequestKey.walletNFTData]: PickRequestGetters<UseWalletBalanceController>
  [RequestKey.NFTInfoData]: PickRequestGetters<UseWalletBalanceController>
}

export type RequestGetters = <Key extends RequestKey>(key: Key, getRequesetId?: GetRequesetId) => RequestGettersMap[Key]
