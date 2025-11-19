import { Logger } from '@imho/logger'
import { fx } from 'affex'
import { pino } from 'pino'
import { FxPinoLog } from './FxPinoLog'

describe('FxPinoLog', () => {
  let buffer: string | null
  const context = fx.context().with(
    FxPinoLog(
      pino(
        { level: 'debug' },
        {
          write(message: string) {
            buffer = message
          },
        },
      ),
    ),
  )

  beforeEach(() => {
    buffer = null
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

      expect(JSON.parse(buffer ?? '')).toMatchObject({ level, msg: 'foo' })
    })
  })
})
