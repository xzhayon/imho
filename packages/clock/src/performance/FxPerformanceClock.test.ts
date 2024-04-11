import { layer, perform, run } from '@xzhayon/fx'
import { Clock } from '../Clock'
import { FxPerformanceClock } from './FxPerformanceClock'

describe('FxPerformanceClock', () => {
  describe('now', () => {
    test('returning current timestamp', async () => {
      await expect(
        run(function* () {
          return (yield* perform(Clock.now())).valueOf()
        }, layer().with(Clock, FxPerformanceClock())),
      ).resolves.toBeCloseTo(performance.timeOrigin + performance.now(), -1)
    })
  })
})
