import { Decoder } from '@imho/codec'
import * as fx from '@xzhayon/fx'

export interface Cache {
  has(key: string): Promise<boolean>
  get<A>(key: string, decoder: Decoder<A>, onMiss: () => Promise<A>): Promise<A>
  delete(key: string): Promise<boolean>
  clear(): Promise<void>
}

export interface FxCache extends Omit<Cache, 'get'> {
  get<A, G extends Generator<unknown, A>>(
    key: string,
    decoder: Decoder<A>,
    onMiss: () => G,
  ): Generator<fx.YOf<G>, A>
}

export const tag = fx.tag<FxCache>('Cache')

const { get } = fx.structA(tag)('get')

export const Cache = {
  tag,
  get: <A, G extends Generator<unknown, A>>(
    key: string,
    decoder: Decoder<A>,
    onMiss: () => G,
  ) => get((f) => f(key, decoder, onMiss)),
  ...fx.struct(tag)('has', 'delete', 'clear'),
}
