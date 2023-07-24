import { Effect, Has } from '@effect-ts/core'
import * as _ from '@imho/clock'
import { EffectTs } from '@imho/effect-effect-ts'

export interface Clock extends EffectTs<_.Clock> {}

export const HasClock = Has.tag<Clock>()

export const Clock = {
  now: () =>
    Effect.accessServiceM(HasClock)((clock) => Effect.fromIO(clock.now())),
}
