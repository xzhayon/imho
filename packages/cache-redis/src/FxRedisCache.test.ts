import { Cache } from '@imho/cache'
import { ZodDecoder } from '@imho/codec-zod'
import { FxNullLog } from '@imho/log'
import { RedisClientType, RedisFlushModes } from '@redis/client'
import { fx } from '@xzhayon/fx'
import { z } from 'zod'
import { use } from '../test/Redis'
import { RedisMock } from '../test/RedisMock'
import { FxRedisCache } from './FxRedisCache'

describe('FxRedisCache', () => {
  const redis = new RedisMock() as any as RedisClientType
  const layer = fx.layer().with(FxRedisCache(redis)).with(FxNullLog()).do()

  beforeEach(async () => {
    await use(redis, (redis) => redis.flushDb(RedisFlushModes.ASYNC))
    await redis.quit()
  })

  afterAll(async () => {
    await redis.quit()
  })

  test('connecting to Redis', async () => {
    await expect(fx.runPromise(Cache.has('foo'), layer)).resolves.not.toThrow()
  })

  test('using an already open connection', async () => {
    await expect(
      fx.runPromise(function* () {
        yield* Cache.clear()

        return yield* Cache.has('foo')
      }, layer),
    ).resolves.not.toThrow()
  })

  describe('has', () => {
    test('checking for missing item', async () => {
      await expect(
        fx.runPromise(Cache.has('foo'), layer),
      ).resolves.toStrictEqual(false)
    })

    test('checking for existing item', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('bar')))

      await expect(
        fx.runPromise(Cache.has('foo'), layer),
      ).resolves.toStrictEqual(true)
    })
  })

  describe('get', () => {
    test('failing to fetch data', async () => {
      class FooError extends Error {}

      await expect(
        fx.runExit(
          Cache.get('foo', new ZodDecoder(z.any()), function* () {
            return yield* fx.raise(new FooError())
          }),
          layer,
        ),
      ).resolves.toMatchObject(fx.Exit.failure(fx.Cause.fail(new FooError())))
    })

    test('fetching data on missing item', async () => {
      await expect(
        fx.runPromise(
          Cache.get('foo', new ZodDecoder(z.any()), function* () {
            return 'bar'
          }),
          layer,
        ),
      ).resolves.toStrictEqual('bar')
    })

    test('fetching data on invalid codec', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify(42)))

      await expect(
        fx.runPromise(
          Cache.get('foo', new ZodDecoder(z.string()), function* () {
            return 'bar'
          }),
          layer,
        ),
      ).resolves.toStrictEqual('bar')
    })

    test('getting existing item', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('qux')))

      await expect(
        fx.runPromise(
          Cache.get('foo', new ZodDecoder(z.any()), function* () {
            return 'bar'
          }),
          layer,
        ),
      ).resolves.toStrictEqual('qux')
    })
  })

  describe('delete', () => {
    test('deleting missing item', async () => {
      await expect(
        fx.runPromise(Cache.delete('foo'), layer),
      ).resolves.toStrictEqual(false)
    })

    test('deleting existing item', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('qux')))

      await expect(
        fx.runPromise(Cache.delete('foo'), layer),
      ).resolves.toStrictEqual(true)
      await expect(
        use(redis, (redis) => redis.exists('foo')),
      ).resolves.toStrictEqual(0)
    })
  })

  describe('clear', () => {
    test('clearing cache', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('bar')))

      await expect(fx.runPromise(Cache.clear(), layer)).resolves.toBeUndefined()
      await expect(
        use(redis, (redis) => redis.dbSize()),
      ).resolves.toStrictEqual(0)
    })
  })
})
