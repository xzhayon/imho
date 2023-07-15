import { Either } from '@imho/effect'
import { CodecError } from './CodecError'

export interface Decoder<A, I = unknown> {
  readonly name: string
  decode(i: I): Either<CodecError, A>
}

export interface Encoder<A, O = A> {
  encode(a: A): O
}

export interface Codec<A, O = A, I = unknown>
  extends Decoder<A, I>,
    Encoder<A, O> {
  is(u: unknown): u is A
}
