import { Decoder, FxDecoder } from '@imho/codec'
import { ContextOf, ErrorOf, fx } from 'affex'
import { CacheError } from './CacheError'

export interface Cache {
  readonly [fx.uri]?: unique symbol
  has(key: string): Promise<boolean>
  get<A>(key: string, decoder: Decoder<A>, onMiss: () => Promise<A>): Promise<A>
  delete(key: string): Promise<boolean>
  clear(): Promise<void>
}

export interface FxCache extends Pick<Cache, typeof fx.uri> {
  has(key: string): fx.Result<boolean, CacheError>
  get<A, G extends fx.AnyEffector<A, any, any>>(
    key: string,
    decoder: FxDecoder<A>,
    onMiss: () => G,
  ): fx.AnyEffector<A, CacheError | ErrorOf<G>, ContextOf<G>>
  delete(key: string): fx.Result<boolean, CacheError>
  clear(): fx.Result<void, CacheError>
}

export const tag = fx.tag<FxCache>('Cache')

const { get } = fx.access(tag, 'get')

export const Cache = {
  ...fx.service(tag, 'has', 'delete', 'clear'),
  get: <A, G extends fx.AnyEffector<A, any, any>>(
    key: string,
    decoder: FxDecoder<A>,
    onMiss: () => G,
  ) => get((f) => f(key, decoder, onMiss)),
}
