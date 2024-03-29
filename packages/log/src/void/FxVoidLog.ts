import { Handler } from '@xzhayon/fx'
import { Log } from '../Log'
import { VoidLog } from './VoidLog'

export function FxVoidLog() {
  return new VoidLog() satisfies Handler<Log>
}
