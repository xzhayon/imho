import { IO } from '@effect-ts/core'
import * as fpTs from '@imho/clock-fp-ts'
import { Clock } from './Clock'

export class EffectTsToFpTsClock implements fpTs.Clock {
  constructor(private readonly clock: Clock) {}

  now() {
    return () => IO.run(this.clock.now())
  }
}
