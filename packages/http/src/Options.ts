import { Headers } from './Headers'
import { Query } from './Query'

export interface Options {
  readonly headers?: Headers
  readonly query?: Query
  readonly abortSignal?: AbortSignal
}
