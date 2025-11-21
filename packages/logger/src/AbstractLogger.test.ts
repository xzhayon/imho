import { fx } from 'affex'
import type { Attributes } from './Attributes'
import { Logger, tag } from './Logger'
import type { Severity } from './Severity'
import { InMemoryLogger } from './inMemory/InMemoryLogger'

describe('AbstractLogger', () => {
  const records: Array<{
    readonly timestamp?: Date
    readonly severity?: Severity
    readonly message?: string
    readonly attributes?: Attributes
    readonly error?: Error
  }> = []
  const context = fx.context().with(fx.layer(tag, new InMemoryLogger(records)))

  describe.each([
    ['debug'],
    ['info'],
    ['notice'],
    ['warning'],
    ['error'],
    ['critical'],
    ['alert'],
    ['emergency'],
  ] as const)('%s', (severity) => {
    test('logging error', async () => {
      const error = new Error()
      await fx.runPromise(Logger[severity](error), context)

      expect(records.slice(-1).at(0)).toMatchObject({
        message: undefined,
        attributes: undefined,
        error,
      })
    })

    test('logging attributes and error', async () => {
      const attributes = { foo: 'bar' }
      const error = new Error()
      await fx.runPromise(Logger[severity](attributes, error), context)

      expect(records.slice(-1).at(0)).toMatchObject({
        message: undefined,
        attributes,
        error,
      })
    })

    test('logging message and error', async () => {
      const message = 'foo'
      const error = new Error()
      await fx.runPromise(Logger[severity](message, error), context)

      expect(records.slice(-1).at(0)).toMatchObject({
        message,
        attributes: undefined,
        error,
      })
    })

    test('logging message, attributes and error', async () => {
      const message = 'foo'
      const attributes = { foo: 'bar' }
      const error = new Error()
      await fx.runPromise(Logger[severity](message, attributes, error), context)

      expect(records.slice(-1).at(0)).toMatchObject({
        message,
        attributes,
        error,
      })
    })
  })
})
