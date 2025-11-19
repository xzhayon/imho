import { fx } from 'affex'
import { Severity } from './Severity'

export type Logger = { readonly [fx.uri]?: unique symbol } & {
  readonly [K in Severity]: (message: string, context?: object) => Promise<void>
}

export const tag = fx.tag<Logger>('Log')

export const Logger = fx.service(
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
