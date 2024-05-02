import { fx } from '@xzhayon/fx'
import { CodecError } from './CodecError'

export interface Decoder<A, I = unknown> {
  decode(i: I): A
}

export interface FxDecoder<A, I = unknown> {
  decode(i: I): fx.Effector<A, CodecError, never>
}
