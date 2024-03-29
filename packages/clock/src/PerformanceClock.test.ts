import { layer, perform, run } from '@xzhayon/fx'
import { Clock } from './Clock'
import { FxPerformanceClock } from './PerformanceClock'

describe('PerformanceClock', () => {
  describe('now', () => {
    test('returning current timestamp', async () => {
      function* f() {
        return (yield* perform(Clock.now())).valueOf()
      }

      await expect(
        run(f(), layer().with(Clock, FxPerformanceClock)),
      ).resolves.toBeCloseTo(performance.timeOrigin + performance.now(), -1)
    })
  })
})
