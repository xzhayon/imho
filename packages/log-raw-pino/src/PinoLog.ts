import * as fpTs from '@nsr/log-fp-ts-pino'
import { FpTsToRawLog } from '@nsr/log-raw'
import * as pino from 'pino'

export class PinoLog extends FpTsToRawLog {
  constructor(pino: pino.Logger) {
    super(new fpTs.PinoLog(pino))
  }
}
