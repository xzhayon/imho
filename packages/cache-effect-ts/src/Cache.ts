import { Effect, Has } from '@effect-ts/core'
import { IO } from '@effect-ts/core/Effect'
import * as _ from '@nsr/cache'
import { CacheError } from '@nsr/cache'
import { CodecError } from '@nsr/codec'
import { Decoder } from '@nsr/codec-effect-ts'
import { EffectTs } from '@nsr/effect-effect-ts'

export interface Cache extends EffectTs<Omit<_.Cache, 'get'>> {
  get<E extends Error, A>(
    key: string,
    decoder: Decoder<A>,
    onMiss: () => IO<E, A>,
  ): IO<E | CacheError | CodecError, A>
}

export const HasCache = Has.tag<Cache>()

export const Cache = {
  ...Effect.deriveLifted(HasCache)(['has', 'delete', 'clear'], [], []),
  get: <E extends Error, A>(
    key: string,
    decoder: Decoder<A>,
    onMiss: () => IO<E, A>,
  ) =>
    Effect.accessServiceM(HasCache)((cache) => cache.get(key, decoder, onMiss)),
}
