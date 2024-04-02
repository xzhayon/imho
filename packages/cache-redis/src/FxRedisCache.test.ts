import { Cache } from '@imho/cache'
import { IoTsCodec } from '@imho/codec-io-ts'
import { FxVoidLog, Log } from '@imho/log'
import { RedisClientType, RedisFlushModes } from '@redis/client'
import { layer, perform, run } from '@xzhayon/fx'
import * as t from 'io-ts'
import { use } from '../test/Redis'
import { RedisMock } from '../test/RedisMock'
import { FxRedisCache } from './FxRedisCache'

describe('FxRedisCache', () => {
  const redis = new RedisMock() as any as RedisClientType
  const _layer = layer()
    .with(Cache, FxRedisCache(redis))
    .with(Log, FxVoidLog())
    .do()

  beforeEach(async () => {
    await use(redis, (redis) => redis.flushDb(RedisFlushModes.ASYNC))
    await redis.quit()
  })

  afterAll(async () => {
    await redis.quit()
  })

  test('connecting to Redis', async () => {
    function* f() {
      return yield* perform(Cache.has('foo'))
    }

    await expect(run(f(), _layer)).resolves.not.toThrow()
  })

  test('using an already open connection', async () => {
    function* f() {
      yield* perform(Cache.clear())

      return yield* perform(Cache.has('foo'))
    }

    await expect(run(f(), _layer)).resolves.not.toThrow()
  })

  describe('has', () => {
    test('checking for missing item', async () => {
      function* f() {
        return yield* perform(Cache.has('foo'))
      }

      await expect(run(f(), _layer)).resolves.toStrictEqual(false)
    })

    test('checking for existing item', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('bar')))
      function* f() {
        return yield* perform(Cache.has('foo'))
      }

      await expect(run(f(), _layer)).resolves.toStrictEqual(true)
    })
  })

  describe('get', () => {
    test('failing to fetch data', async () => {
      class FooError extends Error {}

      function* f() {
        return yield* perform(
          Cache.get('foo', new IoTsCodec(t.any), () => {
            throw new FooError()
          }),
        )
      }

      await expect(run(f(), _layer)).rejects.toBeInstanceOf(FooError)
    })

    test('fetching data on missing item', async () => {
      function* f() {
        return yield* perform(
          Cache.get('foo', new IoTsCodec(t.any), function* () {
            return 'bar'
          }),
        )
      }

      await expect(run(f(), _layer)).resolves.toStrictEqual('bar')
    })

    test('fetching data on invalid codec', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify(42)))
      function* f() {
        return yield* perform(
          Cache.get('foo', new IoTsCodec(t.string), function* () {
            return 'bar'
          }),
        )
      }

      await expect(run(f(), _layer)).resolves.toStrictEqual('bar')
    })

    test('getting existing item', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      function* f() {
        return yield* perform(
          Cache.get('foo', new IoTsCodec(t.any), function* () {
            return 'bar'
          }),
        )
      }

      await expect(run(f(), _layer)).resolves.toStrictEqual('qux')
    })
  })

  describe('delete', () => {
    test('deleting missing item', async () => {
      function* f() {
        return yield* perform(Cache.delete('foo'))
      }

      await expect(run(f(), _layer)).resolves.toStrictEqual(false)
    })

    test('deleting existing item', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('qux')))
      function* f() {
        return yield* perform(Cache.delete('foo'))
      }

      await expect(run(f(), _layer)).resolves.toStrictEqual(true)
      await expect(
        use(redis, (redis) => redis.exists('foo')),
      ).resolves.toStrictEqual(0)
    })
  })

  describe('clear', () => {
    test('clearing cache', async () => {
      await use(redis, (redis) => redis.set('foo', JSON.stringify('bar')))
      function* f() {
        return yield* perform(Cache.clear())
      }

      await expect(run(f(), _layer)).resolves.toBeUndefined()
      await expect(
        use(redis, (redis) => redis.dbSize()),
      ).resolves.toStrictEqual(0)
    })
  })
})
