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
  ) => this.log('debug', messageOrAttributes, attributesOrError, error)

  readonly info: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) => this.log('info', messageOrAttributes, attributesOrError, error)

  readonly notice: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) => this.log('notice', messageOrAttributes, attributesOrError, error)

  readonly warning: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) => this.log('warning', messageOrAttributes, attributesOrError, error)

  readonly error: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) => this.log('error', messageOrAttributes, attributesOrError, error)

  readonly critical: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) => this.log('critical', messageOrAttributes, attributesOrError, error)

  readonly alert: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) => this.log('alert', messageOrAttributes, attributesOrError, error)

  readonly emergency: LogFunctionWithoutSeverity = (
    messageOrAttributes: any,
    attributesOrError?: any,
    error?: Error,
  ) => this.log('emergency', messageOrAttributes, attributesOrError, error)

  protected abstract readonly _log: (
    severity: Severity,
    message?: string,
    attributes?: Attributes,
    error?: Error,
  ) => Promise<void>
}
