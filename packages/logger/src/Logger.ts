import { fx } from 'affex'
import type {
  FxLogFunction,
  FxLogFunctionWithContext,
  FxLogFunctionWithoutSeverity,
  FxLogFunctionWithoutSeverityWithContext,
  LogFunction,
  LogFunctionWithoutSeverity,
} from './LogFunction'
import { Severity } from './Severity'

export type Logger = {
  readonly [fx.uri]?: unique symbol
  readonly log: LogFunction
} & {
  readonly [K in Severity]: LogFunctionWithoutSeverity
}

export type FxLogger = Pick<Logger, typeof fx.uri> & {
  readonly log: FxLogFunction
} & { readonly [K in Severity]: FxLogFunctionWithoutSeverity }

export const tag = fx.tag<FxLogger>('Logger')

const {
  log,
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
  'log',
  'debug',
  'info',
  'notice',
  'warning',
  'error',
  'critical',
  'alert',
  'emergency',
)

export const Logger: { readonly log: FxLogFunctionWithContext } & {
  readonly [K in Severity]: FxLogFunctionWithoutSeverityWithContext
} = {
  log: (severity, arg1: any, arg2?: any, error?: Error) =>
    log((f) => f(severity, arg1, arg2, error)),
  debug: (arg0: any, arg1?: any, error?: Error) =>
    debug((f) => f(arg0, arg1, error)),
  info: (arg0: any, arg1?: any, error?: Error) =>
    info((f) => f(arg0, arg1, error)),
  notice: (arg0: any, arg1?: any, error?: Error) =>
    notice((f) => f(arg0, arg1, error)),
  warning: (arg0: any, arg1?: any, error?: Error) =>
    warning((f) => f(arg0, arg1, error)),
  error: (arg0: any, arg1?: any, error?: Error) =>
    _error((f) => f(arg0, arg1, error)),
  critical: (arg0: any, arg1?: any, error?: Error) =>
    critical((f) => f(arg0, arg1, error)),
  alert: (arg0: any, arg1?: any, error?: Error) =>
    alert((f) => f(arg0, arg1, error)),
  emergency: (arg0: any, arg1?: any, error?: Error) =>
    emergency((f) => f(arg0, arg1, error)),
}
