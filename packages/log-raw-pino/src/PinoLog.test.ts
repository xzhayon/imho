import { pino } from 'pino'
import { PinoLog } from './PinoLog'

describe('PinoLog', () => {
  let buffer: string | null
  const log = new PinoLog(
    pino(
      { level: 'debug' },
      {
        write(message: string) {
          buffer = message
        },
      },
    ),
  )

  beforeEach(() => {
    buffer = null
  })

  test.each([
    ['debug', 'debug', 20],
    ['info', 'info', 30],
    ['notice', 'info', 30],
    ['warning', 'warn', 40],
    ['error', 'error', 50],
    ['alert', 'fatal', 60],
    ['critical', 'fatal', 60],
    ['emergency', 'fatal', 60],
  ] as const)(
    'hadling severity "%s" with level "%s" (%d)',
    async (severity, _level, level) => {
      await log[severity]('foo')
      expect(JSON.parse(buffer ?? '')).toMatchObject({ level, msg: 'foo' })
    },
  )
})
