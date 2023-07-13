import { IoTsCodec } from '@nsr/codec-raw-io-ts'
import { VoidLog } from '@nsr/log-raw'
import * as t from 'io-ts'
import { MapCache } from './MapCache'

describe('MapCache', () => {
  const map = new Map()
  const cache = new MapCache(new VoidLog(), map)

  beforeEach(() => {
    map.clear()
  })

  describe('has', () => {
    test('checking for missing item', async () => {
      await expect(cache.has('foo')).resolves.toBeFalsy()
    })

    test('checking for existing item', async () => {
      map.set('foo', 'bar')
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
      map.set('foo', 'qux')
      await expect(
        cache.get('foo', new IoTsCodec(t.never), async () => 'bar'),
      ).resolves.toStrictEqual('bar')
    })

    test('getting existing item', async () => {
      map.set('foo', 'qux')
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
      map.set('foo', 'bar')
      await expect(cache.delete('foo')).resolves.toBeTruthy()
      expect(map.has('foo')).toBeFalsy()
    })
  })

  describe('clear', () => {
    test('clearing cache', async () => {
      map.set('foo', 'bar')
      await expect(cache.clear()).resolves.toBeUndefined()
      expect(map.size).toStrictEqual(0)
    })
  })
})
