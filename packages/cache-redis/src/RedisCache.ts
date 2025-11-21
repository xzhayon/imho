import { Cache, CacheError } from '@imho/cache'
import { CodecError, Decoder } from '@imho/codec'
import { ZodDecoder } from '@imho/codec-zod'
import { Logger } from '@imho/logger'
import {
  RedisClientType,
  RedisFlushModes,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client'
import { z } from 'zod'
import { CacheItemNotFoundError } from './CacheItemNotFoundError'

const source = 'RedisCache'

export class RedisCache<
  M extends RedisModules = Record<string, never>,
  F extends RedisFunctions = Record<string, never>,
  S extends RedisScripts = Record<string, never>,
> implements Cache
{
  constructor(
    private readonly redis: RedisClientType<M, F, S>,
    private readonly logger: Logger,
  ) {}

  async has(key: string) {
    await this.connect()

    try {
      return (await this.redis.exists(key)) === 1
    } catch (cause) {
      const error = new CacheError(`Cannot check for item "${key}" on Redis`, {
        cause,
      })
      await this.logger.error('Cache item not found', {
        attributes: { key, source },
        error,
      })

      throw error
    }
  }

  async get<A>(key: string, decoder: Decoder<A>, onMiss: () => Promise<A>) {
    try {
      if (!(await this.has(key))) {
        throw new CacheItemNotFoundError(`Cannot find cache item "${key}"`)
      }

      const value = decoder.decode(
        new ZodDecoder(z.string().transform((s) => JSON.parse(s))).decode(
          await this.redis.get(key),
        ),
      )
      await this.logger.debug('Cache item retrieved', {
        attributes: { key, source },
      })

      return value
    } catch (error) {
      if (error instanceof CacheItemNotFoundError) {
        await this.logger.debug('Cache item not found', {
          attributes: { key, source },
        })
      } else if (error instanceof CodecError) {
        await this.logger.error('Cache item decoding failed', {
          attributes: { key, source },
          error,
        })
      } else {
        await this.logger.error('Cache item not found', {
          attributes: { key, source },
          error: new CacheError(`Cannot get item "${key}" from Redis`, {
            cause: error,
          }),
        })
      }
    }

    const value = await onMiss()

    try {
      await this.redis.set(key, JSON.stringify(value))
      await this.logger.debug('Cache item saved', {
        attributes: { key, source },
      })

      return value
    } catch (cause) {
      const error = new CacheError(`Cannot save item "${key}" to Redis`, {
        cause,
      })
      await this.logger.error('Cache item not saved', {
        attributes: { key, source },
        error,
      })

      throw error
    }
  }

  async delete(key: string) {
    await this.connect()

    try {
      const found = (await this.redis.del(key)) === 1
      await this.logger.debug(
        found ? 'Cache item deleted' : 'Cache item not found for deletion',
        { attributes: { key, source } },
      )

      return found
    } catch (cause) {
      const error = new CacheError(`Cannot delete item "${key}" from Redis`, {
        cause,
      })
      await this.logger.error('Cache item not deleted', {
        attributes: { key, source },
        error,
      })

      throw error
    }
  }

  async clear() {
    await this.connect()

    try {
      await this.redis.flushDb(RedisFlushModes.ASYNC)
      await this.logger.debug('Cache cleared', { attributes: { source } })

      return
    } catch (cause) {
      const error = new CacheError('Cannot flush Redis database', { cause })
      await this.logger.error('Cache not cleared', {
        attributes: { source },
        error,
      })

      throw error
    }
  }

  private async connect() {
    if (this.redis.isReady) {
      return
    }

    try {
      await this.redis.connect()
      await this.logger.debug('Connection opened', { attributes: { source } })

      return
    } catch (cause) {
      const error = new CacheError('Cannot connect to Redis', { cause })
      await this.logger.error('Connection failed', {
        attributes: { source },
        error,
      })

      throw error
    }
  }
}
