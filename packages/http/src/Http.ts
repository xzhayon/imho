import { fx } from 'affex'
import { Body } from './Body'
import { HttpError } from './HttpError'
import { Options } from './Options'
import { Response } from './Response'
import { Url } from './Url'

export interface Http {
  readonly [fx.uri]?: unique symbol
  delete(url: Url, options?: Options): Promise<fx.Result<Response, HttpError>>
  get(url: Url, options?: Options): Promise<fx.Result<Response, HttpError>>
  head(url: Url, options?: Options): Promise<fx.Result<Response, HttpError>>
  options(url: Url, options?: Options): Promise<fx.Result<Response, HttpError>>
  patch(
    url: Url,
    body?: Body | null,
    options?: Options,
  ): Promise<fx.Result<Response, HttpError>>
  post(
    url: Url,
    body?: Body | null,
    options?: Options,
  ): Promise<fx.Result<Response, HttpError>>
  put(
    url: Url,
    body?: Body | null,
    options?: Options,
  ): Promise<fx.Result<Response, HttpError>>
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
