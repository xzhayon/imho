import {
  AbstractLogger,
  type LogFunction,
  type LogSeverity,
} from '@imho/logger'
import pino from 'pino'

const LEVELS: Record<LogSeverity, pino.Level> = {
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
  constructor(private readonly props: { readonly pino: pino.Logger }) {
    super()
  }

  readonly log: LogFunction = async (record) => {
    try {
      this.props.pino[LEVELS[record.severity]](
        {
          ...(record.timestamp !== undefined
            ? { time: record.timestamp.getTime() }
            : undefined),
          err: record.error,
          ...record.attributes,
        },
        record.message,
      )
    } catch {}
  }
}
