import * as fpTs from '@imho/clock-fp-ts'
import { Clock } from './Clock'

export class FpTsToRawClock implements Clock {
  constructor(private readonly clock: fpTs.Clock) {}

  now() {
    return this.clock.now()()
  }
}
