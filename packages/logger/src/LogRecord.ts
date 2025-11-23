import type { LogAttributes } from './LogAttributes'
import type { LogSeverity } from './LogSeverity'

export interface LogRecord {
  readonly timestamp?: Date
  readonly severity: LogSeverity
  readonly message?: string
  readonly attributes?: LogAttributes
  readonly error?: Error
}
