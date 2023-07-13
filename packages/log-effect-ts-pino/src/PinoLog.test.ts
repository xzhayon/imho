import { Effect, pipe } from '@effect-ts/core'
import * as Layer from '@effect-ts/core/Effect/Layer'
import { HasLog, Log } from '@nsr/log-effect-ts'
import { pino } from 'pino'
import { PinoLog } from './PinoLog'

describe('PinoLog', () => {
  let buffer: string | null
  const layer = pipe(
    Layer.fromValue(HasLog)(
      new PinoLog(
        pino(
          { level: 'debug' },
          {
            write(message: string) {
              buffer = message
            },
          },
        ),
      ),
    ),
    Layer.main,
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
      await pipe(
        Log[severity]('foo'),
        Effect.provideLayer(layer),
        Effect.runPromise,
      )
      expect(JSON.parse(buffer ?? '')).toMatchObject({ level, msg: 'foo' })
    },
  )
})
