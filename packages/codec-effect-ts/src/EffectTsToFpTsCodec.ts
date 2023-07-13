import { Either, pipe } from '@effect-ts/core'
import * as fpTs from '@nsr/codec-fp-ts'
import { either } from 'fp-ts'
import { Codec, Decoder, Encoder } from './Codec'

export class EffectTsToFpTsDecoder<A, I = unknown>
  implements fpTs.Decoder<A, I>
{
  constructor(private readonly decoder: Decoder<A, I>) {}

  get name() {
    return this.decoder.name
  }

  decode(i: I) {
    return pipe(this.decoder.decode(i), Either.fold(either.left, either.right))
  }
}

export class EffectTsToFpTsEncoder<A, O = A> implements fpTs.Encoder<A, O> {
  constructor(private readonly encoder: Encoder<A, O>) {}

  encode(a: A) {
    return this.encoder.encode(a)
  }
}

export class EffectTsToFpTsCodec<A, O = A, I = unknown>
  implements fpTs.Codec<A, O, I>
{
  private readonly decoder: EffectTsToFpTsDecoder<A, I>
  private readonly encoder: EffectTsToFpTsEncoder<A, O>

  constructor(private readonly codec: Codec<A, O, I>) {
    this.decoder = new EffectTsToFpTsDecoder(codec)
    this.encoder = new EffectTsToFpTsEncoder(codec)
  }

  get name() {
    return this.decoder.name
  }

  is(u: unknown): u is A {
    return this.codec.is(u)
  }

  decode(i: I) {
    return this.decoder.decode(i)
  }

  encode(a: A) {
    return this.encoder.encode(a)
  }
}
