import * as fpTs from '@imho/log-fp-ts-pino'
import { FpTsToRawLog } from '@imho/log-raw'
import * as pino from 'pino'

export class PinoLog extends FpTsToRawLog {
  constructor(pino: pino.Logger) {
    super(new fpTs.PinoLog(pino))
  }
}
