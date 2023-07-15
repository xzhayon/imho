import * as fpTs from '@imho/log-fp-ts'
import { Log } from './Log'

export class FpTsToRawLog implements Log {
  constructor(private readonly log: fpTs.Log) {}

  debug(message: string, context?: object) {
    return this.log.debug(message, context)()
  }

  info(message: string, context?: object) {
    return this.log.info(message, context)()
  }

  notice(message: string, context?: object) {
    return this.log.notice(message, context)()
  }

  warning(message: string, context?: object) {
    return this.log.warning(message, context)()
  }

  error(message: string, context?: object) {
    return this.log.error(message, context)()
  }

  alert(message: string, context?: object) {
    return this.log.alert(message, context)()
  }

  critical(message: string, context?: object) {
    return this.log.critical(message, context)()
  }

  emergency(message: string, context?: object) {
    return this.log.emergency(message, context)()
  }
}
