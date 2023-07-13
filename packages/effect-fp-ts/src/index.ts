import { Either } from 'fp-ts/Either'
import { IO } from 'fp-ts/IO'
import { IOEither } from 'fp-ts/IOEither'
import { IOOption } from 'fp-ts/IOOption'
import { Option } from 'fp-ts/Option'
import { Task } from 'fp-ts/Task'
import { TaskEither } from 'fp-ts/TaskEither'
import { TaskOption } from 'fp-ts/TaskOption'
import * as _ from '@nsr/effect'

export type FpTs<A> = A extends _.Option<infer B>
  ? Option<FpTs<B>>
  : A extends _.Either<infer E, infer B>
  ? Either<FpTs<E>, FpTs<B>>
  : A extends _.IO<infer B>
  ? B extends _.Option<infer C>
    ? IOOption<FpTs<C>>
    : B extends _.Either<infer E, infer C>
    ? IOEither<FpTs<E>, FpTs<C>>
    : IO<FpTs<B>>
  : A extends _.Task<infer B>
  ? B extends _.Option<infer C>
    ? TaskOption<FpTs<C>>
    : B extends _.Either<infer E, infer C>
    ? TaskEither<FpTs<E>, FpTs<C>>
    : Task<FpTs<B>>
  : A extends (...args: any) => any
  ? (...args: FpTs<Parameters<A>>) => FpTs<ReturnType<A>>
  : A extends { readonly [K: string]: any }
  ? { readonly [K in keyof A]: FpTs<A[K]> }
  : A
