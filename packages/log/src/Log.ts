import { fx } from 'affex'
import { Severity } from './Severity'

export type Log = { readonly [fx.uri]?: unique symbol } & {
  readonly [K in Severity]: (message: string, context?: object) => Promise<void>
}

export const tag = fx.tag<Log>('Log')

export const Log = fx.service(
  tag,
  'debug',
  'info',
  'notice',
  'warning',
  'error',
  'critical',
  'alert',
  'emergency',
)
