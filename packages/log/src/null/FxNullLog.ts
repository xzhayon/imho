import { fx } from '@xzhayon/fx'
import { tag } from '../Log'
import { NullLog } from './NullLog'

export function FxNullLog() {
  return fx.layer().with(tag, new NullLog())
}
