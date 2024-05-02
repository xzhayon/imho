import { CacheError, tag } from '@imho/cache'
import { CodecError } from '@imho/codec'
import { FxZodDecoder } from '@imho/codec-zod'
import { Log } from '@imho/log'
import {
  RedisClientType,
  RedisFlushModes,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client'
import { fx } from '@xzhayon/fx'
import { z } from 'zod'
import { CacheItemNotFoundError } from './CacheItemNotFoundError'

const source = 'FxRedisCache'

export function FxRedisCache<
  M extends RedisModules = Record<string, never>,
  F extends RedisFunctions = Record<string, never>,
  S extends RedisScripts = Record<string, never>,
>(redis: RedisClientType<M, F, S>) {
  async function* connect() {
    if (redis.isReady) {
      return
    }

    return yield* fx.tryCatch(
      async function* () {
        yield* fx.async(
          () => redis.connect(),
          (cause) => new CacheError('Cannot connect to Redis', { cause }),
        )
        yield* Log.debug('Connection opened', { source })
      },
      function* (error) {
        yield* Log.error('Connection failed', { error, source })

        return yield* fx.raise(error)
      },
    )
  }

  async function* has(key: string) {
    yield* connect()

    return yield* fx.tryCatch(
      fx.async(
        async () => (await redis.exists(key)) === 1,
        (cause) =>
          new CacheError(`Cannot check for item "${key}" on Redis`, { cause }),
      ),
      function* (error) {
        yield* Log.error('Cache item not found', { error, key, source })

        return yield* fx.raise(error)
      },
    )
  }

  return fx.layer().with(tag, {
    has,
    async *get(key, decoder, onMiss) {
      return yield* fx.tryCatch(
        async function* () {
          if (!(yield* has(key))) {
            return yield* fx.raise(
              new CacheItemNotFoundError(`Cannot find cache item "${key}"`),
            )
          }

          const value = yield* decoder.decode(
            yield* new FxZodDecoder(
              z.string().transform((s) => JSON.parse(s)),
            ).decode(
              yield* fx.async(
                () => redis.get(key),
                (cause) =>
                  new CacheError(`Cannot get item "${key}" from Redis`, {
                    cause,
                  }),
              ),
            ),
          )
          yield* Log.debug('Cache item retrieved', { key, source })

          return value
        },
        async function* (error) {
          if (error instanceof CacheItemNotFoundError) {
            yield* Log.debug('Cache item not found', { source })
          } else if (error instanceof CodecError) {
            yield* Log.error('Cache item decoding failed', {
              error,
              key,
              source,
            })
          } else {
            yield* Log.error('Cache item not found', {
              error,
              key,
              source,
            })
          }

          const value = yield* onMiss()

          return yield* fx.tryCatch(
            async function* () {
              yield* fx.async(
                () => redis.set(key, JSON.stringify(value)),
                (cause) =>
                  new CacheError(`Cannot save item "${key}" to Redis`, {
                    cause,
                  }),
              )
              yield* Log.debug('Cache item saved', { key, source })

              return value
            },
            function* (error) {
              yield* Log.error('Cache item not saved', { error, key, source })

              return yield* fx.raise(error)
            },
          )
        },
      )
    },
    async *delete(key: string) {
      yield* connect()

      return yield* fx.tryCatch(
        async function* () {
          const found = yield* fx.async(
            async () => (await redis.del(key)) === 1,
            (cause) =>
              new CacheError(`Cannot delete item "${key}" from Redis`, {
                cause,
              }),
          )
          yield* Log.debug(
            found ? 'Cache item deleted' : 'Cache item not found for deletion',
            { key, source },
          )

          return found
        },
        function* (error) {
          yield* Log.error('Cache item not deleted', { error, key, source })

          return yield* fx.raise(error)
        },
      )
    },
    async *clear() {
      yield* connect()

      return yield* fx.tryCatch(
        async function* () {
          yield* fx.async(
            () => redis.flushDb(RedisFlushModes.ASYNC),
            (cause) => new CacheError('Cannot flush Redis database', { cause }),
          )
          yield* Log.debug('Cache cleared', { source })
        },
        function* (error) {
          yield* Log.error('Cache not cleared', { error, source })

          return yield* fx.raise(error)
        },
      )
    },
  })
}
