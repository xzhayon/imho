import { fx } from 'affex'
import { tag } from '../Logger'
import { NullLogger } from './NullLogger'

export function FxNullLogger() {
  return fx.layer(tag, new NullLogger())
}
