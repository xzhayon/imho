import * as _ from '@nsr/cache'
import { CacheError } from '@nsr/cache'
import { CodecError } from '@nsr/codec'
import { Decoder } from '@nsr/codec-fp-ts'
import { FpTs } from '@nsr/effect-fp-ts'
import { readerTaskEither } from 'fp-ts'
import { TaskEither } from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

export interface Cache extends FpTs<Omit<_.Cache, 'get'>> {
  get<E extends Error, A>(
    key: string,
    decoder: Decoder<A>,
    onMiss: () => TaskEither<E, A>,
  ): TaskEither<E | CacheError | CodecError, A>
}

export const Cache = {
  has: (key: string) =>
    pipe(
      readerTaskEither.ask<Cache>(),
      readerTaskEither.chainTaskEitherK((cache) => cache.has(key)),
    ),
  get: <E extends Error, A>(
    key: string,
    decoder: Decoder<A>,
    onMiss: () => TaskEither<E, A>,
  ) =>
    pipe(
      readerTaskEither.ask<Cache>(),
      readerTaskEither.chainTaskEitherK((cache) =>
        cache.get(key, decoder, onMiss),
      ),
    ),
  delete: (key: string) =>
    pipe(
      readerTaskEither.ask<Cache>(),
      readerTaskEither.chainTaskEitherK((cache) => cache.delete(key)),
    ),
  clear: () =>
    pipe(
      readerTaskEither.ask<Cache>(),
      readerTaskEither.chainTaskEitherK((cache) => cache.clear()),
    ),
}
