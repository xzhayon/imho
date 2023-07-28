import { Body, Options, Response, Url } from '@imho/http'
import * as fpTs from '@imho/http-fp-ts'
import { either } from 'fp-ts'
import { Http } from './Http'

export class FpTsToRawHttp implements Http {
  constructor(private readonly http: fpTs.Http) {}

  delete(url: Url, options?: Options) {
    return this.request('delete', url, options)
  }

  get(url: Url, options?: Options) {
    return this.request('get', url, options)
  }

  head(url: Url, options?: Options) {
    return this.request('head', url, options)
  }

  options(url: Url, options?: Options) {
    return this.request('options', url, options)
  }

  patch(url: Url, body?: Body | null, options?: Options) {
    return this.request('patch', url, body, options)
  }

  post(url: Url, body?: Body | null, options?: Options) {
    return this.request('post', url, body, options)
  }

  put(url: Url, body?: Body | null, options?: Options) {
    return this.request('put', url, body, options)
  }

  private async request<A extends keyof Http>(
    method: A,
    ...args: Parameters<Http[A]>
  ): Promise<Response> {
    const response = await this.http[method](...(args as [any]))()
    if (either.isLeft(response)) {
      throw response.left
    }

    return response.right
  }
}
