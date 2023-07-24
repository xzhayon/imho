import { FpTs } from '@imho/effect-fp-ts'
import * as _ from '@imho/http'
import { readerTaskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'

export interface Http extends FpTs<_.Http> {}

const request =
  <A extends keyof Http>(method: A) =>
  (...args: Parameters<Http[A]>) =>
    pipe(
      readerTaskEither.ask<Http>(),
      readerTaskEither.chainTaskEitherK((http) =>
        http[method](...(args as [any])),
      ),
    )

export const Http = {
  delete: request('delete'),
  get: request('get'),
  head: request('head'),
  options: request('options'),
  patch: request('patch'),
  post: request('post'),
  put: request('put'),
}
