import { fx } from 'affex'
import { tag } from '../Clock'
import { PerformanceClock } from './PerformanceClock'

export function FxPerformanceClock() {
  return fx.layer(tag, new PerformanceClock())
}
