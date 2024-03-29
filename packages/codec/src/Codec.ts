import { Decoder } from './Decoder'
import { Encoder } from './Encoder'

export interface Codec<A, O = A, I = unknown>
  extends Decoder<A, I>,
    Encoder<A, O> {
  is(u: unknown): u is A
}
