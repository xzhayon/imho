import { IO, UIO } from '@effect-ts/core/Effect'
import { Either } from '@effect-ts/core/Either'
import { Option } from '@effect-ts/core/Option'
import * as _ from '@nsr/effect'

export type EffectTs<A> = A extends _.Option<infer B>
  ? Option<EffectTs<B>>
  : A extends _.Either<infer E, infer B>
  ? Either<EffectTs<E>, EffectTs<B>>
  : A extends _.IO<infer B> | _.Task<infer B>
  ? B extends _.Either<infer E, infer C>
    ? IO<EffectTs<E>, EffectTs<C>>
    : UIO<EffectTs<B>>
  : A extends (...args: any) => any
  ? (...args: EffectTs<Parameters<A>>) => EffectTs<ReturnType<A>>
  : A extends { readonly [K: string]: any }
  ? { readonly [K in keyof A]: EffectTs<A[K]> }
  : A
