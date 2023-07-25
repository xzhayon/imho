import * as _ from '@imho/clock'
import { FpTs } from '@imho/effect-fp-ts'
import { readerIO } from 'fp-ts'
import { pipe } from 'fp-ts/function'

export interface Clock extends FpTs<_.Clock> {}

export const Clock = {
  now: () =>
    pipe(
      readerIO.ask<Clock>(),
      readerIO.chainIOK((clock) => clock.now()),
    ),
}
