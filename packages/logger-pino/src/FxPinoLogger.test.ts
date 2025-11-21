import { Logger } from '@imho/logger'
import { fx } from 'affex'
import { pino } from 'pino'
import { FxPinoLogger } from './FxPinoLogger'

describe('FxPinoLogger', () => {
  let log = ''
  const context = fx.context().with(
    FxPinoLogger(
      pino(
        { level: 'debug' },
        {
          write(message: string) {
            log = message
          },
        },
      ),
    ),
  )

  beforeEach(() => {
    log = ''
  })

  describe.each([
    ['debug', 'debug', 20],
    ['info', 'info', 30],
    ['notice', 'info', 30],
    ['warning', 'warn', 40],
    ['error', 'error', 50],
    ['critical', 'fatal', 60],
    ['alert', 'fatal', 60],
    ['emergency', 'fatal', 60],
  ] as const)('%s', (severity, _level, level) => {
    test(`using level "${_level}" (${level})`, async () => {
      await fx.runPromise(Logger[severity]('foo'), context)

      expect(JSON.parse(log)).toMatchObject({ level, msg: 'foo' })
    })
  })

  test('overriding timestamp', async () => {
    const timestamp = new Date()
    await fx.runPromise(Logger.debug({ timestamp }), context)

    expect(JSON.parse(log)).toMatchObject({ time: timestamp.getTime() })
  })
})
