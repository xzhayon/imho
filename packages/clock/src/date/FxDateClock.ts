import { fx } from '@xzhayon/fx'
import { tag } from '../Clock'
import { DateClock } from './DateClock'

export function FxDateClock() {
  return fx.layer().with(tag, new DateClock())
}
