import { layer, perform, run } from '@xzhayon/fx'
import { Clock } from '../Clock'
import { FxDateClock } from './FxDateClock'

describe('FxDateClock', () => {
  describe('now', () => {
    test('returning current timestamp', async () => {
      await expect(
        run(function* () {
          return (yield* perform(Clock.now())).valueOf()
        }, layer().with(Clock, FxDateClock())),
      ).resolves.toBeCloseTo(Date.now(), -1)
    })
  })
})
