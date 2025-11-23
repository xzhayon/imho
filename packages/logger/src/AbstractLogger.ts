import type { LogFunction, LogFunctionWithoutSeverity } from './LogFunction'
import type { Logger } from './Logger'
import type { LogSeverity } from './LogSeverity'

export abstract class AbstractLogger implements Logger {
  readonly debug: LogFunctionWithoutSeverity = (
    messageOrErrorOrRecord: any,
    options?: any,
  ) => this._log('debug', messageOrErrorOrRecord, options)

  readonly info: LogFunctionWithoutSeverity = (
    messageOrErrorOrRecord: any,
    options?: any,
  ) => this._log('info', messageOrErrorOrRecord, options)

  readonly notice: LogFunctionWithoutSeverity = (
    messageOrErrorOrRecord: any,
    options?: any,
  ) => this._log('notice', messageOrErrorOrRecord, options)

  readonly warning: LogFunctionWithoutSeverity = (
    messageOrErrorOrRecord: any,
    options?: any,
  ) => this._log('warning', messageOrErrorOrRecord, options)

  readonly error: LogFunctionWithoutSeverity = (
    messageOrErrorOrRecord: any,
    options?: any,
  ) => this._log('error', messageOrErrorOrRecord, options)

  readonly critical: LogFunctionWithoutSeverity = (
    messageOrErrorOrRecord: any,
    options?: any,
  ) => this._log('critical', messageOrErrorOrRecord, options)

  readonly alert: LogFunctionWithoutSeverity = (
    messageOrErrorOrRecord: any,
    options?: any,
  ) => this._log('alert', messageOrErrorOrRecord, options)

  readonly emergency: LogFunctionWithoutSeverity = (
    messageOrErrorOrRecord: any,
    options?: any,
  ) => this._log('emergency', messageOrErrorOrRecord, options)

  private readonly _log = (
    severity: LogSeverity,
    messageOrErrorOrRecord: any,
    options?: any,
  ) =>
    this.log({
      ...(options ?? undefined),
      severity,
      ...(typeof messageOrErrorOrRecord === 'string'
        ? { message: messageOrErrorOrRecord }
        : messageOrErrorOrRecord instanceof Error
        ? { error: messageOrErrorOrRecord }
        : messageOrErrorOrRecord),
    })

  abstract readonly log: LogFunction
}
