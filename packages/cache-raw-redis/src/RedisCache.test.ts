import { IoTsCodec } from '@nsr/codec-raw-io-ts'
import { VoidLog } from '@nsr/log-raw'
import { RedisFlushModes, createClient } from '@redis/client'
import * as t from 'io-ts'
import { mapRedis } from '../../../test/redis'
import { RedisCache } from './RedisCache'

describe('RedisCache', () => {
  const redis = createClient({ url: process.env.REDIS_URL })
  const cache = new RedisCache(redis, new VoidLog())

  beforeEach(async () => {
    await mapRedis(redis, (redis) => redis.flushDb(RedisFlushModes.ASYNC))
    await redis.quit()
  })

  afterAll(async () => {
    await redis.quit()
  })

  test('connecting to Redis', async () => {
    await expect(cache.has('foo')).resolves.not.toThrow()
  })

  test('using an already open connection', async () => {
    await expect(cache.has('foo')).resolves.not.toThrow()
    await expect(cache.has('foo')).resolves.not.toThrow()
  })

  describe('has', () => {
    test('checking for missing item', async () => {
      await expect(cache.has('foo')).resolves.toBeFalsy()
    })

    test('checking for existing item', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('bar')))
      await expect(cache.has('foo')).resolves.toBeTruthy()
    })
  })

  describe('get', () => {
    test('failing to fetch data', async () => {
      class FooError extends Error {}
      await expect(
        cache.get('foo', new IoTsCodec(t.any), async () => {
          throw new FooError()
        }),
      ).rejects.toBeInstanceOf(FooError)
    })

    test('failing to fetch data with no error', async () => {
      await expect(
        cache.get('foo', new IoTsCodec(t.any), () => Promise.reject()),
      ).rejects.toBeInstanceOf(Error)
    })

    test('fetching data on missing item', async () => {
      await expect(
        cache.get('foo', new IoTsCodec(t.any), async () => 'bar'),
      ).resolves.toStrictEqual('bar')
    })

    test('fetching data on invalid codec', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      await expect(
        cache.get('foo', new IoTsCodec(t.never), async () => 'bar'),
      ).resolves.toStrictEqual('bar')
    })

    test('getting existing item', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      await expect(
        cache.get('foo', new IoTsCodec(t.any), async () => 'bar'),
      ).resolves.toStrictEqual('qux')
    })
  })

  describe('delete', () => {
    test('deleting missing item', async () => {
      await expect(cache.delete('foo')).resolves.toBeFalsy()
    })

    test('deleting existing item', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      await expect(cache.delete('foo')).resolves.toBeTruthy()
      await expect(
        mapRedis(redis, (redis) => redis.exists('foo')),
      ).resolves.toStrictEqual(0)
    })
  })

  describe('clear', () => {
    test('clearing cache', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('bar')))
      await expect(cache.clear()).resolves.toBeUndefined()
      await expect(
        mapRedis(redis, (redis) => redis.dbSize()),
      ).resolves.toStrictEqual(0)
    })
  })
})
