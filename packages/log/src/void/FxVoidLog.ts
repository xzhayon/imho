import { fx } from '@xzhayon/fx'
import { tag } from '../Log'
import { VoidLog } from './VoidLog'

export function FxVoidLog() {
  return fx.layer().with(tag, new VoidLog())
}
