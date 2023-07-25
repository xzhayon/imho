import { pipe } from 'fp-ts/function'
import { Clock } from './Clock'
import { PerformanceClock } from './PerformanceClock'

describe('PerformanceClock', () => {
  describe('now', () => {
    test('returning current timestamp', () => {
      expect(pipe(Clock.now()(new PerformanceClock())())).toBeCloseTo(
        performance.timeOrigin + performance.now(),
        -1,
      )
    })
  })
})
