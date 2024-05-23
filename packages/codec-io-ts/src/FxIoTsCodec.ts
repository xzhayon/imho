import { Codec, CodecError, FxCodec } from '@imho/codec'
import { fx } from 'affex'
import * as t from 'io-ts'
import { IoTsCodec } from './IoTsCodec'

export class FxIoTsCodec<A, O = A, I = unknown> implements FxCodec<A, O, I> {
  private readonly codec: Codec<A, O, I>

  constructor(type: t.Type<A, O, I>) {
    this.codec = new IoTsCodec(type)
  }

  is(u: unknown): u is A {
    return this.codec.is(u)
  }

  *decode(i: I) {
    return yield* fx.sync(
      () => this.codec.decode(i),
      (error) => {
        if (!(error instanceof CodecError)) {
          throw error
        }

        return error
      },
    )
  }

  encode(a: A) {
    return this.codec.encode(a)
  }
}
