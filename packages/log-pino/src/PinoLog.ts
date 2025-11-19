import { Logger } from '@imho/logger'
import pino from 'pino'

export class PinoLog implements Logger {
  constructor(private readonly pino: pino.Logger) {}

  debug(message: string, context?: object) {
    return this.log('debug', message, context)
  }

  info(message: string, context?: object) {
    return this.log('info', message, context)
  }

  notice(message: string, context?: object) {
    return this.log('info', message, context)
  }

  warning(message: string, context?: object) {
    return this.log('warn', message, context)
  }

  error(message: string, context?: object) {
    return this.log('error', message, context)
  }

  critical(message: string, context?: object) {
    return this.log('fatal', message, context)
  }

  alert(message: string, context?: object) {
    return this.log('fatal', message, context)
  }

  emergency(message: string, context?: object) {
    return this.log('fatal', message, context)
  }

  private async log(level: pino.Level, message: string, context?: object) {
    return this.pino[level](context, message)
  }
}
