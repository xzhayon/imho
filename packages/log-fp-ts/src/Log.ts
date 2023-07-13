import { FpTs } from '@nsr/effect-fp-ts'
import * as _ from '@nsr/log'
import { Severity } from '@nsr/log'
import { readerTask } from 'fp-ts'
import { pipe } from 'fp-ts/function'

export interface Log extends FpTs<_.Log> {}

const log = (severity: Severity) => (message: string, context?: object) =>
  pipe(
    readerTask.ask<Log>(),
    readerTask.chainTaskK((log) => log[severity](message, context)),
  )

export const Log = {
  debug: log('debug'),
  info: log('info'),
  notice: log('notice'),
  warning: log('warning'),
  error: log('error'),
  alert: log('alert'),
  critical: log('critical'),
  emergency: log('emergency'),
}
