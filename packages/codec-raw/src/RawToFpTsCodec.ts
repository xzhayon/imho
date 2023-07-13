import { CodecError } from '@nsr/codec'
import * as fpTs from '@nsr/codec-fp-ts'
import { either } from 'fp-ts'
import { Codec, Decoder, Encoder } from './Codec'

export class RawToFpTsDecoder<A, I = unknown> implements fpTs.Decoder<A, I> {
  constructor(private readonly decoder: Decoder<A, I>) {}

  get name() {
    return this.decoder.name
  }

  decode(i: I) {
    return either.tryCatch(
      () => this.decoder.decode(i),
      (cause) =>
        cause instanceof CodecError
          ? cause
          : new CodecError(
              [],
              `Cannot decode input with codec "${this.name}"`,
              { cause },
            ),
    )
  }
}

export class RawToFpTsEncoder<A, O = A> implements fpTs.Encoder<A, O> {
  constructor(private readonly encoder: Encoder<A, O>) {}

  encode(a: A) {
    return this.encoder.encode(a)
  }
}

export class RawToFpTsCodec<A, O = A, I = unknown>
  implements fpTs.Codec<A, O, I>
{
  private readonly decoder: RawToFpTsDecoder<A, I>
  private readonly encoder: RawToFpTsEncoder<A, O>

  constructor(private readonly codec: Codec<A, O, I>) {
    this.decoder = new RawToFpTsDecoder<A, I>(codec)
    this.encoder = new RawToFpTsEncoder<A, O>(codec)
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
