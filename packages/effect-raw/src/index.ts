import * as _ from '@imho/effect'

export type Raw<A> = A extends _.Option<infer B>
  ? Raw<B> | undefined
  : A extends _.Either<any, infer B>
  ? Raw<B> | never
  : A extends _.IO<infer B>
  ? Raw<B>
  : A extends _.Task<infer B>
  ? Promise<Raw<B>>
  : A extends Error
  ? A
  : A extends (...args: any) => any
  ? (...args: Raw<Parameters<A>>) => Raw<ReturnType<A>>
  : A extends { [K: string]: any }
  ? { [K in keyof A]: Raw<A[K]> }
  : A
