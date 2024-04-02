import { Handler } from '@xzhayon/fx'
import { Clock } from '../Clock'
import { PerformanceClock } from './PerformanceClock'

export function FxPerformanceClock() {
  return new PerformanceClock() satisfies Handler<Clock>
}
