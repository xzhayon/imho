import { fx } from 'affex'
import { InMemoryLogger } from './inMemory/InMemoryLogger'
import { Logger, tag } from './Logger'
import type { LogRecord } from './LogRecord'

describe('AbstractLogger', () => {
  const records: Array<LogRecord> = []
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
    const message = 'foo'
    const attributes = { foo: 'bar' }
    const error = new Error()

    test('logging message and options', async () => {
      await fx.runPromise(
        Logger[severity](message, { attributes, error }),
        context,
      )

      expect(records.slice(-1).at(0)).toMatchObject({
        severity,
        message,
        attributes,
        error,
      })
    })

    test('logging error and options', async () => {
      await fx.runPromise(
        Logger[severity](error, { message, attributes }),
        context,
      )

      expect(records.slice(-1).at(0)).toMatchObject({
        severity,
        message,
        attributes,
        error,
      })
    })

    test('logging record', async () => {
      await fx.runPromise(
        Logger[severity]({ message, attributes, error }),
        context,
      )

      expect(records.slice(-1).at(0)).toMatchObject({
        severity,
        message,
        attributes,
        error,
      })
    })
  })
})
