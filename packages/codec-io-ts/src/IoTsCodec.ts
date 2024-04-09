import { Codec, CodecError } from '@imho/codec'
import { either } from 'fp-ts'
import * as t from 'io-ts'
import { failure } from 'io-ts/PathReporter'

export class IoTsCodec<A, O = A, I = unknown> implements Codec<A, O, I> {
  constructor(private readonly type: t.Type<A, O, I>) {}

  is(u: unknown): u is A {
    return this.type.is(u)
  }

  decode(i: I) {
    const a = this.type.decode(i)
    if (either.isLeft(a)) {
      throw new CodecError(
        a.left.map((error) => new Error(failure([error])[0])),
        `Cannot decode input with codec "${this.type.name}"`,
        { cause: a.left },
      )
    }

    return a.right
  }

  encode(a: A) {
    return this.type.encode(a)
  }
}
