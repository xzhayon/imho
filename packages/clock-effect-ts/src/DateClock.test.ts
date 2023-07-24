import { Effect, pipe } from '@effect-ts/core'
import { Clock, HasClock } from './Clock'
import { DateClock } from './DateClock'

describe('DateClock', () => {
  describe('now', () => {
    test('returning current timestamp', async () => {
      await expect(
        pipe(
          Clock.now(),
          Effect.provideService(HasClock)(new DateClock()),
          Effect.runPromise,
        ),
      ).resolves.toBeCloseTo(Date.now(), -1)
    })
  })
})
