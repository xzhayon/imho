import { Effect } from '@effect-ts/core'
import * as fpTs from '@imho/clock-fp-ts'
import { Clock } from './Clock'

export class FpTsToEffectTsClock implements Clock {
  constructor(private readonly clock: fpTs.Clock) {}

  now() {
    return Effect.succeedWith(this.clock.now())
  }
}
