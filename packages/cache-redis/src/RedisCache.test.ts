import { ZodDecoder } from '@imho/codec-zod'
import { NullLog } from '@imho/log'
import { RedisClientType, RedisFlushModes } from '@redis/client'
import { z } from 'zod'
import { use } from '../test/Redis'
import { RedisMock } from '../test/RedisMock'
import { RedisCache } from './RedisCache'

describe('RedisCache', () => {
  const redis = new RedisMock() as any as RedisClientType
  const cache = new RedisCache(redis, new NullLog())

  beforeEach(async () => {
    await use(redis, (redis) => redis.flushDb(RedisFlushModes.ASYNC))
    await redis.quit()
  })

  afterAll(async () => {
    await redis.quit()
  })

  test('connecting to Redis', async () => {
    await expect(cache.has('foo')).resolves.not.toThrow()
  })

  test('using an already open connection', async () => {
    await cache.clear()

    await expect(cache.has('foo')).resolves.not.toThrow()
  })

  describe('has', () => {
    test('checking for missing item', async () => {
      await expect(cache.has('foo')).resolves.toStrictEqual(false)
    })

    test('checking for existing item', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('bar')))

      await expect(cache.has('foo')).resolves.toStrictEqual(true)
    })
  })

  describe('get', () => {
    test('failing to fetch data', async () => {
      class FooError extends Error {}

      await expect(
        cache.get('foo', new ZodDecoder(z.any()), () => {
          throw new FooError()
        }),
      ).rejects.toBeInstanceOf(FooError)
    })

    test('fetching data on missing item', async () => {
      await expect(
        cache.get('foo', new ZodDecoder(z.any()), async () => 'bar'),
      ).resolves.toStrictEqual('bar')
    })

    test('fetching data on invalid codec', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('qux')))

      await expect(
        cache.get('foo', new ZodDecoder(z.never()), async () => 'bar'),
      ).resolves.toStrictEqual('bar')
    })

    test('getting existing item', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('qux')))

      await expect(
        cache.get('foo', new ZodDecoder(z.any()), async () => 'bar'),
      ).resolves.toStrictEqual('qux')
    })
  })

  describe('delete', () => {
    test('deleting missing item', async () => {
      await expect(cache.delete('foo')).resolves.toStrictEqual(false)
    })

    test('deleting existing item', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('qux')))

      await expect(cache.delete('foo')).resolves.toStrictEqual(true)
      await expect(
        use(redis, (redis) => redis.exists('foo')),
      ).resolves.toStrictEqual(0)
    })
  })

  describe('clear', () => {
    test('clearing cache', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('bar')))

      await expect(cache.clear()).resolves.toBeUndefined()
      await expect(
        use(redis, (redis) => redis.dbSize()),
      ).resolves.toStrictEqual(0)
    })
  })
})
