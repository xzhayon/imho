import * as _ from '@imho/effect'

export interface Clock {
  now(): _.IO<number>
}
