import { Effect, pipe } from '@effect-ts/core'
import * as fpTs from '@imho/log-fp-ts'
import { Log } from './Log'

export class EffectTsToFpTsLog implements fpTs.Log {
  constructor(private readonly log: Log) {}

  debug(message: string, context?: object) {
    return () => pipe(this.log.debug(message, context), Effect.runPromise)
  }

  info(message: string, context?: object) {
    return () => pipe(this.log.info(message, context), Effect.runPromise)
  }

  notice(message: string, context?: object) {
    return () => pipe(this.log.notice(message, context), Effect.runPromise)
  }

  warning(message: string, context?: object) {
    return () => pipe(this.log.warning(message, context), Effect.runPromise)
  }

  error(message: string, context?: object) {
    return () => pipe(this.log.error(message, context), Effect.runPromise)
  }

  alert(message: string, context?: object) {
    return () => pipe(this.log.alert(message, context), Effect.runPromise)
  }

  critical(message: string, context?: object) {
    return () => pipe(this.log.critical(message, context), Effect.runPromise)
  }

  emergency(message: string, context?: object) {
    return () => pipe(this.log.emergency(message, context), Effect.runPromise)
  }
}
