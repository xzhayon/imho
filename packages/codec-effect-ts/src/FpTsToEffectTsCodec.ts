import { Either } from '@effect-ts/core'
import { CodecError } from '@imho/codec'
import * as fpTs from '@imho/codec-fp-ts'
import { either } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { Codec } from './Codec'

export class FpTsToEffectTsCodec<A, O = A, I = unknown>
  implements Codec<A, O, I>
{
  constructor(private readonly codec: fpTs.Codec<A, O, I>) {}

  get name() {
    return this.codec.name
  }

  is(u: unknown): u is A {
    return this.codec.is(u)
  }

  decode(i: I) {
    return pipe(
      this.codec.decode(i),
      either.match(Either.left, (a) => Either.rightW<A, CodecError>(a)),
    )
  }

  encode(a: A) {
    return this.codec.encode(a)
  }
}
