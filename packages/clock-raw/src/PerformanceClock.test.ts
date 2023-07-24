import { PerformanceClock } from './PerformanceClock'

describe('PerformanceClock', () => {
  describe('now', () => {
    test('returning current timestamp', () => {
      expect(new PerformanceClock().now()).toBeCloseTo(
        performance.timeOrigin + performance.now(),
        -1,
      )
    })
  })
})
