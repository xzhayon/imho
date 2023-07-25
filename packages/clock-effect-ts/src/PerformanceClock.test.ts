import { Effect, pipe } from '@effect-ts/core'
import { Clock, HasClock } from './Clock'
import { PerformanceClock } from './PerformanceClock'

describe('PerformanceClock', () => {
  describe('now', () => {
    test('returning current timestamp', async () => {
      await expect(
        pipe(
          Clock.now(),
          Effect.provideService(HasClock)(new PerformanceClock()),
          Effect.runPromise,
        ),
      ).resolves.toBeCloseTo(performance.timeOrigin + performance.now(), -1)
    })
  })
})
