import { fx } from 'affex'
import { Clock } from '../Clock'
import { FxDateClock } from './FxDateClock'

describe('FxDateClock', () => {
  describe('now', () => {
    test('returning current timestamp', async () => {
      await expect(
        fx.runPromise(function* () {
          return (yield* Clock.now()).valueOf()
        }, fx.context().with(FxDateClock())),
      ).resolves.toBeCloseTo(Date.now(), -1)
    })
  })
})
