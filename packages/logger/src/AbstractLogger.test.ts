import { fx } from 'affex'
import { AbstractLogger } from './AbstractLogger'
import type { Attributes } from './Attributes'
import { Logger, tag } from './Logger'
import type { Severity } from './Severity'

describe('AbstractLogger', () => {
  let buffer: Record<string, unknown>
  class BufferLogger extends AbstractLogger {
    protected readonly _log = async (
      _severity: Severity,
      message?: string,
      attributes?: Attributes,
      error?: Error,
    ) => {
      buffer = { message, attributes, error }
    }
  }
  const context = fx.context().with(fx.layer(tag, new BufferLogger()))

  beforeEach(() => {
    buffer = {}
  })

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

      expect(buffer).toStrictEqual({
        message: undefined,
        attributes: undefined,
        error,
      })
    })

    test('logging attributes and error', async () => {
      const attributes = { foo: 'bar' }
      const error = new Error()
      await fx.runPromise(Logger[severity](attributes, error), context)

      expect(buffer).toStrictEqual({ message: undefined, attributes, error })
    })

    test('logging message and error', async () => {
      const message = 'foo'
      const error = new Error()
      await fx.runPromise(Logger[severity](message, error), context)

      expect(buffer).toStrictEqual({ message, attributes: undefined, error })
    })

    test('logging message, attributes and error', async () => {
      const message = 'foo'
      const attributes = { foo: 'bar' }
      const error = new Error()
      await fx.runPromise(Logger[severity](message, attributes, error), context)

      expect(buffer).toStrictEqual({ message, attributes, error })
    })
  })
})
