import { Effect, Has } from '@effect-ts/core'
import { EffectTs } from '@imho/effect-effect-ts'
import * as _ from '@imho/log'

export interface Log extends EffectTs<_.Log> {}

export const HasLog = Has.tag<Log>()

export const Log = Effect.deriveLifted(HasLog)(
  [
    'debug',
    'info',
    'notice',
    'warning',
    'error',
    'alert',
    'critical',
    'emergency',
  ],
  [],
  [],
)
