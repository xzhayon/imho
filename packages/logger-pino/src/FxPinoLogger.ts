import { tag } from '@imho/logger'
import { fx } from 'affex'
import pino from 'pino'
import { PinoLogger } from './PinoLogger'

export function FxPinoLogger(pino: pino.Logger) {
  return fx.layer(tag, new PinoLogger(pino))
}
