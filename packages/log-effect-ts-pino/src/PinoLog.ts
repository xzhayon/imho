import { FpTsToEffectTsLog } from '@nsr/log-effect-ts'
import * as fpTs from '@nsr/log-fp-ts-pino'
import pino from 'pino'

export class PinoLog extends FpTsToEffectTsLog {
  constructor(pino: pino.Logger) {
    super(new fpTs.PinoLog(pino))
  }
}
