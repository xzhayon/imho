import { Effect } from '@effect-ts/core'
import * as fpTs from '@nsr/log-fp-ts'
import { Log } from './Log'

export class FpTsToEffectTsLog implements Log {
  constructor(protected readonly log: fpTs.Log) {}

  debug(message: string, context?: object) {
    return Effect.promise(this.log.debug(message, context))
  }

  info(message: string, context?: object) {
    return Effect.promise(this.log.info(message, context))
  }

  notice(message: string, context?: object) {
    return Effect.promise(this.log.notice(message, context))
  }

  warning(message: string, context?: object) {
    return Effect.promise(this.log.warning(message, context))
  }

  error(message: string, context?: object) {
    return Effect.promise(this.log.error(message, context))
  }

  alert(message: string, context?: object) {
    return Effect.promise(this.log.alert(message, context))
  }

  critical(message: string, context?: object) {
    return Effect.promise(this.log.critical(message, context))
  }

  emergency(message: string, context?: object) {
    return Effect.promise(this.log.emergency(message, context))
  }
}
