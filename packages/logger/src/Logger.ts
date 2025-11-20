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

const { log } = fx.access(tag, 'log')

export const Logger: { readonly log: FxLogFunctionWithContext } & {
  readonly [K in Severity]: FxLogFunctionWithoutSeverityWithContext
} = {
  log: (
    severity,
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    log((f) =>
      typeof messageOrAttributes === 'string'
        ? f(severity, messageOrAttributes, attributesOrError, error)
        : f(severity, messageOrAttributes, attributesOrError),
    ),
  debug: (messageOrAttributes: any, attributesOrError?: any, error?: Error) =>
    log((f) =>
      typeof messageOrAttributes === 'string'
        ? f('debug', messageOrAttributes, attributesOrError, error)
        : f('debug', messageOrAttributes, attributesOrError),
    ),
  info: (messageOrAttributes: any, attributesOrError?: any, error?: Error) =>
    log((f) =>
      typeof messageOrAttributes === 'string'
        ? f('info', messageOrAttributes, attributesOrError, error)
        : f('info', messageOrAttributes, attributesOrError),
    ),
  notice: (messageOrAttributes: any, attributesOrError?: any, error?: Error) =>
    log((f) =>
      typeof messageOrAttributes === 'string'
        ? f('notice', messageOrAttributes, attributesOrError, error)
        : f('notice', messageOrAttributes, attributesOrError),
    ),
  warning: (messageOrAttributes: any, attributesOrError?: any, error?: Error) =>
    log((f) =>
      typeof messageOrAttributes === 'string'
        ? f('warning', messageOrAttributes, attributesOrError, error)
        : f('warning', messageOrAttributes, attributesOrError),
    ),
  error: (messageOrAttributes: any, attributesOrError?: any, error?: Error) =>
    log((f) =>
      typeof messageOrAttributes === 'string'
        ? f('error', messageOrAttributes, attributesOrError, error)
        : f('error', messageOrAttributes, attributesOrError),
    ),
  critical: (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    log((f) =>
      typeof messageOrAttributes === 'string'
        ? f('critical', messageOrAttributes, attributesOrError, error)
        : f('critical', messageOrAttributes, attributesOrError),
    ),
  alert: (messageOrAttributes: any, attributesOrError?: any, error?: Error) =>
    log((f) =>
      typeof messageOrAttributes === 'string'
        ? f('alert', messageOrAttributes, attributesOrError, error)
        : f('alert', messageOrAttributes, attributesOrError),
    ),
  emergency: (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    log((f) =>
      typeof messageOrAttributes === 'string'
        ? f('emergency', messageOrAttributes, attributesOrError, error)
        : f('emergency', messageOrAttributes, attributesOrError),
    ),
}
