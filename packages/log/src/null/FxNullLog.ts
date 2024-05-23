import { fx } from 'affex'
import { tag } from '../Log'
import { NullLog } from './NullLog'

export function FxNullLog() {
  return fx.layer(tag, new NullLog())
}
