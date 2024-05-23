import { fx } from 'affex'

export interface Clock {
  readonly [fx.uri]?: unique symbol
  now(): Date
}

export const tag = fx.tag<Clock>('Clock')

export const Clock = fx.struct(tag)('now')
