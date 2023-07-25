import * as fpTs from '@imho/clock-fp-ts'
import { FpTsToRawClock } from './FpTsToRawClock'

export class DateClock extends FpTsToRawClock {
  constructor() {
    super(new fpTs.DateClock())
  }
}
