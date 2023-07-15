import * as _ from '@imho/codec'
import { CodecError } from '@imho/codec'
import { Either } from 'fp-ts/Either'

export interface Decoder<A, I = unknown>
  extends Omit<_.Decoder<A, I>, 'decode'> {
  decode(i: I): Either<CodecError, A>
}

export interface Encoder<A, O = A> extends _.Encoder<A, O> {}

export interface Codec<A, O = A, I = unknown>
  extends Decoder<A, I>,
    Encoder<A, O>,
    Pick<_.Codec<A, O, I>, 'is'> {}
