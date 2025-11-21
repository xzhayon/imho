import { fx } from 'affex'
import type {
  FxLogFunctionWithoutSeverity,
  FxLogFunctionWithoutSeverityWithContext,
  LogFunction,
  LogFunctionWithoutSeverity,
} from './LogFunction'
import { LogSeverity } from './LogSeverity'

export type Logger = {
  readonly [fx.uri]?: unique symbol
  readonly log: LogFunction
} & {
  readonly [K in LogSeverity]: LogFunctionWithoutSeverity
}

export type FxLogger = Pick<Logger, typeof fx.uri | 'log'> & {
  readonly [K in LogSeverity]: FxLogFunctionWithoutSeverity
}

export const tag = fx.tag<FxLogger>('Logger')

const { log } = fx.service(tag, 'log')

const {
  debug,
  info,
  notice,
  warning,
  error: _error,
  critical,
  alert,
  emergency,
} = fx.access(
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

export const Logger: { readonly log: typeof log } & {
  readonly [K in LogSeverity]: FxLogFunctionWithoutSeverityWithContext
} = {
  log,
  debug: (messageOrErrorOrRecord: any, options?: any) =>
    debug((f) => f(messageOrErrorOrRecord, options)),
  info: (messageOrErrorOrRecord: any, options?: any) =>
    info((f) => f(messageOrErrorOrRecord, options)),
  notice: (messageOrErrorOrRecord: any, options?: any) =>
    notice((f) => f(messageOrErrorOrRecord, options)),
  warning: (messageOrErrorOrRecord: any, options?: any) =>
    warning((f) => f(messageOrErrorOrRecord, options)),
  error: (messageOrErrorOrRecord: any, options?: any) =>
    _error((f) => f(messageOrErrorOrRecord, options)),
  critical: (messageOrErrorOrRecord: any, options?: any) =>
    critical((f) => f(messageOrErrorOrRecord, options)),
  alert: (messageOrErrorOrRecord: any, options?: any) =>
    alert((f) => f(messageOrErrorOrRecord, options)),
  emergency: (messageOrErrorOrRecord: any, options?: any) =>
    emergency((f) => f(messageOrErrorOrRecord, options)),
}
