import { IoTsCodec } from '@nsr/codec-fp-ts-io-ts'
import { VoidLog } from '@nsr/log-fp-ts'
import { either, taskEither } from 'fp-ts'
import {} from 'fp-ts/function'
import * as t from 'io-ts'
import { Cache } from './Cache'
import { MapCache } from './MapCache'

describe('MapCache', () => {
  const map = new Map()
  const cache = MapCache(map)(new VoidLog())

  beforeEach(() => {
    map.clear()
  })

  describe('has', () => {
    test('checking for missing item', async () => {
      await expect(Cache.has('foo')(cache)()).resolves.toStrictEqual(
        either.right(false),
      )
    })

    test('checking for existing item', async () => {
      map.set('foo', 'bar')
      await expect(Cache.has('foo')(cache)()).resolves.toStrictEqual(
        either.right(true),
      )
    })
  })

  describe('get', () => {
    test('failing to fetch data', async () => {
      expect(
        (
          (await Cache.get('foo', new IoTsCodec(t.any), () =>
            taskEither.left(new Error()),
          )(cache)()) as any
        ).left,
      ).toBeInstanceOf(Error)
    })

    test('fetching data on missing item', async () => {
      await expect(
        Cache.get('foo', new IoTsCodec(t.any), () => taskEither.right('bar'))(
          cache,
        )(),
      ).resolves.toStrictEqual(either.right('bar'))
    })

    test('fetching data on invalid codec', async () => {
      map.set('foo', 'qux')
      await expect(
        Cache.get('foo', new IoTsCodec(t.never), () => taskEither.right('bar'))(
          cache,
        )(),
      ).resolves.toStrictEqual(either.right('bar'))
    })

    test('getting existing item', async () => {
      map.set('foo', 'qux')
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
      map.set('foo', 'bar')
      await expect(Cache.delete('foo')(cache)()).resolves.toStrictEqual(
        either.right(true),
      )
      expect(map.has('foo')).toBeFalsy()
    })
  })

  describe('clear', () => {
    test('clearing cache', async () => {
      map.set('foo', 'bar')
      await expect(Cache.clear()(cache)()).resolves.toStrictEqual(
        either.right(undefined),
      )
      expect(map.size).toStrictEqual(0)
    })
  })
})
