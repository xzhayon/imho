import { CacheError, FxCache } from '@imho/cache'
import { CodecError, Decoder } from '@imho/codec'
import { ZodDecoder } from '@imho/codec-zod'
import { Log } from '@imho/log'
import {
  RedisClientType,
  RedisFlushModes,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client'
import { Handler, perform } from '@xzhayon/fx'
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

    try {
      await redis.connect()
      yield* perform(Log.debug('Connection opened', { source }))

      return
    } catch (cause) {
      const error = new CacheError('Cannot connect to Redis', { cause })
      yield* perform(Log.error('Connection failed', { error, source }))

      throw error
    }
  }

  async function* has(key: string) {
    yield* connect()

    try {
      return (await redis.exists(key)) === 1
    } catch (cause) {
      const error = new CacheError(`Cannot check for item "${key}" on Redis`, {
        cause,
      })
      yield* perform(Log.error('Cache item not found', { error, key, source }))

      throw error
    }
  }

  return {
    has,
    async *get<A, G extends Generator<unknown, A>>(
      key: string,
      decoder: Decoder<A>,
      onMiss: () => G,
    ) {
      try {
        if (!(yield* has(key))) {
          throw new CacheItemNotFoundError(`Cannot find cache item "${key}"`)
        }

        const value = decoder.decode(
          new ZodDecoder(z.string().transform((s) => JSON.parse(s))).decode(
            await redis.get(key),
          ),
        )
        yield* perform(Log.debug('Cache item retrieved', { key, source }))

        return value
      } catch (error) {
        if (error instanceof CacheItemNotFoundError) {
          yield* perform(Log.debug('Cache item not found', { source }))
        } else if (error instanceof CodecError) {
          yield* perform(
            Log.error('Cache item decoding failed', { error, key, source }),
          )
        } else {
          yield* perform(
            Log.error('Cache item not found', {
              error: new CacheError(`Cannot get item "${key}" from Redis`, {
                cause: error,
              }),
              key,
              source,
            }),
          )
        }
      }

      const value = yield* onMiss()

      try {
        await redis.set(key, JSON.stringify(value))
        yield* perform(Log.debug('Cache item saved', { key, source }))

        return value
      } catch (cause) {
        const error = new CacheError(`Cannot save item "${key}" to Redis`, {
          cause,
        })
        yield* perform(
          Log.error('Cache item not saved', { error, key, source }),
        )

        throw error
      }
    },
    async *delete(key: string) {
      yield* connect()

      try {
        const found = (await redis.del(key)) === 1
        yield* perform(
          Log.debug(
            found ? 'Cache item deleted' : 'Cache item not found for deletion',
            { key, source },
          ),
        )

        return found
      } catch (cause) {
        const error = new CacheError(`Cannot delete item "${key}" from Redis`, {
          cause,
        })
        yield* perform(
          Log.error('Cache item not deleted', { error, key, source }),
        )

        throw error
      }
    },
    async *clear() {
      yield* connect()

      try {
        await redis.flushDb(RedisFlushModes.ASYNC)
        yield* perform(Log.debug('Cache cleared', { source }))

        return
      } catch (cause) {
        const error = new CacheError('Cannot flush Redis database', { cause })
        yield* perform(Log.error('Cache not cleared', { error, source }))

        throw error
      }
    },
  } satisfies Handler<FxCache>
}
