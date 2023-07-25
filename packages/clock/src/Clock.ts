import { IO } from '@imho/effect'

export interface Clock {
  now(): IO<number>
}
