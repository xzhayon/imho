import { Log } from '@imho/log'
import { layer, perform, run } from '@xzhayon/fx'
import { pino } from 'pino'
import { FxPinoLog } from './FxPinoLog'

describe('FxPinoLog', () => {
  let buffer: string | null
  const log = FxPinoLog(
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
      function* f() {
        yield* perform(Log[severity]('foo'))
      }
      await run(f(), layer().with(Log, log))

      expect(JSON.parse(buffer ?? '')).toMatchObject({ level, msg: 'foo' })
    })
  })
})
