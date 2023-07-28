import { Effect, Has } from '@effect-ts/core'
import { EffectTs } from '@imho/effect-effect-ts'
import * as _ from '@imho/http'

export interface Http extends EffectTs<_.Http> {}

export const HasHttp = Has.tag<Http>()

export const Http = Effect.deriveLifted(HasHttp)(
  ['delete', 'get', 'head', 'options', 'patch', 'post', 'put'],
  [],
  [],
)
