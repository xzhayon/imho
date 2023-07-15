import * as fpTs from '@imho/log-fp-ts'
import { FpTsToEffectTsLog } from './FpTsToEffectTsLog'

export class VoidLog extends FpTsToEffectTsLog {
  constructor() {
    super(new fpTs.VoidLog())
  }
}
