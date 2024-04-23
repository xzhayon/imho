import { Decoder, FxDecoder } from './Decoder'
import { Encoder } from './Encoder'

export interface Codec<A, O = A, I = unknown>
  extends Decoder<A, I>,
    Encoder<A, O> {
  is(u: unknown): u is A
}

export interface FxCodec<A, O = A, I = unknown>
  extends FxDecoder<A, I>,
    Encoder<A, O> {
  is(u: unknown): u is A
}
