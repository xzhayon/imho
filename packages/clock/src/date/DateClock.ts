import { Clock } from '../Clock'

export class DateClock implements Clock {
  now() {
    return new Date()
  }
}
