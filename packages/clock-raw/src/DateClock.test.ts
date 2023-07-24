import { DateClock } from './DateClock'

describe('DateClock', () => {
  describe('now', () => {
    test('returning current timestamp', () => {
      expect(new DateClock().now()).toBeCloseTo(Date.now(), -1)
    })
  })
})
