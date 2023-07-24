import { Effect, IO } from '@effect-ts/core'
import { Either } from '@effect-ts/core/Either'
import { Option } from '@effect-ts/core/Option'
import * as _ from '@imho/effect'

export type EffectTs<A> = A extends _.Option<infer B>
  ? Option<EffectTs<B>>
  : A extends _.Either<infer E, infer B>
  ? Either<EffectTs<E>, EffectTs<B>>
  : A extends _.IO<infer B>
  ? IO.IO<EffectTs<B>>
  : A extends _.Task<infer B>
  ? B extends _.Either<infer E, infer C>
    ? Effect.IO<EffectTs<E>, EffectTs<C>>
    : Effect.UIO<EffectTs<B>>
  : A extends Error
  ? A
  : A extends (...args: any) => any
  ? (...args: EffectTs<Parameters<A>>) => EffectTs<ReturnType<A>>
  : A extends { [K: string]: any }
  ? { [K in keyof A]: EffectTs<A[K]> }
  : A
