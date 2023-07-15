import * as fpTs from '@imho/codec-fp-ts-io-ts'
import { FpTsToRawCodec } from '@imho/codec-raw'
import * as t from 'io-ts'

export class IoTsCodec<A, O = A, I = unknown> extends FpTsToRawCodec<A, O, I> {
  constructor(type: t.Type<A, O, I>) {
    super(new fpTs.IoTsCodec(type))
  }
}
