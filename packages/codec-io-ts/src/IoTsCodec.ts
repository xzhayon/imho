import { Codec, CodecError } from '@imho/codec'
import { either } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { failure } from 'io-ts/PathReporter'

export class IoTsCodec<A, O = A, I = unknown> implements Codec<A, O, I> {
  constructor(private readonly type: t.Type<A, O, I>) {}

  get name() {
    return this.type.name
  }

  is(u: unknown): u is A {
    return this.type.is(u)
  }

  decode(i: I) {
    const a = pipe(
      this.type.decode(i),
      either.mapLeft(
        (cause) =>
          new CodecError(
            cause.map((error) => new Error(failure([error])[0])),
            `Cannot decode input with codec "${this.name}"`,
            { cause },
          ),
      ),
    )
    if (either.isLeft(a)) {
      throw a.left
    }

    return a.right
  }

  encode(a: A) {
    return this.type.encode(a)
  }
}
