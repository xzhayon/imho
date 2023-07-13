import { Log } from '@nsr/log-fp-ts'
import { task } from 'fp-ts'
import pino from 'pino'

export class PinoLog implements Log {
  constructor(private readonly pino: pino.Logger) {}

  debug(message: string, context?: object | undefined) {
    return this.log('debug', message, context)
  }

  info(message: string, context?: object | undefined) {
    return this.log('info', message, context)
  }

  notice(message: string, context?: object | undefined) {
    return this.log('info', message, context)
  }

  warning(message: string, context?: object | undefined) {
    return this.log('warn', message, context)
  }

  error(message: string, context?: object | undefined) {
    return this.log('error', message, context)
  }

  alert(message: string, context?: object | undefined) {
    return this.log('fatal', message, context)
  }

  critical(message: string, context?: object | undefined) {
    return this.log('fatal', message, context)
  }

  emergency(message: string, context?: object | undefined) {
    return this.log('fatal', message, context)
  }

  private log(level: pino.Level, message: string, context?: object) {
    return task.fromIO(() => this.pino[level](context, message))
  }
}
