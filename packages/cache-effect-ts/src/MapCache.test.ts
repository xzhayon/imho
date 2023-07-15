import { Effect, pipe } from '@effect-ts/core'
import * as Layer from '@effect-ts/core/Effect/Layer'
import { IoTsCodec } from '@imho/codec-effect-ts-io-ts'
import { HasLog, VoidLog } from '@imho/log-effect-ts'
import * as t from 'io-ts'
import { Cache, HasCache } from './Cache'
import { MapCache } from './MapCache'

describe('MapCache', () => {
  const map = new Map()
  const layer = pipe(
    Layer.fromEffect(HasCache)(MapCache(map)),
    Layer.using(Layer.fromValue(HasLog)(new VoidLog())),
    Layer.main,
  )

  beforeEach(() => {
    map.clear()
  })

  describe('has', () => {
    test('checking for missing item', async () => {
      await expect(
        pipe(Cache.has('foo'), Effect.provideLayer(layer), Effect.runPromise),
      ).resolves.toBeFalsy()
    })

    test('checking for existing item', async () => {
      map.set('foo', 'bar')
      await expect(
        pipe(Cache.has('foo'), Effect.provideLayer(layer), Effect.runPromise),
      ).resolves.toBeTruthy()
    })
  })

  describe('get', () => {
    test('failing to fetch data', async () => {
      await expect(
        pipe(
          Cache.get('foo', new IoTsCodec(t.any), () =>
            Effect.fail(new Error()),
          ),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).rejects.toBeInstanceOf(Error)
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
      map.set('foo', 'qux')
      await expect(
        pipe(
          Cache.get('foo', new IoTsCodec(t.never), () => Effect.succeed('bar')),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).resolves.toStrictEqual('bar')
    })

    test('getting existing item', async () => {
      map.set('foo', 'qux')
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
      map.set('foo', 'bar')
      await expect(
        pipe(
          Cache.delete('foo'),
          Effect.provideLayer(layer),
          Effect.runPromise,
        ),
      ).resolves.toBeTruthy()
      expect(map.has('foo')).toBeFalsy()
    })
  })

  describe('clear', () => {
    test('clearing cache', async () => {
      map.set('foo', 'bar')
      await expect(
        pipe(Cache.clear(), Effect.provideLayer(layer), Effect.runPromise),
      ).resolves.toBeUndefined()
      expect(map.size).toStrictEqual(0)
    })
  })
})
