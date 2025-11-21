import { fx } from 'affex'
import { InMemoryLogger } from './inMemory/InMemoryLogger'
import { Logger, tag } from './Logger'

describe('AbstractLogger', () => {
  const logger = new InMemoryLogger()
  const context = fx.context().with(fx.layer(tag, logger))

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

      expect(logger.records.at(-1)).toMatchObject({
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

      expect(logger.records.at(-1)).toMatchObject({
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

      expect(logger.records.at(-1)).toMatchObject({
        severity,
        message,
        attributes,
        error,
      })
    })
  })
})
