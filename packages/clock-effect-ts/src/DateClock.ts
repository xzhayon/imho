import * as fpTs from '@imho/clock-fp-ts'
import { FpTsToEffectTsClock } from './FpTsToEffectTsClock'

export class DateClock extends FpTsToEffectTsClock {
  constructor() {
    super(new fpTs.DateClock())
  }
}
