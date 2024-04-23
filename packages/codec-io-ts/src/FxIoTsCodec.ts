import { Codec, CodecError, FxCodec } from '@imho/codec'
import { fx } from '@xzhayon/fx'
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
    try {
      return this.codec.decode(i)
    } catch (error) {
      if (!(error instanceof CodecError)) {
        throw error
      }

      return yield* fx.raise(error)
    }
  }

  encode(a: A) {
    return this.codec.encode(a)
  }
}
