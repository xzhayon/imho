import { Effect, pipe } from '@effect-ts/core'
import { IO } from '@effect-ts/core/Effect'
import * as fpTs from '@nsr/cache-fp-ts'
import { Decoder, EffectTsToFpTsDecoder } from '@nsr/codec-effect-ts'
import { either } from 'fp-ts'
import { Cache } from './Cache'

export class FpTsToEffectTsCache implements Cache {
  constructor(private readonly cache: fpTs.Cache) {}

  has(key: string) {
    return pipe(
      Effect.promise(this.cache.has(key)),
      Effect.chain((found) =>
        either.isLeft(found)
          ? Effect.fail(found.left)
          : Effect.succeed(found.right),
      ),
    )
  }

  get<E extends Error, A>(
    key: string,
    decoder: Decoder<A, unknown>,
    onMiss: () => IO<E, A>,
  ) {
    return pipe(
      Effect.promise(
        this.cache.get(
          key,
          new EffectTsToFpTsDecoder(decoder),
          () => () =>
            pipe(
              onMiss(),
              Effect.fold(either.left, either.right),
              Effect.runPromise,
            ),
        ),
      ),
      Effect.chain((a) =>
        either.isLeft(a) ? Effect.fail(a.left) : Effect.succeed(a.right),
      ),
    )
  }

  delete(key: string) {
    return pipe(
      Effect.promise(this.cache.delete(key)),
      Effect.chain((found) =>
        either.isLeft(found)
          ? Effect.fail(found.left)
          : Effect.succeed(found.right),
      ),
    )
  }

  clear() {
    return pipe(
      Effect.promise(this.cache.clear()),
      Effect.chain((cleared) =>
        either.isLeft(cleared)
          ? Effect.fail(cleared.left)
          : Effect.succeed(cleared.right),
      ),
    )
  }
}
