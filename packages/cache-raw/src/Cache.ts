import * as _ from '@imho/cache'
import { Decoder } from '@imho/codec-raw'
import { Raw } from '@imho/effect-raw'

export interface Cache extends Raw<Omit<_.Cache, 'get'>> {
  get<A>(key: string, decoder: Decoder<A>, onMiss: () => Promise<A>): Promise<A>
}
