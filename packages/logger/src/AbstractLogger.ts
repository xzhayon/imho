import type { Attributes } from './Attributes'
import type { LogFunction, LogFunctionWithoutSeverity } from './LogFunction'
import type { Logger } from './Logger'
import type { Severity } from './Severity'

export abstract class AbstractLogger implements Logger {
  readonly log: LogFunction = (
    severity,
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    typeof messageOrAttributes === 'string'
      ? this._log(severity, messageOrAttributes, attributesOrError, error)
      : this._log(severity, undefined, messageOrAttributes, attributesOrError)

  readonly debug: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    typeof messageOrAttributes === 'string'
      ? this.log('debug', messageOrAttributes, attributesOrError, error)
      : this.log('debug', messageOrAttributes, attributesOrError)

  readonly info: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    typeof messageOrAttributes === 'string'
      ? this.log('info', messageOrAttributes, attributesOrError, error)
      : this.log('info', messageOrAttributes, attributesOrError)

  readonly notice: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    typeof messageOrAttributes === 'string'
      ? this.log('notice', messageOrAttributes, attributesOrError, error)
      : this.log('notice', messageOrAttributes, attributesOrError)

  readonly warning: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    typeof messageOrAttributes === 'string'
      ? this.log('warning', messageOrAttributes, attributesOrError, error)
      : this.log('warning', messageOrAttributes, attributesOrError)

  readonly error: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    typeof messageOrAttributes === 'string'
      ? this.log('error', messageOrAttributes, attributesOrError, error)
      : this.log('error', messageOrAttributes, attributesOrError)

  readonly critical: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    typeof messageOrAttributes === 'string'
      ? this.log('critical', messageOrAttributes, attributesOrError, error)
      : this.log('critical', messageOrAttributes, attributesOrError)

  readonly alert: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    typeof messageOrAttributes === 'string'
      ? this.log('alert', messageOrAttributes, attributesOrError, error)
      : this.log('alert', messageOrAttributes, attributesOrError)

  readonly emergency: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) =>
    typeof messageOrAttributes === 'string'
      ? this.log('emergency', messageOrAttributes, attributesOrError, error)
      : this.log('emergency', messageOrAttributes, attributesOrError)

  protected abstract readonly _log: (
    severity: Severity,
    message?: string,
    attributes?: Attributes,
    error?: Error,
  ) => Promise<void>
}
