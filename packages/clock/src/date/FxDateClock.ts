import { Handler } from '@xzhayon/fx'
import { Clock } from '../Clock'
import { DateClock } from './DateClock'

export function FxDateClock() {
  return new DateClock() satisfies Handler<Clock>
}
