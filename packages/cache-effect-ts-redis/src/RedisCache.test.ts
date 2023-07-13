import { Effect, pipe } from '@effect-ts/core'
import * as Layer from '@effect-ts/core/Effect/Layer'
import { Cache, HasCache } from '@nsr/cache-effect-ts'
import { IoTsCodec } from '@nsr/codec-effect-ts-io-ts'
import { HasLog, VoidLog } from '@nsr/log-effect-ts'
import { RedisFlushModes, createClient } from '@redis/client'
import * as t from 'io-ts'
import { mapRedis } from '../../../test/redis'
import { RedisCache } from './RedisCache'

describe('RedisCache', () => {
  const redis = createClient({ url: process.env.REDIS_URL })
  const layer = pipe(
    Layer.fromManaged(HasCache)(RedisCache(redis)),
    Layer.using(Layer.fromValue(HasLog)(new VoidLog())),
    Layer.main,
  )

  beforeEach(async () => {
    await mapRedis(redis, (redis) => redis.flushDb(RedisFlushModes.ASYNC))
    await redis.quit()
  })

  afterAll(async () => {
    await redis.quit()
  })

  test('connecting to Redis', async () => {
    await expect(
      pipe(Cache.has('foo'), Effect.provideLayer(layer), Effect.runPromise),
    ).resolves.not.toThrow()
  })

  test('using an already open connection', async () => {
    await expect(
      pipe(
        Cache.has('foo'),
        Effect.chain(() => Cache.has('foo')),
        Effect.provideLayer(layer),
        Effect.runPromise,
      ),
    ).resolves.not.toThrow()
  })

  test('disconnecting on teardown', async () => {
    await expect(
      pipe(Cache.has('foo'), Effect.provideLayer(layer), Effect.runPromise),
    ).resolves.not.toThrow()
    expect(redis.isReady).toBeFalsy()
  })

  describe('has', () => {
    test('checking for missing item', async () => {
      await expect(
        pipe(Cache.has('foo'), Effect.provideLayer(layer), Effect.runPromise),
      ).resolves.toBeFalsy()
    })

    test('checking for existing item', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('bar')))
      await expect(
        pipe(Cache.has('foo'), Effect.provideLayer(layer), Effect.runPromise),
      ).resolves.toBeTruthy()
    })
  })

  describe('get', () => {
    test('failing to fetch data', async () => {
      class FooError extends Error {}
      await expect(
        pipe(
          Cache.get('foo', new IoTsCodec(t.any), () =>
            Effect.fail(new FooError()),
          ),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).rejects.toBeInstanceOf(FooError)
    })

    test('fetching data on missing item', async () => {
      await expect(
        pipe(
          Cache.get('foo', new IoTsCodec(t.any), () => Effect.succeed('bar')),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).resolves.toStrictEqual('bar')
    })

    test('fetching data on invalid codec', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      await expect(
        pipe(
          Cache.get('foo', new IoTsCodec(t.never), () => Effect.succeed('bar')),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).resolves.toStrictEqual('bar')
    })

    test('getting existing item', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      await expect(
        pipe(
          Cache.get('foo', new IoTsCodec(t.any), () => Effect.succeed('bar')),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).resolves.toStrictEqual('qux')
    })
  })

  describe('delete', () => {
    test('deleting missing item', async () => {
      await expect(
        pipe(
          Cache.delete('foo'),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).resolves.toBeFalsy()
    })

    test('deleting existing item', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      await expect(
        pipe(
          Cache.delete('foo'),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).resolves.toBeTruthy()
      await expect(
        mapRedis(redis, (redis) => redis.exists('foo')),
      ).resolves.toStrictEqual(0)
    })
  })

  describe('clear', () => {
    test('clearing cache', async () => {
      await mapRedis(redis, (redis) => redis.set('foo', JSON.stringify('bar')))
      await expect(
        pipe(Cache.clear(), Effect.provideLayer(layer), Effect.runPromise),
      ).resolves.toStrictEqual(undefined)
      await expect(
        mapRedis(redis, (redis) => redis.dbSize()),
      ).resolves.toStrictEqual(0)
    })
  })
})
