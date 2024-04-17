import { fx } from '@xzhayon/fx'
import { tag } from '../Clock'
import { PerformanceClock } from './PerformanceClock'

export function FxPerformanceClock() {
  return fx.layer().with(tag, new PerformanceClock())
}
