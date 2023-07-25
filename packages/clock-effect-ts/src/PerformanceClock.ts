import * as fpTs from '@imho/clock-fp-ts'
import { FpTsToEffectTsClock } from './FpTsToEffectTsClock'

export class PerformanceClock extends FpTsToEffectTsClock {
  constructor() {
    super(new fpTs.PerformanceClock())
  }
}
