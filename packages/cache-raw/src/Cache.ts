import * as _ from '@nsr/cache'
import { Decoder } from '@nsr/codec-raw'
import { Raw } from '@nsr/effect-raw'

export interface Cache extends Raw<Omit<_.Cache, 'get'>> {
  get<A>(key: string, decoder: Decoder<A>, onMiss: () => Promise<A>): Promise<A>
}
