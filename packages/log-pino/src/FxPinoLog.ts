import { Log } from '@imho/log'
import { Handler } from '@xzhayon/fx'
import pino from 'pino'
import { PinoLog } from './PinoLog'

export function FxPinoLog(pino: pino.Logger) {
  return new PinoLog(pino) satisfies Handler<Log>
}
