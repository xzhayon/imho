import { pipe } from 'fp-ts/function'
import { Clock } from './Clock'
import { DateClock } from './DateClock'

describe('DateClock', () => {
  describe('now', () => {
    test('returning current timestamp', () => {
      expect(pipe(Clock.now()(new DateClock())())).toBeCloseTo(Date.now(), -1)
    })
  })
})
