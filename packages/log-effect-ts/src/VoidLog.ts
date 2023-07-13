import * as fpTs from '@nsr/log-fp-ts'
import { FpTsToEffectTsLog } from './FpTsToEffectTsLog'

export class VoidLog extends FpTsToEffectTsLog {
  constructor() {
    super(new fpTs.VoidLog())
  }
}
