import { fx } from 'affex'
import { tag } from '../Clock'
import { DateClock } from './DateClock'

export function FxDateClock() {
  return fx.layer(tag, new DateClock())
}
