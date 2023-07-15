import * as fpTs from '@imho/codec-fp-ts'
import { either } from 'fp-ts'
import { Codec } from './Codec'

export class FpTsToRawCodec<A, O = A, I = unknown> implements Codec<A, O, I> {
  constructor(private readonly codec: fpTs.Codec<A, O, I>) {}

  get name() {
    return this.codec.name
  }

  is(u: unknown): u is A {
    return this.codec.is(u)
  }

  decode(i: I) {
    const a = this.codec.decode(i)
    if (either.isLeft(a)) {
      throw a.left
    }

    return a.right
  }

  encode(a: A) {
    return this.codec.encode(a)
  }
}
