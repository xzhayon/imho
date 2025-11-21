import { CacheError, tag } from '@imho/cache'
import { CodecError } from '@imho/codec'
import { FxZodDecoder } from '@imho/codec-zod'
import { Logger } from '@imho/logger'
import {
  RedisClientType,
  RedisFlushModes,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client'
import { fx } from 'affex'
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
        yield* Logger.debug('Connection opened', { attributes: { source } })
      },
      function* (error) {
        yield* Logger.error('Connection failed', {
          attributes: { source },
          error,
        })

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
        yield* Logger.error('Cache item not found', {
          attributes: { key, source },
          error,
        })

        return yield* fx.raise(error)
      },
    )
  }

  return fx.layer(tag, {
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
          yield* Logger.debug('Cache item retrieved', {
            attributes: { key, source },
          })

          return value
        },
        async function* (error) {
          if (error instanceof CacheItemNotFoundError) {
            yield* Logger.debug('Cache item not found', {
              attributes: { key, source },
            })
          } else if (error instanceof CodecError) {
            yield* Logger.error('Cache item decoding failed', {
              attributes: { key, source },
              error,
            })
          } else {
            yield* Logger.error('Cache item not found', {
              attributes: { key, source },
              error,
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
              yield* Logger.debug('Cache item saved', {
                attributes: { key, source },
              })

              return value
            },
            function* (error) {
              yield* Logger.error('Cache item not saved', {
                attributes: { key, source },
                error,
              })

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
          yield* Logger.debug(
            found ? 'Cache item deleted' : 'Cache item not found for deletion',
            { attributes: { key, source } },
          )

          return found
        },
        function* (error) {
          yield* Logger.error('Cache item not deleted', {
            attributes: { key, source },
            error,
          })

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
          yield* Logger.debug('Cache cleared', { attributes: { source } })
        },
        function* (error) {
          yield* Logger.error('Cache not cleared', {
            attributes: { source },
            error,
          })

          return yield* fx.raise(error)
        },
      )
    },
  })
}
