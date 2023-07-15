import { FpTsToEffectTsCodec } from '@imho/codec-effect-ts'
import * as fpTs from '@imho/codec-fp-ts-io-ts'
import * as t from 'io-ts'

export class IoTsCodec<A, O = A, I = unknown> extends FpTsToEffectTsCodec<
  A,
  O,
  I
> {
  constructor(type: t.Type<A, O, I>) {
    super(new fpTs.IoTsCodec(type))
  }
}
