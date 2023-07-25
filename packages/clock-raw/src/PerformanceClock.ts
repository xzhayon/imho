import * as fpTs from '@imho/clock-fp-ts'
import { FpTsToRawClock } from './FpTsToRawClock'

export class PerformanceClock extends FpTsToRawClock {
  constructor() {
    super(new fpTs.PerformanceClock())
  }
}
