import { tag } from '@imho/log'
import { fx } from '@xzhayon/fx'
import pino from 'pino'
import { PinoLog } from './PinoLog'

export function FxPinoLog(pino: pino.Logger) {
  return fx.layer().with(tag, new PinoLog(pino))
}
