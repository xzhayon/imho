import { FpTsToEffectTsLog } from '@imho/log-effect-ts'
import * as fpTs from '@imho/log-fp-ts-pino'
import pino from 'pino'

export class PinoLog extends FpTsToEffectTsLog {
  constructor(pino: pino.Logger) {
    super(new fpTs.PinoLog(pino))
  }
}
