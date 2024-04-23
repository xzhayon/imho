import { Decoder } from '@imho/codec'
import { fx } from '@xzhayon/fx'
import { CacheError } from './CacheError'

export interface Cache {
  readonly [fx.uri]?: unique symbol
  has(key: string): Promise<fx.Result<boolean, CacheError>>
  get<A>(key: string, decoder: Decoder<A>, onMiss: () => Promise<A>): Promise<A>
  delete(key: string): Promise<fx.Result<boolean, CacheError>>
  clear(): Promise<void>
}

export interface FxCache extends Omit<Cache, 'get' | 'clear'> {
  get<A, G extends Generator<unknown, A>>(
    key: string,
    decoder: Decoder<A>,
    onMiss: () => G,
  ): Generator<fx.YOf<G>, fx.Result<A, CacheError>, fx.NOf<G>>
  clear(): Promise<fx.Result<void, CacheError>>
}

export const tag = fx.tag<FxCache>('Cache')

const { get } = fx.structA(tag)('get')

export const Cache = {
  get: <A, G extends Generator<unknown, A>>(
    key: string,
    decoder: Decoder<A>,
    onMiss: () => G,
  ) => get((f) => f(key, decoder, onMiss)),
  ...fx.struct(tag)('has', 'delete', 'clear'),
}
