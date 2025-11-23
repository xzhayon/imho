import type { Clock } from '@imho/clock'
import { fx } from 'affex'
import { tag } from '../Logger'
import type { LogRecord } from '../LogRecord'
import { InMemoryLogger } from './InMemoryLogger'

export function FxInMemoryLogger(props?: {
  readonly clock?: Clock
  readonly records?: Array<LogRecord>
}) {
  return fx.layer(tag, new InMemoryLogger(props))
}
