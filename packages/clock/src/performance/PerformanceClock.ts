import { Clock } from '../Clock'

export class PerformanceClock implements Clock {
  now() {
    return new Date(performance.timeOrigin + performance.now())
  }
}
