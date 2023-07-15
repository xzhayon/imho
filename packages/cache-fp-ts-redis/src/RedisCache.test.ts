import { Cache } from '@imho/cache-fp-ts'
import { IoTsCodec } from '@imho/codec-fp-ts-io-ts'
import { VoidLog } from '@imho/log-fp-ts'
import { RedisFlushModes, createClient } from '@redis/client'
import { either, readerTaskEither, taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { mapRedis } from '../../../test/redis'
import { RedisCache } from './RedisCache'

describe('RedisCache', () => {
  const redis = createClient({ url: process.env.REDIS_URL })
  const cache = RedisCache(redis)(new VoidLog())

  beforeEach(async () => {
    await mapRedis(redis, (redis) => redis.flushDb(RedisFlushModes.ASYNC))
    await redis.quit()
  })

  afterAll(async () => {
    await redis.quit()
  })

  test('connecting to Redis', async () => {
    await expect(Cache.has('foo')(cache)()).resolves.not.toThrow()
  })

  test('using an already open connection', async () => {
    await expect(
      pipe(
        Cache.has('foo'),
        readerTaskEither.chain(() => Cache.has('foo')),
      )(cache)(),
    ).resolves.not.toThrow()
  })

  describe('has', () => {
    test('checking for missing item', async () => {
      await expect(Cache.has('foo')(cache)()).resolves.toStrictEqual(
        either.right(false),
      )
    })

    test('checking for existing item', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('bar')))
      await expect(Cache.has('foo')(cache)()).resolves.toStrictEqual(
        either.right(true),
      )
    })
  })

  describe('get', () => {
    test('failing to fetch data', async () => {
      class FooError extends Error {}
      expect(
        (
          (await Cache.get('foo', new IoTsCodec(t.any), () =>
            taskEither.left(new FooError()),
          )(cache)()) as any
        ).left,
      ).toBeInstanceOf(FooError)
    })

    test('fetching data on missing item', async () => {
      await expect(
        Cache.get('foo', new IoTsCodec(t.any), () => taskEither.right('bar'))(
          cache,
        )(),
      ).resolves.toStrictEqual(either.right('bar'))
    })

    test('fetching data on invalid codec', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      await expect(
        Cache.get('foo', new IoTsCodec(t.never), () => taskEither.right('bar'))(
          cache,
        )(),
      ).resolves.toStrictEqual(either.right('bar'))
    })

    test('getting existing item', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      await expect(
        Cache.get('foo', new IoTsCodec(t.any), () => taskEither.right('bar'))(
          cache,
        )(),
      ).resolves.toStrictEqual(either.right('qux'))
    })
  })

  describe('delete', () => {
    test('deleting missing item', async () => {
      await expect(Cache.delete('foo')(cache)()).resolves.toStrictEqual(
        either.right(false),
      )
    })

    test('deleting existing item', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      await expect(Cache.delete('foo')(cache)()).resolves.toStrictEqual(
        either.right(true),
      )
      await expect(
        mapRedis(redis, (redis) => redis.exists('foo')),
      ).resolves.toStrictEqual(0)
    })
  })

  describe('clear', () => {
    test('clearing cache', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('bar')))
      await expect(Cache.clear()(cache)()).resolves.toStrictEqual(
        either.right(undefined),
      )
      await expect(
        mapRedis(redis, (redis) => redis.dbSize()),
      ).resolves.toStrictEqual(0)
    })
  })
})
