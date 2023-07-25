import { Clock } from './Clock'

export class PerformanceClock implements Clock {
  now() {
    return () => performance.timeOrigin + performance.now()
  }
}
