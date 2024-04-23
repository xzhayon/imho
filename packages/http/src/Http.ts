import { fx } from '@xzhayon/fx'
import { Body } from './Body'
import { Options } from './Options'
import { Response } from './Response'
import { Url } from './Url'

export interface Http {
  readonly [fx.uri]?: unique symbol
  delete(url: Url, options?: Options): Promise<Response>
  get(url: Url, options?: Options): Promise<Response>
  head(url: Url, options?: Options): Promise<Response>
  options(url: Url, options?: Options): Promise<Response>
  patch(url: Url, body?: Body | null, options?: Options): Promise<Response>
  post(url: Url, body?: Body | null, options?: Options): Promise<Response>
  put(url: Url, body?: Body | null, options?: Options): Promise<Response>
}

export const tag = fx.tag<Http>('Http')

export const Http = fx.struct(tag)(
  'delete',
  'get',
  'head',
  'options',
  'patch',
  'post',
  'put',
)
