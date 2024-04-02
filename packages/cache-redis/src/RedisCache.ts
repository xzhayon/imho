import { Cache, CacheError } from '@imho/cache'
import { CodecError, Decoder } from '@imho/codec'
import { IoTsCodec } from '@imho/codec-io-ts'
import { Log } from '@imho/log'
import {
  RedisClientType,
  RedisFlushModes,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client'
import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import { CacheItemNotFoundError } from './CacheItemNotFoundError'

const channel = 'RedisCache'

export class RedisCache<
  M extends RedisModules = Record<string, never>,
  F extends RedisFunctions = Record<string, never>,
  S extends RedisScripts = Record<string, never>,
> implements Cache
{
  constructor(
    private readonly redis: RedisClientType<M, F, S>,
    private readonly log: Log,
  ) {}

  async has(key: string) {
    await this.connect()

    try {
      return (await this.redis.exists(key)) === 1
    } catch (cause) {
      const error = new CacheError(`Cannot check for item "${key}" on Redis`, {
        cause,
      })
      await this.log.error('Cache item not found', { error, key, channel })

      throw error
    }
  }

  async get<A>(key: string, decoder: Decoder<A>, onMiss: () => Promise<A>) {
    try {
      if (!(await this.has(key))) {
        throw new CacheItemNotFoundError(`Cannot find cache item "${key}"`)
      }

      const value = decoder.decode(
        new IoTsCodec(t.string.pipe(tt.JsonFromString)).decode(
          await this.redis.get(key),
        ),
      )
      await this.log.debug('Cache item retrieved', { key, channel })

      return value
    } catch (error) {
      if (error instanceof CacheItemNotFoundError) {
        await this.log.debug('Cache item not found', { channel })
      } else if (error instanceof CodecError) {
        await this.log.error('Cache item decoding failed', {
          error,
          key,
          codec: decoder.name,
          channel,
        })
      } else {
        await this.log.error('Cache item not found', {
          error: new CacheError(`Cannot get item "${key}" from Redis`, {
            cause: error,
          }),
          key,
          channel,
        })
      }
    }

    const value = await onMiss()

    try {
      await this.redis.set(key, JSON.stringify(value))
      await this.log.debug('Cache item saved', { key, channel })

      return value
    } catch (cause) {
      const error = new CacheError(`Cannot save item "${key}" to Redis`, {
        cause,
      })
      await this.log.error('Cache item not saved', { error, key, channel })

      throw error
    }
  }

  async delete(key: string) {
    await this.connect()

    try {
      const found = (await this.redis.del(key)) === 1
      await this.log.debug(
        found ? 'Cache item deleted' : 'Cache item not found for deletion',
        { key, channel },
      )

      return found
    } catch (cause) {
      const error = new CacheError(`Cannot delete item "${key}" from Redis`, {
        cause,
      })
      await this.log.error('Cache item not deleted', { error, key, channel })

      throw error
    }
  }

  async clear() {
    await this.connect()

    try {
      await this.redis.flushDb(RedisFlushModes.ASYNC)
      await this.log.debug('Cache cleared', { channel })

      return
    } catch (cause) {
      const error = new CacheError('Cannot flush Redis database', { cause })
      await this.log.error('Cache not cleared', { error, channel })

      throw error
    }
  }

  private async connect() {
    if (this.redis.isReady) {
      return
    }

    try {
      await this.redis.connect()
      await this.log.debug('Connection opened', { channel })

      return
    } catch (cause) {
      const error = new CacheError('Cannot connect to Redis', { cause })
      await this.log.error('Connection failed', { error, channel })

      throw error
    }
  }
}
