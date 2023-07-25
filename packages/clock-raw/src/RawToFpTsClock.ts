import * as fpTs from '@imho/clock-fp-ts'
import { Clock } from './Clock'

export class RawToFpTsClock implements fpTs.Clock {
  constructor(private readonly clock: Clock) {}

  now() {
    return () => this.clock.now()
  }
}
