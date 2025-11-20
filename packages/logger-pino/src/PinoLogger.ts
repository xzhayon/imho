import { AbstractLogger, type Attributes, type Severity } from '@imho/logger'
import pino from 'pino'

const LEVELS: Record<Severity, pino.Level> = {
  debug: 'debug',
  info: 'info',
  notice: 'info',
  warning: 'warn',
  error: 'error',
  critical: 'fatal',
  alert: 'fatal',
  emergency: 'fatal',
}

export class PinoLogger extends AbstractLogger {
  constructor(private readonly pino: pino.Logger) {
    super()
  }

  protected readonly _log = async (
    severity: Severity,
    message?: string,
    attributes?: Attributes,
    error?: Error,
  ) => {
    try {
      this.pino[LEVELS[severity]]({ err: error, ...attributes }, message)
    } catch {}
  }
}
