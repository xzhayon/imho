import { fx } from '@xzhayon/fx'
import { Severity } from './Severity'

export type Log = { readonly [fx.URI]?: unique symbol } & {
  readonly [K in Severity]: (message: string, context?: object) => Promise<void>
}

export const tag = fx.tag<Log>('Log')

export const Log = fx.struct(tag)(
  'debug',
  'info',
  'notice',
  'warning',
  'error',
  'critical',
  'alert',
  'emergency',
)
