import { fx } from 'affex'
import { Clock } from '../Clock'
import { FxPerformanceClock } from './FxPerformanceClock'

describe('FxPerformanceClock', () => {
  describe('now', () => {
    test('returning current timestamp', async () => {
      await expect(
        fx.runPromise(function* () {
          return (yield* Clock.now()).valueOf()
        }, fx.context().with(FxPerformanceClock())),
      ).resolves.toBeCloseTo(performance.timeOrigin + performance.now(), -1)
    })
  })
})
