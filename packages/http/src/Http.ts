import { fx } from 'affex'
import { Body } from './Body'
import { HttpError } from './HttpError'
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

export interface FxHttp extends Pick<Http, typeof fx.uri> {
  delete(url: Url, options?: Options): fx.Result<Response, HttpError>
  get(url: Url, options?: Options): fx.Result<Response, HttpError>
  head(url: Url, options?: Options): fx.Result<Response, HttpError>
  options(url: Url, options?: Options): fx.Result<Response, HttpError>
  patch(
    url: Url,
    body?: Body | null,
    options?: Options,
  ): fx.Result<Response, HttpError>
  post(
    url: Url,
    body?: Body | null,
    options?: Options,
  ): fx.Result<Response, HttpError>
  put(
    url: Url,
    body?: Body | null,
    options?: Options,
  ): fx.Result<Response, HttpError>
}

export const tag = fx.tag<FxHttp>('Http')

export const Http = fx.service(
  tag,
  'delete',
  'get',
  'head',
  'options',
  'patch',
  'post',
  'put',
)
