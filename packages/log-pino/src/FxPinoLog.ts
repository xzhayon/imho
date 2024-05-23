import { tag } from '@imho/log'
import { fx } from 'affex'
import pino from 'pino'
import { PinoLog } from './PinoLog'

export function FxPinoLog(pino: pino.Logger) {
  return fx.layer(tag, new PinoLog(pino))
}
