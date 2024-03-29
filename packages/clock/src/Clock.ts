import * as fx from '@xzhayon/fx'

export interface Clock {
  readonly [fx.URI]?: unique symbol
  now(): Date
}

export const tag = fx.tag<Clock>('Clock')

export const Clock = { tag, ...fx.struct(tag)('now') }
